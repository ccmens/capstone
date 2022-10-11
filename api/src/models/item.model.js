const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    item_name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    price: { type: Number },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    deleted: { type: Boolean, default: false },
    image: {type: String},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('item', itemSchema)