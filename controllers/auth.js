const User = require('../models/User'); // Adjust if your path is different
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {

    if (!req.body.username || !req.body.password) {
        return res.status(400).send("Username and password are required.");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword
    });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during registration");
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.redirect('/signup');

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.redirect('/login');

    // Store user in session
    req.session.user = {
      _id: user._id,
      username: user.username
    };

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
};

module.exports = { register, login };
