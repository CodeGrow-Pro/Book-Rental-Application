const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    id:{
         type:Number,
        require:true
    },
        name:{
            type:String,
            required :true
        },
        password : {
            type:String,
            unique:true,
            required:true
        },
        email:{
          type:String,
          unique:true,
         required:true
        },
        haveBooks:{
            type:[mongoose.SchemaTypes.ObjectId],
            ref:'books'
        },
        userType:{
          type:String,
          required:true,
          default:"customer"
        },
        createdAt:{
            type:String,
            default:()=>{
                return Date.now();
            },
            immutable:true
        },
        updateAt:{
           type:String,
           default:()=>{
            return Date.now();
           }
        }
})
const userModel = mongoose.model('user',userSchema);
module.exports = userModel;