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

  // Function to convert YouTube URL to embeddable format
  const getEmbeddedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url; // Return the original URL if it doesn't match
  };

  return (
    <div className="pose-details-container">
      <h1>{poseDetails.name}</h1>
      {/* Modified description rendering */}
      <ul className="pose-steps">
        {poseDetails.description.split('\n').map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      <div className="pose-content">
        <img className="pose-image" src={poseDetails.image_url} alt={poseDetails.name} />
        
        {/* Embed YouTube Video */}
        {poseDetails.video_url ? (
          <iframe
            className="pose-video"
            width="100%"
            height="315"
            src={getEmbeddedUrl(poseDetails.video_url)}
            title={poseDetails.name}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Video not available for this pose.</p>
        )}
      </div>
    </div>
  );
};

export default PoseDetails;
