import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';

dotenv.config();

const app = express();

// Serve static files
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);

// Database connection
mongoose.connect(
  process.env.MONGO_DB,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`✅ Server listening at port ${process.env.PORT}`)
  );
}).catch((error) =>
  console.error('❌ MongoDB connection error:', error)
);

