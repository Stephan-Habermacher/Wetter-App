import { getWeatherData, searchCity } from "./api";
import { getConditionImagePath } from "./conditions";
import { renderDetailView } from "./detailView";
import { hideLoadingSpinner, showLoadingSpinner } from "./loadingSpinner";

let isEditMode = false;

const deleteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;

function debounce(callback, delay = 300) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export async function renderMainMenu() {
  const app = document.getElementById("app");

  app.classList.remove("show-background");
  app.innerHTML = "";

  const cities = JSON.parse(localStorage.getItem("cities")) || [];

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
        <div class="main-menu__search-results"></div>
      </div>
    
      <div class="main-menu__message"></div>
    
      <div class="main-menu__cities-list"></div>
  </div>
  `;

  showLoadingSpinner(app, "Lade Übersicht...");

  const citiesList = app.querySelector(".main-menu__cities-list");
  const message = app.querySelector(".main-menu__message");
  const editButton = app.querySelector(".main-menu__edit");
  const searchInput = app.querySelector(".main-menu__search-input");
  const searchResults = app.querySelector(".main-menu__search-results");

  const handleSearch = debounce(async (value) => {
    const query = value.trim();

    if (query.length < 2) {
      searchResults.innerHTML = "";
      return;
    }

    try {
      const results = (await searchCity(query)) || [];

      searchResults.innerHTML = results
        .map(
          (city) => `
            <div class="search-result" data-city="${city.name}">
              <h3 class="search-result__name">${city.name}</h3> 
              <p class="search-result__country">${city.country}</p>
            </div>`,
        )
        .join("");
    } catch (error) {
      console.error("Fehler bei der Suche", error);
    }
  }, 300);

  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  searchResults.addEventListener("click", (e) => {
    const result = e.target.closest(".search-result");
    if (!result) return;
    const city = result.dataset.city;

    searchResults.innerHTML = "";
    searchInput.value = "";
    renderDetailView(city);
  });

  editButton.addEventListener("click", () => {
    isEditMode = !isEditMode;
    editButton.textContent = isEditMode ? "Fertig" : "Bearbeiten";

    const deleteButtons = app.querySelectorAll(".city-wrapper__delete");

    deleteButtons.forEach((btn) => {
      btn.classList.toggle("city-wrapper__delete--show", isEditMode);
    });
  });

  if (cities.length === 0) {
    message.textContent = "Noch keine Favoriten gespeichert.";
    hideLoadingSpinner(app);
    return;
  }

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
    <div class="city-wrapper__delete" data-city-name="${weather.city}">${deleteIcon}</div>

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
  const deleteButton = wrapper.querySelector(".city-wrapper__delete");

  cityElement.addEventListener("click", () => {
    if (!isEditMode) {
      renderDetailView(weather.city);
    }
  });

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const cityName = deleteButton.dataset.cityName;
    const cities = JSON.parse(localStorage.getItem("cities")) || [];

    const updatedCities = cities.filter((c) => c !== cityName);

    localStorage.setItem("cities", JSON.stringify(updatedCities));

    if (updatedCities.length === 0) {
      renderMainMenu();
      return;
    }

    wrapper.remove();
  });

  return wrapper;
}
