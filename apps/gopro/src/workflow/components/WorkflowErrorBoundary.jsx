import { useRouteError } from 'react-router-dom';
import { AUBUTTON, AUCARD } from 'artiqui/dist/router-engine.es.js';
import { publicErrorMessage } from '../../utils/security';

// Route-level boundary: never render raw loader/API errors to the borrower.
export default function WorkflowErrorBoundary() {
  const error = useRouteError();
  // A 401 here means the workflow session is gone. There is no sign-in page to
  // send the borrower to, so offer the only useful action: start again.
  const expired = Number(error?.status) === 401 ||
    String(error?.payload?.code || '') === 'UNAUTHORIZED';

  return (
    <AUCARD className="loan-flow-card" role="alert">
      <h1>{expired ? 'Your session ended' : 'Workflow unavailable'}</h1>
      <p>
        {expired
          ? 'This workflow session is no longer valid. Starting again begins a new application.'
          : publicErrorMessage(error, 'The requested workflow page could not be loaded.')}
      </p>
      <AUBUTTON
        variant="primary"
        onClick={() => {
          window.location.href = expired ? '/loan-flow/workflow' : window.location.href;
        }}
      >
        {expired ? 'Start again' : 'Retry'}
      </AUBUTTON>
      <AUBUTTON variant="outline" onClick={() => { window.location.href = '/'; }}>Home</AUBUTTON>
    </AUCARD>
  );
}
