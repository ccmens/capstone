const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const commonMiddle = require('../middlewares/common.middle')
const userMiddle = require('../middlewares/user.middle')

router.post('/upload/:id', userMiddle.upload.single("image"), userController.upload);

router.get('/user', userController.list);
router.get('/user/export', userController.export);
router.get('/user/:id', commonMiddle.checkParamsId, userMiddle.getUser, userController.get);
router.post('/user', 
    userMiddle.valid_register, 
    commonMiddle.checkRequestBody, 
    userMiddle.exists, 
    userMiddle.checkRole, 
    userController.add);
router.post('/user/tokenLogin', userController.tokenLogin);
router.post('/user/logout', userController.logout);
router.post('/user/login', 
    userMiddle.valid_login, 
    commonMiddle.checkRequestBody, 
    userMiddle.checkPassword, 
    userController.login);
router.post('/user/register',
    userMiddle.valid_register,
    commonMiddle.checkRequestBody, 
    userController.register);
router.put('/user/profile/:id',
    commonMiddle.checkParamsId, 
    userMiddle.valid_profile,
    commonMiddle.checkRequestBody, 
    userMiddle.getUser,
    userController.profile);
router.put('/user/inactive/:id',
    commonMiddle.checkParamsId, 
    userMiddle.getUser,
    userController.inactive);
router.put('/user/:id', 
    commonMiddle.checkParamsId, 
    userMiddle.getUser, 
    userController.update);
router.put('/user/recover/:id', 
    commonMiddle.checkParamsId, 
    userMiddle.getUser, 
    userController.recover);
router.delete('/user/:id', 
    commonMiddle.checkParamsId, 
    userMiddle.getUser, 
    userController.delete);

module.exports = router