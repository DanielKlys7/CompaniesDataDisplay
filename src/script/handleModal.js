import { checkArrayToRender } from "./helperFunctions";
import 'chart.js';

const wrapper = document.querySelector(".wrapper");

const renderModal = (specificCompany) => {
  wrapper.classList.add("notClickable");

  const currentDate = new Date();
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  );

  let lastMonthIncomesOfSpecificCompany = specificCompany.incomes.filter(
    (item) =>
      Date.parse(item.date) > firstDay.getTime() &&
      Date.parse(item.date) < lastDay.getTime()
  );
  let lastMonthTotalIncome = lastMonthIncomesOfSpecificCompany.reduce(
    (previous, current) => {
      return previous + Number(current.value);
    },
    0
  );

  const modalTemplate = `
  <div class="customModal">
    <div class="customModal__basicData basicData">
      <p class="basicData__id" >id: ${specificCompany.id}</p>
      <p class="basicData__name">name: ${specificCompany.name}</p>
      <p class="basicData__city">city: ${specificCompany.city}</p>
      <p class="basicData__totalIncome">total income: ${
    specificCompany.totalIncome
    }</p>
      <p class="basicData__averageIncome">average income: ${
    specificCompany.totalIncome / specificCompany.incomes.length
    }</p>
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
      <p>average income per transaction between dates: <span class="averageBetweenDatesDisplay">0</span></p>
    </div>
    <canvas id="myChart" width=260" height="60"></canvas>
    <button class="modalClosingBtn">OK!</button>
  </div>
  `;

  const sortedArrayOfIncomes = specificCompany.incomes.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  const getArrayOfDates = (specificCompany) => {
    return specificCompany.reduce((total, current) => {
      const date = new Date(current.date);
      const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
      const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
      const year = date.getFullYear();
      total.push(`${year}.${month}.${day}`);
      return total;
    }, [])
  };

  const getArrayOfValues = (specificCompany) => {
    return specificCompany.reduce((total, current) => {
      total.push(current.value);
      return total;
    }, [])
  };

  const arrayOfDates = getArrayOfDates(sortedArrayOfIncomes);
  const arrayOfValues = getArrayOfValues(sortedArrayOfIncomes);

  wrapper.insertAdjacentHTML("afterend", modalTemplate);
  var ctx = document.getElementById('myChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [...arrayOfDates],
      datasets: [{
        label: 'value of transaction',
        data: [...arrayOfValues],
        backgroundColor: 'rgba(245, 176, 66, 1)',
        borderColor: 'rgba(112,112,112, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

};

const displayCustomDatesIncomes = (specificCompany) => {
  const dateFrom = document.querySelector(".datePickers__dateFrom");
  const dateTo = document.querySelector(".datePickers__dateTo");
  const totalBetweenDatesDisplay = document.querySelector(
    ".totalBetweenDatesDisplay"
  );
  const averageBetweenDatesDisplay = document.querySelector(
    ".averageBetweenDatesDisplay"
  );

  const timeFrom = new Date(dateFrom.value).getTime();
  const timeTo = new Date(dateTo.value).getTime();

  const specificCompanyIncomesBetweenDates = specificCompany.incomes.filter(
    (item) => Date.parse(item.date) > timeFrom && Date.parse(item.date) < timeTo
  );
  const totalIncomeBetweenDates = specificCompanyIncomesBetweenDates.reduce(
    (previous, current) => {
      return previous + Number(current.value);
    },
    0
  );

  totalBetweenDatesDisplay.textContent = totalIncomeBetweenDates || 0;
  averageBetweenDatesDisplay.textContent =
    totalIncomeBetweenDates / specificCompanyIncomesBetweenDates.length || 0;
};

const handleModalEvents = (specificCompany) => {
  const betweenDatesHandler = document.querySelector(".handleBetweenDatesBtn");

  betweenDatesHandler.addEventListener("click", () =>
    displayCustomDatesIncomes(specificCompany)
  );

  const modal = document.querySelector(".customModal");
  const modalClosingBtn = document.querySelector(".modalClosingBtn");

  modalClosingBtn.addEventListener("click", () => {
    wrapper.classList.remove("notClickable");
    document.body.removeChild(modal);
  });
};

export const handleCompanyClick = (e) => {
  let specificCompany;

  for (let company of checkArrayToRender()) {
    if (Number(e.target.parentNode.dataset.key) === company.id) {
      specificCompany = company;
    }
  }

  renderModal(specificCompany);
  handleModalEvents(specificCompany);
};
