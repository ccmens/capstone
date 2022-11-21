const itemModel = require('../models/item.model')
const { check } = require('express-validator');
const config = require('../config');
const multer = require("multer");

const itemMiddle = {}

itemMiddle.upload = multer({
    // dest: "/public/upload/new",
    limits: {
        fileSize: config.upload.fileSize,
    }
});

itemMiddle.valid_item = [
    check('item_name').isLength({ min: 2, max: 30 }).withMessage('Name is required'),
    //check('category').isLength({ min: 2, max: 30 }).withMessage('Product is required'),
    check('price').isLength({ min: 2, max: 30 }).withMessage('Price is required'),
];

itemMiddle.getItem = async (req, res, next) => {
    try {
        const item = await itemModel.findOne({ _id: req.params.id }).populate('category.category_name');
        console.log('----getItem:', item);
        if (item == null) {
            return res.status(404).json({ status: 'error', message: 'Cannot find item' })
        }
        res.item = item
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

module.exports = itemMiddle;