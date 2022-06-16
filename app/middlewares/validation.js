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


module.exports = {
    registerValidation,
    loginValidation
};
