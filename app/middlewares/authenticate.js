const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config.js");
const userModel = require('../models/userModel.js');

const isAuthenticate = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token provided!"
    });
  }
  token = token.split(" ");
  if(token.length != 2) {
    return res.status(403).send({
      success: false,
      message: "Token invalid!"
    });
  }
  token = token[1];

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized!"
      });
    }

    let user = await userModel.getOneUser(decoded.id);
    if (user.status) {
      req.user = user.data;
      next();
    } else {
      return res.status(401).send({
        success: false,
        message: "Unauthorized!"
      });
    }
    
    
  });
};


module.exports = isAuthenticate;