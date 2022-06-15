const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");

const login = async (req, res) => {

    var user = await userModel.login(req.body.email, req.body.password);
    console.log(user)
    if(user.id) {
        let payload = { id: user.id };
        let token = jwt.sign(payload, config.secret);
        res.json({ 
            status: true,
            token: token
        });
        return;
    }

    res.status(401).json({
        status: false,
        token: ''
    })
}

const userInfo = async (req, res) => {
    console.log(req.user)
    var user = await userModel.get(req.user.id);
    if(user) {
        res.json({ 
            status: true,
            data: user
        });
        return;
    }

    res.status(401).json({
        status: false,
        data: []
    })
}

const register = async (req, res) => {

}
module.exports =  {
    login,
    register,
    userInfo
};