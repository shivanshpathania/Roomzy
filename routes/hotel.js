const express = require("express");
const { getAllHotels, getHotelDetails, getHotelMap } = require("../controllers/hotel.js");

const router = express.Router();

// Show all hotels
router.get("/hotels", getAllHotels);

// Show individual hotel details
router.get("/hotel/:id", getHotelDetails);

// Show hotel map
router.get("/hotel/:id/map", getHotelMap);

module.exports = router;
