const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    title: { type: String },
    role_name: { type: String },
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('role', roleSchema)