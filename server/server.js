// server/server.js


const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
const cors = require('cors');
const contractJSON = require('../build/contracts/MedicalConsent.json');

const app = express();
const PORT = 4000;

// Config
const GANACHE_RPC = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0x86d8639BB35d2d42DE381D413ea4d1513C6934b6'; // Replace this!
const ACCOUNT_ADDRESS = '0xb0BA4b4410009E87335666f8262807CB814Efb36'; // Replace with unlocked Ganache address

// Init
const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_RPC));
const contract = new web3.eth.Contract(contractJSON.abi, CONTRACT_ADDRESS);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/medical_forms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PatientSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });
const Patient = mongoose.model('Patient', PatientSchema);

app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    await contract.methods
        .signConsent(formData.signature, formData.signedDate)
        .send({ from: ACCOUNT_ADDRESS, gas: 5000000 })
        .on('transactionHash', (hash) => {
            console.log('Transaction Hash:', hash);
            formData.consent = hash.toString();
            formData.consentTimestamp = Date.now();
        })
        .on('receipt', (receipt) => {
            console.log('Transaction Receipt:', receipt);
        })
        .on('error', (error) => {
            console.log('Error in transaction:', error);
        });
    try {
        const patient = new Patient({ any: formData });

        console.log('Transaction sent');
        await patient.save();
        console.log('Salvat in MongoDB:', patient);
        res.status(200).json({ message: 'Formular salvat si consimtamant inregistrat' });

    } catch (err) {
        console.error('Eroare la salvare:', err);
        res.status(500).json({ error: 'Ceva n-a mers bine la salvare sau blockchain' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
