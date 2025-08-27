const express = require("express");
require("dotenv").config();

const router = express.Router();

// ✅ Route to get weather by city
router.get("/:city", async (req, res) => {
  const city = req.params.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Weather fetch failed" });
  }
});

module.exports = router;
