import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaPenToSquare, FaTrashCan, FaFilePdf, FaMagnifyingGlass, FaUserDoctor, FaListCheck} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import ModalAcorduri from "./ModalAcorduri"; //
import {toast} from "react-toastify";

let debounceTimer;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const PatientTreatmentModal = ({ patient, onClose }) => {
    const [tratamente, setTratamente] = useState(patient.any.tratamente.toString());

    const handleSaveTreatment = async () => {
        const lista_tratamente = tratamente
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
        const lista_alergii = patient.any.alergii
            .split(',')
            .map(a => a.trim().toLowerCase())
            .filter(a => a.length > 0);

        let conflicte = [];

        try {
            for (let tratament of lista_tratamente) {
                const response = await fetch(`https://www.apimedic.ro/api/v1/medicine/${encodeURIComponent(tratament)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.warn(`Nu s-a gasit tratamentul: ${tratament} (Status ${response.status})`);
                    continue;
                }

                const data = await response.json();

                for (let medicament of data) {
                    const keywords = (medicament.keywords || "").toLowerCase();
                    const description = (medicament.description || "").toLowerCase();

                    const conflicteGasite = lista_alergii.filter(alergie =>
                        keywords.includes(alergie) || description.includes(alergie)
                    );

                    if (conflicteGasite.length > 0) {
                        conflicte.push({
                            tratament,
                            nume_medicament: medicament.name,
                            alergiiDetectate: conflicteGasite
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Eroare la cautarea tratamentelor:', error);
        }

        if(conflicte.length > 0) {
            toast.warn("Atentie! Ai adaugat un tratament la care pacientul e posibil sa fie alergic!");

        }
        try {
            onClose();
            toast.success('Pacient actualizat cu succes!');
            const response = await fetch(`${backendUrl}/update-patient-field/${encodeURIComponent(patient.any.CNP)}`, {
                method: 'PUT', // sau PATCH, dacă backend-ul o permite
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    field: 'tratamente',
                    value: tratamente,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || 'Eroare la actualizarea pacientului!');
                return;
            }


            patient.any.tratamente = tratamente;

        } catch (error) {
            console.error('Eroare la submit:', error);
            toast.error('Eroare la comunicarea cu serverul!');
        }
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000,
            padding: 10
        }}>
            <div style={{
                background: 'white',
                padding: 20,
                borderRadius: 10,
                width: '50%',
                maxWidth: 1400,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxSizing: 'border-box'
            }}>

                <h2>Tratamentele lui {patient.any.lastName} {patient.any.firstName}</h2>
                Lista alergii: {patient.any.alergii}
                <div>
                    <input style={{width:'80%'}}
                        type="text"
                        value={tratamente} onChange={(e) => setTratamente(e.target.value)}
                        className="flex-1 border rounded px-2 py-1"
                        placeholder="Tratamente"
                    />
                    <TooltipButton tooltipText={"Actualizeaza lista"}
                        onClick={handleSaveTreatment}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                        <FaListCheck/>
                    </TooltipButton>
                </div>
                <center>
                <button
                    onClick={onClose}

                >
                    Close
                </button></center>
            </div>
        </div>
    );
};
export default function PatientsList() {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [acorduri, setAcorduri] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [triggered, setTriggered] = useState(false);

    const fetchPatients = async (query = '') => {
        try {
            const res = await fetch(`${backendUrl}/get-patients?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            console.error('Eroare la fetch:', error);
        }
    };

    useEffect(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchPatients(searchTerm);
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);
    const handleSearch = (value) => {
        setSearchTerm(value);
        fetchPatients(value);
    }
    const handleTrigger = () => {
        setTriggered(!triggered);
        if(triggered === true) {
            setSearchTerm('');
        }
    }
    const handleEdit = (cnp) => {
        navigate(`/edit/${cnp}`);
    };
    const handleTreatmentClick = (patient) => {
        setShowTreatmentModal(true);
        setSelectedPatient(patient);
    }
    const handlePdfClick = (patient) => {
        setSelectedPatient(patient);

        const handleLoadAcorduri = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/acorduri`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ cnp: patient.any.CNP }),
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('Eroare răspuns server:', errorText);
                    return;
                }

                const data = await res.json();
                setAcorduri(data);
            } catch (error) {
                console.error('Eroare la fetch acorduri:', error);
            } finally {
            }
        };
        handleLoadAcorduri();

        setShowModal(true);
    };

    const handleDelete = async (cnp) => {
        if (!window.confirm('Ești sigur că vrei să ștergi pacientul?')) return;
        try {
            const res = await fetch(`${backendUrl}/delete-patient/${cnp}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchPatients(); // reîncarcă lista după ștergere
                toast.success('Pacientul a fost sters cu succes!');
            } else {
                toast.error('Eroare la ștergerea pacientului');
            }
        } catch (error) {
            console.error('Eroare la ștergere:', error);
        }
    };

    return (<div>
            <div className={"form-container"} style={{maxWidth:'1200px'}}>
                <div style={{ marginBottom: '20px' }}>

                    {triggered === true && ( <><input
                        type="text"
                        placeholder="Caută pacient după nume sau CNP..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ padding: '8px', marginBottom: '15px', width: '90%' }}
                    />
                    </> )}
                    <TooltipButton onClick={() => handleTrigger()} tooltipText={"Search patient"} style={{ padding: '8px', backgroundColor: 'white', color: '#007bff'}}><FaMagnifyingGlass/></TooltipButton>
                </div>

                <h2>Lista Pacienților</h2>
                <>
                    <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                        <tr>
                            <th>Nume si Prenume Pacient</th>
                            <th>Nume si Prenume Tutore</th>
                            <th>CNP Pacient</th>
                            <th>Acțiuni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((patient) => (
                            <tr key={patient._id}>
                                <td>{patient.any.lastName} {patient.any.firstName}</td>
                                <td>{patient.any.tutoreNume}</td>
                                <td>{patient.any.CNP}</td>
                                <td><center>
                                    <TooltipButton tooltipText={"Edit patient"} onClick={() => handleEdit(patient.any.CNP)}><FaPenToSquare /></TooltipButton>{' '}
                                    <TooltipButton tooltipText={"Delete patient"} style={{backgroundColor: "red"}} onClick={() => handleDelete(patient.any.CNP)}><FaTrashCan  /></TooltipButton>
                                    &nbsp;
                                    <TooltipButton tooltipText={"View or generate PDFs"} style={{ backgroundColor: "darkorange" }} onClick={() => handlePdfClick(patient)}><FaFilePdf /></TooltipButton>
                                    {' '}<TooltipButton tooltipText={"Add treatment"} style={{backgroundColor: "darkblue"}} onClick={() => handleTreatmentClick(patient)}><FaUserDoctor/></TooltipButton>
                                </center></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {}
                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: 30, marginRight:30}}>
                        <TooltipButton tooltipText={"Add patient"}
                            onClick={() => navigate('/chestionar')}
                            style={{
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: 60,
                                height: 60,
                                fontSize: 28,
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                            }}
                        >
                            +
                        </TooltipButton>
                    </div>
                    {showModal && selectedPatient && (
                        <ModalAcorduri
                            patient={selectedPatient}
                            acorduri={acorduri}
                            onClose={() => setShowModal(false)}
                        />
                    )}
                    {showTreatmentModal && selectedPatient && (
                        <PatientTreatmentModal
                        patient={selectedPatient}
                        onClose={() => setShowTreatmentModal(false)}
                        />
                        ) }
                </>
            </div>

        </div>
    );
}

