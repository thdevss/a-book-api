const paymentModel = require('../models/paymentModel.js');


const getAllPayment = async (req, res) => {
    var result = await paymentModel.getAllPayment();
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
    getAllPayment
};