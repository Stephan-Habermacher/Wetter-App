import { getWeatherData, searchCity } from "./api";
import { getConditionImagePath } from "./conditions";
import { renderDetailView } from "./detailView";
import { hideLoadingSpinner, showLoadingSpinner } from "./loadingSpinner";
import { getSavedCities, saveCities } from "./utils";

let isEditMode = false;
let lastResults = [];

const deleteIcon = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
`;

// Debounce Funktion
function debounce(callback, delay = 500) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

// Hauptansicht rendern
export async function renderMainMenu() {
  const app = document.getElementById("app");

  app.classList.remove("show-background");

  app.innerHTML = "";

  showLoadingSpinner(app, "Lade Übersicht...");

  const savedCityIds = getSavedCities();

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

  const citiesList = app.querySelector(".main-menu__cities-list");
  const message = app.querySelector(".main-menu__message");
  const editButton = app.querySelector(".main-menu__edit");
  const searchInput = app.querySelector(".main-menu__search-input");
  const searchResults = app.querySelector(".main-menu__search-results");

  // Suchresultate rendern
  function renderSearchResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML = `<div class="search-result">Keine Städte gefunden</div>`;
      return;
    }

    searchResults.innerHTML = results
      .map(
        (city) => `
            <div class="search-result" data-city-name="${city.name}" data-city-id="${city.id}">
              <h3 class="search-result__name">${city.name}</h3> 
              <p class="search-result__country">${city.country}</p>
            </div>`,
      )
      .join("");
  }

  // API-Suche
  const handleSearch = debounce(async (value) => {
    const query = value.trim();

    if (query.length < 2) {
      searchResults.innerHTML = "";
      lastResults = [];
      return;
    }

    searchResults.innerHTML = `<div class="search-result">Lade Vorschläge...</div>`;

    try {
      const results = (await searchCity(query)) || [];

      lastResults = results;

      renderSearchResults(results);
    } catch (error) {
      console.error("Fehler bei der Suche", error);
    }
  }, 500);

  searchInput.addEventListener("input", (e) => {
    handleSearch(e.target.value);
  });

  // Erneuter Klick auf die Searchbar bringt die Vorschläge mit bestehendem String zurück
  searchInput.addEventListener("focusin", () => {
    if (searchInput.value.trim() && lastResults.length > 0) {
      renderSearchResults(lastResults);
    }
  });

  // Klick ausserhalb der Searchbar, lässt die Vorschläge verschwinden (String bleibt bestehen)
  document.addEventListener("click", (e) => {
    const isClickInside = e.target.closest(".main-menu__search-bar");

    if (!isClickInside) {
      searchResults.innerHTML = "";
    }
  });

  // Klick auf das Suchresultat löst Detailansicht der gewählten Stadt aus
  searchResults.addEventListener("click", (e) => {
    const result = e.target.closest(".search-result");
    if (!result) return;

    const cityId = result.dataset.cityId;
    const cityName = result.dataset.cityName;

    searchResults.innerHTML = "";
    searchInput.value = "";

    renderDetailView({ id: cityId, query: cityName });
  });

  // Toggle für "Bearbeiten"/"Fertig"
  editButton.addEventListener("click", () => {
    isEditMode = !isEditMode;
    editButton.textContent = isEditMode ? "Fertig" : "Bearbeiten";

    const deleteButtons = app.querySelectorAll(".city-wrapper__delete");

    deleteButtons.forEach((btn) => {
      btn.classList.toggle("city-wrapper__delete--show", isEditMode);
    });
  });

  if (savedCityIds.length === 0) {
    message.textContent = "Noch keine Favoriten gespeichert.";
    hideLoadingSpinner(app);
    return;
  }

  for (const cityId of savedCityIds) {
    try {
      const weather = await getWeatherData(cityId);
      const cityCard = createCityCard({ ...weather, id: cityId });
      citiesList.appendChild(cityCard);
    } catch (error) {
      console.error(`Fehler beim Laden von ${cityId}:`, error);
    }
  }

  hideLoadingSpinner(app);
}

// Kreiert für jede gespeicherte Stadt die entsprechende Karte in der Hauptansicht
function createCityCard(weather) {
  const wrapper = document.createElement("div");
  wrapper.className = "city-wrapper";

  const conditionImage = getConditionImagePath(
    weather.conditionCode,
    !weather.isDay,
  );

  wrapper.innerHTML = `
    <div class="city-wrapper__delete" data-city-id="${weather.id}">${deleteIcon}</div>

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

  // Klick auf die Favoritenkarte öffnet die Detailansicht der jeweiligen Stadt
  cityElement.addEventListener("click", () => {
    if (!isEditMode) {
      renderDetailView({ id: weather.id });
    }
  });

  deleteButton.addEventListener("click", (e) => {
    e.stopPropagation();

    const cityId = deleteButton.dataset.cityId;

    const updatedCityIds = getSavedCities().filter((id) => id !== cityId);
    saveCities(updatedCityIds);

    if (updatedCityIds.length === 0) {
      renderMainMenu();
      return;
    }

    wrapper.remove();
  });

  return wrapper;
}
