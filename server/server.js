// server/server.js




const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Web3 = require('web3');
const cors = require('cors');
const contractJSON = require('../build/contracts/MedicalConsent.json');

const contractGenJSON = require('../build/contracts/GeneConsent.json');
const contractEndJSON = require('../build/contracts/EndoConsent.json');
const contractPedJSON = require('../build/contracts/PedoConsent.json');
const contractChiJSON = require('../build/contracts/ChirConsent.json');

const app = express();
const PORT = 4000;

// Config
const GANACHE_RPC = 'http://127.0.0.1:7545';
const CONTRACT_ADDRESS = '0x86d8639BB35d2d42DE381D413ea4d1513C6934b6'; // Replace this!
const CONSTACT_ENDO_ADDRESS = '0x73CB66e54b8c51f3Daf1439cf17228113D66e87B';
const CONSTACT_GENE_ADDRESS = '0x0ec5C975b967551Eec9D85Ae7c13b5D000582e90';
const CONSTACT_PEDO_ADDRESS = '0x0A210305B89547defe0B5a2A77da77CB3e3a8cE7';
const CONSTACT_CHIR_ADDRESS = '0xf070D237a1f75A72fcE1a90FB6c777B5E4075083';
const ACCOUNT_ADDRESS = '0xb0BA4b4410009E87335666f8262807CB814Efb36'; // Replace with unlocked Ganache address

// Init
const web3 = new Web3(new Web3.providers.HttpProvider(GANACHE_RPC));
const contract = new web3.eth.Contract(contractJSON.abi, CONTRACT_ADDRESS);
const contractEndo = new web3.eth.Contract(contractEndJSON.abi, CONSTACT_ENDO_ADDRESS);
const contractPedo = new web3.eth.Contract(contractPedJSON.abi, CONSTACT_PEDO_ADDRESS);
const contractGene = new web3.eth.Contract(contractGenJSON.abi, CONSTACT_GENE_ADDRESS);
const contractChir = new web3.eth.Contract(contractChiJSON.abi, CONSTACT_CHIR_ADDRESS);


app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/medical_forms', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PatientSchema = new mongoose.Schema({ any: mongoose.Schema.Types.Mixed });
const Patient = mongoose.model('Patient', PatientSchema);

const User = require('./models/User');

const Form = require('./models/Form');

app.get('/get-patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la obținerea pacienților.' });
    }
});
app.put('/update-patient/:cnp', async (req, res) => {
    const cnp = req.params.cnp;
    const updatedData = req.body; // datele noi trimise de client
    console.log(cnp);
    console.log(updatedData);
    try {
        const updatedPatient = await Patient.findOneAndUpdate(
            { "any.CNP": cnp },
            { $set: { any: updatedData } },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: 'Pacientul nu a fost găsit.' });
        }

        res.json({ message: 'Pacient actualizat cu succes.', patient: updatedPatient });
    } catch (error) {
        console.error('Eroare la actualizare:', error);
        res.status(500).json({ message: 'Eroare internă la actualizare.' });
    }
});
app.get('/get-form-data', async (req, res) => {
    try {
        const { cnp } = req.query; // <-- așa preiei cnp-ul din query
        const userData = await Patient.findOne({ "any.CNP": cnp });

        if (!userData) return res.status(404).json({ error: 'Datele nu au fost găsite' });

        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Eroare la extragerea datelor' });
    }
});

app.get('/get-form-data-fromid', async (req, res) => {
    try {
        const { id } = req.query; // <-- așa preiei cnp-ul din query
        const userData = await Form.findOne({ "_id": id });

        if (!userData) return res.status(404).json({ error: 'Datele nu au fost găsite' });

        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Eroare la extragerea datelor' });
    }
});
app.delete('/delete-patient/:cnp', async (req, res) => {
    const cnp = req.params.cnp;

    try {

        const deletedPatient = await Patient.findOneAndDelete({ 'any.cnp': cnp });


        if (!deletedPatient) {
            return res.status(404).json({ message: 'Pacientul nu a fost găsit.' });
        }

        res.json({ message: 'Pacient șters cu succes.' });
    } catch (error) {
        console.error('Eroare la ștergere:', error);
        res.status(500).json({ message: 'Eroare internă la ștergere.' });
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Utilizator inexistent' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Parolă greșită' });

    res.status(200).json({ message: 'Autentificare reușită' });
});

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
app.post('/api/acorduri', async (req, res) => {
    const { cnp } = req.body;

    try {
        const acorduri = await Form.find({ 'any.cnp': cnp })
            .sort({ 'any.consentTimestamp': -1 }); // DESC
        res.json(acorduri);
    } catch (err) {
        console.error('Eroare la extragere acorduri:', err);
        res.status(500).json({ error: 'Eroare la extragerea acordurilor' });
    }
});
app.post('/submit-form-pedodontic', async (req, res) => {
    const formData = req.body;
    if(formData.formType === 'pedodontic') {
        await contractPedo.methods
            .signConsent(formData.signature, formData.signedDate)
            .send({from: ACCOUNT_ADDRESS, gas: 5000000})
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
    }
    else if(formData.formType === 'endocrinologic') {
        await contractEndo.methods
            .signConsent(formData.signature, formData.signedDate)
            .send({from: ACCOUNT_ADDRESS, gas: 5000000})
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
    }
    else if(formData.formType === 'chirurgie') {
        await contractChir.methods
            .signConsent(formData.signature, formData.signedDate)
            .send({from: ACCOUNT_ADDRESS, gas: 5000000})
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
    }
    try {
        const form = new Form({ any: formData });

        console.log('Transaction sent');
        await form.save();
        console.log('Salvat in MongoDB:', form);
        res.status(200).json({ message: 'Formular salvat si inregistrat' });

    } catch (err) {
        console.error('Eroare la salvare:', err);
        res.status(500).json({ error: 'Ceva n-a mers bine la salvare sau blockchain' });
    }
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
