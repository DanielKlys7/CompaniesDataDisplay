import {sortByParam} from './sortAndInput';
import {renderCompanies, checkArrayToRender, removeLoaderAndEnableInputs} from './helperFunctions';
import {currentPage, renderButtons} from './pagionation';

const tbody = document.querySelector('.table__body');
const filterInput = document.querySelector('.filterInput');
const sortInput = document.querySelector('.sortInput');
const btnsContainers = document.querySelectorAll('.btnsContainer');

export const amountOfItemsPerPage = 15;

const bootFunction = async () => {
  await sortByParam();
  removeLoaderAndEnableInputs([filterInput, sortInput]);
  renderButtons(checkArrayToRender(), amountOfItemsPerPage, btnsContainers);
  renderCompanies(checkArrayToRender(), currentPage, amountOfItemsPerPage, tbody);
}

bootFunction();
