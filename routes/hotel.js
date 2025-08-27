const express = require("express");
const { getAllHotels } = require("../controllers/hotel.js");

const router = express.Router();

// Show all hotels
router.get("/hotels", getAllHotels);

module.exports = router;
