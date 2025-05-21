const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
    any: mongoose.Schema.Types.Mixed,
}, { collection: 'forms' });

module.exports = mongoose.model('Form', formSchema);