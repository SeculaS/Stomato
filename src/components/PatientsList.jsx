import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaPenToSquare, FaTrashCan, FaFilePdf, FaMagnifyingGlass, FaUserDoctor, FaListCheck} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import ModalAcorduri from "./ModalAcorduri"; //
let debounceTimer;
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const PatientTreatmentModal = ({ patient, onClose }) => {
    const [tratamente, setTratamente] = useState(patient.any.tratamente);

    const handleSaveTreatment = async () => {
        const lista_tratamente = tratamente
            .split(/[,\s]+/)
            .map(t => t.trim())
            .filter(t => t.length > 0);
        const lista_alergii = patient.any.alergii.split(/[,\s]+/)
            .map(t => t.trim())
            .filter(t => t.length > 0);

        const alergiiLower = lista_alergii.map(a => a.toLowerCase());

        const conflicte = lista_tratamente.filter(t =>
            alergiiLower.includes(t.toLowerCase())
        );

        if(conflicte.length > 0) {
            alert("Atentie! Ai adaugat un tratament la care pacientul e alergic!");
        }
        try {
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
                alert(errorData.message || 'Eroare la actualizarea pacientului!');
                return;
            }

            alert('Pacient actualizat cu succes!');
            onClose();
        } catch (error) {
            console.error('Eroare la submit:', error);
            alert('Eroare la comunicarea cu serverul!');
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
                <h2 className="text-xl font-semibold mb-4">Tratamente pentru {patient.any.lastName} {patient.any.firstName}</h2>


                <div className="flex gap-2 mb-4">
                    <input style={{width:'80%'}}
                        type="text"
                        value={tratamente} onChange={e => setTratamente(e.target.value)}
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

                <button
                    onClick={onClose}

                >
                    Close
                </button>
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

    const handleEdit = (cnp) => {
        navigate(`/edit/${cnp}`);
    };
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
                console.log(data);
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
            } else {
                alert('Eroare la ștergerea pacientului');
            }
        } catch (error) {
            console.error('Eroare la ștergere:', error);
        }
    };

    return (
        <div className={"form-container"} style={{maxWidth:'1200px'}}>
            <div style={{ marginBottom: '20px' }}>

                {triggered === true && ( <><input
                    type="text"
                    placeholder="Caută pacient după nume sau CNP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px', marginBottom: '15px', width: '90%' }}
                />
                </> )}
                <TooltipButton onClick={r=> setTriggered(!triggered)} tooltipText={"Search patient"} style={{ padding: '8px'}}><FaMagnifyingGlass/></TooltipButton>
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
                                {' '}<TooltipButton tooltipText={"Add treatment"} style={{backgroundColor: "darkblue"}} onClick={() => {
                                    setShowTreatmentModal(true);
                                    setSelectedPatient(patient);
                            }}><FaUserDoctor/></TooltipButton>
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
    );
}

