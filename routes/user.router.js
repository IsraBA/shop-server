// ייבוא האקספרס
const express = require('express');
// הגדרת הראוטר בתוך האקספרס
const router = express.Router();
// ייבוא השירותים
const service = require('../BL/user.service');
// ייבוא ההזדהות
const auth = require('../authorisation');

// הצגת כל המשתמשים
router.get('/', auth.verifyToken, auth.verifyTokenAdmin, async (req, res) => {
    try {
        const { populateOrders, populateItems } = req.query;
        let users = await service.getUsersByFilter({}, {
            populateOrders: populateOrders && JSON.parse(populateOrders),
            populateItems: populateItems && JSON.parse(populateItems),
        })
        res.send(users);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// ID הצגת משתמש על פי
router.get('/user', auth.verifyToken, async (req, res) => {
    try {
        const userId = req.body.user.userId;
        if (req.body.user.premission == "admin" || req.body.user.userId == userId) {
            const { populateOrders, populateItems } = req.query;
            let singleUser = await service.getUserByID(userId, {
                populateOrders: populateOrders && JSON.parse(populateOrders),
                populateItems: populateItems && JSON.parse(populateItems),
            });
            res.send(singleUser);
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה להציג נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to see this user");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})

// עדכון משתמש
router.put('/:id', auth.verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.body.user.premission == "admin" || req.body.user.userId == userId) {
            await service.updateSingleUser(userId, req.body);
            res.send("The user has been updated")
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה לעדכן נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to update this user");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})

// הוספת משתמש
router.post('/', async (req, res) => {
    try {
        let newUser = await service.addUser(req.body)
        res.send(newUser);
    } catch (error) {
        res.status(500).send(error || 'something went wrong')
    }
})

// מחיקת משתמש
router.delete('/:id', auth.verifyToken, async (req, res) => {
    try {
        const userId = req.params.id;
        if (req.body.user.premission == "admin" || req.body.user.userId == userId) {
            let user = await service.deleteSingleUser(userId);
            res.send(user);
        } else {
            // אם זה לא המשתמש עצמו או האדמין שמנסה למחוק נזרקת שגיאה
            res.status(403).send("Forbidden: You do not have permission to delete this user");
        }
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})

// ייצוא הראוטר
module.exports = router;

// הצגת משתמש על פי אימייל
// router.get('/email/:email', async (req, res) => {
//     try {
//         let singleUser = await service.getUserByemail(req.params.email);
//         res.send(singleUser);
//     } catch (error) {
//         res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
//     }
// })