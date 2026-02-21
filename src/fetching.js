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
    `${API_ENDPOINT}/forecast.json?key=${API_KEY}&q=${city}&days=2&lang=de`,
  );

  const data = await res.json();

  console.log(data);

  const today = data.forecast.forecastday[0];
  const tomorrow = data.forecast.forecastday[1];

  const now = new Date();
  const currentHour = now.getHours();

  const remainingToday = today.hour.slice(currentHour);

  const missingHours = 24 - remainingToday.length;

  const fromTomorrow = tomorrow.hour.slice(0, missingHours);

  const next24HoursRaw = [...remainingToday, ...fromTomorrow];

  const next24Hours = next24HoursRaw.map((hour, index) => ({
    time: index === 0 ? "Jetzt" : hour.time.split(" ")[1].slice(0, 2) + " Uhr",
    temp: Math.round(hour.temp_c),
    icon: "https:" + hour.condition.icon,
  }));

  return {
    max: Math.round(today.day.maxtemp_c),
    min: Math.round(today.day.mintemp_c),
    condition: today.day.condition.text,
    wind: today.day.maxwind_kph,
    hours: next24Hours,
  };
}
