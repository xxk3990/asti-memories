const express = require('express');
const cookieParser = require("cookie-parser")
const cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");
const process = require('process')
const router = require("./router");
const server = require("./server")


const app = express();
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3001", credentials:true}))
app.use(express.json());

server.startServer(app);

module.exports = app;

