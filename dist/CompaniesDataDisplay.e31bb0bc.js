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
})({"index.js":[function(require,module,exports) {
const table = document.querySelector('#table');
const tbody = document.querySelector('#tbody');
const filterInput = document.querySelector('#filterInput');
const btnsContainer = document.querySelector('#btnsContainer');
const datepicker = document.querySelector('#hwdp');
let globalSortedCompanies;
let globalFilteredCompanies;

const fetchCompanies = async () => {
  let response = await fetch(`https://recruitment.hal.skygate.io/companies`);
  let data = await response.json();
  return data;
};

const fetchIncomes = async id => {
  let response = await fetch(`https://recruitment.hal.skygate.io/incomes/${id}`);
  let data = await response.json();
  return data;
};

const mergeFetchObjects = async () => {
  let fetchedCompanies = await fetchCompanies();

  for (fetchedCompany of fetchedCompanies) {
    const fetchedIncomes = await fetchIncomes(fetchedCompany.id);
    fetchedCompany.incomes = await fetchedIncomes.incomes;
  }

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
};

const sortByTotalIncome = async () => {
  const companies = await calculateTotalIncome();
  companies.sort((a, b) => a.totalIncome < b.totalIncome ? 1 : -1);
  globalSortedCompanies = companies;
  return companies;
}; //Pagination


let pageButtons;
let currentPage = 1;
const amountOfItemsPerPage = 30;

const renderButtons = array => {
  const amountOfPages = Math.ceil(array.length / amountOfItemsPerPage);
  let buttonElement = "";

  for (let i = 1; i <= amountOfPages; i++) {
    buttonElement += `<button class="pageButton" data-value=${i}>${i}</button>`;
  }

  btnsContainer.innerHTML = buttonElement;
  pageButtons = document.querySelectorAll('.pageButton');

  for (button of pageButtons) {
    button.addEventListener("click", e => {
      handlePageChange(e);
    });
  }

  handleCurrentPageFocus();
}; //Render


const renderCompanies = array => {
  const itemsOfPage = array.slice(currentPage * amountOfItemsPerPage - amountOfItemsPerPage, amountOfItemsPerPage * currentPage);
  const companiesIntoElements = itemsOfPage.map(company => `<tr class="company" data-key=${company.id}>
      <td>${company.id}</td>
      <td>${company.name}</td>
      <td>${company.city}</td>
      <td>${company.totalIncome.toFixed(2)}</td>
    </tr>`).join('');
  tbody.innerHTML = companiesIntoElements;
  const companiesRows = document.querySelectorAll('.company');

  for (companyRow of companiesRows) {
    companyRow.addEventListener('click', e => {
      handleCompanyClick(e);
    });
  }

  ;
};

const handleCurrentPageFocus = () => {
  const btns = document.getElementsByClassName('pageButton');

  for (btn of btns) {
    btn.classList.remove('currentPage');

    if (currentPage === Number(btn.dataset.value)) {
      btn.classList.add('currentPage');
    }
  }
};

const handlePageChange = e => {
  currentPage = Number(e.target.dataset.value);
  renderCompanies(globalFilteredCompanies || globalSortedCompanies);
  handleCurrentPageFocus();
};

const handleCompanyClick = e => {
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  let specificCompany;

  for (globalSortedCompany of globalSortedCompanies) {
    if (Number(e.target.parentNode.dataset.key) === globalSortedCompany.id) {
      specificCompany = globalSortedCompany;
    }

    ;
  }

  ;
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
    <div class="datepickers">
      <input type="date" id="dateFrom"/>
      <input type="date" id="dateTo"/>
      <button id="handleBetweenDates">Check!</button>
    </div>
    <p>total income between dates: <span id="totalBetweenDates">0</span></p>
    <p>average income between dates: <span id="averageBetweenDates">0</span></p>
    <button class="modalClosingBtn">OK!</button>
  </div>
  `;
  table.insertAdjacentHTML('afterend', modalTemplate);
  const dateFrom = document.getElementById('dateFrom');
  const dateTo = document.getElementById('dateTo');
  const betweenDatesHandler = document.getElementById('handleBetweenDates');
  const totalBetweenDatesDisplay = document.getElementById('totalBetweenDates');
  const averageBetweenDatesDisplay = document.getElementById('averageBetweenDates');

  const displayCustomDatesIncomes = () => {
    const timeFrom = new Date(dateFrom.value).getTime();
    const timeTo = new Date(dateTo.value).getTime();
    const specificCompanyIncomesBetweenDates = specificCompany.incomes.filter(item => Date.parse(item.date) > timeFrom && Date.parse(item.date) < timeTo);
    const totalIncomeBetweenDates = specificCompanyIncomesBetweenDates.reduce((previous, current) => {
      return previous + Number(current.value);
    }, 0);
    totalBetweenDatesDisplay.textContent = totalIncomeBetweenDates;
    averageBetweenDatesDisplay.textContent = totalIncomeBetweenDates / specificCompanyIncomesBetweenDates.length;
  };

  betweenDatesHandler.addEventListener('click', () => displayCustomDatesIncomes());
  const modal = document.querySelector('.customModal');
  const modalClosingBtn = document.querySelector('.modalClosingBtn');
  modalClosingBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}; //Boot


const bootFunction = async () => {
  const sortedCompanies = globalSortedCompanies || (await sortByTotalIncome());
  renderButtons(sortedCompanies);
  renderCompanies(sortedCompanies);
  filterInput.addEventListener("input", () => {
    filterByName();
  });
};

const filterByName = async () => {
  currentPage = 1;
  const companies = globalSortedCompanies;
  const filteredCompanies = companies.filter(i => i.name.toLowerCase().includes(filterInput.value.toLowerCase()));
  globalFilteredCompanies = filteredCompanies;
  renderButtons(filteredCompanies);
  renderCompanies(filteredCompanies);
};

bootFunction();
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57533" + '/');

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
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/CompaniesDataDisplay.e31bb0bc.js.map