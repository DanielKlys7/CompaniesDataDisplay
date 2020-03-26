const table = document.querySelector('#table')
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
  handleCurrentPageFocus();
}

//Render
const renderCompanies = (array) => {
  const itemsOfPage = array.slice((currentPage * amountOfItemsPerPage - amountOfItemsPerPage), (amountOfItemsPerPage * currentPage))
  const companiesIntoElements = itemsOfPage.map((company) => (
    `<tr class="company" data-key=${company.id}>
      <td>${company.id}</td>
      <td>${company.name}</td>
      <td>${company.city}</td>
      <td>${company.totalIncome.toFixed(2)}</td>
    </tr>`
    )).join('')
  tbody.innerHTML = companiesIntoElements;
  const companiesRows = document.querySelectorAll('.company');
  for (companyRow of companiesRows) {
    companyRow.addEventListener('click', (e) => {handleCompanyClick(e)})
  };
}
    
const handleCurrentPageFocus = () => {
  const btns = document.getElementsByClassName('pageButton');
  for (btn of btns) {
    btn.classList.remove('currentPage')
    if(currentPage === Number(btn.dataset.value)) {
      btn.classList.add('currentPage')
    }
  }
}

const handlePageChange = (e) => {
  currentPage = Number(e.target.dataset.value);
  renderCompanies(globalFilteredCompanies || globalSortedCompanies);
  handleCurrentPageFocus()
}

const handleCompanyClick = (e) => {
  let specificCompany;
  for (globalSortedCompany of globalSortedCompanies) {
    if(Number(e.target.parentNode.dataset.key) === globalSortedCompany.id) {
      specificCompany = globalSortedCompany;
    };
  };
  const modalTemplate = `
  <div class="customModal">
    <p>id: ${specificCompany.id}</p>
    <p>name: ${specificCompany.name}</p>
    <p>city: ${specificCompany.city}</p>
    <p>total income: ${specificCompany.totalIncome}</p>
    <p>avarage income: ${specificCompany.totalIncome / specificCompany.incomes.length}</p>
    <button class="modalClosingBtn">OK!</button>
  </div>
  `;
  table.insertAdjacentHTML('afterend', modalTemplate);
  const modal = document.querySelector('.customModal');
  const modalClosingBtn = document.querySelector('.modalClosingBtn');
  modalClosingBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  })
}

//Boot
const bootFunction = async () => {
  const sortedCompanies = (globalSortedCompanies || await sortByTotalIncome());
  renderButtons(sortedCompanies);
  renderCompanies(sortedCompanies);
  filterInput.addEventListener("input", () => {
    filterByName();
  })
}
    
const filterByName = async () => {
  currentPage = 1;
  const companies = globalSortedCompanies;
  const filteredCompanies = companies.filter((i) => i.name.toLowerCase().includes(filterInput.value.toLowerCase()));
  globalFilteredCompanies = filteredCompanies;
  renderButtons(filteredCompanies);
  renderCompanies(filteredCompanies);
}


bootFunction();

