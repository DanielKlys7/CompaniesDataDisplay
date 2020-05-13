import { handleActualPageIdx } from "./main";

const checkIfArray = (array) => {
  if (Array.isArray(array)) {
    return true;
  } else {
    throw new Error(`parameter is not an array`);
  }
};

const checkIfObject = (settings) => {
  const typeOfSettings = typeof settings;
  const isVariableAnArray = Array.isArray(settings);
  if (typeOfSettings === "object" && isVariableAnArray === false) {
    return true;
  } else {
    throw new Error("settings is not an object");
  }
};

const checkSettingsProperties = (settings) => {
  const DoesActualPageIdxExist = settings.hasOwnProperty("actualPageIdx");
  const DoesEntriesOnPageExist = settings.hasOwnProperty("entriesOnPage");

  if (DoesActualPageIdxExist && DoesEntriesOnPageExist) {
    for (const property in settings) {
      const isNumber =
        typeof settings[property] === "number" && settings[property] >= 0
          ? true
          : false;
      if (!isNumber) {
        throw new Error(`${property} is not number or is not >= 0`);
      }
    }
  } else {
    throw new Error("settings doesn't have one of neccesary properties");
  }
  return true;
};

export const paginateArray = (dataEntries, settings) => {
  if (!checkIfArray(dataEntries)) {
    return;
  }
  if (!checkIfObject(settings)) {
    return;
  }
  if (!checkSettingsProperties(settings)) {
    return;
  }

  const { actualPageIdx, entriesOnPage } = settings;
  return dataEntries.slice(
    actualPageIdx * entriesOnPage - entriesOnPage,
    actualPageIdx * entriesOnPage
  );
};

export const handlePageChange = (value) => {
  handleActualPageIdx(value);
};

export const handlePreviousOrNextPage = (
  instruction,
  settings,
  arrayOfFullItems
) => {
  const { actualPageIdx, entriesOnPage } = settings;

  if (instruction === "next") {
    if (actualPageIdx < Math.ceil(arrayOfFullItems.length / entriesOnPage)) {
      handleActualPageIdx(settings.actualPageIdx + 1);
    }
  } else if (instruction === "previous") {
    if (actualPageIdx > 1) {
      handleActualPageIdx(settings.actualPageIdx - 1);
    }
  }
};
