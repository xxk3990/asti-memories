const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require('cors');
const {
    expressjwt: jwt
} = require("express-jwt");
const process = require('process')
const router = require("./router");


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3001"
}, {
    origin: "https://www.astimemories.com"
}))
app.use(express.json());
router(app);

module.exports = app;