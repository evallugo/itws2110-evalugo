// Lab 3 – Weather & Jokes App
// Author: YOUR NAME
// Date: 10/07/2025
// Uses OpenWeatherMap API + JokeAPI

// ------------------- CONFIG -------------------
const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256";
const DEFAULT_CITY = "Troy, NY";

// ------------------- ELEMENTS -------------------
const weatherDiv = document.getElementById("weather");
const jokeDiv = document.getElementById("joke");
const headersPre = document.getElementById("headers");
const cityInput = document.getElementById("cityInput");
const refreshBtn = document.getElementById("refreshBtn");
const locationBtn = document.getElementById("locationBtn");
const searchBtn = document.getElementById("searchBtn");

// ------------------- UTILITIES -------------------
// Debugging utility (no longer shown on page)
function displayHeaders(response) {
  const headers = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-length" || key === "content-type") {
      headers.push(`${key}: ${value}`);
    }
  }
  console.log("HTTP Response Headers:\n" + headers.join("\n"));
  headersPre.textContent = ""; // Hide from UI
  headersPre.style.display = "none";
}

// ------------------- WEATHER FUNCTIONS -------------------
async function fetchWeatherUrl(url) {
  try {
    const response = await fetch(url);
    displayHeaders(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching weather:", response.status, response.statusText);
      console.error(errorText);
      weatherDiv.innerHTML = `<p class="text-danger">Error: ${response.statusText}</p>`;
      return;
    }

    const data = await response.json();
    displayWeather(data);
  } catch (err) {
    console.error("Fetch error:", err);
    weatherDiv.innerHTML = `<p class="text-danger">Network error: ${err.message}</p>`;
  }
}

// Normalize city input to handle “Boston, MA” → “Boston,US”
async function fetchWeatherByCity(city = DEFAULT_CITY) {
  let normalized = city.trim();

  if (normalized.includes(",")) {
    const parts = normalized.split(",").map(p => p.trim());
    const cityName = parts[0];
    let region = parts[1] ? parts[1].toUpperCase() : "";

    const usStates = [
      "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
      "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
      "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
      "WI","WY"
    ];

    if (usStates.includes(region)) {
      region = "US";
    }

    normalized = `${cityName},${region}`;
  } else {
    normalized += ",US"; // default country
  }

  const q = encodeURIComponent(normalized);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  await fetchWeatherUrl(url);
}

// Display weather info
function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;
  const city = data.name;
  const country = data.sys.country;

  weatherDiv.innerHTML = `
    <div class="card-body text-center">
      <h5 class="card-title">Current Weather</h5>
      <p class="text-muted">Default: <strong>${DEFAULT_CITY}, USA</strong></p>
      <h2>${temp}°F</h2>
      <p class="text-capitalize">
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="">
        ${desc} · ${city}, ${country}
      </p>
      <p>Feels like: ${feels}°F<br>Humidity: ${humidity}%<br>Wind: ${wind} mph</p>
    </div>
  `;
}

// ------------------- JOKE FUNCTIONS -------------------
async function fetchJoke() {
  const url = "https://v2.jokeapi.dev/joke/Any";
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch joke");
    const data = await response.json();

    // ✅ Filter out offensive jokes
    if (data.flags && (data.flags.racist || data.flags.sexist || data.flags.explicit || data.flags.nsfw || data.flags.political || data.flags.religious)) {
      console.warn("Skipped inappropriate joke:", data);
      jokeDiv.textContent = "😅 No clean jokes available right now — try refreshing!";
      return;
    }

    if (data.type === "single") {
      jokeDiv.textContent = data.joke;
    } else if (data.type === "twopart") {
      jokeDiv.innerHTML = `<strong>${data.setup}</strong><br>${data.delivery}`;
    }
  } catch (err) {
    console.error("Joke fetch error:", err);
    jokeDiv.textContent = "Couldn't load a joke right now!";
  }
}

// ------------------- LOCATION FUNCTIONS -------------------
async function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
      await fetchWeatherUrl(url);
    },
    () => alert("Unable to retrieve your location.")
  );
}

// ------------------- EVENT LISTENERS -------------------
refreshBtn.addEventListener("click", () => fetchWeatherByCity(DEFAULT_CITY));
locationBtn.addEventListener("click", fetchWeatherByLocation);
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
});

// ------------------- INITIAL LOAD -------------------
window.addEventListener("DOMContentLoaded", async () => {
  weatherDiv.innerHTML = "";
  headersPre.textContent = "";
  headersPre.style.display = "none"; // Hide headers area entirely
  await fetchWeatherByCity(DEFAULT_CITY);
  fetchJoke();
});
