const express = require("express");
const { getAllHotels, getHotelDetails, getHotelMap } = require("../controllers/hotel.js");
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

module.exports = router;
