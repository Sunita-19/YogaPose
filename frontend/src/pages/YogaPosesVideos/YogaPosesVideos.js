import React, { useState } from "react";
import "./YogaPosesVideos.css";

const YogaPosesVideos = () => {
  const [selectedAsana, setSelectedAsana] = useState(null);

  const handleAsanaClick = (asana) => {
    setSelectedAsana(asana);
  };

  return (
    <div className="yoga-poses-container">
      <header className="yoga-header">
        <h1>Yoga Asanas</h1>
      </header>

      {/* Yoga Levels Section */}
      <section className="yoga-levels">
        <div className="level-box">
          <h3>Beginner</h3>
          <ul>
            {["Tadasana (Mountain Pose)", "Adho Mukha Svanasana (Downward Dog)", "Virabhadrasana I (Warrior I)", "Vrikshasana (Tree Pose)", "Balasana (Child's Pose)", "Bhujangasana (Cobra Pose)", "Paschimottanasana (Seated Forward Bend)", "Setu Bandhasana (Bridge Pose)", "Marjaryasana-Bitilasana (Cat-Cow Pose)", "Utkatasana (Chair Pose)"].map((asana) => (
              <li key={asana} onClick={() => handleAsanaClick(asana)}>
                {asana}
              </li>
            ))}
          </ul>
        </div>

        <div className="level-box">
          <h3>Intermediate</h3>
          <ul>
            {["Trikonasana (Triangle Pose)", "Ardha Chandrasana (Half Moon Pose)", "Bhujangasana (Cobra Pose)", "Virabhadrasana II (Warrior II)", "Bakasana (Crow Pose)", "Navasana (Boat Pose)", "Phalakasana (Plank Pose)", "Parivrtta Trikonasana (Revolved Triangle Pose)", "Eka Pada Rajakapotasana (Pigeon Pose)", "Ustrasana (Camel Pose)"].map((asana) => (
              <li key={asana} onClick={() => handleAsanaClick(asana)}>
                {asana}
              </li>
            ))}
          </ul>
        </div>

        <div className="level-box">
          <h3>Advanced</h3>
          <ul>
            {["Vrschikasana (Scorpion Pose)", "Tittibhasana (Firefly Pose)", "Sirsasana (Headstand)", "Adho Mukha Vrksasana (Handstand)", "Pincha Mayurasana (Forearm Stand)", "Eka Pada Galavasana (Flying Pigeon Pose)", "Kapotasana (King Pigeon Pose)", "Mayurasana (Peacock Pose)", "Urdhva Dhanurasana (Wheel Pose)", "Dhanurasana (Bow Pose)"].map((asana) => (
              <li key={asana} onClick={() => handleAsanaClick(asana)}>
                {asana}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Asana Tutorial Section */}
      {selectedAsana && (
        <div className="asana-tutorial">
          <h3>{selectedAsana}</h3>
          <p>This is the detailed tutorial for {selectedAsana}. Learn step-by-step instructions and tips to perform this pose correctly and safely.</p>
          <button onClick={() => setSelectedAsana(null)}>Close Tutorial</button>
        </div>
      )}

      {/* Video Section */}
      <section className="yoga-videos">
        <h2>Interactive Yoga Videos</h2>
        <div className="videos">
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/7GyC_UVFGU0"
              title="Beginner Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Beginner Yoga</h4>
          </div>
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/_LvGTQ3Aq-g"
              title="Intermediate Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Intermediate Yoga</h4>
          </div>
          <div className="video-box">
            <iframe
              width="100%"
              height="315"
              src="https://www.youtube.com/embed/CiaD3jP0YhA"
              title="Advanced Yoga"
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <h4>Advanced Yoga</h4>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YogaPosesVideos;
