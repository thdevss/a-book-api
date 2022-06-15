require('dotenv').config()

module.exports = {
  secret: process.env.SECRET_KEY ? process.env.SECRET_KEY : 'XKL930ZHuFOI4xJs1sXkx5aW31QcRcj63pcfPFP0'
};