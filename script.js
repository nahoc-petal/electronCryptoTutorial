const {
  ipcRenderer,
  shell
} = require('electron');
const con = require('electron').remote.getGlobal('console');

// Renders the HTML for the settings tab
function renderSettingsTab(exchangeRatesObject) {
  let exchangeRatesArray;
  let exchangeRatesSelect = '<select class="settingsSelect">';
  let themesArray;
  let themesSelect = '<select class="settingsSelect"></select>';
  let percentagesArray;
  let percentagesSelect = '<select class="settingsSelect"></select>';
  let languagesArray;
  let languagesSelect = '<select class="settingsSelect"></select>';

  exchangeRatesArray = $.map(exchangeRatesObject, function (value, index) {
    return [index];
  });

  exchangeRatesArray.forEach(element => {
    exchangeRatesSelect += '<option>' + element + '</option>';
  });

  exchangeRatesSelect += '</select>';

  $('#settingsTab').append(
    '<li class="listItem"><img class="settingIcon" src="assets/language.svg" width="24" height="24" /><span class="settingName">Language</span>' + languagesSelect + '</li>' +
    '<li class="listItem"><img class="settingIcon" src="assets/currency.svg" width="24" height="24" /><span class="settingName">Currency</span>' + exchangeRatesSelect + '</li>' +
    '<li class="listItem"><img class="settingIcon" src="assets/startup.svg" width="24" height="24" /><span class="settingName">Launch at startup</span><input type="checkbox" /></li>' +
    '<li class="listItem"><img class="settingIcon" src="assets/theme.svg" width="24" height="24" /><span class="settingName">Theme</span>' + themesSelect + '</li>' +
    '<li class="listItem"><img class="settingIcon" src="assets/percentage.svg" width="24" height="24" /><span class="settingName">Percentage</span>' + percentagesSelect + '</li>');
}

// Renders the HTML for the market tab
function renderMarketTab(coinSymbol, coinName, coinPrice, coinPriceChange) {
  $('#marketTabCoins').append(
    '<li class="listItem">' +
    '<img src="assets/coins/' + coinSymbol + '.svg" width="24" height="24" />' +
    '<span class="coinName">' + coinName + '</span>' +
    '<span class="coinPrice">$' + formatPrice(coinPrice) +
    '<br/><span class="coinPriceChange ' + isNegative(coinPriceChange) + '">' + coinPriceChange + '%</span></span>' +
    '</li>');
}

// Renders the HTML for the portfolio tab
function renderPortfolioTab(coinSymbol, coinName) {
  $('#portfolioTabCoins').append(
    '<li class="listItem">' +
    '<img src="assets/coins/' + coinSymbol + '.svg" width="24" height="24" />' +
    '<span class="coinName">' + coinName + '</span>' +
    '<input type="text" class="input coinQuantity" placeholder="0">' +
    '</li>');
}

// Navigation
$('.tabButton').click(function () {
  $('.tabButton').removeClass('tabButtonActive');
  $('.tab').hide();

  if (this.id === "marketTabButton") {
    $(this).addClass('tabButtonActive');
    $('#marketTab').show();
    $('#balance').addClass('closed');
  }
  if (this.id === "portfolioTabButton") {
    $(this).addClass('tabButtonActive');
    $('#portfolioTab').show();
    $('#balance').removeClass('closed');
  }
  if (this.id === "settingsTabButton") {
    $('#settingsTab').show();
    $('#balance').addClass('closed');
  }
});

const isNegative = (value) => {
  if (value.indexOf('-') !== -1) {
    return "coinPriceChangeNegative";
  }
}

const formatPrice = (price) => {
  return price.replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString();
}

const updateTabView = (coins) => {
  coins.forEach(element => {
    const coinName = element.name;
    const coinPrice = element.price_usd;
    const coinSymbol = element.symbol;
    const coinPriceChange = element.percent_change_24h;
    renderMarketTab(coinSymbol, coinName, coinPrice, coinPriceChange);
    renderPortfolioTab(coinSymbol, coinName);
  });
}

const updateSettingsTabView = (exchangeRates) => {
  const exchangeRatesObject = exchangeRates.rates;
  renderSettingsTab(exchangeRatesObject);
}

const getMarketTabCoins = () => {
  const url = 'https://api.coinmarketcap.com/v1/ticker/?limit=5';

  fetch(url)
    .then(
      function (response) {
        response.json().then(function (data) {
          updateTabView(data);
        });
      }
    )
    .catch(function (err) {
      // error
    });
}

const getExchangeRates = () => {
  const url = 'https://api.fixer.io/latest?base=USD';

  fetch(url)
    .then(
      function (response) {
        response.json().then(function (data) {
          updateSettingsTabView(data);
        });
      }
    ).catch(function (err) {
      // error
    });
}

// Update initial market coins when loaded
document.addEventListener('DOMContentLoaded', getMarketTabCoins);
// Update settings when currencies loaded
document.addEventListener('DOMContentLoaded', getExchangeRates);