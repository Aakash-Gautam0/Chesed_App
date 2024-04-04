const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const jwtkey = 'dfffefe';


const userAuthentication = async (req, res, next) => {
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            const token = authorization.split(' ')[1];
            const decoded = jwt.verify(token, jwtkey);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Invalid token" })
        }
    }
}

module.exports = userAuthentication;