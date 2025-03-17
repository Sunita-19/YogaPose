import React from "react";
import axios from "axios";

const PracticeButton = ({ poseId }) => {
  const token = localStorage.getItem("token");

  const handlePractice = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/practice",
        { poseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error("Error logging practice activity:", error.response?.data || error);
    }
  };

  return (
    <button 
      className="btn"
      onClick={(e) => {
        e.stopPropagation();
        // Here use an appropriate mapping for poseId; e.g. if not tied to yoga_poses, use the index or a custom mapping.
        // For this example, we use the index + 1.
        handlePractice(poseId);
      }}
    >
      I did this pose
    </button>
  );
};

export default PracticeButton;