const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const isAuthenticate = require('../middlewares/authenticate');
const { orderValidation } = require('../middlewares/validation');

// preview order before save
router.get('/', [ isAuthenticate, orderValidation ], orderController.previewBeforeOrder);

// // save master-detail order
router.post('/', [ isAuthenticate, orderValidation ], orderController.createNewOrder);

// // get order detail by id [for create user only]
router.get('/:orderId', isAuthenticate, orderController.getOneOrder);

// // save payment detail for this order [for create user only]
// router.get('/:orderId/payment', isAuthenticate, bookDetail);


module.exports = router;