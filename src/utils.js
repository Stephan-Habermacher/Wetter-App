export function formatTime(timeString) {
  const [time, modifier] = timeString.split(" ");

  let [hours, minutes] = time.split(":");

  hours = parseInt(hours, 10);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, "0")}:${minutes} Uhr`;
}

export function getSavedCities() {
  return JSON.parse(localStorage.getItem("cities")) || [];
}

export function saveCities(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}
