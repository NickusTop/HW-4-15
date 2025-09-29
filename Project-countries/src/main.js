import debounce from "lodash.debounce";
import Handlebars from "handlebars";
import { alert, info, success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

const countriesTemplate = Handlebars.compile(`
  <ul>
    {{#each this}}
      <li>{{name.common}} - {{region}}</li>
    {{/each}}
  </ul>
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
      animateSpeed: "normal",
      modules: new Map([[PNotifyButtons, { closer: true, sticker: false }]]),
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
    .catch((error) => {
      ulCountries.innerHTML = "<li>Помилка завантаження даних</li>";
      alert({
        text: "Сталася помилка при завантаженні даних!",
        type: "error",
        delay: 2000,
        hide: true,
        animateSpeed: "normal",
        modules: new Map([[PNotifyButtons, { closer: true, sticker: false }]]),
      });
    });
}

function renderCountries(countries) {
  ulCountries.innerHTML = countriesTemplate(countries);
}
