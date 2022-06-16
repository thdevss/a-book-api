const orderModel = require('../models/orderModel.js');



const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");

const previewBeforeOrder = async (req, res) => {

    var result = await orderModel.previewBeforeOrder(req.user.id, req.query.address_id, req.query.shipping_id, req.query.payment_id);
    if(result.status) {
        
        res.json({ 
            status: true,
            message: result.message,
            data: result.data
        });
        return;
    }
    console.log(result)
    res.status(200).json({
        status: false,
        message: result.message,
        data: {}
    })
}


const createNewOrder = async (req, res) => {

    var result = await orderModel.createNewOrder(req.user.id, req.body.address_id, req.body.shipping_id, req.body.payment_id);
    if(result.status) {
        
        res.json({ 
            status: true,
            message: result.message,
            id: result.id
        });
        return;
    }
    console.log(result)

    res.status(200).json({
        status: false,
        message: result.message,
        id: 0
    })
}


const getOneOrder = async (req, res) => {

    var result = await orderModel.getOneOrder(req.user.id, req.params.orderId);
    if(result.status) {
        
        res.json({ 
            status: true,
            message: result.message,
            data: result.data
        });
        return;
    }


    res.status(404).json({
        status: false,
        message: result.message,
        data: {}
    })
}
module.exports =  {
    previewBeforeOrder,
    createNewOrder,
    getOneOrder
};