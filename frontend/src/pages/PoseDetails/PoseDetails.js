import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PracticeButton from "../../components/PracticeButton";
import "./PoseDetails.css";

// Define getImageUrl helper at the top of your Progress.js component:
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `http://localhost:5000/${url}`;
};

const PoseDetails = () => {
  const { id } = useParams();
  const [poseDetails, setPoseDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Fetching pose details for id:", id);
    fetch(`http://localhost:5000/api/yoga_poses/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        if (!data || Object.keys(data).length === 0) {
          setError("No data returned for this pose.");
        } else {
          setPoseDetails(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching pose details:", error);
        setError("Error fetching pose details. Please try again later.");
      });
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }
  if (!poseDetails) {
    return <div>Loading...</div>;
  }

  const getEmbeddedUrl = (url) => {
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  return (
    <div className="pose-details-container">
      <h1>{poseDetails.name}</h1>
      <ul className="pose-steps">
        {poseDetails.description && poseDetails.description.trim() !== ""
          ? poseDetails.description.split("\n").map((point, index) => (
              <li key={index}>{point}</li>
            ))
          : null}
      </ul>
      <div className="pose-content">
        {poseDetails.image_url ? (
          <img
            src={getImageUrl(poseDetails.image_url)}
            alt={poseDetails.name}
            className="pose-image"
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {poseDetails.video_url && poseDetails.video_url.trim() !== "" ? (
          <iframe
            className="pose-video"
            width="100%"
            height="315"
            src={getEmbeddedUrl(poseDetails.video_url)}
            title={poseDetails.name}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : null}
      </div>
      <PracticeButton poseId={poseDetails.id} accuracy={0.95} />
    </div>
  );
};

export default PoseDetails;
