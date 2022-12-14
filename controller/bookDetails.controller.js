const convert = require('../converter/multiObjconverter')
const singleConvert = require('../converter/singleObjconverter');
const bookModel = require('../model/bookDetails');

exports.bookRegister = async (req, res) => {
    const data = req.body;
    if (!data.name || !data.price || !data.isbn) {
        return res.status(404).send({
            message: "Your are not provide Required details!",
            success: false
        })
    }
    try {
        const createdata = {
            name: data.name,
            price: data.price,
            isbn: data.isbn
        }
        const saved = await bookModel.create(createdata);
        return res.status(200).send({
            message: "book register successfully",
            bookSummary: saved
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Internal server error ! Please try after some time.",
            success: false
        })
    }
}
// exports.bookRegister = async (req,res)=>{
//     const data = {
//         name:req.body.name,
//         price:req.body.price,
//         isbn:req.body.isbn,
//     }
//     if(!req.body.name){
//         return res.status(404).send({
//             message:"Book name not found!",
//             success:false
//         })
//     }
//     if(!req.body.price){
//         return res.status(404).send({
//             message:"Book price not found!",
//             success:false
//         })
//     }
//     if(!req.body.isbn){
//         return res.status(404).send({
//             message:"Book isbn not found!",
//             success:false
//         })
//     }
//     try {
//         const created = await booksModel.create(data);
//             return res.status(201).send({
//                 message:"Book register successfully",
//                 success:true,
//                 BookSummary:singleConvert.singleObj(created)
//             })
//     }catch(err){
//         console.log(err.message)
//             return res.status(500).send({
//                 message:"Internal error !",
//                 success:false
//             })
//     }
// }

exports.findAllbooksorByisbn = async (req, res) => {
    const find = {};
    const isbn = req.query.isbn
    const bookname = req.query.name
    const id = req.query.id;
    if (isbn) {
        find.isbn = req.query.isbn
    }
    if (bookname) {
        find.name = bookname
    }
    if (id) {
        find._id = id;
    }
    try {
        const finded = await bookModel.find(find);
        return res.status(201).send(finded);
    } catch (error) {
        console.log(error.send)
        return res.status(500).send({
            message: "Internal server error ! please try after some time!",
            success: false
        })
    }
}