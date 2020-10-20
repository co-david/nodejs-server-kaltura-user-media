const express = require('express');
const { generateAuthToken } = require('../middleware/auth');
const { login } = require('../models/kalturaClient');
const router = new express.Router();

router.post('/users/login', async (req, res) => {
    try {
        const data = await login(req.body.email, req.body.password);
        const token = generateAuthToken(req.body.email);

        res.send({ data, token });
    } catch (error) {
        res.status(400).send({ error: error.message }); //Return http status 400 (Bad Request)
    }
})

module.exports = router;