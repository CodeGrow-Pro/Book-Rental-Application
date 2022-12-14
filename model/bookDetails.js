const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    isbn: {
        type: String,
        unique: true,
        requied: true
    },
    createdAt: {
        type: String,
        default: () => {
            return Date.now();
        },
        immutable: true
    },
    updatedAt: {
        type: String,
        default: () => {
            return Date.now()
        }
    }
});
const bookModel = mongoose.model('books', bookSchema)
module.exports = bookModel;