const User = require('../models/User'); // Adjust if your path is different
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set; using an insecure dev default. Set JWT_SECRET in .env for production.');
}

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const errors = [];

    if (!username || !username.trim()) {
      errors.push('Username is required.');
    } else if (username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long.');
    }

    if (!email || !email.trim()) {
      errors.push('Email is required.');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('Please provide a valid email address.');
      }
    }

    if (!password) {
      errors.push('Password is required.');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }

    if (errors.length > 0) {
      return res.redirect('/signup?error=' + encodeURIComponent(errors.join(' ')));
    }

    const existingUser = await User.findOne({
      $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }],
    });

    if (existingUser) {
      return res.redirect(
        '/signup?error=' + encodeURIComponent('Username or email is already in use.')
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    let message = 'Error during registration';
    if (err.code === 11000) {
      message = 'Username or email is already in use.';
    }
    res.redirect('/signup?error=' + encodeURIComponent(message));
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !username.trim() || !password) {
      return res.redirect(
        '/login?error=' + encodeURIComponent('Username and password are required.')
      );
    }

    const user = await User.findOne({ username: username.trim() });

    if (!user) {
      return res.redirect(
        '/login?error=' + encodeURIComponent('Invalid username or password.')
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(
        '/login?error=' + encodeURIComponent('Invalid username or password.')
      );
    }

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
