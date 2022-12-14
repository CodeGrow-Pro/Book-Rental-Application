const userModels = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const converter = require('../converter/multiObjconverter');
const key = require('../configs/authkey')
const userModel = require('../model/user.model');
let id = Math.random() * 10000
exports.regester = async (req, res) => {
    if (!filedChecks(req.body)) {
        return res.status(404).send({
            message: "some information needed please fill it!",
            success: false
        });
    }
    const data = {
        name: req.body.name,
        id: id,
        userType: req.body.userType,
        haveBooks: req.body.haveBooks,
        email: req.body.email
    }

    data.password = bcrypt.hashSync(req.body.password, 10);

    try {
        const user = await userModels.create(data);
        return res.status(201).send({
            message: "Register Successfully",
            success: true
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!",
            success: false
        })
    }

}

function filedChecks(filedObj) {
    if (!filedObj.name || !filedObj.password || !filedObj.userType || !filedObj.email) {
        return false
    }
    return true;
}

exports.login = async (req, res) => {
    if (!req.body.email) {
        return res.status(404).send({
            message: "Email is required!",
            success: false
        });
    }
    try {
        const find = await userModels.findOne({
            email: req.body.email
        });
        if (find.password !== req.body.password) {
            return res.status(401).send({
                message: "Password incorrect!",
                success: false
            })
        }
        return res.status(201).send({
            message: "Login successfully...!",
            success: true
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!",
            success: false
        })
    }
}

exports.strongLogin = async (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    try {
        const finded = await userModel.findOne({
            email: email
        });
        if (!finded) {
            return res.status(401).send({
                message: "Invalied Email ID!",
                success: false
            })
        }
        const isValied = bcrypt.compareSync(pass, finded.password);
        if (!isValied) {
            return res.status(401).send({
                message: 'Invalied Password!',
                success: false
            })
        }
        const payload = {
            userId: finded.id
        }
        const makeToken = jwt.sign(payload, key.authKey, {
            expiresIn: '1d'
        })
        return res.status(200).send({
            message: "you are login successfully!",
            success: true,
            userDetails: {
                userID: finded.id,
                email: finded.email,
                AccessToken: makeToken
            }
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!"
        })
    }
}
exports.searchUser = async (req, res) => {
    const find = {}
    if (req.query.name) {
        find.name = req.query.name
    }
    if (req.query.userId) {
        find.id = req.query.userId
    }
    if (req.query.email) {
        find.email = req.query.email
    }
    if (req.query.type) {
        find.userType = req.query.type
    }
    try {
        const finded = await userModel.find(find);
        return res.status(201).send({
            message: "user find successfully!",
            success: true,
            userSummary: converter.userConverter(finded)
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Internal server error!",
            success: false
        })
    }
}