const itemModel = require("../models/item.model");
const categoryModel = require("../models/category.model");
const helper = require("../utils/helper");
// const config = require('../config');
const resize = require('../utils/resize');

const itemController = {};

// uploading a photo to the application
itemController.upload = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('upload id:', id)
    // console.log('upload', req.file)
    // return res.status(401).json({ status: 'error', message: 'Please provide an image' });
    const imagePath = helper.getUploadPath('item', '');
    console.log('imagePath:', imagePath)
    const fileUpload = new resize(imagePath);
    if (!req.file) {
      helper.resError(res, 'Please provide an image', 401);
      return;
    }
    const filename = await fileUpload.save(req.file, id);
    const fileUrl = helper.getUploadUrl('item', filename);

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

//populate the itemlist IE: dispaly items.
itemController.list = async (req, res) => {
  try {
    const where = {};
    if (res.user.role.role_name != "admin") {
      where.owner = res.user._id;
    }
    const items = await itemModel
      .find(where)
      .populate("category.category_name")
      .populate("owner");
    res.json({
      status: "success",
      data: items,
    });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

itemController.get = async (req, res) => {
  try {
    res.json(res.item);
  } catch (error) {
    helper.resError(res, error.message);
  }
};

// Add items
itemController.add = async (req, res) => {
  try {
    console.log('add:', req.body)
    const { item_name, category, price, stock, digikey_part_num, supplier_link, picture, } = req.body;
    let fileUrl = '';
    if (picture) {
      const filename = `${picture.uid}.${picture.extname}`;
      fileUrl = helper.getUploadUrl('item', filename);
    }
    const item = new itemModel({
      item_name: item_name,
      category: category,
      price: price,
      stock: stock,
      digikey_part_num: digikey_part_num,
      supplier_link: supplier_link,
      owner: res.user._id,
      image: fileUrl,
    });
    await item.save();
    res
      .status(201)
      .json({ status: "success", message: "Add new item successful" });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

itemController.update = async (req, res) => {
  try {
    const { item_name, category, price, picture, stock, digikey_part_num, supplier_link } = req.body;
    if (item_name) res.item.item_name = item_name;
    if (category) res.item.category = category;
    // if (part_category) res.item.part_category = part_category;
    if (price) res.item.price = price;
    if (stock) res.item.stock = stock;
    //if (needed_qty) res.item.needed_qty = needed_qty;
    if (digikey_part_num) res.item.digikey_part_num = digikey_part_num;
    if (supplier_link) res.item.supplier_link = supplier_link;
    if (picture) {
      const filename = `${picture.uid}.${picture.extname}`;
      res.item.image = helper.getUploadUrl('item', filename);
    }
    res.item.updated_at = Date.now();

    await res.item.save();
    res
      .status(201)
      .json({ status: "success", message: "Update item successful" });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

itemController.delete = async (req, res) => {
  try {
    if (res.item.deleted) {
      if (res.item?.image) {
        helper.deleteUploadFile('item', res.item?.image);
      }
      await res.item.remove();
    } else {
      res.item.deleted = true;
      res.item.update_at = Date.now();
      await res.item.save();
    }
    res.json({ status: "success", message: "item deleted" });
  } catch (error) {
    helper.resError(res, error.message);
  }
};

itemController.recover = async (req, res) => {
  try {
    if (res.item.deleted) {
      res.item.deleted = false;
      res.item.update_at = Date.now();
      await res.item.save();
    }
    res.status(201).json({ status: 'success', message: 'Recover item successful' })
  } catch (error) {
    helper.resError(res, error.message);
  }
};

itemController.export = async (req, res) => {
  try {
    console.log('export:', req.body)
    let results = [];
    //const users = await userModel.find({ active: true }).populate("role");
    // for (const user of users) {
    //if (user.role.role_name != "user")
    //continue;

    //const items = await itemModel.find();
    const items = await itemModel.find({ deleted: false }).populate("category.category_name");
    for (const item of items) {

      const tmp = {
        Name: item.item_name,
        Product: item.category.category_name,
        Price: item.price,
        Stock: item.stock
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

module.exports = itemController;
