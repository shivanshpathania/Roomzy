const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  // Registered user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },

  // Hotel reference
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  },

  roomType: {
    type: String,
    required: true
  },

  price: {
    type: Number,  // price per night
    required: true
  },

  // Booking dates
  checkin: {
    type: Date,
    required: true
  },
  checkout: {
    type: Date,
    required: true
  },

  nights: {
    type: Number,
    required: true
  },

  totalPrice: {
    type: Number,
    required: true
  },

  // Guest booking fields (if no user account)
  guestName: {
    type: String,
    required: false
  },
  guestEmail: {
    type: String,
    required: false
  },
  guestPhone: {
    type: String,
    required: false
  },
  isGuestBooking: {
    type: Boolean,
    default: false
  },

  // Status (confirmed, cancelled, etc.)
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
