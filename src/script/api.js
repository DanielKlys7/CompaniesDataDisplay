export const fetchData = async (apiEndpoint) => {
  try {
    const response = await fetch(apiEndpoint);
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    throw Error(err);
  }
};