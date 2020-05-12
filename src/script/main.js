import { sortByParam } from "./sortAndInput";
import { renderApp } from "./render";

export const settings = {
  actualPageIdx: 1,
  entriesOnPage: 15,
};

export const handleActualPageIdx = (value) => {
  settings.actualPageIdx = value;
};

const bootFunction = async () => {
  await sortByParam();
  renderApp();


};

bootFunction();
