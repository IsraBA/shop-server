const userModel = require('../models/user.model');

const getUsers = async (filter = {}, options = {}) => {
    let query = userModel.find({ ...filter, isActive: true });
    if (options.populateOrders) {
        query.populate({
            path: 'orders',
            populate: options.populateItems ? { path: 'items.itemId' } : null
        });
    }
    return await query.exec();
}

const getUser = async (filter = {}, options = {}) => {
    let query = userModel.findOne(filter);
    if (options.populateOrders) {
        query.populate({
            path: 'orders',
            populate: options.populateItems ? { path: 'items.itemId' } : null
        });
    }
    return await query.exec();
}

const updateUser = async (id, data) => {
    return await userModel.findByIdAndUpdate({ _id: id }, { $set: data });
};

const createUser = async (data) => {
    return await userModel.create(data);
};

const deleteUser = async (id) => {
    return await userModel.findByIdAndUpdate({ _id: id }, { isActive: false });
};

module.exports = { getUsers, getUser, updateUser, createUser, deleteUser };