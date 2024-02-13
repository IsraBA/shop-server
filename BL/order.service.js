const orders = require('../DL/controllers/order.controller');
const itemsChack = require('../DL/controllers/item.controller')
const userController = require('../DL/controllers/user.controller');
const { default: mongoose } = require('mongoose');

const getOrders = async (filter, options) => {
    let order = await orders.read(filter, options);
    return order;
};

const getOrder = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) throw "Order ID not valid"
    let order = await orders.readOne({ _id: id });
    if (!order) throw { code: 404, msg: "Order not found" };
    return order;
};

const createOrder = async (newOrder) => {
    // :בדיקות
    // האם היוזר קיים
    if (!mongoose.Types.ObjectId.isValid(newOrder.userId)) throw "User ID not valid"
    let user = await userController.getUser({ _id: newOrder.userId })
    if (!user) throw { code: 404, msg: "user is not exist" };

    // האם קיימים מוצרים בהזמנה
    if (newOrder.items.length === 0) throw { code: 500, msg: "there are no items in the order" };

    // שלהם לא תקין idסינון המוצרים שהכמות שלהם היא 0 או שה 
    const updatedItems = newOrder.items.filter(
        item => item.amount > 0 && mongoose.Types.ObjectId.isValid(item.itemId)
    );

    // האם כל המוצרים בהזמנה קיימים
    const isExistItem = await updatedItems.every(async item => await itemsChack.getItem({ _id: item.itemId }));
    if (!isExistItem) throw { code: 404, msg: "one of the items or more not found" };

    // הפקת מחיר המוצר לרגע ההזמנה
    const finalItems = await Promise.all(
        updatedItems.map(async item => {
            return { ...item, price: await itemsChack.getItem({ _id: item.itemId }).then((res) => res.price) }
        })
    )

    // חישוב הסה"כ
    let tempTotal = 0;
    finalItems.forEach(item => tempTotal += item.price * item.amount);
    const total = tempTotal.toFixed(2);

    // יצירת ההזמנה בדטא בייס
    const finalOrder = {
        userId: newOrder.userId,
        items: finalItems,
        total: total
    };
    let order = await orders.create(finalOrder);
    // console.log('order: ', order);

    // עדכון היוזר במספר ההזמנה החדשה שלו
    const userToUpdate = await userController.updateUser(newOrder.userId,
        { orders: [...user.orders, order._id] });
    // console.log("The user who ordered the order: ",userToUpdate);

    // החזרת תשובה
    return "new order created successfully"
};

module.exports = { getOrders, getOrder, createOrder };

// async function starter() {
//     const db = require('../DL/database')
//     db.connect();
//     let newOrder = {
//         userId: '65b0edd3e58f4bc867091c2e',
//         items: [
//             {
//                 itemId: '65a7d5b3c99c9cc9651bf970',
//                 amount: 3
//             },
//             {
//                 itemId: '65a7d5b3c99c9cc9651bf963',
//                 amount: 2
//             },
//             {
//                 itemId: '65a7d5b3c99c9cc9651bf967',
//                 amount: 5
//             },
//         ],
//     }
//     try {
//         const order = await getOrders({items: {$elemMatch: {itemId: '65a7d5b3c99c9cc9651bf970'}}})
//         // const order = await createOrder(newOrder)
//         // .populate('userId')
//         // .populate('items.itemId')

//         console.log(order);
//     } catch (error) {
//         console.error(error || "something went wrong");
//     }

// }
// starter();