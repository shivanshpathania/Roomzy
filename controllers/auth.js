const User = require('../models/User'); // Adjust if your path is different
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set; using an insecure dev default. Set JWT_SECRET in .env for production.');
}

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

    // Sign JWT token
    const token = jwt.sign(
      { _id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Send token as HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
};

module.exports = { register, login };
