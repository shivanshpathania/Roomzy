const Wishlist = require('../models/Wishlist');
const Hotel = require('../models/Hotel');

const addToWishlist = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });

    const { hotelId } = req.body;
    if (!hotelId) return res.status(400).json({ message: 'hotelId is required' });

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    await Wishlist.findOneAndUpdate(
      { userId: req.session.user._id, hotelId },
      { $setOnInsert: { userId: req.session.user._id, hotelId } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Error adding to wishlist:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });

    const items = await Wishlist.find({ userId: req.session.user._id }).populate('hotelId');
    const hotels = items.map(i => i.hotelId).filter(Boolean);
    res.status(200).json({ wishlist: hotels });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { addToWishlist, getUserWishlist };


