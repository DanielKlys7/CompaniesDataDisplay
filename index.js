const table = document.querySelector('#table')
const tbody = document.querySelector('#tbody')
const filterInput = document.querySelector('#filterInput')
const btnsContainer = document.querySelector('#btnsContainer')
const btnsContainerBottom = document.querySelector('#btnsContainerBottom')
const datepicker = document.querySelector('#hwdp')

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
  btnsContainerBottom.innerHTML = buttonElement;
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
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

  let specificCompany;
  for (globalSortedCompany of globalSortedCompanies) {
    if(Number(e.target.parentNode.dataset.key) === globalSortedCompany.id) {
      specificCompany = globalSortedCompany;
    };
  };

  let lastMonthIncomesOfSpecificCompany = specificCompany.incomes.filter(item => Date.parse(item.date) > firstDay.getTime() && Date.parse(item.date) < lastDay.getTime());
  let lastMonthTotalIncome = lastMonthIncomesOfSpecificCompany.reduce((previous, current) => {
    return previous + Number(current.value);
  }, 0);

  const modalTemplate = `
  <div class="customModal">
    <p>id: ${specificCompany.id}</p>
    <p>name: ${specificCompany.name}</p>
    <p>city: ${specificCompany.city}</p>
    <p>total income: ${specificCompany.totalIncome}</p>
    <p>average income: ${specificCompany.totalIncome / specificCompany.incomes.length}</p>
    <p>Last month total income: ${lastMonthTotalIncome}</p>
    <div class="datepickers">
      <input type="date" id="dateFrom"/>
      <input type="date" id="dateTo"/>
      <button id="handleBetweenDates">Check!</button>
    </div>
    <p>total income between dates: <span id="totalBetweenDates">0</span></p>
    <p>average income between dates: <span id="averageBetweenDates">0</span></p>
    <button class="modalClosingBtn">OK!</button>
  </div>
  `;
  table.insertAdjacentHTML('afterend', modalTemplate);

  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  const betweenDatesHandler = document.getElementById('handleBetweenDates');
  const totalBetweenDatesDisplay = document.getElementById('totalBetweenDates')
  const averageBetweenDatesDisplay = document.getElementById('averageBetweenDates')

  const displayCustomDatesIncomes = () => {
    const timeFrom = new Date(dateFrom.value).getTime();
    const timeTo = new Date(dateTo.value).getTime();

    const specificCompanyIncomesBetweenDates = specificCompany.incomes.filter(item => Date.parse(item.date) > timeFrom && Date.parse(item.date) < timeTo);
    const totalIncomeBetweenDates = specificCompanyIncomesBetweenDates.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);

    totalBetweenDatesDisplay.textContent = totalIncomeBetweenDates;
    averageBetweenDatesDisplay.textContent = totalIncomeBetweenDates / specificCompanyIncomesBetweenDates.length;
  }

  betweenDatesHandler.addEventListener('click', () => displayCustomDatesIncomes())

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

