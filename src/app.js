'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();  
const router = express.Router();

// load models
const Product = require('./models/product'); 
const Customer = require('./models/customer'); 
const Order = require('./models/order'); 

// open mongodb connection
mongoose.connect(config.connectionString);

// load routes
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: false
}));

// bind routes to express
app.use('/', indexRoute);
app.use('/product', productRoute);
app.use('/customer', customerRoute);
app.use('/order', orderRoute);

module.exports = app;