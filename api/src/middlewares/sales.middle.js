const salesModel = require('../models/sales.model')
const { check } = require('express-validator');



const salesMiddle = {}


salesMiddle.valid_item = [
    check('category').isLength({ min: 2, max: 30 }).withMessage('Product is required'),
    check('sales_qty').isLength({ min: 2, max: 30 }).withMessage('Sales Quantity is required'),
];

salesMiddle.getSales = async (req, res, next) => {
    try {
        const sale = await salesModel.findOne({ _id: req.params.id }).populate('category');
       // console.log('----getSales:', sale);
        if (sale == null) {
            return res.status(404).json({ status: 'error', message: 'Cannot find sale' })
        }
        res.sale = sale
        next()
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message })
    }
}

module.exports = salesMiddle;