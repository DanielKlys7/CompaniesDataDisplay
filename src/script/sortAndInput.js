import {handleSaveFilteredCompanies, handleSaveSortedCompanies, entireCompaniesData, calculateTotalIncome, renderCompanies, filteredCompaniesData, checkArrayToRender} from './helperFunctions';
import {handleCurrentPageChange, amountOfItemsPerPage, currentPage, renderButtons} from './pagination';

const filterInput = document.querySelector('.filterInput');
const sortInput = document.querySelector('.sortInput');
const btnsContainers = document.querySelectorAll('.btnsContainer');
const tbody = document.querySelector('.table__body');

export const sortByParam = async (param) => {
  const sortedCompanies = (entireCompaniesData || await calculateTotalIncome());
  const filteredCompanies =  (filteredCompaniesData || []);
  switch (param) {
    case "totalIncome":
      [sortedCompanies, filteredCompanies].forEach(i => i.sort((a, b) => (a.totalIncome < b.totalIncome) ? 1 : -1));
      break;
    case "id":
      [sortedCompanies, filteredCompanies].forEach(i => i.sort((a, b) => (a.id < b.id) ? -1 : 1));
      break;
    case "name":
      [sortedCompanies, filteredCompanies].forEach(i => i.sort((a, b) => (a.name < b.name) ? -1 : 1));
      break;
    case "city":
      [sortedCompanies, filteredCompanies].forEach(i => i.sort((a, b) => (a.city < b.city) ? -1 : 1));
      break;
    default:
      [sortedCompanies, filteredCompanies].forEach(i => i.sort((a, b) => (a.totalIncome < b.totalIncome) ? 1 : -1));
      break;
  }
  handleSaveFilteredCompanies(filteredCompanies);
  handleSaveSortedCompanies(sortedCompanies);
  return sortedCompanies;
}

sortInput.addEventListener('change', (e) => {
  handleCurrentPageChange(1); 
  sortByParam(e.target.value);
  renderButtons(checkArrayToRender(), amountOfItemsPerPage, btnsContainers);
  renderCompanies(checkArrayToRender(), currentPage, amountOfItemsPerPage, tbody);
})

const filterByName = async () => {
  handleCurrentPageChange(1);
  handleSaveFilteredCompanies(entireCompaniesData.filter((i) => i.name.toLowerCase().indexOf(filterInput.value.toLowerCase()) === 0));
  renderButtons(checkArrayToRender(), amountOfItemsPerPage, btnsContainers);
  renderCompanies(checkArrayToRender(), currentPage, amountOfItemsPerPage, tbody);
}

filterInput.addEventListener('input', () => {
  filterByName();
});
