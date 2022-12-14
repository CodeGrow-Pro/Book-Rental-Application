const express = require('express');
const bodyParser = require('body-parser')
const routers = require('./router/api/index')
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.get('/', (req, res) => {
    return res.status(200).send("Welcome to Book Rental Application Backend Development");
});
app.use('/bookRental/api', routers);
module.exports = app;