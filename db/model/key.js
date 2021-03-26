const mongoose = require('mongoose');

const keySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    key: { type: String, required: true, unique: true },
    status: { type: Boolean, require: true, default: true },
    expiredTime: { type: Number, default: Math.floor(new Date().getTime() / 1000.0) }
});

module.exports = mongoose.model('Key', keySchema);
