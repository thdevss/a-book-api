const express = require('express');
const app = express();
const PORT = process.env.PORT || 4111;
const passport = require('passport');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use('/book', require('./app/routes/bookRoute'));
app.use('/user', require('./app/routes/userRoute'));
app.use('/cart', require('./app/routes/cartRoute'));
app.use('/order', require('./app/routes/orderRoute'));

app.use('/payment', require('./app/routes/paymentRoute'));
app.use('/shipping', require('./app/routes/shippingRoute'));

app.use(passport.initialize());

app.listen(PORT, console.log("Server .. start for port: " + PORT))