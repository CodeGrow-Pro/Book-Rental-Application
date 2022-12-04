const  Multiconverter = (books)=>{
    const send = [];
    books.forEach(book => {
        const date = parseInt(book.createdAt)
        send.push({
            BookName:book.name,
            Price:book.price,
            ISBNNO : book.isbn,
            Quantity:book.quantity,
           RegisterDate:new Date(date)
        })
    });
    return send;
}
const  userConverter = (user)=>{
    const send = [];
    user.forEach(u=>{
        send.push({
            username:u.name,
            userId:u.id,
            email:u.email,
            userType:u.userType,
            HaveBooks:u.haveBools
        })
    })
    return send;
}
module.exports = {Multiconverter,userConverter}