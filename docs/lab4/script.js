/* script.js - lab 3
   - uses OpenWeatherMap current weather endpoint
   - uses JokeAPI (sv443) for jokes
   - displays some response headers
*/

/* ============ CONFIG ============ */
/* The instructor provided API key; you may replace it with your own if you prefer.
   WARNING: For real projects do not commit API keys to public repos. For this lab it's acceptable.
*/
const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256";

/* Default location */
const DEFAULT_CITY = "Troy,US"; // Troy, NY, United States

/* Joke API base */
const JOKE_API_BASE = "https://v2.jokeapi.dev/joke/Any";

/* ============ DOM ============ */
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

/* ============ Helpers ============ */
function showLoading(el, show=true) {
  el.style.display = show ? "block" : "none";
}
function formatTemp(t) {
  // temperature rounded
  return Math.round(t) + "°F";
}

/* ============ Weather fetch ============ */
async function fetchWeatherByCity(city = DEFAULT_CITY) {
  const q = encodeURIComponent(city);
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
    // show some headers (iterate)
    const headerList = [];
    for (const pair of resp.headers.entries()) {
      // collect a few headers — note that browsers sometimes restrict some headers for CORS/security
      headerList.push(`${pair[0]}: ${pair[1]}`);
      if (headerList.length >= 12) break;
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
  const weatherDesc = (data.weather && data.weather[0] && data.weather[0].description) || "N/A";
  const icon = (data.weather && data.weather[0] && data.weather[0].icon) ? data.weather[0].icon : null;
  const wind = data.wind ? `${data.wind.speed} mph` : "N/A";

  let iconHtml = "";
  if (icon) {
    iconHtml = `<img alt="${escapeHtml(weatherDesc)}" src="https://openweathermap.org/img/wn/${icon}@2x.png" style="width:72px;height:72px;" />`;
  }

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

/* ============ Joke fetch ============ */
async function fetchJoke() {
  try {
    showLoading(jokeLoading, true);
    jokeDiv.innerHTML = "";

    // Build a safe-joke query: blacklist potentially offensive content
    const url = `${JOKE_API_BASE}?blacklistFlags=nsfw,religious,political,sexist,explicit`;
    const resp = await fetch(url);

    if (!resp.ok) {
      const txt = await resp.text();
      jokeDiv.innerHTML = `<div class="text-danger">Error fetching joke: ${resp.status} ${resp.statusText}<br/><small>${escapeHtml(txt)}</small></div>`;
      return;
    }

    const data = await resp.json();

    // JokeAPI returns type 'single' or 'twopart'
    let html = "";
    if (data.type === "single" && data.joke) {
      html = `<div class="lead">${escapeHtml(data.joke)}</div>`;
    } else if (data.type === "twopart" && data.setup && data.delivery) {
      html = `<div><strong>Q:</strong> ${escapeHtml(data.setup)}</div><div class="mt-2"><strong>A:</strong> ${escapeHtml(data.delivery)}</div>`;
    } else {
      html = `<div>Unexpected joke format. Raw response: <pre class="small">${escapeHtml(JSON.stringify(data))}</pre></div>`;
    }

    // show category and id (helpful for README)
    html += `<div class="mt-3 small text-muted">Category: ${escapeHtml(data.category || "N/A")} • ID: ${escapeHtml(String(data.id || "N/A"))}</div>`;

    jokeDiv.innerHTML = html;
  } catch (err) {
    jokeDiv.innerHTML = `<div class="text-danger">Network error: ${escapeHtml(err.message)}</div>`;
  } finally {
    showLoading(jokeLoading, false);
  }
}

/* ============ Utilities ============ */
function escapeHtml(s) {
  if (s == null) return "";
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ============ Event bindings ============ */
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

/* ============ Initial load ============ */
window.addEventListener("load", () => {
  fetchWeatherByCity(DEFAULT_CITY);
  fetchJoke();
});
