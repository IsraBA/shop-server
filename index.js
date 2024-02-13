require('dotenv').config();
const express = require('express');
const auth = require('./authorisation')
const app = express();

const db = require('./DL/database')
db.connect();

const cors = require('cors');
app.use(cors());
app.use(express.json());

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


app.listen(2500, () => console.log("****server is listening on 2500****"))

// if (time == "16:50") {
//     teachImportantStuff();
// }

// " בנימין טק Full Stack #8 קורס "  