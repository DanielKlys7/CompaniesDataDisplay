// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/script/api.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIncomes = exports.fetchCompanies = void 0;

const fetchCompanies = async () => {
  let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
  let data = await response.json();
  return data;
};

exports.fetchCompanies = fetchCompanies;

const fetchIncomes = async id => {
  let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
  let data = await response.json();
  return data;
};

exports.fetchIncomes = fetchIncomes;
},{}],"src/script/handleModal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCompanyClick = void 0;

var _helperFunctions = require("./helperFunctions");

const table = document.querySelector('.table');
const wrapper = document.querySelector('.wrapper');

const handleCompanyClick = e => {
  wrapper.classList.add('notClickable');
  let specificCompany;

  for (let company of (0, _helperFunctions.checkArrayToRender)()) {
    if (Number(e.target.parentNode.dataset.key) === company.id) {
      specificCompany = company;
    }

    ;
  }

  ;
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
  const totalBetweenDatesDisplay = document.querySelector('.totalBetweenDatesDisplay');
  const averageBetweenDatesDisplay = document.querySelector('.averageBetweenDatesDisplay');

  const displayCustomDatesIncomes = () => {
    const timeFrom = new Date(dateFrom.value).getTime();
    const timeTo = new Date(dateTo.value).getTime();
    const specificCompanyIncomesBetweenDates = specificCompany.incomes.filter(item => Date.parse(item.date) > timeFrom && Date.parse(item.date) < timeTo);
    const totalIncomeBetweenDates = specificCompanyIncomesBetweenDates.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);
    totalBetweenDatesDisplay.textContent = totalIncomeBetweenDates || 0;
    averageBetweenDatesDisplay.textContent = totalIncomeBetweenDates / specificCompanyIncomesBetweenDates.length || 0;
  };

  betweenDatesHandler.addEventListener('click', () => displayCustomDatesIncomes());
  const modal = document.querySelector('.customModal');
  const modalClosingBtn = document.querySelector('.modalClosingBtn');
  modalClosingBtn.addEventListener('click', () => {
    wrapper.classList.remove('notClickable');
    document.body.removeChild(modal);
  });
};

exports.handleCompanyClick = handleCompanyClick;
},{"./helperFunctions":"src/script/helperFunctions.js"}],"src/script/helperFunctions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderCompanies = exports.removeLoaderAndEnableInputs = exports.calculateTotalIncome = exports.checkArrayToRender = exports.handleSaveSortedCompanies = exports.handleSaveFilteredCompanies = exports.filteredCompaniesData = exports.entireCompaniesData = void 0;

var _api = require("./api");

var _handleModal = require("./handleModal");

const filterInput = document.querySelector('.filterInput');
let entireCompaniesData;
exports.entireCompaniesData = entireCompaniesData;
let filteredCompaniesData;
exports.filteredCompaniesData = filteredCompaniesData;

const handleSaveFilteredCompanies = arrayToSaveAsFilteredCompaniesData => {
  exports.filteredCompaniesData = filteredCompaniesData = arrayToSaveAsFilteredCompaniesData;
};

exports.handleSaveFilteredCompanies = handleSaveFilteredCompanies;

const handleSaveSortedCompanies = arrayToSaveAsEntireCompaniesData => {
  exports.entireCompaniesData = entireCompaniesData = arrayToSaveAsEntireCompaniesData;
};

exports.handleSaveSortedCompanies = handleSaveSortedCompanies;

const checkArrayToRender = () => {
  if (filterInput.value) {
    return filteredCompaniesData;
  } else {
    return entireCompaniesData;
  }
};

exports.checkArrayToRender = checkArrayToRender;

const mergeFetchObjects = async () => {
  let fetchedCompanies = await (0, _api.fetchCompanies)();

  for (let company of fetchedCompanies) {
    const fetchedIncomes = await (0, _api.fetchIncomes)(company.id);
    company.incomes = await fetchedIncomes.incomes;
  }

  return fetchedCompanies;
};

const calculateTotalIncome = async () => {
  const companiesWithIncomesArray = await mergeFetchObjects();

  for (let company of companiesWithIncomesArray) {
    company.totalIncome = company.incomes.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);
  }

  ;
  exports.entireCompaniesData = entireCompaniesData = companiesWithIncomesArray;
  return companiesWithIncomesArray;
};

exports.calculateTotalIncome = calculateTotalIncome;

