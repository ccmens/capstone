const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/category.controller')
const commonMiddle = require('../middlewares/common.middle')
const categoryMiddle = require('../middlewares/category.middle')
const authMiddle = require('../middlewares/auth.middle')

router.get('/category', categoryController.list)
router.get('/category/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, categoryMiddle.getCategory, categoryController.get)
router.post('/category', authMiddle.checkPermission('admin'), categoryController.add)
router.put('/category/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, categoryMiddle.getCategory, categoryController.update);
router.delete('/category/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, categoryMiddle.getCategory, categoryController.delete);

module.exports = router