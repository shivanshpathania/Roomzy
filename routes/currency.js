const express = require("express");
require("dotenv").config();

const router = express.Router();

// ✅ Route: /currency/convert?from=USD&to=INR&amount=100
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

module.exports = router;