const removeLoaderAndEnableInputs = arrayOfItemsToEnable => {
  const loader = document.querySelector('.loader');
  if (loader) loader.parentNode.removeChild(loader);
  arrayOfItemsToEnable.forEach(i => i.disabled = false);
};

exports.removeLoaderAndEnableInputs = removeLoaderAndEnableInputs;

const renderCompanies = (array, currentPage, amountOfItemsPerPage, placeOfRender) => {
  const itemsOfPage = array.slice(currentPage * amountOfItemsPerPage - amountOfItemsPerPage, amountOfItemsPerPage * currentPage);
  const companiesIntoElements = itemsOfPage.map(company => `<tr class="body__company company" data-key=${company.id}>
      <td class="company__id">${company.id}</td>
      <td class="company__name">${company.name}</td>
      <td class="company__city">${company.city}</td>
      <td class="company__totalIncome">${company.totalIncome.toFixed(2)}</td>
    </tr>`).join('');
  placeOfRender.innerHTML = companiesIntoElements;
  const companiesRows = document.querySelectorAll('.body__company');

  for (let companyRow of companiesRows) {
    companyRow.addEventListener('click', e => {
      (0, _handleModal.handleCompanyClick)(e);
    });
  }

  ;
};

exports.renderCompanies = renderCompanies;
},{"./api":"src/script/api.js","./handleModal":"src/script/handleModal.js"}],"src/script/pagionation.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderButtons = exports.handleCurrentPageChange = exports.currentPage = void 0;

var _helperFunctions = require("./helperFunctions");

var _main = require("./main");

const tbody = document.querySelector('.table__body');
const btnsContainers = document.querySelectorAll('.btnsContainer');
let currentPage = 1;
exports.currentPage = currentPage;

const handleCurrentPageChange = value => {
  exports.currentPage = currentPage = value;
};

exports.handleCurrentPageChange = handleCurrentPageChange;

const renderButtons = (array, amountOfItemsPerPage, placesToRender) => {
  const amountOfPages = Math.ceil(array.length / amountOfItemsPerPage);
  let buttonElement = "";

  for (let i = -1; i <= 2; i++) {
    if (currentPage + i <= amountOfPages && currentPage + i > 0 && i < amountOfPages) {
      buttonElement += `<button class="pageButton" data-value=${currentPage + i}>${currentPage + i}</button>`;
    }

    ;
  }

  ;
  placesToRender.forEach(btnContainer => btnContainer.innerHTML = `
    <button class="pageButton" data-value="1">first</button>
    <button class="previousPageBtn">&#8592; previous</button>
    ${buttonElement}
    <button class="nextPageBtn">next &#8594;</button>
    <button class="pageButton" data-value=${amountOfPages}>last</button>
  `);
  const pageButtons = document.querySelectorAll('.pageButton');

  for (let button of pageButtons) {
    button.addEventListener("click", e => {
      handlePageChange(e);
    });
  }

  ;
  const previousButton = document.querySelector('.previousPageBtn');
  const nextButton = document.querySelector('.nextPageBtn');
  previousButton.addEventListener('click', e => {
    handlePreviousOrNextPage('previous');
  });
  nextButton.addEventListener('click', e => {
    handlePreviousOrNextPage('next');
  });
  handleCurrentPageFocus();
};

exports.renderButtons = renderButtons;

const handleCurrentPageFocus = () => {
  const buttons = document.querySelectorAll('.pageButton');

  for (let singleButton of buttons) {
    singleButton.classList.remove('currentPage');

    if (currentPage === Number(singleButton.dataset.value)) {
      singleButton.classList.add('currentPage');
    }
  }
};

const handlePreviousOrNextPage = instruction => {
  const companiesToRender = (0, _helperFunctions.checkArrayToRender)();

  if (instruction === 'next') {
    if (currentPage < _main.amountOfItemsPerPage) exports.currentPage = currentPage = currentPage + 1;
  } else if (instruction === 'previous') {
    if (currentPage > 1) exports.currentPage = currentPage = currentPage - 1;
  }

  ;
  (0, _helperFunctions.renderCompanies)(companiesToRender, currentPage, _main.amountOfItemsPerPage, tbody);
  renderButtons(companiesToRender, _main.amountOfItemsPerPage, btnsContainers);
};

