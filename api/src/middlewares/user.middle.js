const userModel = require('../models/user.model')
const roleModel = require('../models/role.model')
const { check } = require('express-validator');
const helper = require('../utils/helper');
const bcrypt = require('bcrypt');
const config = require('../config');
const multer = require("multer");
const userMiddle = {}

userMiddle.upload = multer({
    // dest: "/public/upload/new",
    limits: {
        fileSize: config.upload.fileSize,
    }
});

userMiddle.valid_register = [
    check('email').isLength({ min: 2, max: 30 }).withMessage('Email is required'),
    check('password').isLength({ min: 2, max: 30 }).withMessage('Password is required'),
    check('first_name').isLength({ min: 2, max: 30 }).withMessage('First name is required'),
    check('last_name').isLength({ min: 2, max: 30 }).withMessage('Last name is required'),
];

userMiddle.valid_profile = [
    check('first_name').isLength({ min: 2, max: 30 }).withMessage('First name is required'),
    check('last_name').isLength({ min: 2, max: 30 }).withMessage('Last name is required'),
];

userMiddle.valid_login = [
    check('email').isLength({ min: 2, max: 30 }).withMessage('Email is required'),
    check('password').isLength({ min: 2, max: 30 }).withMessage('Password is required'),
];

userMiddle.getUser = async (req, res, next) => {
    try {
        console.log('getUser:', req.params.id);
        const user = await userModel.findOne({ _id: req.params.id }).populate('role');
        console.log('getUser:', user);
        if (!user) {
            helper.resError(res, 'Cannot find user', 404);
            return;
        }
        res.user = user
        next()
    } catch (error) {
        helper.resError(res, error.message);
    }
}

userMiddle.exists = async (req, res, next) => {
    try {
        const exists = await userModel.exists({ email: req.body.email });
        console.log('exists:', exists);
        if (exists) {
            helper.resError(res, 'The user is exists', 400);
            return;
        }
        next()
    } catch (error) {
        helper.resError(res, error.message);
    }
}

userMiddle.checkRole = async (req, res, next) => {
    try {
        const role = await roleModel.exists({ _id: req.body.role });
        console.log('checkRole:', role);
        if (!role) {
            helper.resError(res, 'The role is not exists', 400);
            return;
        }
        next()
    } catch (error) {
        helper.resError(res, error.message);
    }
}

userMiddle.checkPassword = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email }).populate('role');
        console.log('checkPassword:', user);
        if (!user) {
            helper.resError(res, 'The user is not exists', 400);
            return;
        }
        const isMatch = await bcrypt.compareSync(password, user.password);
        // compare password
        if (!isMatch) {
            helper.resError(res, 'Username or password is incorrect', 400);
            return;
        }
        if (!user.active) {
            helper.resError(res, 'The user is inactive', 400);
            return;
        }
        res.user = user;
        next()
    } catch (error) {
        helper.resError(res, error.message);
    }
}

module.exports = userMiddle;