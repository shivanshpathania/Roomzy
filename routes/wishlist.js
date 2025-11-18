const express = require("express");
const { addToWishlist, getUserWishlist } = require("../controllers/wishlist.js");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/add", requireAuth, addToWishlist);
router.get("/me", requireAuth, getUserWishlist);

module.exports = router;


