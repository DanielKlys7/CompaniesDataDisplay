import {checkArrayToRender, renderCompanies} from './helperFunctions';

const tbody = document.querySelector('.table__body');
const btnsContainers = document.querySelectorAll('.btnsContainer');

export const amountOfItemsPerPage = 15;
export let currentPage = 1;

export const handleCurrentPageChange = (value) => {
  currentPage = value;
}

export const renderButtons = (array, amountOfItemsPerPage, placesToRender) => {
  const amountOfPages = Math.ceil(array.length / amountOfItemsPerPage);

  let buttonElement = "";
  for (let i = -1; i <= 2; i++) {
    if ((currentPage + i <= amountOfPages) && (currentPage + i > 0) && (i < amountOfPages)) {
      buttonElement += `<button class="pageButton" data-value=${currentPage + i}>${currentPage+ i}</button>`;
    };
  };
  
  placesToRender.forEach(btnContainer => btnContainer.innerHTML = `
    <button class="pageButton" data-value="1">first</button>
    <button class="previousPageBtn">&#8592; previous</button>
    ${buttonElement}
    <button class="nextPageBtn">next &#8594;</button>
    <button class="pageButton" data-value=${amountOfPages}>last</button>
  `);

  const pageButtons = document.querySelectorAll('.pageButton');
  for (let button of pageButtons) {
    button.addEventListener("click", (e) => {
      handlePageChange(e);
    });
  };

  const handlePreviousOrNextPage = (instruction) => {
    const companiesToRender = checkArrayToRender();
    if (instruction === 'next') {
      if(currentPage < amountOfPages) currentPage++;
    } else if (instruction === 'previous') {
      if(currentPage > 1) currentPage--;
    };
    renderCompanies(companiesToRender, currentPage, amountOfItemsPerPage, tbody);
    renderButtons(companiesToRender, amountOfItemsPerPage, btnsContainers);
  };

  const previousButtons = document.querySelectorAll('.previousPageBtn');
  const nextButtons = document.querySelectorAll('.nextPageBtn');

  previousButtons.forEach(i => i.addEventListener('click', (e) => {
    handlePreviousOrNextPage('previous');
  }));
  nextButtons.forEach(i => i.addEventListener('click', (e) => {
    handlePreviousOrNextPage('next');
  }));
  
  handleCurrentPageFocus();
};

const handleCurrentPageFocus = () => {
  const buttons = document.querySelectorAll('.pageButton');
  for (let singleButton of buttons) {
    singleButton.classList.remove('currentPage')
    if(currentPage === Number(singleButton.dataset.value)) {
      singleButton.classList.add('currentPage')
    }
  }
}


const handlePageChange = (e) => {
  const companiesToRender = checkArrayToRender();
  currentPage = Number(e.target.dataset.value);
  renderCompanies(companiesToRender, currentPage, amountOfItemsPerPage, tbody);
  renderButtons(companiesToRender, amountOfItemsPerPage, btnsContainers);
};


