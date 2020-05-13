import { getDataForTheFirstTime, updateDataInFirebase } from "./helperFunctions";
import { renderApp } from "./render";

export const settings = {
  actualPageIdx: 1,
  entriesOnPage: 15,
};

export const handleActualPageIdx = (value) => {
  settings.actualPageIdx = value;
};

const bootFunction = async () => {
  await getDataForTheFirstTime();
  renderApp();

  updateDataInFirebase();
};

bootFunction();
