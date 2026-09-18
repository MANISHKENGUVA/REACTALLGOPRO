import React from 'react';


const NotYourTurnPage = () => (
  <div className="not-your-turn-container">
    <div className="card">
      <h1>⏱️ Not Your Turn</h1>
      <p className="message">Workflow has not reached the LENDER stage yet.</p>
      <p className="details">Please wait for the previous actor to complete their step.</p>
      <button className="refresh-btn" onClick={() => window.location.reload()}>Refresh</button>
    </div>
  </div>
);

export default NotYourTurnPage;
