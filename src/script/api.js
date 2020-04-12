export const fetchCompanies = async () => {
  try {
    let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchIncomes = async (id) => {
  try {
    let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
    let data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
    return [];
  }
};



