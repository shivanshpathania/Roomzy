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

module.exports = { getAllHotels };
