// Serializes first-time workflow bootstrap across tabs of this origin.
//
// The backend already prevents a reload or a later tab from opening a second
// application: the first response sets the HttpOnly `wf_recover` cookie and
// `POST /workflow/session {}` resumes it. The remaining race is two tabs asking
// for a brand-new application at the same instant, before either response has
// set that cookie. Web Locks makes the second tab wait for the first request to
// finish, so its own request sees the cookie and resumes the same application.
//
// Browsers without the Web Locks API keep the previous behaviour; the backend
// cookie still covers every request that starts after the first response.

const LOCK_NAME = 'gopro-workflow-bootstrap';

export async function withBootstrapLock(task) {
  if (typeof navigator === 'undefined' || !navigator.locks?.request) {
    return task();
  }
  return navigator.locks.request(LOCK_NAME, { mode: 'exclusive' }, () => task());
}
