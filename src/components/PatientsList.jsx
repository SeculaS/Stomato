import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {FaPenToSquare, FaTrashCan} from "react-icons/fa6";

export default function PatientsList({ onEdit }) {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();
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
                            <td>
                                <button onClick={() => handleEdit(patient.any.CNP)}><FaPenToSquare /></button>{' '}
                                <button style={{backgroundColor:"red"}} onClick={() => handleDelete(patient.any.CNP)}><FaTrashCan  /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Exemplu floating button */}
                <button
                    onClick={() => navigate('/chestionar')}
                    style={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: 50,
                        height: 50,
                        fontSize: 24,
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    }}
                >
                    +
                </button>
            </>
        </div>
    );
}

