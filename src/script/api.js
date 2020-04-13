export const fetchData = async (apiEndpoint) => {
  try {
    let response = await fetch(apiEndpoint);
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};



