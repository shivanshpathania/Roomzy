const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

router.post("/", async (req, res) => {
    try {
        const { hotelId, roomType, userId } = req.body;

        // console.log("Booking Request Received");
        // console.log("Hotel ID:", hotelId);
        // console.log("Room Type from form:", `"${roomType}"`);
        // console.log("User ID:", userId);

        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            console.log("Hotel not found");
            return res.status(404).send("Hotel not found");
        }

        // console.log("RoomType received:", roomType);
        // console.log("Hotel Rooms (raw):", hotel.rooms);

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

        // Save booking
        const booking = new Booking({
            userId,
            hotelId,
            roomType,
            price: room.price,
        });

        await booking.save();

        console.log("Booking confirmed");
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