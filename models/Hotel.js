const mongoose = require("mongoose");

// Define the Room schema



const RoomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true // e.g., "Deluxe Room", "Suite"
  },
  price: {
    type: Number,
    required: true // Price per night
  },
  capacity: {
    type: Number,
    required: true,
    default: 2 // Default capacity is 2 people
  },
  available: {
    type: Number, // Number of available rooms
    required: true,
    default: 0 // Default to 0 if not provided
  },
  ac: {
    type: Boolean, // Whether the room has air conditioning
    required: true,
    default: false // Default to Non-AC
  }
});

const HotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    rooms: [RoomSchema],

    // ⭐ Add rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);


const Hotel = mongoose.model("Hotel", HotelSchema);

module.exports = Hotel;