const orderModel = require('../models/orderModel.js');

const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");

const previewBeforeOrder = async (req, res) => {

    var result = await orderModel.previewBeforeOrder(req.user.id);
    if(result) {
        
        res.json({ 
            status: true,
            data: result.data
        });
        return;
    }

    res.status(401).json({
        status: false,
        data: {}
    })
}


module.exports =  {
    previewBeforeOrder
};