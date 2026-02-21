export function getTodayForecast(forecast) {
  return `
    <div class="today-forecast">
      <div class="today-forecast__conditions">
        Heute ${forecast.condition}. Wind bis zu ${forecast.wind} km/h.
      </div>

      <div class="today-forecast__hours">
        ${forecast.hours
          .map(
            (hour) => `
              <div class="hourly-forecast">
                <div class="hourly-forecast__time">${hour.time}</div>
                <img
                  src="${hour.icon}"
                  alt=""
                  class="hourly-forecast__icon"
                />
                <div class="hourly-forecast__temperature">${hour.temp}°</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </div>
  `;
}
