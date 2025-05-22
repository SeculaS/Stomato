import React from 'react';
import TooltipButton from "./TooltipButton";
import { useNavigate } from "react-router-dom";


export default function ModalAcorduri({ patient, acorduri, onClose }) {
    // grupare acorduri pe tip
    const navigate = useNavigate();
    const grouped = acorduri.reduce((acc, a) => {
        const tip = a.any.formType;
        acc[tip] = acc[tip] || [];
        acc[tip].push(a);
        acc[tip].sort((b, c) => new Date(c.any.consentTimestamp) - new Date(b.any.consentTimestamp)); // sort desc
        return acc;
    }, {});

    const formatTimestamp = (ts) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ` +
            `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    const genereazaPDF = (acord) => {
        // Ex: creezi un PDF folosind jsPDF sau ceva similar
        console.log("Generează PDF pentru:", acord._id);
        // ...
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', padding: 20, borderRadius: 10,
                minWidth: 900, textAlign: 'center', maxHeight: '80vh', overflowY: 'auto'
            }}>
                <h3>Acordurile pacientului: {patient.any.firstName} {patient.any.lastName}</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, gap: 20 }}>
                    {['pedodontic', 'endocrinologic', 'general', 'chirurgie'].map((tip) => (
                        <div key={tip} style={{ flex: 1, margin: '0 10px', border: '1px solid #ccc', borderRadius: 8, padding: 10 }}>
                            <h4>Acorduri {tip.charAt(0).toUpperCase() + tip.slice(1)}</h4>
                            <hr />
                            {(grouped[tip] || []).map(acord => (
                                <a
                                    key={acord._id}
                                    href="#!"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        genereazaPDF(acord);
                                    }}
                                    style={{
                                        display: 'block',
                                        marginBottom: 6,
                                        color: '#1e40af',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    <li>{formatTimestamp(acord.any.consentTimestamp)}</li>
                                </a>
                            ))}

                            {(!grouped[tip] || grouped[tip].length === 0) && <p style={{ fontStyle: 'italic', color: '#888' }}>Niciun acord</p>}
                            {/* Buton creare nou */}
                            <TooltipButton style={{ marginBottom: 10 }} onClick={() => {
                                if(tip === 'endocrinologic') {
                                    navigate(`/acordpedocreate/${patient.any.CNP}`);
                                }
                                else
                                    alert(tip);
                            }} tooltipText={"Creeaza acord"}>+</TooltipButton>

                            {/* Lista acorduri */}

                        </div>
                    ))}
                </div>

                <button onClick={onClose} style={{ marginTop: 20 }}>Închide</button>
            </div>
        </div>
    );
}
