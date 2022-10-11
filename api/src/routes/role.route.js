const express = require('express')
const router = express.Router()
const roleController = require('../controllers/role.controller')
const commonMiddle = require('../middlewares/common.middle')
const roleMiddle = require('../middlewares/role.middle')
const authMiddle = require('../middlewares/auth.middle')

router.get('/role', roleController.list)
router.get('/role/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, roleMiddle.getRole, roleController.get)
router.post('/role', authMiddle.checkPermission('admin'), roleController.add)
router.put('/role/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, roleMiddle.getRole, roleController.update);
router.delete('/role/:id', authMiddle.checkPermission('admin'), commonMiddle.checkParamsId, roleMiddle.getRole, roleController.delete);

module.exports = router