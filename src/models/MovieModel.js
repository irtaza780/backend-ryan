const Sequelize = require("sequelize");
const sequelize = require("../sequelize");

const Movie = sequelize.define("Movie", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
    },
  },
  duration: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isDurationValid(value) {
        if (
          !/^((([1-9][0-9]{0,2}|720)m)|(([0-9]|1[0-2])(\.[1-9])?h))$/.test(
            value
          )
        ) {
          throw new Error("Invalid duration format. Use Xh or Xm.");
        }
      },
    },
  },
  rating: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
});

module.exports = Movie;
