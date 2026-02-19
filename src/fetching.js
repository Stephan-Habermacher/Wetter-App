const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_ENDPOINT = "https://api.weatherapi.com/v1";

export async function fetchCurrentWeather(city) {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${API_KEY}&q=${city}&lang=de`,
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
    `${API_ENDPOINT}/forecast.json?key=${API_KEY}&q=${city}&lang=de`,
  );

  const data = await res.json();

  const day = data.forecast.forecastday[0];

  return {
    max: Math.round(day.day.maxtemp_c),
    min: Math.round(day.day.mintemp_c),
    condition: day.day.condition.text,
    wind: day.day.maxwind_kph,

    hours: day.hour.map((hour) => ({
      time: hour.time.split(" ")[1].slice(0, 2),
      temp: hour.temp_c,
      icon: "https:" + hour.condition.icon,
    })),
  };
}
