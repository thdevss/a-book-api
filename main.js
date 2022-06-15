const express = require('express');
const app = express();
const PORT = process.env.PORT || 4111;

app.use('/book', require('./app/routes/bookRoute'));

app.listen(PORT, console.log("Server .. start for port: " + PORT))