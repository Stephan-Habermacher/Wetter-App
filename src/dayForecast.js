export function dayForecast(weather) {
  return `
    <div class="today-forecast">
      <div class="today-forecast__conditions">
        Heute ${weather.condition}. Wind bis zu ${weather.wind} km/h.
      </div>

      <div class="today-forecast__hours">
        ${weather.hours
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
