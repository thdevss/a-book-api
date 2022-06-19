const {body, checkSchema, validationResult} = require('express-validator');
const userModel = require('../models/userModel.js');


const registerValidation = checkSchema({
    password: {
        notEmpty: true,
        errorMessage: "password cannot be empty"
    },
    phone_number: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
    first_name: {
        notEmpty: true,
        errorMessage: "First name cannot be empty"
    },
    last_name: {
        notEmpty: true,
        errorMessage: "Last name cannot be empty"
    },
    email: {
        notEmpty: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                if(await userModel.hasEmail(value)) {
                    return Promise.reject('Email address already taken')
                }
            }
        }
    }
});


const loginValidation = checkSchema({
    password: {
        notEmpty: true,
        errorMessage: "password cannot be empty"
    },
    email: {
        notEmpty: true,
        normalizeEmail: true,
        custom: {
            options: async (value) => {
                if(!await userModel.hasEmail(value)) {
                    return Promise.reject('Email address not found')
                }
            }
        }
    }
});

const addToCartValidation = checkSchema({
    book_id: {
        notEmpty: true,
        isNumeric: true
    },
    quantity: {
        notEmpty: true,
        isNumeric: true
    }
});

const orderValidation = checkSchema({
    payment_id: {
        isInt: true,
        notEmpty: false,
        optional: true
    },
    shipping_id: {
        isInt: true,
        notEmpty: false,
        optional: true
    },
    address_id: {
        isInt: true,
        notEmpty: false,
        optional: true
    }
});


const ratingValidation = checkSchema({
    ratingScore: {
        isInt: {
            min: 1,
            max: 5
        },
        notEmpty: true,

    }
});

const addressValidation = checkSchema({
    address_1: {
        notEmpty: true,
    },
    address_sub_district: {
        notEmpty: true,
    },
    address_district: {
        notEmpty: true,
    },
    address_province: {
        notEmpty: true,
    },
    address_postel_code: {
        notEmpty: true,
    },
    address_country: {
        notEmpty: true,
    },
});


module.exports = {
    registerValidation,
    loginValidation,
    addToCartValidation,
    orderValidation,
    ratingValidation,
    addressValidation
};
