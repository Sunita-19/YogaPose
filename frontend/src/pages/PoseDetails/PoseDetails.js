import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./PoseDetails.css";

const PoseDetails = () => {
  const { id } = useParams();
  const [poseDetails, setPoseDetails] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/yoga_poses/${id}`)
      .then((response) => response.json())
      .then((data) => setPoseDetails(data))
      .catch((error) => console.error("Error fetching pose details:", error));
  }, [id]);

  if (!poseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pose-details-container">
      <h1>{poseDetails.name}</h1>
      <p>{poseDetails.description}</p>
      <div className="pose-content">
        <img className="pose-image" src={poseDetails.image_url} alt={poseDetails.name} />
        <video className="pose-video" controls autoPlay muted playsInline>
  <source src={poseDetails.video_url} type="video/mp4" />
  Your browser does not support the video tag.
</video>

      </div>
    </div>
    
  );
};

export default PoseDetails;
