const tbody = document.querySelector('#tbody')
const filterInput = document.querySelector('#filterInput')
const btnsContainer = document.querySelector('#btnsContainer')

let globalSortedCompanies;
let globalFilteredCompanies;

const fetchCompanies = async () => {
  let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
  let data = await response.json();
  return data;
}

const fetchIncomes = async (id) => {
  let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
  let data = await response.json();
  return data;
}

const mergeFetchObjects = async () => {
  let fetchedCompanies = await fetchCompanies();
  for (fetchedCompany of fetchedCompanies) {
    const fetchedIncomes = await fetchIncomes(fetchedCompany.id)
    fetchedCompany.incomes = await fetchedIncomes.incomes;
  }
  return fetchedCompanies;
}

const calculateTotalIncome = async () => {
  const companies = await mergeFetchObjects();
  for (company of companies) {
    company.totalIncome = company.incomes.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);
  }
  return companies;
}

const sortByTotalIncome = async () => {
  const companies = await calculateTotalIncome();
  companies.sort((a, b) => (a.totalIncome < b.totalIncome) ? 1 : -1)
  globalSortedCompanies = companies;
  return companies;
}

//Pagination
let pageButtons;

let currentPage = 1;
const amountOfItemsPerPage = 30;

const renderButtons = (array) => {
  const amountOfPages = Math.ceil(array.length / amountOfItemsPerPage)
  let buttonElement = "";
  for (let i = 1; i <= amountOfPages; i++) {
    buttonElement += `<button class="pageButton" data-value=${i}>${i}</button>`
  }
  btnsContainer.innerHTML = buttonElement;
  pageButtons = document.querySelectorAll('.pageButton')
  for (button of pageButtons) {
    button.addEventListener("click", (e) => {
      handlePageChange(e)
    })
  }
}

//Render
const renderCompanies = (array) => {
  const itemsOfPage = array.slice((currentPage * amountOfItemsPerPage - amountOfItemsPerPage), (amountOfItemsPerPage * currentPage))
  const companiesIntoElements = itemsOfPage.map((company) => (
    `<tr>
      <td>${company.id}</td>
      <td>${company.name}</td>
      <td>${company.city}</td>
      <td>${company.totalIncome.toFixed(2)}</td>
    </tr>`
    )).join('')
  tbody.innerHTML = companiesIntoElements;
}
    
const handlePageChange = (e) => {
  currentPage = Number(e.target.dataset.value);
  renderCompanies(globalFilteredCompanies || globalSortedCompanies);
}
    
//Boot
const bootFunction = async () => {
  const sortedCompanies = await sortByTotalIncome();
  renderButtons(sortedCompanies);
  renderCompanies(sortedCompanies);
  filterInput.addEventListener("input", () => {
    filterByName();
  })
}
    
const filterByName = async () => {
  const companies = globalSortedCompanies;
  const filteredCompanies = companies.filter((i) => i.name.toLowerCase().includes(filterInput.value.toLowerCase()));
  globalFilteredCompanies = filteredCompanies;
  renderButtons(filteredCompanies);
  renderCompanies(filteredCompanies);
}

bootFunction();

