const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://test:1234@cluster0.onb7tvx.mongodb.net/israel?retryWrites=true&w=majority'

async function connect() {
    // connect : msg
    try {
        await mongoose.connect(MONGO_URL)
        console.log("DB - connection succeeded")
    } catch (error) {
        console.log("MongoDB Error: ", error);
    }
}

module.exports = {connect}
// connect() 
