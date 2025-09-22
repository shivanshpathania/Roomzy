const express = require("express");
const { getAllHotels, getHotelDetails, getHotelMap, setSale } = require("../controllers/hotel.js");
const fs = require('fs');
const router = express.Router();
const path = require('path');
const data = fs.readFileSync(path.join(__dirname, "../data", "hotel-images.json"), "utf8");
// Show all hotels
router.get("/hotels", getAllHotels);

// Show individual hotel details
router.get("/hotel/:id", getHotelDetails);

// Show hotel map
router.get("/hotel/:id/map", getHotelMap);

// Quick test endpoint to set sale on a hotel (requires session)
router.post("/hotel/:id/sale", setSale);
// demo endpoint removed

module.exports = router;
