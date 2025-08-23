const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Port Configuration
const port = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch((error) => {
        console.error('❌ MongoDB connection error: ', error);
        process.exit(1); // Exit if DB connection fails
    });

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Routes
app.use('/api/cars/', require('./routes/carsRoute'));
app.use('/api/users/', require('./routes/usersRoute'));
app.use('/api/bookings/', require('./routes/bookingsRoute'));

// Static Files for Production
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
    });
}

// Default Route
app.get('/', (req, res) => res.send('🚀 Server is running...'));

// Start Server
app.listen(port, () => console.log(`🌍 Server started on port ${port}`));