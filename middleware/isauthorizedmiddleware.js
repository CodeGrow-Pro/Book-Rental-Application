const key = require('../configs/authkey')
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    const token = req.headers.authkey
    if (!token) {
        return res.status(404).send({
            message: "token not found!",
            success: false
        })
    }
    jwt.verify(token, key.authKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized User!",
                success: false
            })
        }
        req.userId = decoded.userId
        next()
    })
}