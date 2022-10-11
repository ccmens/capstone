const categoryModel = require('../models/category.model');
const helper = require('../utils/helper');

const categoryController = {};


categoryController.list = async (req, res) => {
    try {
        const categorys = await categoryModel.find();
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
        const { category_name } = req.body;

        const category = new categoryModel({
            category_name: category_name
        });
        await category.save();
        res.status(201).json({ status: 'success', message: 'Add new category successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.update = async (req, res) => {
    try {
        const { category_name } = req.body;

        res.category.category_name = category_name;
        res.category.create_at = Date.now();

        await res.category.save();
        res.status(201).json({ status: 'success', message: 'Update category successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

categoryController.delete = async (req, res) => {
    try {
        await res.category.remove();
        res.json({ status: 'success', message: 'Category deleted' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

module.exports = categoryController;