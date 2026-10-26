import React, { useState } from 'react';
import { AUCARD, AUBUTTON, AUINPUT, AUSELECT } from 'artiqui/dist/router-engine.es.js';

// AuthGate: rendered ONLY when backend returns AUTHENTICATION_REQUIRED.
// Supports backend-advertised methods (e.g. MOBILE_OTP, AADHAAR). Not hard-coded
// into the workflow engine — methods come from the resolve response.
export default function AuthGate({ methods = [], sessionId, onVerify, verifying }) {
  const available = methods.length ? methods : ['MOBILE_OTP'];
  const [method, setMethod] = useState(available[0]);
  const [credential, setCredential] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!method) {
      setError('Select an authentication method.');
      return;
    }
    if (!credential) {
      setError('Enter the credential for the selected method.');
      return;
    }
    setError('');
    try {
      await onVerify?.({ method, credential });
    } catch (e) {
      setError(e?.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Authentication Required</h2>
      <p style={{ color: '#666', marginBottom: '12px' }}>
        The next step needs actor authentication. You were not asked to log in globally —
        this prompt appears only because the backend requires it for this node.
      </p>
      <AUSELECT
        label="Authentication method"
        name="authMethod"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        options={available.map((m) => ({ label: m, value: m }))}
      />
      <div style={{ marginTop: '12px' }}>
        <AUINPUT
          type="text"
          label={method === 'AADHAAR' ? 'Aadhaar credential' : 'OTP / credential'}
          name="authCredential"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder={method === 'AADHAAR' ? 'Enter Aadhaar-linked credential' : 'Enter OTP'}
        />
      </div>
      {error ? <p style={{ color: '#c00', fontSize: '13px' }}>{error}</p> : null}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <AUBUTTON variant="primary" onClick={handleSubmit} disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify'}
        </AUBUTTON>
      </div>
      {sessionId ? (
        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '10px' }}>Session: {sessionId}</p>
      ) : null}
    </AUCARD>
  );
}
