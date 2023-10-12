const express = require("express");
const { Op, where } = require("sequelize");
const Movie = require("../models/MovieModel"); // Import your Sequelize model

const router = express.Router();

//Create a movie

router.post("/createMovie", async (req, res) => {
  try {
    const { name, duration, rating } = req.body;

    if (rating < 0 || rating > 10) {
      throw new Error("Rating cannot be less than 0 or greater than 10");
    }

    await Movie.create({
      name,
      duration,
      rating,
    });

    res
      .status(200)
      .json({ success: true, message: "Movie inserted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new movie
router.get("/", async (req, res) => {
  const page = req.query.page || 1;
  const perPage = req.query.perPage || 10;
  const filterByName = req.query.filterByName || "";
  const sortBy = req.query.sortBy || "name";

  try {
    const whereClause = filterByName
      ? {
          name: {
            [Op.iLike]: `%${filterByName}%`,
          },
        }
      : {};

    const order = sortBy === "rating" ? [["rating", "ASC"]] : [["name", "ASC"]];

    const { count: totalMovies, rows: movies } = await Movie.findAndCountAll({
      where: whereClause,
      order,
      offset: (page - 1) * perPage,
      limit: perPage,
      order: [["updatedAt", "DESC"]],
    });

    res.json({ movies, totalMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching movies." });
  }
});

// Search API
router.get("/search", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const ratingSort = req.query.ratingSort;
  const ratingFilter = req.query.ratingFilter;

  try {
    const offset = (page - 1) * limit;

    const nameCondition = search ? { name: { [Op.like]: `%${search}%` } } : {};

    const totalCount = await Movie.count({
      where: nameCondition,
    });

    const totalPages = Math.ceil(totalCount / limit);

    let optionalSortField = ratingSort ? "rating" : "updatedAt";
    const sortOrder = ratingSort ? ratingSort : "DESC";

    let condition = {
      where: nameCondition,
      limit: limit,
      offset: offset,
      order: [[optionalSortField, sortOrder]],
    };

    const movies = await Movie.findAll(condition);

    const response = {
      movies,
      page,
      limit,
      totalCount,
      totalPages,
    };

    res.status(200).json({ success: true, paginatedResponse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve movies." });
  }
});

//get all
router.get("/all", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const ratingSort = req.query.ratingSort;
  const ratingFilter = req.query.ratingFilter;

  try {
    const offset = (page - 1) * limit;

    const totalCount = await Movie.count();

    const totalPages = Math.ceil(totalCount / limit);

    let optionalSortField = ratingSort ? "rating" : "updatedAt";
    const sortOrder = ratingSort ? ratingSort : "DESC";

    let condition = {
      limit: limit,
      offset: offset,
      order: [[optionalSortField, sortOrder]],
    };

    if (ratingFilter) {
      condition.where = {
        rating: ratingFilter,
      };
    }

    const movies = await Movie.findAll(condition);

    const response = {
      movies,
      page,
      limit,
      totalCount,
      totalPages,
    };

    res.status(200).json({ success: true, paginatedResponse: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve movies." });
  }
});

// Update a movie by ID
router.put("/update/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const { name, duration, rating } = req.body;

    if (rating < 0 || rating > 10) {
      throw new Error("Rating cannot be less than 0 or greater than 10");
    }

    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, error: "Movie not found." });
    }

    await movie.update({ name, duration, rating }, { where: { id: movieId } });

    res.status(200).json({ success: true, message: "movie has been updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the movie." });
  }
});

// Delete a movie by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findByPk(movieId);

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, error: "Movie not found." });
    }

    await movie.destroy({ where: { id: movieId } });

    res
      .status(200)
      .json({ success: true, message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
