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

app.use(bodyParser.json({ 
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({ 
    extended: false
}));

// enable cors
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// bind routes to express
app.use('/', indexRoute);
app.use('/product', productRoute);
app.use('/customer', customerRoute);
app.use('/order', orderRoute);

module.exports = app;