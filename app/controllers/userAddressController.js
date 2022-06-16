const userModel = require('../models/userModel.js');
const userAddressModel = require('../models/userAddressModel.js');

const jwt = require('jsonwebtoken');
const config = require("../configs/auth.config.js");


const getUserAddress = async (req, res) => {
    console.log(req.user)
    var user = await userModel.get(req.user.id);
    if(user) {
        var userAddress = await userAddressModel.getAllAddress(req.user.id);
        res.json({ 
            status: true,
            data: {
                user: user,
                address: userAddress
            }
        });
        return;
    }

    res.status(401).json({
        status: false,
        data: []
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