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
const path = require("path");

const app = express();
connectDB();

// Session setup
app.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: false
}));

// Middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

// Routes
app.use('/api/auth', authRoute);
app.use("/", hotelRoute);
app.use("/api/bookings", bookingsRoute);

// Auth Views
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/home', (req, res) => {
    res.render('home');
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
        
        res.render('user-bookings', { bookings: userBookings, user: req.session.user });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        res.status(500).send('Something went wrong.');
    }
});

app.use("/api/weather", weatherRoutes);
app.use("/currency", currencyRoutes);

connectDB().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.log("Error While Connecting the database", err);
});
