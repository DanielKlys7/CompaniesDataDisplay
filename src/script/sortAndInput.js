import { entireCompaniesData, filteredCompaniesData, saveFilteredCompanies, saveSortedCompanies, } from "./helperFunctions";
import { getFirebaseCollection } from './firebaseHandler';

export const sortByParam = async (param) => {
  const sortedCompanies = entireCompaniesData || (await getFirebaseCollection());
  const filteredCompanies = filteredCompaniesData || [];
  switch (param) {
    case "totalIncome":
      [sortedCompanies, filteredCompanies].forEach((i) =>
        i.sort((a, b) => (a.totalIncome < b.totalIncome ? 1 : -1))
      );
      break;
    case "id":
      [sortedCompanies, filteredCompanies].forEach((i) =>
        i.sort((a, b) => (a.id < b.id ? -1 : 1))
      );
      break;
    case "name":
      [sortedCompanies, filteredCompanies].forEach((i) =>
        i.sort((a, b) => (a.name < b.name ? -1 : 1))
      );
      break;
    case "city":
      [sortedCompanies, filteredCompanies].forEach((i) =>
        i.sort((a, b) => (a.city < b.city ? -1 : 1))
      );
      break;
    default:
      [sortedCompanies, filteredCompanies].forEach((i) =>
        i.sort((a, b) => (a.totalIncome < b.totalIncome ? 1 : -1))
      );
      break;
  }
  saveFilteredCompanies(filteredCompanies);
  saveSortedCompanies(sortedCompanies);
  return sortedCompanies;
};

export const filterByName = async (input) => {
  saveFilteredCompanies(
    entireCompaniesData.filter(
      (i) => i.name.toLowerCase().indexOf(input.value.toLowerCase()) === 0
    )
  );
};

