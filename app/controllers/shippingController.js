const shippingModel = require('../models/shippingModel.js');


const getAllShipping = async (req, res) => {
    var result = await shippingModel.getAllShipping();
    if(result.status) {
        
        res.json({ 
            success: true,
            message: result.message,
            data: result.data
        });
        return;
    }

    res.status(200).json({
        success: false,
        message: result.message,
        data: {}
    })
}


module.exports =  {
    getAllShipping
};