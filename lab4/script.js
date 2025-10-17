/* script.js - Lab 3
   Weather + Joke app using OpenWeatherMap and JokeAPI
   Author: YOUR NAME
*/

/* ============ CONFIG ============ */
const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256"; // Instructor-provided key
const DEFAULT_CITY = "Troy,US"; // Default city (Troy, NY, USA)
const JOKE_API_BASE = "https://v2.jokeapi.dev/joke/Any";

/* ============ DOM REFERENCES ============ */
const weatherDiv = document.getElementById("weather");
const headersPre = document.getElementById("response-headers");
const weatherLoading = document.getElementById("weather-loading");

const jokeDiv = document.getElementById("joke");
const jokeLoading = document.getElementById("joke-loading");

const btnRefresh = document.getElementById("btn-refresh");
const btnGeolocate = document.getElementById("btn-geolocate");
const btnCity = document.getElementById("btn-city");
const cityInput = document.getElementById("city-input");
const btnJoke = document.getElementById("btn-joke");

/* ============ HELPERS ============ */
function showLoading(el, show = true) {
  el.style.display = show ? "block" : "none";
}

function formatTemp(t) {
  return Math.round(t) + "°F";
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============ WEATHER FUNCTIONS ============ */
async function fetchWeatherByCity(city = DEFAULT_CITY) {
  // Clean and normalize input
  let normalized = city.trim();

  // Handle inputs like "Boston, MA" → "Boston,US"
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
    // Default to US if no country given
    normalized += ",US";
  }

  const q = encodeURIComponent(normalized);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  return fetchWeatherUrl(url);
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  return fetchWeatherUrl(url);
}

async function fetchWeatherUrl(url) {
  try {
    showLoading(weatherLoading, true);
    weatherDiv.innerHTML = "";
    headersPre.textContent = "";

    const resp = await fetch(url);

    // Display available response headers
    const headerList = [];
    for (const [key, val] of resp.headers.entries()) {
      headerList.push(`${key}: ${val}`);
      if (headerList.length >= 12) break; // show up to 12 headers
    }
    headersPre.textContent = headerList.join("\n");

    if (!resp.ok) {
      const txt = await resp.text();
      weatherDiv.innerHTML = `<div class="text-danger">Error fetching weather: ${resp.status} ${resp.statusText}<br/><small>${escapeHtml(txt)}</small></div>`;
      return;
    }

    const data = await resp.json();
    displayWeather(data);
  } catch (err) {
    weatherDiv.innerHTML = `<div class="text-danger">Network error: ${escapeHtml(err.message)}</div>`;
  } finally {
    showLoading(weatherLoading, false);
  }
}

function displayWeather(data) {
  if (!data || !data.main) {
    weatherDiv.innerHTML = `<div class="text-warning">No weather data returned.</div>`;
    return;
  }

  const cityName = `${data.name}, ${data.sys?.country || ""}`;
  const temp = data.main.temp;
  const feels = data.main.feels_like;
  const humidity = data.main.humidity;
  const weatherDesc = data.weather?.[0]?.description || "N/A";
  const icon = data.weather?.[0]?.icon || null;
  const wind = data.wind ? `${data.wind.speed} mph` : "N/A";

  const iconHtml = icon
    ? `<img alt="${escapeHtml(weatherDesc)}" src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width:72px;height:72px;" />`
    : "";

  const html = `
    <div class="d-flex align-items-center gap-3">
      <div>${iconHtml}</div>
      <div>
        <div class="temp">${formatTemp(temp)}</div>
        <div class="meta">${escapeHtml(weatherDesc)} · ${escapeHtml(cityName)}</div>
      </div>
    </div>
    <div class="mt-3 small">
      <div><strong>Feels like:</strong> ${formatTemp(feels)}</div>
      <div><strong>Humidity:</strong> ${escapeHtml(String(humidity))}%</div>
      <div><strong>Wind:</strong> ${escapeHtml(wind)}</div>
    </div>
  `;
  weatherDiv.innerHTML = html;
}

/* ============ JOKE FUNCTIONS ============ */
async function fetchJoke() {
  try {
    showLoading(jokeLoading, true);
    jokeDiv.innerHTML = "";

    const url = `${JOKE_API_BASE}?blacklistFlags=nsfw,religious,political,sexist,explicit`;
    const resp = await fetch(url);

    if (!resp.ok) {
      const txt = await resp.text();
      jokeDiv.innerHTML = `<div class="text-danger">Error fetching joke: ${resp.status} ${resp.statusText}<br/><small>${escapeHtml(txt)}</small></div>`;
      return;
    }

    const data = await resp.json();

    let html = "";
    if (data.type === "single" && data.joke) {
      html = `<div class="lead">${escapeHtml(data.joke)}</div>`;
    } else if (data.type === "twopart" && data.setup && data.delivery) {
      html = `<div><strong>Q:</strong> ${escapeHtml(data.setup)}</div><div class="mt-2"><strong>A:</strong> ${escapeHtml(data.delivery)}</div>`;
    } else {
      html = `<div>Unexpected joke format. Raw response: <pre class="small">${escapeHtml(JSON.stringify(data))}</pre></div>`;
    }

    html += `<div class="mt-3 small text-muted">Category: ${escapeHtml(data.category || "N/A")} • ID: ${escapeHtml(String(data.id || "N/A"))}</div>`;
    jokeDiv.innerHTML = html;
  } catch (err) {
    jokeDiv.innerHTML = `<div class="text-danger">Network error: ${escapeHtml(err.message)}</div>`;
  } finally {
    showLoading(jokeLoading, false);
  }
}

/* ============ EVENT BINDINGS ============ */
btnRefresh.addEventListener("click", () => fetchWeatherByCity(DEFAULT_CITY));

btnCity.addEventListener("click", () => {
  const c = cityInput.value.trim();
  if (c.length === 0) {
    alert("Please type a city name (e.g., Troy, NY).");
    return;
  }
  fetchWeatherByCity(c);
});

btnJoke.addEventListener("click", fetchJoke);

btnGeolocate.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  showLoading(weatherLoading, true);
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    },
    (err) => {
      showLoading(weatherLoading, false);
      alert("Could not get location: " + err.message);
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
});

/* ============ INITIAL LOAD ============ */
window.addEventListener("load", () => {
  fetchWeatherByCity(DEFAULT_CITY);
  fetchJoke();
});
