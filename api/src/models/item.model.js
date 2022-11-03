const mongoose = require('mongoose')

// Database model for MongoDB
const itemSchema = new mongoose.Schema({
    item_name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    price: { type: Number },
    stock: { type: Number },
    needed_qty: { type: Number },
    digikey_part_num: { type: String },
    supplier_link: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    deleted: { type: Boolean, default: false },
    image: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('item', itemSchema)