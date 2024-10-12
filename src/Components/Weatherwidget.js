import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weatherwidget.css';

function WeatherWidget() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // For 24-hour forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current weather and 24-hour forecast
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

        // Fetch current weather
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );
        setWeather(weatherResponse.data);

        // Fetch 5-day/3-hour forecast
        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
        );
        setForecast(forecastResponse.data.list.slice(0, 8)); // Next 24 hours (3-hour interval, 8 data points)
      } catch (err) {
        console.error('Error fetching weather data:', err.response || err.message);
        setError('Error fetching weather data');
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  const handleCitySubmit = (e) => {
    e.preventDefault();
    const cityInput = e.target.elements.cityName.value;
    if (cityInput) {
      setCity(cityInput);
    }
  };

  return (
    <div className="weather-widget-container">
      <div className="container">
        <div className="title">
          <h1>Weather Forecast</h1>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleCitySubmit} className="form">
          <input
            type="text"
            name="cityName"
            placeholder="Enter city"
            className="search-bar"
          />
          <button type="submit" className="submit-button">
            Get Weather
          </button>
        </form>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {weather && (
        <div className="weather-info">
          <h3>{weather.name}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}%</p> {/* Show humidity */}
          <img
            src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
            alt="Weather icon"
          />
        </div>
      )}

      {forecast && (
        <div className="forecast-info">
          <h3>Next 24-Hour Forecast</h3>
          <div className="forecast-list">
            {forecast.map((item) => (
              <div key={item.dt} className="forecast-item">
                <p>{new Date(item.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{item.weather[0].description}</p>
                <p>{item.main.temp}°C</p>
                <img
                  src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                  alt="Weather icon"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherWidget;
