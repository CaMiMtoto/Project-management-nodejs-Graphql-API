const mongoose = require('mongoose');
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Client', clientSchema);