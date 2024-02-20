// getting-started.js
const mongoose = require("mongoose");
const dotenv = require('dotenv').config()

main().catch((err) => console.log(err));

async function main() {
     await mongoose.connect(process.env.MONGODB_URL);
     console.log("MongoDB database connected");
     // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}