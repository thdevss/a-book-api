const express = require('express');
const { login, register, userInfo } = require('../controllers/userController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');

// get user's data
router.get('/', isAuthenticate, userInfo);

// login
router.post('/login', login);

// register
router.post('/register', register);

// get user's address
router.get('/address', isAuthenticate, userInfo);

// update user's address
router.post('/address', isAuthenticate, userInfo);

// get all order from user
router.get('/order', isAuthenticate, userInfo);


module.exports = router;