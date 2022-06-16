const express = require('express');
const userController = require('../controllers/userController');
const userAddressController = require('../controllers/userAddressController');

const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get user's data
router.get('/', isAuthenticate, userController.userInfo);

// login
router.post('/login', userController.login);

// register
router.post('/register', userController.register);

// get user's all address
router.get('/address', isAuthenticate, userAddressController.getUserAddress);

// update user's some address
router.post('/address', isAuthenticate, userAddressController.addNewAddress);
router.put('/address/:addressId', isAuthenticate, userAddressController.getUserAddress);
router.delete('/address/:addressId', isAuthenticate, userAddressController.getUserAddress);


// get all order from user
router.get('/order', isAuthenticate, userController.userInfo);


module.exports = router;