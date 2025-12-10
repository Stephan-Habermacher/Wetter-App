import { fetchCurrentWeather, fetchForecastWeather } from "./fetching";

export async function renderCurrentWeather(city) {
  const app = document.getElementById("app");
  // HTML erstellen
  app.innerHTML = `
  <div class="loading-spinner">
        <div class="loading-spinner__message">Lade Wetterdaten für ${city}...</div>
        <div class="lds-ripple">
          <div></div>
          <div></div>
        </div>
      </div>

  <div class="current-weather current-weather--active">
    <h2 class="current-weather__city"></h2>
    <h1 class="current-weather__current-temperature"></h1>
    <p class="current-weather__current-condition"></p>
      <div class="current-weather__daily-temperatures">
        <span class="current-weather__max-temperature"></span>
        <span class="current-weather__min-temperature"></span>
      </div>
  </div>`;

  // HTML Elemente selektieren
  const loadingSpinner = app.querySelector(".loading-spinner");
  const currentWeather = app.querySelector(".current-weather");
  const cityEl = app.querySelector(".current-weather__city");
  const tempEl = app.querySelector(".current-weather__current-temperature");
  const conditionEl = app.querySelector(".current-weather__current-condition");
  const maxTempEl = app.querySelector(".current-weather__max-temperature");
  const minTempEl = app.querySelector(".current-weather__min-temperature");

  // Fetchen und HTML Elemente befüllen
  const current = await fetchCurrentWeather(city);
  const forecast = await fetchForecastWeather(city);

  cityEl.textContent = current.city;
  tempEl.textContent = current.temp + "°";
  conditionEl.textContent = current.condition;
  maxTempEl.textContent = `H: ${forecast.max}°`;
  minTempEl.textContent = `T: ${forecast.min}°`;

  loadingSpinner.classList.add("hidden");
  currentWeather.classList.add("active");
}
