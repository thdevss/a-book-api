const orderModel = require('../models/orderModel.js');
const {validationResult} = require('express-validator');

const previewBeforeOrder = async (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `input not valid`,
            data: errors.array()
        });
    }
    

    var result = await orderModel.previewBeforeOrder(req.user.id, req.query.address_id, req.query.shipping_id, req.query.payment_id);
    if(result.status) {
        
        res.json({ 
            success: true,
            message: result.message,
            data: result.data
        });
        return;
    }
    console.log(result)
    res.status(200).json({
        success: false,
        message: result.message,
        data: {}
    })
}


const createNewOrder = async (req, res) => {


    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: `input not valid`,
            data: errors.array()
        });
    }
    


    var result = await orderModel.createNewOrder(req.user.id, req.body.address_id, req.body.shipping_id, req.body.payment_id);
    if(result.status) {
        
        res.json({ 
            success: true,
            message: result.message,
            id: result.id
        });
        return;
    }
    console.log(result)

    res.status(200).json({
        success: false,
        message: result.message,
        id: 0
    })
}


const getOneOrder = async (req, res) => {

    var result = await orderModel.getOneOrder(req.user.id, req.params.orderId);
    if(result.status) {
        
        res.json({ 
            success: true,
            message: result.message,
            data: result.data
        });
        return;
    }


    res.status(404).json({
        success: false,
        message: result.message,
        data: {}
    })
}
module.exports =  {
    previewBeforeOrder,
    createNewOrder,
    getOneOrder
};