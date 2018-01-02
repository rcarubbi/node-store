'use-strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');

exports.getByCustomer = async (customer) => {
    const res = await Order.find({ customer: customer}, 'number status createDate customer items')
        .populate('customer', 'name')
        .populate('items.product', 'title');
    return res;
}

exports.create = async (data) => {
    var order = new Order(data);
    await order.save();
}
