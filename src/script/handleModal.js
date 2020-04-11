import {checkArrayToRender} from './helperFunctions';

const wrapper = document.querySelector('.wrapper');

export const handleCompanyClick = (e) => {
  wrapper.classList.add('notClickable');

  let specificCompany;

  for (let company of checkArrayToRender()) {
    if(Number(e.target.parentNode.dataset.key) === company.id) {
      specificCompany = company;
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
    <div class="customModal__basicData basicData">
      <p class="basicData__id" >id: ${specificCompany.id}</p>
      <p class="basicData__name">name: ${specificCompany.name}</p>
      <p class="basicData__city">city: ${specificCompany.city}</p>
      <p class="basicData__totalIncome">total income: ${specificCompany.totalIncome}</p>
      <p class="basicData__averageIncome">average income: ${specificCompany.totalIncome / specificCompany.incomes.length}</p>
      <p class="basicData__lastMonthTotal">Last month total income: ${lastMonthTotalIncome}</p>
    </div>
    <div class="datePickers">
      <label for="dateFrom">Date from:</label>
      <input id="dateFrom" type="date" class="datePickers__dateFrom" placeholder="Date from"/>
      <label for="dateTo">Date to:</label>
      <input id="dateTo" type="date" class="datePickers__dateTo placeholder="Date to"/>
      <button class="handleBetweenDatesBtn">Check!</button>
    </div>
    <div class="datePickers__dataDisplay">
      <p>total income between dates: <span class="totalBetweenDatesDisplay">0</span></p>
      <p>average income between dates: <span class="averageBetweenDatesDisplay">0</span></p>
    </div>
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

    totalBetweenDatesDisplay.textContent = totalIncomeBetweenDates || 0;
    averageBetweenDatesDisplay.textContent = totalIncomeBetweenDates / specificCompanyIncomesBetweenDates.length || 0;
  }

  betweenDatesHandler.addEventListener('click', () => displayCustomDatesIncomes())

  const modal = document.querySelector('.customModal');
  const modalClosingBtn = document.querySelector('.modalClosingBtn');

  modalClosingBtn.addEventListener('click', () => {
    wrapper.classList.remove('notClickable');
    document.body.removeChild(modal);
  })
}