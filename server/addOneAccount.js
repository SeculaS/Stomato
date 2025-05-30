// run-once.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

// noinspection JSIgnoredPromiseFromCall,JSCheckFunctionSignatures
mongoose.connect('mongodb://localhost:27017/medical_forms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function createUser() {
    const hashedPassword = await bcrypt.hash('ChangeMe', 10);
    const user = new User({ username: 'Administrator', password: hashedPassword, type: 'Admin'});
    await user.save();
    console.log('Utilizator creat.');
    await mongoose.disconnect();
}

// noinspection JSIgnoredPromiseFromCall
createUser();