const categoryModel = require('../models/category.model');
const itemModel = require('../models/item.model');
const salesModel = require('../models/sales.model');
const helper = require('../utils/helper');

const categoryController = {};


categoryController.list = async (req, res) => {
    try {
        const categorys = await categoryModel.find().populate("needed_part.part");
        res.json({
            status: 'success',
            data: categorys
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.get = async (req, res) => {
    try {
        res.json(res.category);
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.add = async (req, res) => {
    try {
        const { category_name, category_qty, category_price, category_hrs, needed_part } = req.body;

        const category = new categoryModel({
            category_name: category_name,
            category_qty: category_qty,
            category_price: category_price,
            category_hrs: category_hrs,
            needed_part: needed_part
        });
        await category.save();
        res.status(201).json({ status: 'success', message: 'Add new product successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.update = async (req, res) => {
    try {
        const { category_name, category_qty, category_price, category_hrs, needed_part } = req.body;
        console.table(req.body);
        res.category.category_name = category_name;
        res.category.category_qty = category_qty;
        res.category.category_price = category_price;
        res.category.category_hrs = category_hrs;
        res.category.needed_part = needed_part;
        res.category.create_at = Date.now();
        console.log(res.category);
        await res.category.save();
        res.status(201).json({ status: 'success', message: 'Update product successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.delete = async (req, res) => {
    try {
        await res.category.remove();
        //const sale = await salesModel.find({category : category._id});
        await salesModel.remove({"category" : res.category._id });

        res.json({ status: 'success', message: 'product deleted' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

module.exports = categoryController;