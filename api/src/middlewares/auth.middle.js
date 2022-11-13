const jwt = require('jsonwebtoken')
const config = require('../config');
const helper = require('../utils/helper');
const userModel = require('../models/user.model')
const authMiddle = {}

authMiddle.checkToken = async (req, res, next) => {
    try {
        const request_url = req.originalUrl.split('?').shift();
        // console.log('checkToken', request_url)
        if (config.without_check_token.indexOf(request_url) > -1) {
            next();
            return;
        }
        const authHeader = req.headers['authorization'];
        // Bearer token
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            helper.resError(res, 'No token provided', 401);
            return;
        }
        jwt.verify(token, config.access_token_secret, async (err, data) => {
            if (err) {
                helper.resError(res, 'Token is invalid', 403);
                return;
            }
            const user = await userModel.findOne({ email: data.email }).populate('role');
            // console.log('checkToken', user);
            if (!user) {
                helper.resError(res, 'User not found', 403);
                return;
            }
            if (user.token != token) {
                helper.resError(res, 'Token is invalid or expired', 403);
                return;
            }
            res.user = user;
            res.auth = user;
            next();
        })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

authMiddle.checkPassword = async (req, res, next) => {
    try {
        console.log('checkPassword:', req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            helper.resError(res, 'Email or password is empty', 400);
            return;
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            helper.resError(res, 'Username or password is incorrect!', 404);
            return;
        }
        // compare password
        if (!bcrypt.compareSync(password, user.password)) {
            helper.resError(res, 'Username or password is incorrect!', 404);
            return;
        }
        if (!user.active) {
            helper.resError(res, 'The user is inactive!', 400);
            return;
        }
        res.user = user;
        next();
    } catch (error) {
        helper.resError(res, error.message);
    }
}

authMiddle.checkPermission = (role) => {
    return (req, res, next) => {
        try {
            if (res.auth?.role?.role_name != role) {
                helper.resError(res, 'You do not have permission to access this page!', 403);
                return;
            }
            next();
        }
        catch (err) {
            helper.resError(res, 'No permission to access', 403);
        }
    };
};

module.exports = authMiddle;