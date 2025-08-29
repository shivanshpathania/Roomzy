const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
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
    type: Number,
    required: true
  },
  // Guest booking fields
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
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
