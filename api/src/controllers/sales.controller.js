const salesModel = require("../models/sales.model");
const categoryModel = require("../models/category.model");
const helper = require("../utils/helper");
// const config = require('../config');
const resize = require('../utils/resize');

const salesController = {};


//populate the saleslist IE: dispaly items.
salesController.list = async (req, res) => {
  try {
    const where = {};
    if (res.user.role.role_name != "admin") {
      where.owner = res.user._id;
    }
    const sales = await salesModel
      .find(where)
      .populate("category");
    //.populate("owner");
    res.json({
      status: "success",
      data: sales,
    });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

salesController.get = async (req, res) => {
  try {
    res.json(res.sale);
  } catch (error) {
    helper.resError(res, error.message);
  }
};

// Add Sale
salesController.add = async (req, res) => {
  try {
    console.log('add:', req.body)
    const { category, sales_qty } = req.body;

    //define total_sales
    const findProduct = await categoryModel.find({ "_id": category });
    let unit_price = 0;
    unit_price = findProduct.map(item => item.category_price);
    const total_sales = unit_price * sales_qty;

    const sale = new salesModel({

      category: category,
      sales_qty: sales_qty,
      total_sales: total_sales,
      //owner: res.user._id,
      // stock: res.category.category_qty - sales_qty,
    });
    await sale.save();
    //update category_qty
    const qty = sales_qty * (-1);
    const categorys = await categoryModel.updateOne({ "_id": category },
      { "$inc": { "category_qty": qty } });
    res
      .status(201)
      .json({ status: "success", message: "Add new sale successful" });
  } catch (error) {
    helper.resError(res, error.message);
  }

};

salesController.update = async (req, res) => {
  try {
    const { category, sales_qty } = req.body;
    const tmp = res.sale.sales_qty;
    // update the stock 
    let qty = 0;
    if (tmp > sales_qty) {
      qty = (tmp - sales_qty)
      console.log("plus", qty);
    } else {
      qty = (sales_qty - tmp) * (-1);
      console.log(qty, "Minus");
    }
    //update the total sales amount
    const findProduct = await categoryModel.find({ "_id": category });
    let unit_price = 0;
    unit_price = findProduct.map(item => item.category_price);

    //update all the variables
    if (category) res.sale.category = category;
    if (sales_qty) res.sale.sales_qty = sales_qty;
    res.sale.total_sales = sales_qty * unit_price;
    const categorys = await categoryModel.updateOne({ "_id": category },
      { "$inc": { "category_qty": qty } });
    res.sale.updated_at = Date.now();

    console.log(res.sale.sales_qty);
    await res.sale.save();
    res
      .status(201)
      .json({ status: "success", message: "Update sale successful" });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

salesController.delete = async (req, res) => {
  try {

    const categorys = await categoryModel.updateOne({ "_id": res.sale.category },
      { "$inc": { "category_qty": res.sale.sales_qty } });
    await res.sale.remove();
    res.json({ status: 'success', message: 'Sales deleted' });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

salesController.recover = async (req, res) => {
  try {
    if (res.sale.deleted) {
      res.sale.deleted = false;
      res.sale.update_at = Date.now();
      await res.sale.save();
    }
    res.status(201).json({ status: 'success', message: 'Recover sale successful' })
  } catch (error) {
    helper.resError(res, error.message);
  }
};

salesController.export = async (req, res) => {
  try {
    console.log('export:', req.body)
    let results = [];
    //const users = await userModel.find({ active: true }).populate("role");
    // for (const user of users) {
    //if (user.role.role_name != "user")
    //continue;

    //const items = await itemModel.find();
    const sales = await salesModel.find({ deleted: false }).populate("category");
    for (const sale of sales) {

      const tmp = {

        Product: sale.category.category_name,
        Quantity: sale.sales_qty,
      };


      results.push(tmp);

    };
    /* };
 
     results.sort(function (a, b) {
       return a.Last.localeCompare(b.Last) || a.First.localeCompare(b.First) || b.Number_Of_Items - a.Number_Of_Items;
     });
  
     results.forEach(item=>{
       delete item.First;
       delete item.Last;
     })
 */

    res.json({
      status: 'success',
      data: results
    });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

module.exports = salesController;
