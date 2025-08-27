const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  ac: {
    type: Boolean,
    required: true
  },
  available: {
    type: Number,
    required: true
  },
});

const HotelSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true
    }, 
    rooms: [RoomSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", HotelSchema);
