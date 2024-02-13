const mongoose = require('mongoose');
require('./order.model')

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        // select: false,
        required: true
    },
    image: {
        type: String,
    },
    orders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "order",
    }],
    createTime: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    premission: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    }
})

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;