const { default: mongoose } = require('mongoose');
const items = require('../DL/controllers/item.controller')
// #region get item/s with different filters
// הצגת כל המוצרים
// function getAllItems() {
//     return items.read({})
// }
// function getGTItems() {
//     return items.read({ price: { $gt: 25 } })
// }
// function getLTItems() {
//     return items.read({ price: { $lt: 2.3 } })
// }
// function getItemByID() {
//     return items.readOne({ _id: '65a7d5b3c99c9cc9651bf990' })
// }
// function getItemByBarcode() {
//     return items.readOne({ barcode: '04' })
// }
// function getItemByName() {
//     return items.read({ name: { $regex: /^c/i } })
// }
// function getCategory() {
//     return items.read({ category: 'fruits' })
// }
// function get2Category() {
//     return items.read({
//         $or: [
//             { category: "fruits" },
//             { category: "dairy" }
//         ]
//     })
// }
// function getItemByRange() {
//     return items.read({ price: { $gte: 1.5, $lte: 1.9 } })
// }
// function getItemPNG() {
//     return items.read({ image: { $regex: /\.png$/i } })
// }
// function getItemBerry() {
//     return items.read({ image: { $regex: /berry/i } })
// }
// function getItemEmoji() {
//     return items.read({
//         $and: [
//             { emoji: { $exists: true } },
//             { image: { $exists: false } }
//         ]
//     })
// }
// function getBerryOrMelon() {
//     return items.read({
//         $or: [
//             { name: { $regex: /berry/i } },
//             { name: { $regex: /melon/i } }
//         ]
//     })
// }
// function getItemLt2andNeAlcohol() {
//     return items.read({
//         $and: [
//             { price: { $lte: 1.99 } },
//             { category: { $ne: "alcohol" } }
//         ]
//     })
// }
// function getLtOrGt() {
//     return items.read({
//         $or: [
//             { price: { $lt: 1 } },
//             { price: { $gt: 20 } }
//         ]
//     })
// }
// function getItemNeFruOrVeg() {
//     return items.read({
//         $and: [
//             { category: { $nin: ["fruits", "vegetables"] } }
//         ]
//     })
// }
// function getItemGte10() {
//     return items.read({
//         name: { $regex: /.{10,}/ }
//     })
// }
// #endregion

// קבלת כל הקטגוריות
async function getCategories() {
    // [ 'alcohol', 'dairy', 'fruits', 'vegetables' ]
    let categories = await items.getAllCategories();
    return categories
}


// קבלת מוצרים לפי קטגוריה
async function getCategory(category) {
    return await items.getItems({ category });
}


// קבלת מוצרים לפי חיפוש
async function getItems(input) {
    const inputRgex = new RegExp(input, 'i')
    return await items.getItems({ name: { $regex: inputRgex } });
}


// ID הצגת מוצר על פי
async function getItemByID(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw "Item ID not valid"
    let item = await items.getItem({ _id: id });
    if (!item) throw { code: 404, msg: "Item not found" }
    return item;
}


// ID עדכון מוצר על פי
async function updateSingleItem(id, body) {
    // idבדיקה ל
    if (!mongoose.Types.ObjectId.isValid(id)) throw "id not valid"

    // בדיקה שהשם מוצר לא בשימוש כבר במערכת
    const { name } = body;
    const existingName = await items.getItem({ name });
    if (existingName && existingName._id.toString() !== id) {
        throw "Item name already exists in the system"
    }
    // בדיקה שברקוד המוצר לא בשימוש כבר במערכת
    const { barcode } = body;
    const existingBarcode = await items.getItem({ barcode });
    if (existingBarcode && existingBarcode._id.toString() !== id) {
        throw "Item barcode already exists in the system"
    }

    // בדיקה שהמחיר מעל 0
    const { price } = body;
    if (price <= 0) throw "Item price must be greater than 0"

    // חילוץ השדות הרלוונטים מהבאדי
    const { category, image } = body;
    let data = { name, barcode, category, image, price };
    // Object.fromEntries-בשביל לקבל אובייקט ולא מערך מערכים משתמשים ב
    const filterData = Object.fromEntries(Object.entries(data).filter(([key, value]) => {
        return value !== undefined && value !== null && value !== '';
    }));

    const item = await items.updateItem(id, filterData);
    console.log(item);
    if (!item) throw { code: 404, msg: "Item not to update found" }
    return item;
}


// הוספת מוצר
async function addItem(body) {
    // בדיקה שהשם מוצר לא בשימוש כבר במערכת
    const { name } = body;
    const existingName = await items.getItem({ name });
    if (existingName) {
        throw "Item name already exists in the system"
    }
    // בדיקה שברקוד המוצר לא בשימוש כבר במערכת
    const { barcode } = body;
    const existingBarcode = await items.getItem({ barcode });
    if (existingBarcode) {
        throw "Item barcode already exists in the system"
    }

    // בדיקה שהמחיר מעל 0
    const { price } = body;
    if (price <= 0) throw "Item price must be greater than 0"

    // חילוץ השדות הרלוונטים מהבאדי
    const { category, image } = body;
    const data = { name, barcode, category, image, price };

    const isDataValid = Object.values(data).every(value => {
        return value !== undefined && value !== null && value !== '';
    })
    if (!isDataValid) throw "All the values must be full"

    const item = await items.createItem(data);
    console.log(item);
    return item;
}


// מחיקת מוצר על פי ID
async function deleteSingleItem(id) {
    // idבדיקה ל
    if (!mongoose.Types.ObjectId.isValid(id)) throw "id not valid"

    const item = await items.deleteItem(id);
    if (!item) throw { code: 404, msg: "item to delete not found" };
    return item;
}

// #region
// // מחיקת מוצר על פי ID
// function deleteItem(id) {
//     let itemToDelete = items.findIndex(item => item.id == id);
//     let deleteditem = items[itemToDelete];
//     if (deleteditem) {
//         delete items[itemToDelete];
//     }
//     return deleteditem;
// }

// // עדכון מוצר על פי ID
// function updateItem(id, body) {
//     itemToUpdate = items.findIndex(item => item.id == id);
//     let updateditem = items[itemToUpdate];
//     if (updateditem) {
//         items[itemToUpdate] = { ...items[itemToUpdate], ...body };
//         updateditem = items[itemToUpdate];
//     }
//     return updateditem;
// }

// // הוספת מוצר
// function addItem(body) {
//     if (body.id) {
//         if (items.every(item => item.id !== body.id)) {
//             items.push(body);
//             return "Item added successfully"
//         }
//         else { return "ID is already in" }
//     }
//     else { return "ID is must be included in body" }
// }
// #endregion

module.exports = {
    getCategories,
    getCategory,
    getItems,
    getItemByID,
    deleteSingleItem,
    updateSingleItem,
    addItem
}
