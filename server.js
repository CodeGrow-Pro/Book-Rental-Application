const mongoose = require('mongoose');
const app = require('./index');
const Port = 8080;
mongoose.connect('mongodb://localhost/BookRentalDB',{family:4},(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log("Our DataBase connected successfully");
        app.listen(Port , ()=>{
            console.log("our server start at port : ", Port);
        })
    }
})