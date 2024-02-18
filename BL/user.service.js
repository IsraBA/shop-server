const { default: mongoose } = require('mongoose');
const users = require('../DL/controllers/user.controller');
const bcrypt = require('bcrypt');

// הצגת כל המשתמשים
async function getUsersByFilter(filter, options) {
    return await users.getUsers(filter, options);
}


// ID הצגת משתמש על פי
async function getUserByID(id, options) {
    if (!mongoose.Types.ObjectId.isValid(id)) throw "User ID not valid"
    let user = await users.getUser({ _id: id }, options);
    if (!user) throw { code: 404, msg: "user not found" };
    return user;
}


// הצגת משתמש על פי אימייל
async function getUserByemail(email) {
    return await users.getUser({ email, isActive: true });
}


// ID עדכון משתמש על פי
async function updateSingleUser(id, body) {
    // idבדיקה ל
    if (!mongoose.Types.ObjectId.isValid(id)) throw "id not valid"

    // בדיקה שהאימייל לא בשימוש כבר במערכת
    const { email } = body;
    const existingUser = await users.getUser({ email });
    if (existingUser && existingUser._id.toString() !== id) {
        throw "Email already exists in the system"
    }

    // חילוץ השדות הרלוונטים מהבאדי
    const { fName, lName, password } = body;

    let data = { fName, lName, email, password };
    // Object.fromEntries-בשביל לקבל אובייקט ולא מערך מערכים משתמשים ב
    let filterData = Object.fromEntries(Object.entries(data).filter(([key, value]) => {
        return value !== undefined && value !== null && value !== '';
    }));

    // גיבוב הסיסמה למשהו אחר לאבטחה נוספת
    if (filterData.password) {
        const hashedPassword = await bcrypt.hash(filterData.password, 10);
        filterData = { ...filterData, password: hashedPassword }
    }

    const user = await users.updateUser(id, filterData);
    if (!user) throw { code: 404, msg: "user not found" };
    const updatedUser = await getUserByID(user._id, {});
    return updatedUser;
}


// הוספת משתמש
async function addUser(body) {
    // בדיקה שהאימייל לא בשימוש כבר במערכת
    const { email } = body;
    const existingUser = await users.getUser({ email, isActive: true });
    if (existingUser) {
        throw "Email already exists in the system"
    }

    // חילוץ השדות הרלוונטים מהבאדי
    const { fName, lName, password } = body;

    let data = { fName, lName, email, password };

    const isDataValid = Object.values(data).every(value => {
        return value !== undefined && value !== null && value !== '';
    })
    if (!isDataValid) throw "All the values must be full"

    // גיבוב הסיסמה למשהו אחר לאבטחה נוספת
    const hashedPassword = await bcrypt.hash(data.password, 10);

    data = { fName, lName, email, password: hashedPassword };

    return await users.createUser(data);
}


// מחיקת משתמש על פי ID
async function deleteSingleUser(id, password) {
    // מציאת היוזר
    const user = await getUserByID(id, {});
    if (!user) throw { code: 404, msg: "User to delete not found" };

    // בדיקת הסיסמה
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw { code: 401, msg: "Invalid password" };

    await users.deleteUser(id);
    return user;
}

module.exports = {
    getUsersByFilter,
    getUserByID,
    getUserByemail,
    deleteSingleUser,
    updateSingleUser,
    addUser
}