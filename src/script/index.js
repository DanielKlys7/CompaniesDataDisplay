const table = document.querySelector('.table')
const wrapper = document.querySelector('.wrapper');
const tbody = document.querySelector('.table__body')
const filterInput = document.querySelector('.filterInput')
const btnsContainers = document.querySelectorAll('.btnsContainer')

let globalSortedCompanies;
let globalFilteredCompanies;

const fetchCompanies = async () => {
  let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
  let data = await response.json();
  return data;
};

const fetchIncomes = async (id) => {
  let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
  let data = await response.json();
  return data;
};

const mergeFetchObjects = async () => {
  let fetchedCompanies = await fetchCompanies();
  for (fetchedCompany of fetchedCompanies) {
    const fetchedIncomes = await fetchIncomes(fetchedCompany.id);
    fetchedCompany.incomes = await fetchedIncomes.incomes;
  };
  return fetchedCompanies;
};

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
  companies.sort((a, b) => (a.totalIncome < b.totalIncome) ? 1 : -1);
  globalSortedCompanies = companies;
  return companies;
}

//Pagination
let pageButtons;

let currentPage = 1;
const amountOfItemsPerPage = 15;

const renderButtons = (array) => {
  const amountOfPages = Math.ceil(array.length / amountOfItemsPerPage);
  let buttonElement = "";
  for (let i = 0; i <= 3; i++) {
    if (currentPage + i > 20) break;
    buttonElement += `<button class="pageButton" data-value=${currentPage + i}>${currentPage+ i}</button>`
  };
  btnsContainers.forEach(i => i.innerHTML = `
    <button class="previousPageBtn">&#8592; previous</button>
    <button class="pageButton" data-value="1">first</button>
    ${buttonElement}
    <button class="pageButton" data-value=${amountOfPages}>last</button>
    <button class="nextPageBtn">next &#8594;</button>`
  );
  pageButtons = document.querySelectorAll('.pageButton');
  for (button of pageButtons) {
    button.addEventListener("click", (e) => {
      handlePageChange(e);
    });
  };
  const addCurrentPage = () => {
    if (currentPage < amountOfPages) {
      currentPage++;
      renderCompanies(globalFilteredCompanies || globalSortedCompanies);
      renderButtons(globalSortedCompanies);
      handleCurrentPageFocus();
    }
  }
  const minusCurrentPage = () => {
    if (currentPage > 1) {
      currentPage--;
      renderCompanies(globalFilteredCompanies || globalSortedCompanies);
      renderButtons(globalSortedCompanies);
      handleCurrentPageFocus();
    } 
  }
  document.querySelectorAll('.previousPageBtn').forEach(i => i.addEventListener('click', () => minusCurrentPage()));
  document.querySelectorAll('.nextPageBtn').forEach(i => i.addEventListener('click', () => addCurrentPage()));
  handleCurrentPageFocus();
};

//Render
const renderCompanies = (array) => {
  const itemsOfPage = array.slice((currentPage * amountOfItemsPerPage - amountOfItemsPerPage), (amountOfItemsPerPage * currentPage));
  const companiesIntoElements = itemsOfPage.map((company) => (
    `<tr class="body__company" data-key=${company.id}>
      <td>${company.id}</td>
      <td>${company.name}</td>
      <td>${company.city}</td>
      <td>${company.totalIncome.toFixed(2)}</td>
    </tr>`
    )).join('');
  tbody.innerHTML = companiesIntoElements;
  const companiesRows = document.querySelectorAll('.body__company');
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
  renderButtons(globalSortedCompanies);
  handleCurrentPageFocus();
}

const handleCompanyClick = (e) => {
  let specificCompany;
  for (globalSortedCompany of globalSortedCompanies) {
    if(Number(e.target.parentNode.dataset.key) === globalSortedCompany.id) {
      specificCompany = globalSortedCompany;
    };
  };

  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

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
    <div class="datePickers">
      <input type="date" class="datePickers__dateFrom"/>
      <input type="date" class="datePickers__dateTo"/>
      <button class="handleBetweenDatesBtn">Check!</button>
    </div>
    <p>total income between dates: <span class="totalBetweenDatesDisplay">0</span></p>
    <p>average income between dates: <span class="averageBetweenDatesDisplay">0</span></p>
    <button class="modalClosingBtn">OK!</button>
  </div>
  `;
  wrapper.insertAdjacentHTML('afterend', modalTemplate);

  const dateFrom = document.querySelector('.datePickers__dateFrom');
  const dateTo = document.querySelector('.datePickers__dateTo');
  const betweenDatesHandler = document.querySelector('.handleBetweenDatesBtn');
  const totalBetweenDatesDisplay = document.querySelector('.totalBetweenDatesDisplay')
  const averageBetweenDatesDisplay = document.querySelector('.averageBetweenDatesDisplay')

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
  const filteredCompanies = globalSortedCompanies.filter((i) => i.name.toLowerCase().includes(filterInput.value.toLowerCase()));
  globalFilteredCompanies = filteredCompanies;
  renderButtons(filteredCompanies);
  renderCompanies(filteredCompanies);
}

bootFunction();

