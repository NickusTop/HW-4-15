import debounce from "lodash.debounce";
import Handlebars from "handlebars";
import { alert, info, success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const countriesTemplate = Handlebars.compile(`
  <ul>
    {{#each this}}
      <li>{{name.common}}</li>
    {{/each}}
  </ul>
`);

const countryTemplate = Handlebars.compile(`
 <ul style="display: flex;">
    {{#each this}}
      <ul class="country-card">
        <li class="li-card li-card-name">{{name.common}}</li>
        <li class="li-card">Capital: <p class="p-card">{{capital}}</p></li>
        <li class="li-card">Population: <p class="p-card">{{population}}</p></li>
        <li class="li-card li-card-languages">
          Languages:
          <ul class="languages-list"></ul>
        </li>
      </ul>
      <img src={{flags.png}} alt="flag" class="flag-img"/>
    {{/each}}
  </ul>
`);

const languagesTemplate = Handlebars.compile(`
  {{#each this}}
    <li>{{this}}</li>
  {{/each}}
`);

const searchInput = document.querySelector(".search-input");
const ulCountries = document.querySelector(".ul-countries");

searchInput.addEventListener("input", debounce(onSearch, 500));

function onSearch(e) {
  const name = e.target.value.trim();

  if (!name || !isNaN(name)) {
    ulCountries.innerHTML = "";
    alert({
      text: "Напишіть правильну назву країни!",
      delay: 2000,
      hide: true,
      animateSpeed: "normal"
    });
    return;
  }

  getCountries(name);
}

function getCountries(name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((countries) => {
      renderCountries(countries);
    })
    .catch(() => {
      error({
        text: "Сталася помилка при завантаженні даних!",
        type: "error",
        delay: 2000,
        hide: true,
        animateSpeed: "normal"
      });
    });
}

function renderCountries(countries) {
  if (countries.length > 10) {
    ulCountries.innerHTML = "";
    error({
      text: "Забагато результатів! Введіть більш конкретну назву",
      delay: 2000,
      hide: true,
      animateSpeed: "normal",
    });
    return;
  } else if (countries.length === 1) {
    ulCountries.innerHTML = countryTemplate(countries);
    const languagesList = document.querySelector(".languages-list");
    const langs = [];
    for (let key in countries[0].languages) {
      langs.push(countries[0].languages[key]);
    }
    languagesList.innerHTML = languagesTemplate(langs);
  }
}
