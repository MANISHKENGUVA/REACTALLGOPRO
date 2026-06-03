export const GETLOANCOLLECTION = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/loan');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch loan collection", error);
    return null;
  }
};

export const GETCONFIGCOLLECTION = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/config');
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch config collection", error);
    return null;
  }
};
