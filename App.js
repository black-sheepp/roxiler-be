const express = require('express');
const App = express();
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 8000;
const route = express.Router();
const db = require("./config/mongoose");
const bodyParser = require("body-parser");

App.use(express.json()); 
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extended: true }));

App.use("/", require("./routes"));

App.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
})