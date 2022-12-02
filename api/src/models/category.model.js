const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: { type: String },
    category_qty: { type: Number, default: 0 },
    category_price: { type: Number },
    category_hrs: { type: Number },
    needed_part: [{
        part: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
        needed_qty: { type: Number },

        /*
        category_name: { type: String },
        item_name: { type: String },
        needed_qty: { type: Number },
        total_price: { type: Number },
        */
    }],
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('category', categorySchema)