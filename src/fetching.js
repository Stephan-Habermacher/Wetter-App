const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_ENDPOINT = "http://api.weatherapi.com/v1";

export async function fetchCurrentWeather(city) {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${API_KEY}&q=${city}&lang=de`
  );

  const data = await res.json();

  return {
    city: data.location.name,
    temp: Math.round(data.current.temp_c),
    condition: data.current.condition.text,
  };
}

export async function fetchForecastWeather(city) {
  const res = await fetch(
    `${API_ENDPOINT}/forecast.json?key=${API_KEY}&q=${city}&lang=de`
  );

  const data = await res.json();

  return {
    max: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
    min: Math.round(data.forecast.forecastday[0].day.mintemp_c),
  };
}
