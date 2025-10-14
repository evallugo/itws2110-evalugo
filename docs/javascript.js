const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256"; 
const TROY_ID = "5140604";
const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Any?type=single";
const OPENWEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?q=Troy,US&units=imperial&appid=${OPENWEATHER_API_KEY}`;

function fetchWeatherData() {
  var weatherXhr = new XMLHttpRequest();

  weatherXhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var weatherData = JSON.parse(this.responseText); 
          updateWeatherDisplay(weatherData);

      } else if (this.readyState == 4) {
          console.error("Error fetching weather data. HTTP Status: " + this.status);
          document.getElementById('description').textContent = "Error: Could not fetch weather data.";
          document.getElementById('temperature').textContent = "-";
          document.getElementById('city-name').textContent = "Unavailable";
          fetchJoke(); 
      }
  };
  
  weatherXhr.open("GET", OPENWEATHER_URL, true); 
  weatherXhr.send();
}

function updateWeatherDisplay(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const city = data.name;
  const iconCode = data.weather[0].icon;
  const windSpeed = data.wind.speed.toFixed(2);
  const humidity = data.main.humidity;
  document.getElementById('city-name').textContent = city;
  document.getElementById('description').textContent = description;
  document.getElementById('temperature').textContent = `${temp}°F`;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.getElementById('wind-speed').textContent = `Wind: ${windSpeed} mph`; 
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  fetchJoke(); 
}

function fetchJoke() {
  var jokeXhr = new XMLHttpRequest();
  const displayElement = document.getElementById('fact-display');

  jokeXhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var jokeData = JSON.parse(this.responseText);
        
        displayElement.textContent = jokeData.joke || "Could not fetch a joke.";
    } else if (this.readyState == 4) {
        displayElement.textContent = "Could not fetch a joke at this time.";
    }
  };
  
  jokeXhr.open("GET", JOKE_API_URL, true);
  jokeXhr.send();
}
document.addEventListener('DOMContentLoaded', fetchWeatherData);