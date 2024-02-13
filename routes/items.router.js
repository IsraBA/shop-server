const express = require('express');
const router = express.Router();
const service = require('../BL/items.service');
const auth = require('../authorisation');

// קבלת הקטגוריות
router.get('/categories', async (req, res) => {
    try {
        let categories = await service.getCategories();
        res.send(categories);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// קבלת מוצרים לפי קטגוריה
router.get('/:cat', async (req, res) => {
    try {
        let cat = req.params.cat;
        let items = await service.getCategory(cat);
        res.send(items);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// קבלת מוצרים לפי חיפוש
router.get('/search/:input', async (req, res) => {
    try {
        let input = req.params.input;
        let items = await service.getItems(input);
        res.send(items);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// הצגת מוצר
router.get('/singleItem/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let item = await service.getItemByID(id);
        res.send(item);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// עדכון מוצר
router.put('/:id', auth.verifyToken, auth.verifyTokenAdmin, async (req, res) => {
    try {
        await service.updateSingleItem(req.params.id, req.body);
        res.send("The item has been updated")
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");
    }
})

// הוספת מוצר
router.post('/', auth.verifyToken, auth.verifyTokenAdmin, async (req, res) => {
    try {
        let newItem = await service.addItem(req.body)
        res.send(newItem);
    } catch (error) {
        res.status(500).send(error || 'something went wrong')
    }
})

// מחיקת מוצר
router.delete('/:id', auth.verifyToken, auth.verifyTokenAdmin, async (req, res) => {
    try {
        let user = await service.deleteSingleItem(req.params.id);
        res.send(user)
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})


module.exports = router;