const express = require("express");
const { submitFeedback, getFeedbackByHotel } = require("../controllers/feedback.js");

const router = express.Router();

router.post("/submit", submitFeedback);
router.get("/hotel/:hotelId", getFeedbackByHotel);

module.exports = router;


