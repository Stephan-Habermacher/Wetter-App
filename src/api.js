const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_ENDPOINT = "https://api.weatherapi.com/v1";

export async function getWeatherData(city) {
  const res = await fetch(
    `${API_ENDPOINT}/forecast.json?key=${API_KEY}&q=${city}&days=3&lang=de`,
  );

  if (!res.ok) {
    throw new Error("Wetter API Fehler");
  }

  const data = await res.json();

  // Stundenvorhersage für die nächsten 24 Stunden
  const today = data.forecast.forecastday[0];
  const tomorrow = data.forecast.forecastday[1];

  const now = new Date();
  const currentHour = now.getHours();

  const remainingToday = today.hour.slice(currentHour);
  const missingHours = 24 - remainingToday.length;
  const fromTomorrow = tomorrow.hour.slice(0, missingHours);

  const next24HoursRaw = [...remainingToday, ...fromTomorrow];

  const hours = next24HoursRaw.map((hour, index) => ({
    time: index === 0 ? "Jetzt" : hour.time.split(" ")[1].slice(0, 2) + " Uhr",
    temp: Math.round(hour.temp_c),
    icon: "https:" + hour.condition.icon,
  }));

  // 3-Tages-Vorhersage
  const forecastDays = data.forecast.forecastday.map((day, index) => {
    const date = new Date(day.date);
    return {
      day:
        index === 0
          ? "Heute"
          : date.toLocaleDateString("de-CH", { weekday: "short" }),
      icon: "https:" + day.day.condition.icon,
      max: Math.round(day.day.maxtemp_c),
      min: Math.round(day.day.mintemp_c),
      wind: day.day.maxwind_kph,
    };
  });

  return {
    city: data.location.name,

    currentTemp: Math.round(data.current.temp_c),
    currentCondition: data.current.condition.text,

    max: Math.round(today.day.maxtemp_c),
    min: Math.round(today.day.mintemp_c),
    condition: today.day.condition.text,
    wind: today.day.maxwind_kph,

    hours,
    days: forecastDays,
  };
}
