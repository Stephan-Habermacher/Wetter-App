import { getWeatherData } from "./api";
import { hideLoadingSpinner, showLoadingSpinner } from "./loadingSpinner";
import { getDayForecast } from "./dayForecast";
import { getDaysForecast } from "./daysForecast";
import { getMiniStats } from "./miniStats";
import { getConditionImagePath } from "./conditions";
import { renderMainMenu } from "./mainMenu";

const backIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
`;

const favoriteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
</svg>
`;

export async function renderDetailView(city) {
  const app = document.getElementById("app");

  app.innerHTML = "";
  app.classList.remove("show-background");

  showLoadingSpinner(app, `Lade Wetterdaten für ${city}...`);

  try {
    const weather = await getWeatherData(city);

    hideLoadingSpinner(app);

    const savedCities = JSON.parse(localStorage.getItem("cities")) || [];
    const isSaved = savedCities.includes(weather.city);

    app.innerHTML = `
       <div class="action-bar">
        <div class="action-bar__back">${backIcon}</div>
        ${!isSaved ? `<div class="action-bar__favorite">${favoriteIcon}</div>` : ""}
       </div>

        <div class="current-weather current-weather--active">
          <h2 class="current-weather__city">${weather.city}</h2>
          <h1 class="current-weather__current-temperature">${weather.currentTemp}°</h1>
          <p class="current-weather__current-condition">${weather.currentCondition}</p>
            <div class="current-weather__daily-temperatures">
              <span class="current-weather__max-temperature">H: ${weather.max}°</span>
              <span class="current-weather__min-temperature">T: ${weather.min}°</span>
            </div>
        </div>
  
        ${getDayForecast(weather)}
        ${getDaysForecast(weather.days)}
        ${getMiniStats(weather)}
  `;

    const conditionImage = getConditionImagePath(
      weather.conditionCode,
      !weather.isDay,
    );

    if (conditionImage) {
      app.style.setProperty(
        "--detail-condition-image",
        `url(${conditionImage})`,
      );
      app.classList.add("show-background");
    }

    const backButton = app.querySelector(".action-bar__back");

    backButton.addEventListener("click", () => {
      renderMainMenu();
    });

    const favoriteButton = app.querySelector(".action-bar__favorite");

    if (favoriteButton) {
      favoriteButton.addEventListener("click", () => {
        const savedCities = JSON.parse(localStorage.getItem("cities")) || [];

        /*   if (savedCities.includes(weather.city)) {
          alert(`${weather.city} wurde bereits den Favoriten hinzugefügt!`);
          return;
        } */

        savedCities.push(weather.city);
        localStorage.setItem("cities", JSON.stringify(savedCities));

        alert(`${weather.city} wurde zu den Favoriten hinzugefügt!`);

        favoriteButton.remove();
      });
    }
  } catch (error) {
    hideLoadingSpinner(app);
    app.innerHTML = `<p>Fehler beim Laden der Wetterdaten.</p>`;
    console.error(error);
  }
}
