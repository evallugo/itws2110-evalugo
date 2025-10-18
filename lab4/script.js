// script.js
// Lab 3 – Weather & Jokes App
// Fix: Refresh button now refreshes both weather and joke
// Keeps existing behavior (normalization, geolocation, safe jokes)

// ---------- CONFIG ----------
const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256";
const DEFAULT_CITY = "Troy, NY";

// ---------- ELEMENTS ----------
const weatherDiv = document.getElementById("weather");
const jokeDiv = document.getElementById("joke");
const headersPre = document.getElementById("headers");
const cityInput = document.getElementById("cityInput");
const refreshBtn = document.getElementById("refreshBtn");
const locationBtn = document.getElementById("locationBtn");
const searchBtn = document.getElementById("searchBtn");

// ---------- UTILITIES ----------
function hideHeadersUI() {
  if (headersPre) {
    headersPre.textContent = "";
    headersPre.style.display = "none";
  }
}

function logHeaders(response) {
  // Keep headers for debugging only (console). We hide the UI.
  try {
    const headers = [];
    for (const [k, v] of response.headers.entries()) {
      if (k === "content-length" || k === "content-type") headers.push(`${k}: ${v}`);
    }
    if (headers.length) console.log("HTTP Response Headers:\n" + headers.join("\n"));
  } catch (e) {
    // ignore
  }
  hideHeadersUI();
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

// ---------- WEATHER FETCHING ----------
async function fetchWeatherUrl(url) {
  try {
    // show a minimal loading state
    weatherDiv.innerHTML = `<div class="p-4 text-center text-muted">Loading weather...</div>`;

    const resp = await fetch(url);
    logHeaders(resp);

    if (!resp.ok) {
      const txt = await resp.text();
      weatherDiv.innerHTML = `<div class="p-4 text-center text-danger">Error fetching weather: ${resp.status} ${resp.statusText}<br/><small>${escapeHtml(txt)}</small></div>`;
      return;
    }

    const data = await resp.json();
    displayWeather(data);
  } catch (err) {
    console.error("fetchWeatherUrl error:", err);
    weatherDiv.innerHTML = `<div class="p-4 text-center text-danger">Network error: ${escapeHtml(err.message)}</div>`;
  }
}

// Normalize "City, ST" -> "City,US" and default single names to US
async function fetchWeatherByCity(city = DEFAULT_CITY) {
  let normalized = city ? city.trim() : DEFAULT_CITY;

  if (normalized.includes(",")) {
    const parts = normalized.split(",").map(p => p.trim());
    const cityName = parts[0] || "";
    let region = parts[1] ? parts[1].toUpperCase() : "";

    const usStates = [
      "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
      "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
      "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
      "WI","WY"
    ];

    if (usStates.includes(region)) region = "US";
    // if region already looks like a country code (e.g., "US", "FR"), keep it
    normalized = cityName + (region ? `,${region}` : "");
  } else {
    // no comma => assume US
    normalized = normalized + ",US";
  }

  const q = encodeURIComponent(normalized);
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  await fetchWeatherUrl(url);
}

function displayWeather(data) {
  try {
    if (!data || !data.main) {
      weatherDiv.innerHTML = `<div class="p-4 text-center text-warning">No weather data available.</div>`;
      return;
    }

    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = data.weather?.[0]?.description || "N/A";
    const humidity = data.main.humidity ?? "N/A";
    const wind = data.wind?.speed ?? "N/A";
    const icon = data.weather?.[0]?.icon || "";
    const city = data.name || "";
    const country = data.sys?.country || "";

    weatherDiv.innerHTML = `
      <div class="card-body text-center">
        <h5 class="card-title">Current Weather</h5>
        <p class="text-muted">Default: <strong>${escapeHtml(DEFAULT_CITY)}, USA</strong></p>
        <h2>${escapeHtml(String(temp))}°F</h2>
        <p class="text-capitalize">
          ${icon ? `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="${escapeHtml(desc)}">` : ""}
          ${escapeHtml(desc)} · ${escapeHtml(city)}, ${escapeHtml(country)}
        </p>
        <p>Feels like: ${escapeHtml(String(feels))}°F<br>Humidity: ${escapeHtml(String(humidity))}%<br>Wind: ${escapeHtml(String(wind))} mph</p>
      </div>
    `;
  } catch (e) {
    console.error("displayWeather error:", e);
    weatherDiv.innerHTML = `<div class="p-4 text-center text-danger">Error rendering weather.</div>`;
  }
}

// ---------- JOKE FETCHING ----------
async function fetchJoke() {
  // Use sv443 JokeAPI with blacklist flags to keep jokes clean
  const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,sexist,explicit";
  try {
    // show minimal joke loading hint
    jokeDiv.textContent = "Loading a joke...";
    const resp = await fetch(url);
    if (!resp.ok) {
      console.warn("Joke API non-ok:", resp.status);
      jokeDiv.textContent = "Couldn't fetch a joke right now.";
      return;
    }
    const data = await resp.json();

    if (data.type === "single" && data.joke) {
      jokeDiv.textContent = data.joke;
    } else if (data.type === "twopart" && data.setup && data.delivery) {
      jokeDiv.innerHTML = `<div><strong>${escapeHtml(data.setup)}</strong></div><div class="mt-2">${escapeHtml(data.delivery)}</div>`;
    } else {
      jokeDiv.textContent = "No joke available.";
    }
  } catch (err) {
    console.error("fetchJoke error:", err);
    jokeDiv.textContent = "Couldn't load a joke right now.";
  }
}

// ---------- GEOLOCATION ----------
function fetchWeatherByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  weatherDiv.innerHTML = `<div class="p-4 text-center text-muted">Getting your location…</div>`;
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
      await fetchWeatherUrl(url);
    },
    (err) => {
      console.warn("Geolocation error:", err);
      weatherDiv.innerHTML = `<div class="p-4 text-center text-danger">Unable to retrieve your location: ${escapeHtml(err.message)}</div>`;
    },
    { enableHighAccuracy: false, timeout: 10000 }
  );
}

// ---------- EVENT BINDINGS ----------
searchBtn?.addEventListener("click", () => {
  const c = (cityInput?.value || "").trim();
  if (c) fetchWeatherByCity(c);
});

locationBtn?.addEventListener("click", fetchWeatherByLocation);

// IMPORTANT: refresh should update BOTH weather and joke (fix requested)
refreshBtn?.addEventListener("click", async () => {
  // refresh weather for default city and refresh joke
  await fetchWeatherByCity(DEFAULT_CITY);
  // call joke after weather finished to avoid overlapping UI churn
  fetchJoke();
});

// ---------- INITIAL LOAD ----------
window.addEventListener("DOMContentLoaded", async () => {
  hideHeadersUI();
  // initial weather + joke load
  await fetchWeatherByCity(DEFAULT_CITY);
  fetchJoke();
});
