const roleModel = require('../models/role.model');
const helper = require('../utils/helper');
const roleMiddle = {};

roleMiddle.getRole = async (req, res, next) => {
    try {
        const role = await roleModel.findOne({ _id: req.params.id });
        console.log('getRole:', role);
        if (role == null) {
            helper.resError(res, 'Cannot find role', 404);
            return;
        }
        res.role = role
        next()
    } catch (error) {
        helper.resError(res, error.message);
    }
}

module.exports = roleMiddle;