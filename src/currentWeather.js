import { fetchCurrentWeather, fetchForecastWeather } from "./fetching";

export async function renderCurrentWeather(city) {
  const current = await fetchCurrentWeather(city);
  const forecast = await fetchForecastWeather(city);

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
    <h2 class="current-weather__city">${current.city}</h2>
    <h1 class="current-weather__current-temperature">${current.temp + "°"}</h1>
    <p class="current-weather__current-condition">${current.condition}</p>
      <div class="current-weather__daily-temperatures">
        <span class="current-weather__max-temperature">${
          "H: " + forecast.max + "°"
        }</span>
        <span class="current-weather__min-temperature">${
          "T: " + forecast.min + "°"
        }</span>
      </div>
  </div>`;

  // HTML Elemente selektieren
  const loadingSpinner = app.querySelector(".loading-spinner");
  const currentWeather = app.querySelector(".current-weather");

  // Fetchen und HTML Elemente befüllen

  loadingSpinner.classList.add("hidden");
  currentWeather.classList.add("active");
}
