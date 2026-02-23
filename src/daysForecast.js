export function daysForecast(days) {
  return `
    <div class="forecast">
      <div class="forecast__title">Vorhersage für die nächsten 3 Tage:</div>

        <div class="forecast__days">
        ${days
          .map(
            (day) => `
          <div class="forecast-day">
            <div class="forecast-day__day">${day.day}</div>
            <img
              src="${day.icon}"
              alt=""
              class="forecast-day__icon"
            />
            <div class="forecast-day__max-temperature">H: ${day.max}°</div>
            <div class="forecast-day__min-temperature">T: ${day.min}°</div>
            <div class="forecast-day__wind">Wind: ${day.wind} km/h</div>
          </div>`,
          )
          .join("")}
        </div>
    </div>
  `;
}
