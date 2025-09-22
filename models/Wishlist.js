const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  }
}, { timestamps: true });

// Ensure a user cannot wishlist the same hotel multiple times
WishlistSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", WishlistSchema);


