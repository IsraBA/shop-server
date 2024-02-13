const itemModel = require('../models/item.model');

const getAllCategories = async () => {
    try {
        const categories = await itemModel.distinct('category');
        return categories;
    } catch (error) {
        console.error('Error retrieving categories:', error);
        throw error;
    }
};

const getItems = async (filter = {}) => {
    return await itemModel.find({ ...filter, isActive: true });
}

const getItem = async (filter) => {
    return await itemModel.findOne(filter).catch(err => { console.log(err); });
}

const updateItem = async (id, data) => {
    return await itemModel.findByIdAndUpdate({ _id: id }, { $set: data });
};

const createItem = async (data) => {
    return await itemModel.create(data);
};

const deleteItem = async (id) => {
    return await itemModel.findByIdAndUpdate({ _id: id }, { isActive: false });
};

// const updateItemsCategory = async (oldCategory, newCategory) => {
//     try {
//         const updateResult = await itemModel.updateMany(
//             { category: oldCategory },
//             { $set: { category: newCategory } }
//         );
//     } catch (error) {
//         console.error('Error updating items:', error);
//         throw error;
//     }
// };


module.exports = { getAllCategories, getItems, getItem, updateItem, createItem, deleteItem };