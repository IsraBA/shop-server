const jwt = require('jsonwebtoken');
const userService = require('./BL/user.service');
const bcrypt = require('bcrypt');
const SECRET = process.env.SECRET

async function login(body) {
    const { email, password } = body;

    // מציאת היוזר לפי האימייל וזריקת שגיאה אם לא נמצא
    let user = await userService.getUserByemail(email);
    if (!user) throw { code: 401, msg: "Invalid email or password" };

    // בדיקת הסיסמה
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw { code: 401, msg: "Invalid email or password" };

    //                             הגדרת ההרשאות של המשתמש על פי מה שמוזן לו
    const data = { email, password, premission: user.premission, userId: user._id }

    // יצירת טוקן למשתמש
    const token = jwt.sign(data, SECRET, { expiresIn: "1d" })
    return token;
}

function verifyToken(req, res, next) {
    try {
        const originalToken = req.headers.authorization;
        if (!originalToken) throw "Unauthorized";

        const token = originalToken.replace("Bearer ", "");
        let user = jwt.verify(token, SECRET);
        req.body.user = user;
        next();
    } catch (error) {
        res.status(401).send(error.msg || "Unauthorized");
    }
}

function verifyTokenAdmin(req, res, next) {
    if (req.body?.user.premission == "admin") { next() }
    else { res.status(401).send("Unauthorized") }
}

module.exports = { login, verifyToken, verifyTokenAdmin }