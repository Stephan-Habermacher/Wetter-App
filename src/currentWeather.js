import { fetchCurrentWeather, fetchForecastWeather } from "./fetching";

export async function renderCurrentWeather(city) {
  const current = await fetchCurrentWeather(city);
  const forecast = await fetchForecastWeather(city);

  const app = document.getElementById("app");

  app.innerHTML = `
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

  const loadingSpinner = app.querySelector(".loading-spinner");
  const currentWeather = app.querySelector(".current-weather");

  loadingSpinner.classList.add("hidden");
  currentWeather.classList.add("active");
}
