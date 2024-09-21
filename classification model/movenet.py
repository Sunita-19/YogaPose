# this module is taken from tensorflow example repository to use functions and algorithms in the project

# Copyright 2021 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Code to run a pose estimation with a TFLite MoveNet model."""

from code import InteractiveInterpreter
import os
from typing import Dict, List

import cv2
from data import BodyPart
from data import Person
from data import person_from_keypoints_with_scores
import numpy as np

# pylint: disable=g-import-not-at-top
try:
    # Import TFLite interpreter from TensorFlow package
    from tensorflow.lite import Interpreter
except ImportError:
    raise ImportError("TensorFlow is required for this code.")
# pylint: enable=g-import-not-at-top


class Movenet(object):
    """A wrapper class for a Movenet TFLite pose estimation model."""

    # Configure how confident the model should be on the detected keypoints to
    # proceed with using smart cropping logic.
    _MIN_CROP_KEYPOINT_SCORE = 0.2
    _TORSO_EXPANSION_RATIO = 1.9
    _BODY_EXPANSION_RATIO = 1.2

    def __init__(self, model_name: str) -> None:
        """Initialize a MoveNet pose estimation model.

        Args:
            model_name: Name of the TFLite MoveNet model.
        """

        # Append TFLITE extension to model_name if there's no extension
        _, ext = os.path.splitext(model_name)
        if not ext:
            model_name += '.tflite'

        # Initialize model
        interpreter = InteractiveInterpreter(model_path=model_name, num_threads=4)
        interpreter.allocate_tensors()

        self._input_index = interpreter.get_input_details()[0]['index']
        self._output_index = interpreter.get_output_details()[0]['index']

        self._input_height = interpreter.get_input_details()[0]['shape'][1]
        self._input_width = interpreter.get_input_details()[0]['shape'][2]

        self._interpreter = interpreter
        self._crop_region = None

    def init_crop_region(self, image_height: int, image_width: int) -> Dict[str, float]:
        """Defines the default crop region.

        The function provides the initial crop region (pads the full image from
        both sides to make it a square image) when the algorithm cannot reliably
        determine the crop region from the previous frame.

        Args:
            image_height (int): The input image width
            image_width (int): The input image height

        Returns:
            crop_region (dict): The default crop region.
        """
        if image_width > image_height:
            x_min = 0.0
            box_width = 1.0
            # Pad the vertical dimension to become a square image.
            y_min = (image_height / 2 - image_width / 2) / image_height
            box_height = image_width / image_height
        else:
            y_min = 0.0
            box_height = 1.0
            # Pad the horizontal dimension to become a square image.
            x_min = (image_width / 2 - image_height / 2) / image_width
            box_width = image_height / image_width

        return {
            'y_min': y_min,
            'x_min': x_min,
            'y_max': y_min + box_height,
            'x_max': x_min + box_width,
            'height': box_height,
            'width': box_width
        }

    def _torso_visible(self, keypoints: np.ndarray) -> bool:
        """Checks whether there are enough torso keypoints.

        This function checks whether the model is confident at predicting one of
        the shoulders/hips which is required to determine a good crop region.

        Args:
            keypoints: Detection result of Movenet model.

        Returns:
            True/False
        """
        left_hip_score = keypoints[BodyPart.LEFT_HIP.value, 2]
        right_hip_score = keypoints[BodyPart.RIGHT_HIP.value, 2]
        left_shoulder_score = keypoints[BodyPart.LEFT_SHOULDER.value, 2]
        right_shoulder_score = keypoints[BodyPart.RIGHT_SHOULDER.value, 2]

        left_hip_visible = left_hip_score > Movenet._MIN_CROP_KEYPOINT_SCORE
        right_hip_visible = right_hip_score > Movenet._MIN_CROP_KEYPOINT_SCORE
        left_shoulder_visible = left_shoulder_score > Movenet._MIN_CROP_KEYPOINT_SCORE
        right_shoulder_visible = right_shoulder_score > Movenet._MIN_CROP_KEYPOINT_SCORE

        return ((left_hip_visible or right_hip_visible) and
                (left_shoulder_visible or right_shoulder_visible))

    def _determine_torso_and_body_range(self, keypoints: np.ndarray,
                                        target_keypoints: Dict[BodyPart, List[float]],
                                        center_y: float,
                                        center_x: float) -> List[float]:
        """Calculates the maximum distance from each keypoint to the center.

        The function returns the maximum distances from the two sets of keypoints:
        full 17 keypoints and 4 torso keypoints. The returned information will
        be used to determine the crop size. See determine_crop_region for more
        details.

        Args:
            keypoints: Detection result of Movenet model.
            target_keypoints: The 4 torso keypoints.
            center_y (float): Vertical coordinate of the body center.
            center_x (float): Horizontal coordinate of the body center.

        Returns:
            The maximum distance from each keypoint to the center location.
        """
        torso_joints = [
            BodyPart.LEFT_SHOULDER, BodyPart.RIGHT_SHOULDER, BodyPart.LEFT_HIP,
            BodyPart.RIGHT_HIP
        ]
        max_torso_yrange = 0.0
        max_torso_xrange = 0.0
        for joint in torso_joints:
            dist_y = abs(center_y - target_keypoints[joint][0])
            dist_x = abs(center_x - target_keypoints[joint][1])
            if dist_y > max_torso_yrange:
                max_torso_yrange = dist_y
            if dist_x > max_torso_xrange:
                max_torso_xrange = dist_x

        max_body_yrange = 0.0
        max_body_xrange = 0.0
        for idx in range(len(BodyPart)):
            if keypoints[BodyPart(idx).value, 2] < Movenet._MIN_CROP_KEYPOINT_SCORE:
                continue
            dist_y = abs(center_y - target_keypoints[joint][0])
            dist_x = abs(center_x - target_keypoints[joint][1])
            if dist_y > max_body_yrange:
                max_body_yrange = dist_y

            if dist_x > max_body_xrange:
                max_body_xrange = dist_x

        return [
            max_torso_yrange, max_torso_xrange, max_body_yrange, max_body_xrange
        ]

    def _determine_crop_region(self, keypoints: np.ndarray, image_height: int,
                               image_width: int) -> Dict[str, float]:
        """Determines the region to crop the image for the model to run inference on.

        The algorithm uses the detected joints from the previous frame to
        estimate the square region that encloses the full body of the target
        person and centers at the midpoint of two hip joints. The crop size is
        determined by the distances between each joint and the center point.
        When the model is not confident with the four torso joint predictions,
        the function returns a default crop which is the full image padded to
        square.

        Args:
            keypoints: Detection result of Movenet model.
            image_height (int): The input image width
            image_width (int): The input image height

        Returns:
            crop_region (dict): The crop region to run inference on.
        """
        # Convert keypoint index to human-readable names.
        target_keypoints = {}
        for idx in range(len(BodyPart)):
            target_keypoints[BodyPart(idx)] = [
                keypoints[idx, 0] * image_height, keypoints[idx, 1] * image_width
            ]

        # Calculate crop region if the torso is visible.
        if self._torso_visible(keypoints):
            center_y = (target_keypoints[BodyPart.LEFT_HIP][0] +
                        target_keypoints[BodyPart.RIGHT_HIP][0]) / 2
            center_x = (target_keypoints[BodyPart.LEFT_HIP][1] +
                        target_keypoints[BodyPart.RIGHT_HIP][1]) / 2

            (max_torso_yrange, max_torso_xrange, max_body_yrange,
             max_body_xrange) = self._determine_torso_and_body_range(
                 keypoints, target_keypoints, center_y, center_x)

            crop_length_half = np.amax([
                max_torso_xrange * Movenet._TORSO_EXPANSION_RATIO,
                max_torso_yrange * Movenet._TORSO_EXPANSION_RATIO,
                max_body_yrange * Movenet._BODY_EXPANSION_RATIO,
                max_body_xrange * Movenet._BODY_EXPANSION_RATIO
            ])

            # Adjust crop length so that it is always larger than 1.
            crop_length_half = max(crop_length_half, 1.0)
            crop_region = {
                'y_min': center_y - crop_length_half,
                'x_min': center_x - crop_length_half,
                'y_max': center_y + crop_length_half,
                'x_max': center_x + crop_length_half,
                'height': crop_length_half * 2,
                'width': crop_length_half * 2
            }
        else:
            crop_region = self.init_crop_region(image_height, image_width)

        return crop_region

    def predict(self, image: np.ndarray) -> Person:
        """Runs pose estimation on the input image.

        Args:
            image: The input image to run inference on.

        Returns:
            A Person object containing the detected keypoints.
        """
        h, w, _ = image.shape
        if self._crop_region:
            crop_box = self._crop_region
        else:
            crop_box = self.init_crop_region(h, w)

        y_min = int(max(0, crop_box['y_min'] * h))
        x_min = int(max(0, crop_box['x_min'] * w))
        y_max = int(min(h, crop_box['y_max'] * h))
        x_max = int(min(w, crop_box['x_max'] * w))

        crop_image = image[y_min:y_max, x_min:x_max]

        # Resize the cropped image to the input size for the model.
        resized_image = cv2.resize(crop_image, (self._input_width, self._input_height))

        # Normalize the image to [0, 1] range.
        input_data = np.expand_dims(resized_image / 255.0, axis=0).astype(np.float32)

        # Run inference.
        self._interpreter.set_tensor(self._input_index, input_data)
        self._interpreter.invoke()
        output_data = self._interpreter.get_tensor(self._output_index)

        # Post-process the output data.
        keypoints = output_data[0][0][:, :2]  # Keypoints (y, x) coordinates
        scores = output_data[0][0][:, 2]      # Confidence scores

        # Update crop region for the next frame.
        if self._torso_visible(output_data[0][0]):
            self._crop_region = self._determine_crop_region(keypoints, h, w)
        else:
            self._crop_region = None

        return person_from_keypoints_with_scores(keypoints, scores)
