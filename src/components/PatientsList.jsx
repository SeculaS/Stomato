import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaPenToSquare, FaTrashCan, FaFilePdf} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import ModalAcorduri from "./ModalAcorduri"; //

export default function PatientsList({ onEdit }) {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [acorduri, setAcorduri] = useState([]);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const res = await fetch('http://localhost:4000/get-patients');
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setPatients(data);
        } catch (error) {
            console.error('Eroare la încărcarea pacienților:', error);
        }
    };
    const handleEdit = (cnp) => {
        navigate(`/edit/${cnp}`);
    };
    const handlePdfClick = (patient) => {
        setSelectedPatient(patient);

        const handleLoadAcorduri = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/acorduri', {
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
            const res = await fetch(`http://localhost:4000/delete-patient/${cnp}`, { method: 'DELETE' });
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
        <div>
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
            </>
        </div>
    );
}

