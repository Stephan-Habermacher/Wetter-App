import { getWeatherData } from "./api";
import { hideLoadingSpinner, showLoadingSpinner } from "./loadingSpinner";
import { dayForecast } from "./dayForecast";
import { daysForecast } from "./daysForecast";

export async function renderDetailView(city) {
  const app = document.getElementById("app");
  app.innerHTML = "";

  showLoadingSpinner(app, `Lade Wetterdaten für ${city}...`);

  try {
    const weather = await getWeatherData(city);

    hideLoadingSpinner(app);

    app.innerHTML = `
  <div class="current-weather current-weather--active">
    <h2 class="current-weather__city">${weather.city}</h2>
    <h1 class="current-weather__current-temperature">${weather.currentTemp}°</h1>
    <p class="current-weather__current-condition">${weather.currentCondition}</p>
      <div class="current-weather__daily-temperatures">
        <span class="current-weather__max-temperature">H: ${weather.max}°</span>
        <span class="current-weather__min-temperature">T: ${weather.min}°</span>
      </div>
  </div>
  
  ${dayForecast(weather)}
  ${daysForecast(weather.days)}
  `;
  } catch (error) {
    hideLoadingSpinner(app);
    app.innerHTML = `<p>Fehler beim Laden der Wetterdaten.</p>`;
    console.error(error);
  }
}
