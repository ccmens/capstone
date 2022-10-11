const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const commonMiddle = require("../middlewares/common.middle");
const itemMiddle = require("../middlewares/item.middle");

router.get("/item", itemController.list);
router.get('/item/export', itemController.export);
router.get(
  "/item/:id",
  commonMiddle.checkParamsId,
  itemMiddle.getItem,
  itemController.get
);
router.post("/item", itemController.add);
router.put(
  "/item/:id",
  commonMiddle.checkParamsId,
  itemMiddle.getItem,
  itemController.update
);
router.put(
  "/item/recover/:id",
  commonMiddle.checkParamsId,
  itemMiddle.getItem,
  itemController.recover
);
router.delete(
  "/item/:id",
  commonMiddle.checkParamsId,
  itemMiddle.getItem,
  itemController.delete
);
router.post('/item/upload/:id', itemMiddle.upload.single("image"), itemController.upload);

module.exports = router;
