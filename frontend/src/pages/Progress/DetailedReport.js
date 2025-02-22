import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DetailedReport.css';

const DetailedReport = () => {
  const [detailedReport, setDetailedReport] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      axios.get('/api/detailed-report', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setDetailedReport(response.data);
      })
      .catch(error => {
        console.error('Error fetching detailed report:', error);
      });
    }
  }, [token]);

  if (!token) {
    return (
      <div className="detailed-report-container">
        <h1>Please log in to view your detailed report.</h1>
      </div>
    );
  }

  return (
    <div className="detailed-report-container">
      <div className="detailed-report-header">
        <h1>Detailed Report</h1>
      </div>
      { !detailedReport ? (
        <p className="detailed-report-content">Loading detailed report...</p>
      ) : (
        <div className="detailed-report-content">
          <p>Total Duration: {detailedReport.totalDuration} minutes</p>
          <p>Average Duration: {detailedReport.averageDuration} minutes</p>
          <h2>Sessions:</h2>
          <ul>
            {detailedReport.sessions.map((session, index) => (
              <li key={index}>
                {session.date}: {session.duration} minutes ({session.pose})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DetailedReport;
