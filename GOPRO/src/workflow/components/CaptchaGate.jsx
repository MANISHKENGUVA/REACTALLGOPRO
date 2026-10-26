import React, { useState } from 'react';
import { AUCARD, AUBUTTON, AUINPUT } from 'artiqui/dist/router-engine.es.js';

// CaptchaGate: renders backend-provided CAPTCHA challenge.
// Never treats local completion as verified — backend verify is authoritative.
export default function CaptchaGate({ captcha, sessionId, onVerify, verifying }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const provider = captcha?.provider || 'captcha';
  const siteKey = captcha?.siteKey || '';

  const handleSubmit = async () => {
    if (!token) {
      setError('Please complete the CAPTCHA challenge.');
      return;
    }
    setError('');
    try {
      await onVerify?.({ token, provider });
    } catch (e) {
      setError(e?.message || 'CAPTCHA verification failed. Please try again.');
    }
  };

  return (
    <AUCARD className="loan-flow-card">
      <h2>Security Check</h2>
      <p style={{ color: '#666', marginBottom: '12px' }}>
        This step requires CAPTCHA verification. CAPTCHA is not authentication.
      </p>
      {siteKey ? (
        <p style={{ color: '#999', fontSize: '13px' }}>Provider: {provider}</p>
      ) : null}
      <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: '8px', margin: '12px 0' }}>
        <p style={{ fontSize: '14px', color: '#555' }}>
          Complete the {provider} challenge, then paste/confirm the token below.
          Verification happens on the backend.
        </p>
      </div>
      <AUINPUT
        type="text"
        label="CAPTCHA token"
        name="captchaToken"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter CAPTCHA token"
      />
      {error ? <p style={{ color: '#c00', fontSize: '13px' }}>{error}</p> : null}
      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
        <AUBUTTON variant="primary" onClick={handleSubmit} disabled={verifying}>
          {verifying ? 'Verifying...' : 'Verify CAPTCHA'}
        </AUBUTTON>
      </div>
      {sessionId ? (
        <p style={{ color: '#aaa', fontSize: '12px', marginTop: '10px' }}>Session: {sessionId}</p>
      ) : null}
    </AUCARD>
  );
}
