require('dotenv').config();
const express = require('express');
const auth = require('./authorisation');
const cloudinary = require('cloudinary').v2;
const app = express();

const db = require('./DL/database')
db.connect();

const cors = require('cors');
app.use(cors());
app.use(express.json());

// Cloudinary הגדרת
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


app.post('/login', async (req, res) => {
    try {
        const token = await auth.login(req.body);
        res.send(token);
    } catch (error) {
        console.error(error);
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

const userRouter = require('./routes/user.router');
app.use('/user', userRouter);
const itemRouter = require('./routes/items.router');
app.use('/item', itemRouter);
const orderRouter = require('./routes/order.router');
app.use('/order', orderRouter);


app.listen(2500, () => console.log("****server is listening on 2500****"));