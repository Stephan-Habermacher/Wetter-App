import { getWeatherData } from "./api";
import { getConditionImagePath } from "./conditions";
import { renderDetailView } from "./detailView";
import { hideLoadingSpinner, showLoadingSpinner } from "./loadingSpinner";

export async function renderMainMenu(cities) {
  const app = document.getElementById("app");

  app.classList.remove("show-background");
  app.innerHTML = "";

  showLoadingSpinner(app, "Lade Übersicht...");

  app.innerHTML = `
   <div class="main-menu">
      <div class="main-menu__heading">
        Wetter <button class="main-menu__edit">Bearbeiten</button>
      </div>

      <div class="main-menu__search-bar">
        <input
          type="text"
          class="main-menu__search-input"
          placeholder="Nach Stadt suchen..."
        />
      </div>

      <div class="main-menu__cities-list"></div>
    </div>
  `;

  const citiesList = document.querySelector(".main-menu__cities-list");

  for (const city of cities) {
    try {
      const weather = await getWeatherData(city);
      const cityCard = createCityCard(weather);
      citiesList.appendChild(cityCard);
    } catch (error) {
      console.error(`Fehler beim Laden von ${city}:`, error);
    }
  }

  hideLoadingSpinner(app);
}

function createCityCard(weather) {
  const wrapper = document.createElement("div");
  wrapper.className = "city-wrapper";

  const conditionImage = getConditionImagePath(
    weather.conditionCode,
    !weather.isDay,
  );

  wrapper.innerHTML = `
    <div class="city" style="--condition-image: url(${conditionImage})">
      <div class="city__left-column">
        <h2 class="city__name">${weather.city}</h2>
        <div class="city__country">${weather.country}</div>
        <div class="city__condition">${weather.currentCondition}</div>
      </div>

      <div class="city__right-column">
        <div class="city__temperature">${weather.currentTemp}°</div>
        <div class="city__max-min-temperature">
          H: ${weather.max}° T: ${weather.min}°
        </div>
      </div>
    </div>
  `;

  const cityElement = wrapper.querySelector(".city");

  cityElement.addEventListener("click", () => {
    renderDetailView(weather.city);
  });

  return wrapper;
}
