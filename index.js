const express = require("express");
const connectDB = require("./mongo.js");
const authRoute = require("./routes/auth.js");
const hotelRoute = require("./routes/hotel.js");
const bookingsRoute = require("./routes/bookings");
const Hotel = require("./models/Hotel.js");
const Booking = require("./models/Booking.js");
const weatherRoutes = require("./routes/weatherRoute");
const currencyRoutes = require("./routes/currency");
const session = require("express-session");
const methodOverride = require("method-override");
const wishlistRoutes = require("./routes/wishlist");
const feedbackRoutes = require("./routes/feedback");
const path = require("path");
const fs = require('fs');
const app = express();
connectDB();

// Session setup
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

// Routes
app.use('/api/auth', authRoute);
app.use("/", hotelRoute);
app.use("/api/bookings", bookingsRoute);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/feedback", feedbackRoutes);

// Auth Views
app.get('/', (_, res) => {
    res.render('login');
});

app.get('/login', (_, res) => {
    res.render('login');
});

app.get('/signup', (_, res) => {
    res.render('signup');
});

app.get('/home', (_, res) => {
    res.render('home');
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

app.get('/hotels', async (req, res) => {
    try {
        const hotels = await Hotel.find(); 
        res.render('hotels', { hotels, user: req.session.user });
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});

app.get("/booking-success", async(req, res) => {
    const { bookingId } = req.query;

    try {
        const booking = await Booking.findById(bookingId).populate('hotelId');
        
        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        const hotel = booking.hotelId;
        
        res.render("booking-success", {
            booking,
            hotel,
            hotelName: hotel.name,
            roomType: booking.roomType,
            price: booking.price,
        });

    } catch (err) {
        console.error("Error fetching booking details:", err);
        res.status(500).send("Error rendering booking confirmation");
    }
});

app.get('/user/bookings', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userBookings = await Booking.find({ userId: req.session.user._id }).populate('hotelId');

        // Filter out bookings where hotel was not found (in case hotel was deleted)
        const validBookings = userBookings.filter(booking => booking.hotelId);

        res.render('user-bookings', { bookings: validBookings, user: req.session.user });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).send('Something went wrong.');
    }
});

app.get("/guest-booking", (req, res) => {
    res.redirect("/hotels");  // or res.render("hotels", { user: null });
  });

app.use("/api/weather", weatherRoutes);
app.use("/api/currency", currencyRoutes);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Error While Connecting the database", err);
});
