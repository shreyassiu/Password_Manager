const mongoose = require('mongoose');
const dotenv = require('dotenv');

const mongo_url = process.env.MONGO_URI;

mongoose.connect(mongo_url).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB", err);
})