'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();  
const router = express.Router();

const Product = require('./models/product'); 
mongoose.connect('mongodb://nodestore:nodestore@ds058739.mlab.com:58739/nodestore');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: false
}));

const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

app.use('/', indexRoute);
app.use('/product', productRoute);
 
module.exports = app;