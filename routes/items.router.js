const express = require('express');
const router = express.Router();
const service = require('../BL/items.service');
const auth = require('../authorisation');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({
    limits: {
        fieldSize: 6 * 1024 * 1024, // 6MB in bytes
    },
});


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
router.put('/:id', auth.verifyToken, auth.verifyTokenAdmin, upload.single('image'), async (req, res) => {
    try {
        // console.log("req.body: ", req.body); // Should contain form data fields
        let item = await service.getItemByID(req.params.id);

        // בדיקה אם יש תמונה בבקשה
        if (req.body.image) {
            // שלה urlשל התמונה מתוך ה idחילוץ ה
            const publicId = item.image.split('/').pop().split('.')[0];

            // מחיקת התמונה הישנה מהענן
            await cloudinary.uploader.destroy('items_images/' + publicId);

            // העלאת התמונה לענן
            const result = await cloudinary.uploader.upload(req.body.image, {
                folder: 'items_images'
            });

            // עדכון הבאדי להיות עם קישור במקום בייס-64
            req.body.image = result.secure_url;
        }

        item = await service.updateSingleItem(req.params.id, req.body);
        res.send(item)
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
        let item = await service.deleteSingleItem(req.params.id);
        res.send(item);
    } catch (error) {
        res.status(error?.code || 500).send(error.msg || error || "something went wrong");;
    }
})


module.exports = router;