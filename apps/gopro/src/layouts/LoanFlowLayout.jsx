import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLoaderData, useLocation, useSearchParams } from 'react-router-dom';
import { getResolvedWorkflowState, workflowViewData } from '../utils/globalRouterNavigator';
import { buildLoanProgress } from '../workflow/loanProgress';
import { normalizeActor, sanitizeWorkflowId } from '../utils/security';
import { Icon } from '../components/ui/Icons';
import SidebarTracker from '../components/progress/SidebarTracker';
import MobileProgress from '../components/progress/MobileProgress';

const ACTOR_LABELS = {
  BORROWER: 'Borrower',
  COBORROWER: 'Co-borrower',
  LENDER: 'Lender',
  MANAGER: 'Credit manager',
};

export default function LoanFlowLayout() {
  const loaderData = useLoaderData();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [hubData, setHubData] = useState(null);

  // The hub is a child route, so its resolved node arrives through the outlet
  // context instead of the loader. Clear it whenever the URL leaves the hub so
  // a stale hub projection can never sit beside a page loader's data.
  useEffect(() => {
    setHubData(null);
  }, [pathname]);

  const publishWorkflowData = useCallback((data) => {
    setHubData(data || null);
  }, []);

  const workflowData = loaderData?.workflowData || hubData;
  const viewData = workflowViewData(workflowData);
  const workflowState = getResolvedWorkflowState(workflowData);
  const status = String(viewData?.status || workflowData?.status || '').toUpperCase();

  const workflowId = sanitizeWorkflowId(
    workflowData?.workflowId
    || viewData?.workflowId
    || searchParams.get('WORKFLOW_ID'),
  );

  const actor = workflowState?.metadata?.actor
    || normalizeActor(workflowData?.workflowActor || viewData?.workflowActor || workflowData?.actor);

  const progress = useMemo(() => buildLoanProgress({
    actor,
    node: workflowState?.metadata?.node,
    module: workflowState?.metadata?.module,
    status,
    type: workflowState?.type,
    stateId: workflowState?.stateId,
  }), [
    actor,
    status,
    workflowState?.metadata?.module,
    workflowState?.metadata?.node,
    workflowState?.stateId,
    workflowState?.type,
  ]);

  return (
    <div className="gp-app">
      <a className="gp-skip-link" href="#gp-main">Skip to main content</a>

      <header className="gp-header">
        <div className="gp-header__inner">
          <Link className="gp-brand" to="/" aria-label="GOPRO loan application home">
            <span className="gp-brand__mark" aria-hidden="true">
              <Icon name="shield" size={21} />
            </span>
            <span className="gp-brand__text">
              <span className="gp-brand__name">GOPRO</span>
              <span className="gp-brand__sub">Loan application</span>
            </span>
          </Link>

          <div className="gp-header__aside">
            <span className="gp-header__secured">
              <Icon name="lock" size={13} />
              Secure application
            </span>
            {ACTOR_LABELS[actor] ? (
              <span className="gp-header__actor">{ACTOR_LABELS[actor]}</span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="gp-shell">
        <aside className="gp-sidebar" aria-label="Application status">
          <div className="gp-sidebar__inner">
            <SidebarTracker progress={progress} workflowId={workflowId} actor={actor} />
          </div>
        </aside>

        <main className="gp-main" id="gp-main" tabIndex={-1}>
          <MobileProgress progress={progress} workflowId={workflowId} />
          <Outlet context={{ workflowData, publishWorkflowData }} />
        </main>
      </div>
    </div>
  );
}
