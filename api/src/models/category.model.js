const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: { type: String },
    category_qty: { type: Number },
    category_price:{type: Number},
    category_hrs:{type: Number},
    category_part:[{type: mongoose.Schema.Types.ObjectId, ref: 'item'}],
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('category', categorySchema)