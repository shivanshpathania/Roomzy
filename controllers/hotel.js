const Hotel = require('../models/Hotel');
const fs = require("fs");
const path = require("path");

const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    console.log(hotels);

    res.render('hotels', { hotels, user: req.session.user });
  } catch (err) {
    console.error("Error fetching hotels:", err);
    res.status(500).json({ message: 'Error fetching hotels' });
  }
};


const getHotelDetails = async (req, res) => {
  try {
    // Fetch hotel details from the database
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    // Log the hotel object to verify its structure
    console.log("Fetched hotel:", hotel);

    // Read the JSON file to get image URLs
    let hotelImages = {};
    try {
      const data = fs.readFileSync(path.join(__dirname, "../data", "hotel-images.json"), "utf8");
      hotelImages = JSON.parse(data);
    } catch (err) {
      console.error("Error reading or parsing hotel-images.json:", err);
      hotelImages = {}; // Fallback to an empty object
    }

    // Log the requested hotel ID
    console.log("Requested hotel ID:", req.params.id);

    // Get images for the requested hotel
    const images = hotelImages[req.params.id] || [];
    console.log("Images for hotel:", images);

    if (images.length === 0) {
      console.warn(`No images found for hotelId: ${req.params.id}`);
    }

    // Render the hotel details page and pass the hotel and images
    res.render("hotel-details", { hotel, images, user: req.session.user });
  } catch (err) {
    console.error("Error fetching hotel details:", err);
    res.status(500).send("Something went wrong");
  }
};
 



const getHotelMap = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    res.render('hotel-map', { hotel, user: req.session.user });
  } catch (err) {
    console.error("Error fetching hotel map:", err);
    res.status(500).send("Something went wrong");
  }
};

module.exports = { getAllHotels, getHotelDetails, getHotelMap };
 
// Below: lightweight admin-style action to set sale on a hotel
const setSale = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Login required' });
    }

    const { id } = req.params;
    const { discountPercent, saleEndsAt } = req.body;

    const update = {};
    if (discountPercent !== undefined) update.discountPercent = Number(discountPercent) || 0;
    if (saleEndsAt) update.saleEndsAt = new Date(saleEndsAt);

    const hotel = await Hotel.findByIdAndUpdate(id, update, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    res.status(200).json({ message: 'Sale updated', hotel });
  } catch (err) {
    console.error('Error updating sale:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports.setSale = setSale;

// (demo sale removed on request)