const userModel = require('../models/user.model');
const roleModel = require('../models/role.model');
const itemModel = require('../models/item.model');
const helper = require('../utils/helper');
const config = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const resize = require('../utils/resize');

const userController = {};

userController.upload = async (req, res) => {
    try {
        const id = req.params.id;
        console.log('upload id:', id)
        // console.log('upload', req.file)
        // return res.status(401).json({ status: 'error', message: 'Please provide an image' });
        const imagePath = helper.getUploadPath('profile', '');
        console.log('imagePath:', imagePath)
        const fileUpload = new resize(imagePath);
        if (!req.file) {
            helper.resError(res, 'Please provide an image', 401);
            return;
        }
        const filename = await fileUpload.save(req.file, id);
        const fileUrl = helper.getUploadUrl('profile', filename);

        // delete old image
        if (res.user?.avatar) {
            helper.deleteUploadFile('profile', res.user.avatar);
        }
        res.user.avatar = fileUrl;
        await res.user.save();

        res.set(
            'Access-Control-Allow-Origin', '*',
            'Access-Control-Allow-Methods', 'PUT,POST,DELETE',
            'Access-Control-Allow-Headers', 'Content-Type,token',
            'Access-Control-Allow-Credentials', 'true',
            'Content-Type', 'application/json;charset=utf-8'
        );
        res.json({ status: 'success', message: 'success', filename: filename, fileurl: fileUrl });
    } catch (error) {
        helper.resError(res, error.message);
    }
}

userController.list = async (req, res) => {
    try {
        const user = await userModel.find().populate('role');
        ;
        res.json({
            status: 'success',
            data: user
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.get = async (req, res) => {
    try {
        res.json(res.user);
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.export = async (req, res) => {
    try {
        let results = [];
        const users = await userModel.find();
        for (const user of users) {
            const items = await itemModel.find({ owner: user._x });
            const count = items.length;
            const total_value = await items.reduce((acc, item) => acc + item.price, 0);
            const tmp = {
                Name: user.first_name,
                Email: user.email,
                isActive:user.active,
                Number_Of_Items: count,
                Total_Value: total_value
            };
            results.push(tmp);
        };
        res.json({
            status: 'success',
            data: results
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.login = async (req, res) => {
    try {
        const tokenData = { email: res.user.email, id: res.user._id }
        const accessToken = jwt.sign(tokenData, config.access_token_secret, {
            expiresIn: config.access_token_expires_in,
        })
        res.user.token = accessToken;
        await res.user.save();
        res.json({
            status: 'success',
            data: {
                _id: res.user._id,
                token: res.user.token,
                email: res.user.email,
                role: res.user.role,
                avatar: res.user?.avatar,
                first_name: res.user.first_name,
                last_name: res.user.last_name,
                active: res.user.active,
            }
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.tokenLogin = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return helper.resError(res, 'Email or token is missing', 400);
        }
        jwt.verify(token, config.access_token_secret, async (err, data) => {
            if (err) {
                return helper.resError(res, 'No permission to access 1', 403);
            }
            // check email
            if (data.email != email) {
                return helper.resError(res, 'No permission to access 2', 403);
            }
            const user = await userModel.findOne({ email: email }).populate('role');
            if (!user) {
                return helper.resError(res, 'Cannot find the user.', 403);;
            }
            if (user.token !== token) {
                return helper.resError(res, 'No permission to access 3', 403);
            }
            res.json({
                status: 'success',
                data: {
                    _id: user._id,
                    token: user.token,
                    email: user.email,
                    role: user.role,
                    avatar: user?.avatar,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    active: user.active,
                }
            });
        });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.logout = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return helper.resError(res, 'Email or token is missing', 400);
        }
        const user = await userModel.findOne({ email: email, token: token });
        if (!user) {
            return helper.resError(res, 'Cannot find the user.', 403);;
        }
        user.token = '';
        await user.save();
        res.json({ status: 'success', message: 'Logout successful' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        const role = await roleModel.findOne({ role_name: 'user' });
        console.log('register', role);
        const user = new userModel({
            email: email,
            active: true,
            first_name: first_name,
            last_name: last_name,
            password: await bcrypt.hashSync(password, 10),
            role: role?._id,
        });
        await user.save();
        res.status(201).json({ status: 'success', message: 'register successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.add = async (req, res) => {
    try {
        const { email, password, first_name, last_name, role } = req.body;
        const user = new userModel({
            email: email,
            active: true,
            first_name: first_name,
            last_name: last_name,
            password: await bcrypt.hashSync(password, 10),
            role: role,
        });
        await user.save();
        res.status(201).json({ status: 'success', message: 'register successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.update = async (req, res) => {
    try {
        const { first_name, last_name, active, password, role } = req.body;

        if (first_name)
            res.user.first_name = first_name;
        if (last_name)
            res.user.last_name = last_name;
        if (active != undefined)
            res.user.active = active;
        if (role)
            res.user.role = role;
        if (password)
            res.user.password = await bcrypt.hashSync(password, 10);
        res.user.update_at = Date.now();

        await res.user.save();
        res.status(201).json({ status: 'success', message: 'Update user successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};


 userController.delete = async (req, res) => {
    try {
        if (res.user.deleted) {
            
            await res.user.remove();
        }
        
     else {
            res.user.deleted = true;
            res.user.active = false;
            res.user.update_at = Date.now();
            await res.user.save();
        }
    
        res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        helper.resError(res, error.message);
    }
   
}; 

/*
userController.delete = async (req, res) => {
    try {
        res.user.deleted = true;
        res.user.active = false;
        res.user.update_at = Date.now();
        await res.user.remove();
        await res.user.save();
        res.json({ status: 'success', message: 'User deleted' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};
*/

userController.recover = async (req, res) => {
    try {
        if (res.user.deleted) {
            res.user.deleted = false;
            res.user.active = true;
            res.user.update_at = Date.now();
            await res.user.save();
        }
        res.status(201).json({ status: 'success', message: 'Recover user successful' })
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.profile = async (req, res) => {
    try {
        const { first_name, last_name, password } = req.body;

        res.user.first_name = first_name;
        res.user.last_name = last_name;
        if (password) {
            res.user.password = await bcrypt.hashSync(password, 10);
        }
        res.user.update_at = Date.now();

        await res.user.save();
        res.status(201).json({ status: 'success', message: 'Update user successful' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

userController.inactive = async (req, res) => {
    try {
        res.user.active = false;
        res.user.update_at = Date.now();
        await res.user.save();
        
        res.status(201).json({ status: 'success', message: 'Inactive account successful' });
    } catch (error) {
        helper.resError(res, error.message);
    }
};

module.exports = userController;