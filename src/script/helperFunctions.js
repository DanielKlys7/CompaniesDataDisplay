import { fetchData } from "./api";
import { sortByParam } from './sortAndInput';
import { updateFirebaseCollection } from './firebaseHandler'

const filterInput = document.querySelector(".filterInput");

export let entireCompaniesData;
export let filteredCompaniesData;

export const saveSortedCompanies = (arrayToSaveAsVariable) => {
  entireCompaniesData = arrayToSaveAsVariable;
};
export const saveFilteredCompanies = (arrayToSaveAsVariable) => {
  filteredCompaniesData = arrayToSaveAsVariable;
};

export const checkArrayToRender = () => {
  return filterInput.value ? filteredCompaniesData : entireCompaniesData;
};

const createCompaniesWithIncomes = async () => {
  let companies = await fetchData(
    `https://recruitment.hal.skygate.io/companies`
  );
  for (let company of companies) {
    const fetchedIncomes = await fetchData(
      `https://recruitment.hal.skygate.io/incomes/${company.id}`
    );
    company.incomes = await fetchedIncomes.incomes;
  }
  return companies;
};

export const calculateTotalIncome = async () => {
  const companiesWithIncomesArray = await createCompaniesWithIncomes();
  for (let company of companiesWithIncomesArray) {
    company.totalIncome = company.incomes.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);
  }
  entireCompaniesData = companiesWithIncomesArray;
  return companiesWithIncomesArray;
};

export const getDataForTheFirstTime = async () => {
  return await sortByParam()
}

export const updateDataInFirebase = async () => {
  const companies = await calculateTotalIncome();
  updateFirebaseCollection(companies);
}