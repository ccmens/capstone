const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales.controller");
const commonMiddle = require("../middlewares/common.middle");
const salesMiddle = require("../middlewares/sales.middle");

router.get("/sales", salesController.list);
router.get('/sales/export', salesController.export);
router.get(
  "/sales/:id",
  commonMiddle.checkParamsId,
  salesMiddle.getSales,
  salesController.get
);
router.post("/sales", salesController.add);
router.put(
  "/sales/:id",
  commonMiddle.checkParamsId,
  salesMiddle.getSales,
  salesController.update
);
router.put(
  "/sales/recover/:id",
  commonMiddle.checkParamsId,
  salesMiddle.getSales,
  salesController.recover
);
router.delete(
  "/sales/:id",
  commonMiddle.checkParamsId,
  salesMiddle.getSales,
  salesController.delete
);


module.exports = router;
