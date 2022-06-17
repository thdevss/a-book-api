const paymentModel = require('../models/paymentModel.js');


const getAllPayment = async (req, res) => {
    var result = await paymentModel.getAllPayment();
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
    getAllPayment
};