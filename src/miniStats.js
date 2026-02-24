export function getMiniStats(weather) {
  return `
<div class="mini-stats">

    <div class="mini-stat">
      <div class="mini-stat__heading">Feuchtigkeit</div>
      <div class="mini-stat__value">${weather.humidity}%</div>
    </div>

    <div class="mini-stat">
      <div class="mini-stat__heading">Gefühlte Temperatur</div>
      <div class="mini-stat__value">${weather.feelsLike}°</div>
    </div>

    <div class="mini-stat">
      <div class="mini-stat__heading">Sonnenaufgang</div>
      <div class="mini-stat__value">${weather.sunrise}</div>
    </div>

    <div class="mini-stat">
      <div class="mini-stat__heading">Sonnenuntergang</div>
      <div class="mini-stat__value">${weather.sunset}</div>
    </div>

    <div class="mini-stat">
      <div class="mini-stat__heading">Niederschlag</div>
      <div class="mini-stat__value">${weather.precipitation}mm</div>
    </div>

    <div class="mini-stat">
      <div class="mini-stat__heading">UV-Index</div>
      <div class="mini-stat__value">${weather.uv}</div>
    </div>

  </div>
  `;
}
