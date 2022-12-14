const singleObj = (book) => {
    const date = parseInt(book.createdAt)
    return {
        BookName: book.name,
        Price: book.price,
        ISBNNO: book.isbn,
        Quantity: book.quantity,
        RegisterDate: new Date(date)
    }
}

module.exports = {
    singleObj
};