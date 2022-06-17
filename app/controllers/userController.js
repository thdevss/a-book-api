const userModel = require('../models/userModel.js');
const {validationResult} = require('express-validator');


const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");

const login = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `input not valid`,
            data: errors.array()
        });
    }

    var result = await userModel.login(req.body.email, req.body.password);
    console.log(result)
    if(result.status) {
        let payload = { id: result.data.id };
        let token = jwt.sign(payload, config.secret);
        res.json({ 
            success: true,
            message: result.message,
            token: token
        });
        return;
    }

    res.status(401).json({
        success: false,
        message: result.message,
        token: ''
    })
}

const userInfo = async (req, res) => {

    var result = await userModel.getOneUser(req.user.id);
    if(result.status) {
        res.json({ 
            success: true,
            data: result.data
        });
        return;
    }

    res.status(401).json({
        success: false,
        message: user.message,
        data: {}
    })
}

const register = async (req, res) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `input not valid`,
            data: errors.array()
        });
    }

    var result = await userModel.register(req.body.email, req.body.password, req.body.first_name, req.body.last_name, req.body.phone_number);
    if(result.status) {
        res.json({ 
            success: true,
            message: `registered succeed`,
        });
        return;
    }

    res.status(401).json({
        success: false,
        message: result.message,
    })
}




module.exports =  {
    login,
    register,
    userInfo
};