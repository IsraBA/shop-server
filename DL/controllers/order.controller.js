const orderModel = require('../models/order.model');

const read = async (filter = {}, options = {}) => {
    let query = orderModel.find(filter);
    if (options.populateItems) {
        query.populate({
            path: 'items.itemId'
        });
    }
    return await query.exec();
}

const readOne = async (filter) => {
    return await orderModel.findOne(filter).populate('items.itemId');
}

const create = async (data) => {
    return await orderModel.create(data);
};

const del = async (id) => {
    return await orderModel.deleteOne({ _id: id });
};

module.exports = { read, readOne, create, del };