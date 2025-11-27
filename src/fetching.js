const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_ENDPOINT = "http://api.weatherapi.com/v1";

export async function fetchCurrentWeather(city) {
  const res = await fetch(
    `${API_ENDPOINT}/current.json?key=${API_KEY}&q=${city}&lang=de`
  );

  const data = await res.json();

  console.log(data);
  return data;
}
