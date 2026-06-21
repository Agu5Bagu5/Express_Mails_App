const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.DB_URL;
mongoose.connect(url).then(console.log("db connected"));

module.exports;
