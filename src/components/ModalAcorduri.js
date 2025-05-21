import React from 'react';
import TooltipButton from "./TooltipButton";
import { useNavigate } from "react-router-dom";

export default function ModalAcorduri({ patient, onClose }) {
    const navigate = useNavigate();
    const handleSelect = (acordType) => {
        if(acordType === 'pedodontic') {
            navigate(`/acordpedocreate/${patient.any.CNP}`);
        }
        else alert(`A fost selectat: ${acordType} pentru pacientul ${patient.any.firstName} ${patient.any.lastName}`);

        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: 20,
                borderRadius: 10,
                minWidth: 900,
                textAlign: 'center'
            }}>
                <h3>Acordurile pacientului: {patient.any.firstName} {patient.any.lastName} </h3>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    gap: 20
                }}>
                    {/* Categorie 1 */}
                    <div style={{
                        flex: 1,
                        margin: '0 10px',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 10
                    }}>
                        <h4>Acorduri pedodontie</h4>
                        <hr />
                        <TooltipButton tooltipText={"Creaza un nou acord"} onClick={() => handleSelect('pedodontic')}>+</TooltipButton>
                    </div>

                    {/* Categorie 2 */}
                    <div style={{
                        flex: 1,
                        margin: '0 10px',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 10
                    }}>
                        <h4>Acorduri endocrinologice</h4>
                        <hr />
                        <TooltipButton tooltipText={"Creaza un nou acord"} onClick={() => handleSelect('endocrinologic')}>+</TooltipButton>
                    </div>

                    {/* Categorie 3 */}
                    <div style={{
                        flex: 1,
                        margin: '0 10px',
                        border: '1px solid #ccc',
                        borderRadius: 8,
                        padding: 10
                    }}>
                        <h4>Acorduri generale</h4>
                        <hr />
                        <TooltipButton tooltipText={"Creaza un nou acord"} onClick={() => handleSelect('general')}>+</TooltipButton>
                    </div>
                </div>

                <br />
                <button onClick={onClose} style={{ marginTop: 20 }}>Inchide</button>
            </div>
        </div>
    );
}
