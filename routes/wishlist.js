const express = require("express");
const { addToWishlist, getUserWishlist } = require("../controllers/wishlist.js");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/me", getUserWishlist);

module.exports = router;


