import {
  fetchData
} from "./api";
import {
  handleCompanyClick
} from "./handleModal";

const filterInput = document.querySelector(".filterInput");

export let entireCompaniesData;
export let filteredCompaniesData;

export const saveFilteredCompanies = (arrayToSaveAsVariable) => {
  filteredCompaniesData = arrayToSaveAsVariable;
};

export const saveSortedCompanies = (arrayToSaveAsVariable) => {
  entireCompaniesData = arrayToSaveAsVariable;
};

export const checkArrayToRender = () => {
  return filterInput.value ? filteredCompaniesData : entireCompaniesData;
};

const checkIfArray = array => {
  if (Array.isArray(array)) {
    return true;
  } else {
    throw new Error(`parameter is not an array`);
  }
};

const checkIfObject = settings => {
  const typeOfSettings = typeof settings;
  const isVariableAnArray = Array.isArray(settings);
  if (typeOfSettings === "object" && isVariableAnArray === false) {
    return true;
  } else {
    throw new Error("settings is not an object");
  }
};

const paginateArray = (dataEntries, settings) => {
  if (!checkIfArray(dataEntries)) {
    return;
  }
  if (!checkIfObject(settings)) {
    return;
  }
  if (!checkSettingsProperties(settings)) {
    return;
  }

  const {
    actualPageIdx,
    entriesOnPage
  } = settings;
  return dataEntries.slice(
    actualPageIdx * entriesOnPage - entriesOnPage,
    actualPageIdx * entriesOnPage
  );
};

const checkSettingsProperties = settings => {
  const DoesActualPageIdxExist = settings.hasOwnProperty("actualPageIdx");
  const DoesEntriesOnPageExist = settings.hasOwnProperty("entriesOnPage");

  if (DoesActualPageIdxExist && DoesEntriesOnPageExist) {
    for (const property in settings) {
      const isNumber =
        typeof settings[property] === "number" && settings[property] >= 0 ?
        true :
        false;
      if (!isNumber) {
        throw new Error(`${property} is not number or is not >= 0`);
      }
    }
  } else {
    throw new Error("settings doesn't have one of neccesary properties");
  }
  return true;
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

export const removeLoaderAndEnableInputs = (arrayOfItemsToEnable) => {
  const loader = document.querySelector(".loader");
  if (loader) loader.parentNode.removeChild(loader);
  arrayOfItemsToEnable.forEach((i) => (i.disabled = false));
};

export const renderCompanies = (array, currentPage, amountOfItemsPerPage, placeOfRender) => {
  const itemsOfPage = array.slice(
    currentPage * amountOfItemsPerPage - amountOfItemsPerPage,
    amountOfItemsPerPage * currentPage
  );
  const companiesIntoElements = itemsOfPage
    .map(
      (company) =>
      `<tr class="body__company company" data-key=${company.id}>
      <td class="company__id">${company.id}</td>
      <td class="company__name">${company.name}</td>
      <td class="company__city">${company.city}</td>
      <td class="company__totalIncome">${company.totalIncome.toFixed(2)}</td>
    </tr>`
    )
    .join("");
  placeOfRender.innerHTML = companiesIntoElements;

  const companiesRows = document.querySelectorAll(".body__company");
  for (let companyRow of companiesRows) {
    companyRow.addEventListener("click", (e) => {
      handleCompanyClick(e);
    });
  }
};