const Feedback = require('../models/Feedback');
const Hotel = require('../models/Hotel');

const submitFeedback = async (req, res) => {
  try {
    if (!req.session.user) return res.status(401).json({ message: 'Login required' });

    const { hotelId, rating, comment } = req.body;
    if (!hotelId || !rating) return res.status(400).json({ message: 'hotelId and rating are required' });

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const feedback = new Feedback({
      userId: req.session.user._id,
      hotelId,
      rating,
      comment: comment || ''
    });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted' });
  } catch (err) {
    console.error('Error submitting feedback:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getFeedbackByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    if (!hotelId) return res.status(400).json({ message: 'hotelId is required' });

    const feedbackList = await Feedback.find({ hotelId }).populate('userId', 'username');
    res.status(200).json({ feedback: feedbackList });
  } catch (err) {
    console.error('Error fetching feedback:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = { submitFeedback, getFeedbackByHotel };


