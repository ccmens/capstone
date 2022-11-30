const mongoose = require('mongoose')

// Database model for MongoDB
const salesSchema = new mongoose.Schema({
    
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    sales_qty: { type: Number },
    total_sales:{type:Number},
    created_at: { type: Date, default: Date.now },

})

module.exports = mongoose.model('sale', salesSchema)