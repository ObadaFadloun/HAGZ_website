const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { location, lat, lon, date } = req.query;

    if (!location && (!lat || !lon)) {
      return res
        .status(400)
        .json({ message: 'Missing location or coordinates' });
    }

    if (!process.env.WEATHER_API_KEY) {
      return res.status(500).json({ message: 'Missing API key' });
    }

    // Use forecast endpoint for better date handling
    const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    const url =
      lat && lon
        ? `${baseUrl}?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        : `${baseUrl}?q=${encodeURIComponent(location)}&appid=${process.env.WEATHER_API_KEY}&units=metric`;

    const { data } = await axios.get(url);

    if (!data || !data.list) {
      return res.status(404).json({ message: 'Invalid weather data' });
    }

    // If date is provided, find the closest forecast
    let selected = data.list[0];
    if (date) {
      const target = new Date(date).getTime();
      selected = data.list.reduce((prev, curr) => {
        const prevDiff = Math.abs(new Date(prev.dt_txt).getTime() - target);
        const currDiff = Math.abs(new Date(curr.dt_txt).getTime() - target);
        return currDiff < prevDiff ? curr : prev;
      });
    }

    const weather = {
      temp: selected.main.temp,
      description: selected.weather[0].description,
      icon: selected.weather[0].icon,
      date: selected.dt_txt,
      city: data.city.name,
      country: data.city.country
    };

    res.json(weather);
  } catch (err) {
    console.error('Weather route error:', err.message);
    res.status(500).json({ message: 'Weather fetch failed' });
  }
});

module.exports = router;
