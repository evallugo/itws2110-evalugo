const OPENWEATHER_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256"; 
const FINNHUB_API_KEY = "e5b777ef2c116a5f495f2d2f19e18256"; 
const TROY_ID = "5140604";

const STOCK_SYMBOL = "AAPL";
const FINNHUB_QUOTE_URL = 
  `https://finnhub.io/api/v1/quote?symbol=${STOCK_SYMBOL}&token=${FINNHUB_API_KEY}`;

const OPENWEATHER_URL = 
  `https://api.openweathermap.org/data/2.5/weather?id=${TROY_ID}&units=imperial&appid=${OPENWEATHER_API_KEY}`;

function fetchWeatherData() 
{
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) 
        {
          var weatherData = JSON.parse(this.responseText); 
          updateWeatherDisplay(weatherData);

        } else if (this.readyState == 4) {
          console.error("Error fetching weather data. HTTP Status: " + this.status);
          document.getElementById('description').textContent = "Could not fetch weather data.";
      }
  };
  
  xhr.open("GET", OPENWEATHER_URL, true); 
  xhr.send();
}

function updateWeatherDisplay(data) 
{
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const city = data.name;
  const iconCode = data.weather[0].icon;

  document.getElementById('city-name').textContent = city;
  document.getElementById('description').textContent = description;
  document.getElementById('temperature').textContent = `${temp}°F`;
  document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;
  fetchSecondAPIData(); 
}

function fetchSecondAPIData() 
{
    var xhrFinnhub = new XMLHttpRequest();
    
    xhrFinnhub.onreadystatechange = function() 
    {
        if (this.readyState == 4 && this.status == 200) 
          {
            var stockData = JSON.parse(this.responseText);
            const currentPrice = stockData.c;
            const percentChange = stockData.dp;
            const displayElement = document.getElementById('fact-display');
            
            if (currentPrice && percentChange) 
            {
                displayElement.innerHTML = 
                    `${STOCK_SYMBOL} Stock Price: **$${currentPrice.toFixed(2)}** (<span style="color:${percentChange >= 0 ? 'lightgreen' : 'pink'};">${percentChange.toFixed(2)}%</span>)`;
            } else 
              {
                displayElement.textContent = `Error: Could not retrieve quote for ${STOCK_SYMBOL}.`;
              }

        } else if (this.readyState == 4) 
          {
            console.error("Error fetching stock data. HTTP Status: " + this.status);
            document.getElementById('fact-display').textContent = "Stock data unavailable.";
          }
    };
    
    xhrFinnhub.open("GET", FINNHUB_QUOTE_URL, true); 
    xhrFinnhub.send();
}

document.addEventListener('DOMContentLoaded', fetchWeatherData);