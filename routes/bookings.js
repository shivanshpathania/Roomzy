const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

router.post("/", async (req, res) => {
  try {
    const { hotelId, roomType, userId, guestName, guestEmail, guestPhone, checkIn, checkOut } = req.body;

    if (!checkIn || !checkOut) {
      return res.status(400).send("Check-in and Check-out dates are required");
    }

    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);

    if (outDate <= inDate) {
      return res.status(400).send("Check-out date must be after Check-in date");
    }

    const nights = Math.ceil((outDate - inDate) / (1000 * 60 * 60 * 24));

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      console.log("Hotel not found with ID:", hotelId);
      return res.status(404).send("Hotel not found");
    }
    console.log("Hotel found successfully:", hotel.name);

    const room = hotel.rooms.find(r => r.type.trim().toLowerCase() === roomType.trim().toLowerCase());
    if (!room) {
      console.log("Room type doesn't match");
      return res.status(400).send("Room type not found");
    }

    if (room.available <= 0) {
      console.log("Room not available:", room.available);
      return res.status(400).send("Room not available");
    }

    // Reduce availability
    room.available -= 1;
    await hotel.save();

    // Create booking object
    const bookingData = {
      hotelId,
      roomType,
      price: room.price,       
      checkin: inDate,
      checkout: outDate,
      nights,
      totalPrice: room.price * nights
    };

    // User or guest booking
    if (userId) {
      bookingData.userId = userId;
      bookingData.isGuestBooking = false;
    } else {
      if (!guestName || !guestEmail || !guestPhone) {
        room.available += 1;
        await hotel.save();
        return res.status(400).send("Guest details required for guest bookings");
      }

      bookingData.guestName = guestName;
      bookingData.guestEmail = guestEmail;
      bookingData.guestPhone = guestPhone;
      bookingData.isGuestBooking = true;
    }

    const booking = new Booking(bookingData);
    await booking.save();

    console.log("Booking confirmed with ID:", booking._id);
    return res.redirect(`/booking-success?bookingId=${booking._id}`);

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).send("Booking failed");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.redirect("/user/bookings");
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
