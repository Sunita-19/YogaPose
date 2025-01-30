import React from "react";
import "./YogaPosesVideos.css";

const YogaPosesVideos = () => {
  return (
    <div className="yoga-poses-container">
      <header className="yoga-header">
        <h1>Yoga Poses & Interactive Videos</h1>
      </header>

      {/* Yoga Levels Section */}
      <section className="yoga-levels">
        <h2>Yoga Poses for Different Levels</h2>
        <div className="level beginner">
          <h3>Beginner</h3>
          <ul>
            <li>Mountain Pose</li>
            <li>Downward Dog</li>
            <li>Warrior I</li>
          </ul>
        </div>

        <div className="level intermediate">
          <h3>Intermediate</h3>
          <ul>
            <li>Triangle Pose</li>
            <li>Half Moon Pose</li>
            <li>Cobra Pose</li>
          </ul>
        </div>

        <div className="level advanced">
          <h3>Advanced</h3>
          <ul>
            <li>Scorpion Pose</li>
            <li>Firefly Pose</li>
            <li>Lotus Headstand</li>
          </ul>
        </div>
      </section>

      {/* Video Section */}
      <section className="yoga-videos">
        <h2>Interactive Yoga Videos</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/v7AYKMP6rOE"
          title="Beginner Yoga"
          frameBorder="0"
          allowFullScreen
        ></iframe>

        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/qz1uwKQ8e5c"
          title="Advanced Yoga"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </section>
    </div>
  );
};

export default YogaPosesVideos;
