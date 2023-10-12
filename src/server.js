const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const sequelize = require('./sequelize'); // Import your Sequelize configuration
const movieRoutes = require('./routes/api'); // Assuming you already have your route definitions

// Define your Sequelize models and associate them here
// const Movie = sequelize.define('Movie', { /* your model definition */ });

app.use(bodyParser.json());
app.use(cors());
app.use('/api/movies', movieRoutes);

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
