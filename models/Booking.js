const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
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
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
