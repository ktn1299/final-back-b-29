import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/user_routes.js";
import adminRoutes from "./routes/admin_routes.js";
import movieRoutes from "./routes/movie-routes.js";
import bookingRoutes from "./routes/booking-routes.js";

dotenv.config();

const app = express(); // ✅ must be defined before any use

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // ✅ safe to use now
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/movie", movieRoutes);
app.use("/booking", bookingRoutes);

// Server and DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Connected to Database and Server is running");
    });
  })
  .catch(err => console.log(err));
