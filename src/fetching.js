const API_ENDPOINT = "http://api.weatherapi.com/v1";

export async function fetchCurrentWeather() {
  const res = await fetch(API_ENDPOINT);

  const data = await res.json();

  return data;
}
