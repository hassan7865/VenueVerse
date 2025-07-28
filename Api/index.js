const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const authRoute = require("./Routes/auth");
const postRoute = require("./Routes/post")
const cookieParser = require("cookie-parser")
const storageRoute = require("./Routes/storage")
const userRoute = require("./Routes/user")
const bookingRoute = require("./Routes/booking")
const productRoute = require("./Routes/product")
const orderAuth = require("./Routes/order")

const app = express()

app.use(cors({
    origin:"*"
}))

dotenv.config()
app.use(cookieParser());
app.use(express.json())

const connect = ()=>{
    mongoose.connect(process.env.MONGOURL)
    .then(()=>{
        console.log("DB Connected Successfully")
    })
    .catch((err)=>{
        throw err
    })
}

connect()
app.listen(process.env.PORT,()=>{
    console.log(`Server Started at PORT: ${process.env.PORT}`)

    
})


app.use("/api/auth",authRoute)
app.use("/api/storage",storageRoute)
app.use("/api/post",postRoute)
app.use("/api/user",userRoute)
app.use("/api/booking",bookingRoute)
app.use("/api/product",productRoute)
app.use("/api/order",orderAuth)

app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.log(err)
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
});
  
