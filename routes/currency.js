const express = require("express");
require("dotenv").config();

const router = express.Router();

// Route: /currency/convert?from=USD&to=INR&amount=100
router.get("/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Please provide from, to, and amount" });
  }

  try {
    const response = await fetch(
      `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
    );
    const data = await response.json();
    res.json({
      from,
      to,
      amount,
      rate: data.info.rate,
      converted: data.result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Currency conversion failed" });
  }
});

//  Route: /currency/rates?base=USD
router.get("/rates", async (req, res) => {
  const { base = "INR" } = req.query;

  try {
    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${base}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Fallback rates if API doesn't return expected data
    if (!data.rates) {
      const fallbackRates = {
        INR: 1,
        USD: 0.012,
        EUR: 0.011,
        GBP: 0.0096,
      };

      return res.json({
        base: base,
        date: new Date().toISOString().split('T')[0],
        rates: fallbackRates,
        source: "fallback"
      });
    }

    res.json({
      base: data.base,
      date: data.date,
      rates: data.rates,
      source: "live"
    });
  } catch (error) {
    console.error("Currency API error:", error);

    // Return fallback rates
    const fallbackRates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0096,
    };

    res.json({
      base: base,
      date: new Date().toISOString().split('T')[0],
      rates: fallbackRates,
      source: "fallback",
      error: "Live rates unavailable"
    });
  }
});


router.get("/test", (_, res) => {
  res.json({
    status: "Currency API is working",
    endpoints: {
      rates: "/api/currency/rates?base=INR",
      convert: "/api/currency/convert?from=INR&to=USD&amount=1000"
    }
  });
});

module.exports = router;
