const userModel = require('../model/user.model');
const bookModel = require('../model/bookDetails')
exports.bootRentTocustomer = async (req, res) => {
    const id = req.body.userId;
    const isbn = req.body.isbn
    let user
    try {
        user = await userModel.findOne({
            id: id
        });
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Intarnal server error!",
            success: false
        })
    }
    try {
        const book = await bookModel.findOne({
            isbn: isbn
        });
        console.log(book)
        if (user.haveBools) {
            user.haveBools.push(book._id);
        } else {
            user.haveBools = [book._id]
        }
        console.log(user)
        await user.save()
        return res.status(201).send({
            message: "book rent successfully!",
            success: true
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send({
            message: "Intarnal server error!",
            success: false
        })
    }
}