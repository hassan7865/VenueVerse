const mongoose = require("mongoose")

const OtpSchema = new mongoose.Schema({
    Email : {type:String,required:true},
    Code : {type:Number,required:true},
    IsUsed : {type:Boolean,required:true,default:false},
    CreatedOn: { type: Date, required: true, default: Date.now } 
})

module.exports = mongoose.model("OTP",OtpSchema)