const handlePageChange = e => {
  const companiesToRender = (0, _helperFunctions.checkArrayToRender)();
  exports.currentPage = currentPage = Number(e.target.dataset.value);
  (0, _helperFunctions.renderCompanies)(companiesToRender, currentPage, _main.amountOfItemsPerPage, tbody);
  renderButtons(companiesToRender, _main.amountOfItemsPerPage, btnsContainers);
};
},{"./helperFunctions":"src/script/helperFunctions.js","./main":"src/script/main.js"}],"src/script/sortAndInput.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByParam = void 0;

var _helperFunctions = require("./helperFunctions");

var _pagionation = require("./pagionation");

var _main = require("./main");

const filterInput = document.querySelector('.filterInput');
const sortInput = document.querySelector('.sortInput');
const btnsContainers = document.querySelectorAll('.btnsContainer');
const tbody = document.querySelector('.table__body');

const sortByParam = async param => {
  const companies = _helperFunctions.entireCompaniesData || (await (0, _helperFunctions.calculateTotalIncome)());

  switch (param) {
    case "totalIncome":
      companies.sort((a, b) => a.totalIncome < b.totalIncome ? 1 : -1);
      break;

    case "id":
      companies.sort((a, b) => a.id < b.id ? -1 : 1);
      break;

    case "name":
      companies.sort((a, b) => a.name < b.name ? -1 : 1);
      break;

    case "city":
      companies.sort((a, b) => a.city < b.city ? -1 : 1);
      break;

    default:
      companies.sort((a, b) => a.totalIncome < b.totalIncome ? 1 : -1);
      break;
  }

  (0, _helperFunctions.handleSaveSortedCompanies)(companies);
  return companies;
};

exports.sortByParam = sortByParam;
sortInput.addEventListener('change', e => {
  (0, _pagionation.handleCurrentPageChange)(1);
  sortByParam(e.target.value);
  (0, _pagionation.renderButtons)((0, _helperFunctions.checkArrayToRender)(), _main.amountOfItemsPerPage, btnsContainers);
  (0, _helperFunctions.renderCompanies)((0, _helperFunctions.checkArrayToRender)(), _pagionation.currentPage, _main.amountOfItemsPerPage, tbody);
});

const filterByName = async () => {
  (0, _pagionation.handleCurrentPageChange)(1);
  (0, _helperFunctions.handleSaveFilteredCompanies)(_helperFunctions.entireCompaniesData.filter(i => i.name.toLowerCase().indexOf(filterInput.value.toLowerCase()) === 0));
  (0, _pagionation.renderButtons)((0, _helperFunctions.checkArrayToRender)(), _main.amountOfItemsPerPage, btnsContainers);
  (0, _helperFunctions.renderCompanies)((0, _helperFunctions.checkArrayToRender)(), _pagionation.currentPage, _main.amountOfItemsPerPage, tbody);
};

filterInput.addEventListener('input', () => {
  filterByName();
});
},{"./helperFunctions":"src/script/helperFunctions.js","./pagionation":"src/script/pagionation.js","./main":"src/script/main.js"}],"src/script/main.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.amountOfItemsPerPage = void 0;

var _sortAndInput = require("./sortAndInput");

var _helperFunctions = require("./helperFunctions");

var _pagionation = require("./pagionation");

const tbody = document.querySelector('.table__body');
const filterInput = document.querySelector('.filterInput');
const sortInput = document.querySelector('.sortInput');
const btnsContainers = document.querySelectorAll('.btnsContainer');
const amountOfItemsPerPage = 15;
exports.amountOfItemsPerPage = amountOfItemsPerPage;

const bootFunction = async () => {
  await (0, _sortAndInput.sortByParam)();
  (0, _helperFunctions.removeLoaderAndEnableInputs)([filterInput, sortInput]);
  (0, _pagionation.renderButtons)((0, _helperFunctions.checkArrayToRender)(), amountOfItemsPerPage, btnsContainers);
  (0, _helperFunctions.renderCompanies)((0, _helperFunctions.checkArrayToRender)(), _pagionation.currentPage, amountOfItemsPerPage, tbody);
};

bootFunction();
},{"./sortAndInput":"src/script/sortAndInput.js","./helperFunctions":"src/script/helperFunctions.js","./pagionation":"src/script/pagionation.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63061" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/script/main.js"], null)
//# sourceMappingURL=/main.e9d9d2da.js.map