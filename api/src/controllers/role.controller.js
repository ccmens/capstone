const roleModel = require('../models/role.model');
const userModel = require('../models/user.model');
const helper = require('../utils/helper');

const roleController = {};


roleController.list = async (req, res) => {
    try {
        const roles = await roleModel.find();
        res.json({
            status: 'success',
            data: roles
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

roleController.get = async (req, res) => {
    try {
        res.json(res.role);
    } catch (error) {
        helper.resError(res, error.message);
    }
};

roleController.add = async (req, res) => {
    try {
        const { title, role_name } = req.body;

        const role = new roleModel({
            title: title,
            role_name: role_name
        });
        await role.save();
        res.status(201).json({ status: 'success', message: 'Add new role successful' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

roleController.update = async (req, res) => {
    try {
        const { title, role_name } = req.body;
        res.role.title = title;
        res.role.role_name = role_name;
        res.role.create_at = Date.now();

        await res.role.save();
        res.status(201).json({ status: 'success', message: 'Update role successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

roleController.delete = async (req, res) => {
    try {
        await res.role.remove();
        await userModel.remove({"role" : res.role._id });
        res.json({ status: 'success', message: 'Role deleted' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

module.exports = roleController;