import { checkArrayToRender } from "./helperFunctions";
import { paginateArray, handlePageChange, handlePreviousOrNextPage } from "./pagination";
import { settings } from "./main";
import { handleCompanyClick } from "./handleModal";
import { sortByParam, filterByName } from "./sortAndInput";

export const filterInput = document.querySelector(".filterInput");
const sortInput = document.querySelector(".sortInput");
const tbody = document.querySelector(".table__body");
const btnsContainers = document.querySelectorAll(".btnsContainer");

const removeLoaderAndEnableInputs = () => {
  const loader = document.querySelector(".loader");
  if (loader) loader.parentNode.removeChild(loader);
  [filterInput, sortInput].forEach((i) => (i.disabled = false));
};

const renderCompanies = (arrayToRender) => {
  const companiesIntoElements = arrayToRender.map((company) => `
    <tr class="body__company company" data-key=${company.id}>
      <td class="company__id">${company.id}</td>
      <td class="company__name">${company.name}</td>
      <td class="company__city">${company.city}</td>
      <td class="company__totalIncome">${company.totalIncome.toFixed(2)}</td>
    </tr>
  `)
    .join("");
  tbody.innerHTML = companiesIntoElements;
};

const renderButtons = (arrayOfFullItems, amountOfItemsPerPage, currentPage) => {
  const amountOfPages = Math.ceil(arrayOfFullItems.length / amountOfItemsPerPage);

  let buttonElement = "";
  for (let i = -1; i <= 2; i++) {
    if (currentPage + i <= amountOfPages && currentPage + i > 0 && i < amountOfPages) {
      buttonElement += `<button class="pageButton" data-value=${currentPage + i}>${currentPage + i}</button>`;
    }
  }

  btnsContainers.forEach((btnContainer) => (btnContainer.innerHTML = `
      <button class="pageButton" data-value="1">first</button>
      <button class="previousPageBtn">&#8592; previous</button>
      ${buttonElement}
      <button class="nextPageBtn">next &#8594;</button>
      <button class="pageButton" data-value=${amountOfPages}>last</button>
    `)
  );
};

const handleEvents = () => {
  const companiesRows = document.querySelectorAll(".body__company");
  const pageButtons = document.querySelectorAll(".pageButton");
  const previousButtons = document.querySelectorAll(".previousPageBtn");
  const nextButtons = document.querySelectorAll(".nextPageBtn");

  for (let companyRow of companiesRows) {
    companyRow.addEventListener("click", (e) => {
      handleCompanyClick(e);
    });
  }

  for (let button of pageButtons) {
    button.addEventListener("click", (e) => {
      handlePageChange(Number(e.target.dataset.value));
      renderApp();
    });
  }

  previousButtons.forEach((i) =>
    i.addEventListener("click", () => {
      handlePreviousOrNextPage("previous", settings, checkArrayToRender());
      renderApp();
    })
  );

  nextButtons.forEach((i) =>
    i.addEventListener("click", () => {
      handlePreviousOrNextPage("next", settings, checkArrayToRender());
      renderApp();
    })
  );

  sortInput.addEventListener("change", (e) => {
    handlePageChange(1);
    sortByParam(e.target.value);
    renderApp();
  });

  filterInput.addEventListener("input", () => {
    handlePageChange(1);
    filterByName(filterInput);
    renderApp();
  });
};

const handleCurrentPageFocus = (currentPage) => {
  const buttons = document.querySelectorAll(".pageButton");
  for (let singleButton of buttons) {
    singleButton.classList.remove("currentPage");
    if (currentPage === Number(singleButton.dataset.value)) {
      singleButton.classList.add("currentPage");
    }
  }
};

export const renderApp = () => {
  const { entriesOnPage, actualPageIdx } = settings;

  removeLoaderAndEnableInputs();
  renderCompanies(paginateArray(checkArrayToRender(), settings));
  renderButtons(checkArrayToRender(), entriesOnPage, actualPageIdx);
  handleEvents();
  handleCurrentPageFocus(actualPageIdx);
};
