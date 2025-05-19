// run-once.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/medical_forms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function createUser() {
    const hashedPassword = await bcrypt.hash('Parola', 10);
    const user = new User({ username: 'Medic', password: hashedPassword });
    await user.save();
    console.log('Utilizator creat.');
    await mongoose.disconnect();
}

createUser();