import React, { useState } from 'react';
import { poseInstructions } from '../../utils/data';
import { poseImages } from '../../utils/pose_images';
import './Instructions.css';

export default function Instructions({ currentPose }) {
    const [instructions, setInstructions] = useState(poseInstructions);

    return (
        <div className="instructions-container">
            <ul className="instructions-list">
                {instructions[currentPose] ? (
                    instructions[currentPose].map((instruction) => (
                        <li className="instruction" key={instruction}>
                            {instruction}
                        </li>
                    ))
                ) : (
                    <li className="instruction">Instructions not available for this pose.</li>
                )}
            </ul>
            <img 
                className="pose-demo-img"
                src={poseImages[currentPose]}
                alt={`${currentPose} pose`}
            />
        </div>
    );
}
