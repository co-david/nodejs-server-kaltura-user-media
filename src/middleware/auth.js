const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer', ''); // Get token from header request
        const decoded = jwt.verify(token, process.env.API_TOKEN_SECRET); // Verify token

        req.userEmail = decoded.email;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
}

const generateAuthToken = email => jwt.sign({ email }, process.env.API_TOKEN_SECRET);

module.exports = {
    auth,
    generateAuthToken
}