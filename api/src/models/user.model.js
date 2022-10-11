const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: { type: String, lowercase: true, unique: true },
    active: { type: Boolean, default: true },
    first_name: { type: String },
    last_name: { type: String },
    avatar: { type: String },
    password: { type: String },
    token: { type: String },
    deleted: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'role' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('user', userSchema)