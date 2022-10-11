const { validationResult } = require('express-validator');
const commonMiddle = {}

commonMiddle.checkRequestBody = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log('checkRequestBody', errors.array())
        res.status(400).json({ status: 'error', message: errors.array()[0].msg });
        return;
    }
    next();
};

commonMiddle.checkParamsId = (req, res, next) => {
    if (!req.params.id) {
        res.status(400).json({ status: 'error', message: 'id is required' });
        return;
    }
    next();
}

module.exports = commonMiddle;