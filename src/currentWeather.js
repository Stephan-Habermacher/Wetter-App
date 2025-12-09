import { fetchCurrentWeather, fetchForecastWeather } from "./fetching";

export async function renderCurrentWeather(city) {
  const app = document.getElementById("app");
  // HTML erstellen
  app.innerHTML = `
  <div class="current-weather">
    <div class="current-weather__loading-spinner"></div>
    <h2 class="current-weather__city"></h2>
    <h1 class="current-weather__current-temperature"></h1>
    <p class="current-weather__current-condition"></p>
      <div class="current-weather__daily-temperatures">
        <span class="current-weather__max-temperature"></span>
        <span class="current-weather__min-temperature"></span>
      </div>
  </div>`;

  // HTML Elemente selektieren
  const cityEl = app.querySelector(".current-weather__city");
  const tempEl = app.querySelector(".current-weather__current-temperature");
  const conditionEl = app.querySelector(".current-weather__current-condition");
  const maxTempEl = app.querySelector(".current-weather__max-temperature");
  const minTempEl = app.querySelector(".current-weather__min-temperature");

  // Fetchen und HTML Elemente befüllen
  const current = await fetchCurrentWeather(city);
  const forecast = await fetchForecastWeather(city);
  console.log(current, forecast);

  cityEl.textContent = current.location.name;
  tempEl.textContent = current.current.temp_c + "°";
  conditionEl.textContent = current.current.condition.text;
  maxTempEl.textContent =
    "H: " + forecast.forecast.forecastday[0].day.maxtemp_c + "°";
  minTempEl.textContent =
    "T: " + forecast.forecast.forecastday[0].day.mintemp_c + "°";
}
