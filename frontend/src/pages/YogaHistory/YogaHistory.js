import React from "react";
import "./YogaHistory.css";

const YogaHistory = () => {
  return (
    <div className="yoga-history-container">
      <header className="yoga-header">
        <h1>Yoga History & Its Benefits</h1>
      </header>

      <section className="history-section">
        <h2>History of Yoga</h2>
        <p>
          Yoga is an ancient practice that originated in India over 5,000 years
          ago. The word "Yoga" comes from the Sanskrit root "Yuj," which means
          "to unite" or "to join." It was developed as a spiritual discipline to
          achieve harmony between mind, body, and spirit. The practice was later
          documented in the Yoga Sutras of Patanjali, one of the most important
          texts in yogic philosophy.
        </p>
      </section>

      <section className="benefits-section">
        <h2>Why is Yoga Important?</h2>
        <ul>
          <li>Improves flexibility and posture</li>
          <li>Enhances mental clarity and reduces stress</li>
          <li>Boosts respiratory and cardiovascular health</li>
          <li>Encourages mindfulness and relaxation</li>
          <li>Strengthens the immune system</li>
        </ul>
      </section>
    </div>
  );
};

export default YogaHistory;
