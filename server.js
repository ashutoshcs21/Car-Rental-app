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
  .then(() => console.log('Connected to DB ✅'))
  .catch((error) => console.error('DB connection error: ', error));

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies and other credentials
};
app.use(cors(corsOptions));

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
app.get('/', (req, res) => res.send('Hello World!'));

// Start Server
app.listen(port, () => console.log(`Node.js Server started on port ${port}`));
