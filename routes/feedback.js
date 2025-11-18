const express = require("express");
const { submitFeedback, getFeedbackByHotel } = require("../controllers/feedback.js");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/submit", requireAuth, submitFeedback);
router.get("/hotel/:hotelId", getFeedbackByHotel);

module.exports = router;


