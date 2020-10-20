const express = require('express');
const { auth } = require('../middleware/auth');
const { getAllMedia, filterMedia, deleteMedia } = require('../models/kalturaClient');
const router = new express.Router();

router.get('/media', auth, async (req, res) => {
    try {
        const data = await getAllMedia();
        res.send(data);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

router.get('/media/filter', auth, async (req, res) => {
    try {
        const data = await filterMedia(req.query.q, req.query.soryByCreationDate, req.query.page);
        res.send(data);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

router.delete('/media', auth, async (req, res) => {
    try {
        //Get userEmail from auth 
        await deleteMedia(req.body.id, req.userEmail);
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
})

module.exports = router;