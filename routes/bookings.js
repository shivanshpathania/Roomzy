const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

router.post("/", async (req, res) => {
    try {
        const { hotelId, roomType, userId, guestName, guestEmail, guestPhone } = req.body;



        console.log("Booking Request Received");
        console.log("Hotel ID:", hotelId);
        console.log("Room Type:", roomType);
        console.log("User ID:", userId);
        console.log("Guest Name:", guestName);

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
        };

        // Check if it's a guest booking or user booking
        if (userId) {
            // User booking
            bookingData.userId = userId;
            bookingData.isGuestBooking = false;
        } else {
            // Guest booking - require guest details
            if (!guestName || !guestEmail || !guestPhone) {
                // Restore room availability if guest details missing
                room.available += 1;
                await hotel.save();
                return res.status(400).send("Guest name, email, and phone are required for guest bookings");
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