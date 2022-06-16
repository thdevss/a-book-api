const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config.js");
const userModel = require('../models/userModel.js');

const isAuthenticate = async (req, res, next) => {
  let token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }

    let user = await userModel.getOneUser(decoded.id);
    if (user.status) {
      req.user = user.data;
      next();
    } else {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    
    
  });
};


module.exports = isAuthenticate;