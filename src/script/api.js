export const fetchCompanies = async () => {
  let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
  let data = await response.json();
  return data;
};

export const fetchIncomes = async (id) => {
  let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
  let data = await response.json();
  return data;
};



