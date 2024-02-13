const mongoose = require('mongoose');
require('./item.model')
require('./user.model')

const orderSchema = new mongoose.Schema({
    orderDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true
    },
    items: [{
        itemId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "item",
            required: true
        },
        price: {
            type: Number
        },
        amount: {
            type: Number
        }
    }],
    total: {
        type: Number,
    },
})

const orderModel = mongoose.model('order', orderSchema);

// ?לא הבנתי איך הרף מקשר את המוצר או היוזר, מה התהליך

module.exports = orderModel;