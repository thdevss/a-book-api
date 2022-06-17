const userModel = require('../models/userModel.js');
const userAddressModel = require('../models/userAddressModel.js');

const getUserAddress = async (req, res) => {

    var user = await userModel.getOneUser(req.user.id);
    if(user) {
        var userAddress = await userAddressModel.getAllAddress(req.user.id);
        res.json({ 
            success: true,
            data: {
                user: user.data,
                address: userAddress
            }
        });
        return;
    }

    res.status(401).json({
        success: false,
        data: {}
    })
}

const addNewAddress = async (req, res) => {
    var isDefault = (parseInt(req.body.is_default))

    var result = await userAddressModel.addNewAddress(
        req.user.id,
        req.body.address_1,
        req.body.address_2,
        req.body.address_sub_district,
        req.body.address_district,
        req.body.address_province,
        req.body.address_postel_code,
        req.body.address_country,
        isDefault
    )

    res.json({
        status: result.status,
        message: result.message,
        data: (await userAddressModel.getOneAddress(result.id, req.user.id))
    })
}

 


module.exports =  {
    addNewAddress,
    getUserAddress
};