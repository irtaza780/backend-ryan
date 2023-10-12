const connectDatabase = () => {
  const mongoose = require('mongoose');
  mongoose
    .connect(
      'mongodb+srv://asadijaz402:03115882366@dev-profile.2aesujp.mongodb.net/ecommcrce?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then((data) => {
      console.log('connect');
    })
    .catch((err) => {
      console.log(err);
      console.log('connection error');
    });
};
module.exports = connectDatabase;
