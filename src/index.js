const express = require('express');
const userRouter = require('./router/user');
const mediaRouter = require('./router/media');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use((req, res, next) => {
    //Allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    //Request headers to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    //Request methods to allow
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    next();
})

//Parse every requesy body to json
app.use(express.json());

//Add user routes
app.use(userRouter);

//Add media routes
app.use(mediaRouter);

app.listen(port, () => {
    console.log('Server is up on poot' + port);
})