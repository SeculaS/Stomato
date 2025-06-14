import React from 'react';
import TooltipButton from "./TooltipButton";
import { useNavigate } from "react-router-dom";
import {FaFileCirclePlus} from "react-icons/fa6";

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
        if(acord.any.formType === 'pedodontic') navigate(`/pedoview/${acord._id}`);
        else if(acord.any.formType === 'endocrinologic') navigate(`/endoview/${acord._id}`);
        else if(acord.any.formType === 'chirurgie') navigate(`/chirview/${acord._id}`);
        else navigate(`/geneview/${acord._id}`);
    };

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
                width: '100%',
                maxWidth: 1400,
                maxHeight: '90vh',
                overflowY: 'auto',
                boxSizing: 'border-box'
            }}>
                <h3><center>Acordurile pacientului: {patient.any.firstName} {patient.any.lastName}</center></h3>

                <div style={{ display: 'flex',
                    flexWrap: 'wrap',
                    gap: 20,
                    marginTop: 20,
                    justifyContent: 'center'}}>
                    {['pedodontic', 'endocrinologic', 'general', 'chirurgie'].map((tip) => (
                        <div key={tip} style={{flex: '1 1 300px',
                            border: '1px solid #ccc',
                            borderRadius: 8,
                            padding: 10,
                            minWidth: 200,
                            maxWidth: 300}}>
                            <h4>Acorduri {tip.charAt(0).toUpperCase() + tip.slice(1)}{(tip !=='chirurgie' && <>e</>)}</h4>
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
                            <center><TooltipButton style={{ marginBottom: 10 }} onClick={() => {
                                if(tip === 'pedodontic') {
                                    navigate(`/acordpedocreate/${patient.any.CNP}`);
                                }
                                else if (tip === 'endocrinologic') {
                                    navigate(`/acordendocreate/${patient.any.CNP}`);
                                }
                                else if(tip === 'chirurgie') {
                                    navigate(`/acordchircreate/${patient.any.CNP}`);
                                }
                                else
                                    navigate(`/acordgenecreate/${patient.any.CNP}`);
                            }} tooltipText={"Creeaza acord"}><FaFileCirclePlus/></TooltipButton></center>

                            {/* Lista acorduri */}

                        </div>
                    ))}
                </div>

                <center><button onClick={onClose} style={{ marginTop: 20 }}>Close</button></center>
            </div>
        </div>
    );
}
