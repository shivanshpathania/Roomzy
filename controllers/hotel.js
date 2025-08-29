const Hotel = require('../models/Hotel');

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
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).send("Hotel not found");
    }

    res.render('hotel-details', { hotel, user: req.session.user });
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
