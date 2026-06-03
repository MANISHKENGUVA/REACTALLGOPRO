export const runWFEngine = async () => {
  console.log('WF Engine started (Fetching from backend)');
  try {
    const response = await fetch('http://localhost:5000/api/engine/start');
    const payLoad = await response.json();
    console.log('payLoad from backend', payLoad);
    return payLoad;
  } catch (error) {
    console.error("Failed to fetch engine state from backend", error);
    return null;
  }
};
