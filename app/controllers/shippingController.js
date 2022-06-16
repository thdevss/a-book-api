const shippingModel = require('../models/shippingModel.js');


const getAllShipping = async (req, res) => {
    var result = await shippingModel.getAllShipping();
    if(result.status) {
        
        res.json({ 
            status: true,
            message: result.message,
            data: result.data
        });
        return;
    }

    res.status(200).json({
        status: false,
        message: result.message,
        data: {}
    })
}


module.exports =  {
    getAllShipping
};