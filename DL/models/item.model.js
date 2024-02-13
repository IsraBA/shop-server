const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    category:{
        type:String,
        required : true
    },
    name : {
        type:String,
        required:true
    },
    emoji : {
        type:String,
    },
    image : {
        type:String,
    },
    price : {
        type:Number,
    },
    barcode: {
        type:String,
        unique : true,
        required:true
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

const itemModel = mongoose.model('item', itemSchema);

module.exports = itemModel;