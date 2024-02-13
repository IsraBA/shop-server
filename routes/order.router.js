const express = require('express');
const router = express.Router();
const service = require('../BL/order.service');
const auth = require('../authorisation');

// הצגת כל ההזמנות
router.get('/', auth.verifyToken, auth.verifyTokenAdmin, async (req, res) => {
    try {
        const { populateItems } = req.query;
        let orders = await service.getOrders({}, {
            populateItems: populateItems && JSON.parse(populateItems),
        })
        res.send(orders);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// הצגת כל ההזמנות של משתמש מסויים
router.get('/user/:id', auth.verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.body.user.premission == "admin" || req.body.user.userId == userId) {
            const { populateItems } = req.query;
            let userOrders = await service.getOrders({ userId }, {
                populateItems: populateItems && JSON.parse(populateItems),
            });
            res.send(userOrders);
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה לראות את ההזמנות שלו נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to see this orders");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// ID הצגת הזמנה על פי
router.get('/:id', auth.verifyToken, async (req, res) => {
    try {
        const orderId = req.params.id;
        let order = await service.getOrder(orderId);
        if (req.body.user.premission == "admin" || req.body.user.userId == order.userId) {
            res.send(order);
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה לראות את ההזמנה שלו נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to see this order");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})


// יצירת הזמנה
router.post('/', auth.verifyToken, async (req, res) => {
    try {
        if (req.body.user.premission == "admin" || req.body.user.userId == req.body.userId) {
            let neworder = await service.createOrder(req.body);
            res.send(neworder);
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה לראות את ההזמנה שלו נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to make this order");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})

// ייצוא הראוטר
module.exports = router;