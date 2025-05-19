import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Admin from "../models/Admin.js"; // ✅ added .js
import Movie from "../models/Movie.js"; // ✅ added .js

export const addMovie = async (req, res, next) => {
  const extractedToken = req.headers.authorization?.split(" ")[1];

  if (!extractedToken || extractedToken.trim() === "") {
    return res.status(401).json({ message: "Token Not Found" });
  }

  let adminId;
  try {
    const decrypted = jwt.verify(extractedToken, process.env.SECRET_KEY);
    adminId = decrypted.id;
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", error: err.message });
  }

  const { title, description, releaseDate, posterUrl, featured, actors } = req.body;

  if (
    !title || title.trim() === "" ||
    !description || description.trim() === "" ||
    !posterUrl || posterUrl.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let movie;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const adminUser = await Admin.findById(adminId).session(session);
    if (!adminUser) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Admin not found" });
    }

    movie = new Movie({
      description,
      releaseDate: new Date(releaseDate),
      featured,
      actors,
      admin: adminId,
      posterUrl,
      title,
    });

    await movie.save({ session });
    adminUser.addedMovies.push(movie);
    await adminUser.save({ session });

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    return res.status(500).json({ message: "Failed to create movie", error: err.message });
  }

  return res.status(201).json({ movie });
};

export const getAllMovies = async (req, res, next) => {
  let movies;

  try {
    movies = await Movie.find();
  } catch (err) {
    return res.status(500).json({ message: "Fetching movies failed", error: err.message });
  }

  return res.status(200).json({ movies });
};

export const getMovieById = async (req, res, next) => {
  const id = req.params.id;
  let movie;
  try {
    movie = await Movie.findById(id);
  } catch (err) {
    return res.status(500).json({ message: "Fetching movie failed", error: err.message });
  }

  if (!movie) {
    return res.status(404).json({ message: "Invalid Movie ID" });
  }

  return res.status(200).json({ movie });
};
