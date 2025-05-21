import React, { useState } from 'react';
import {FaChevronUp, FaChevronDown} from "react-icons/fa6";

const DropdownSection = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ marginBottom: '1rem' }} >
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#1e3a8a',
                    userSelect: 'none',
                    display: 'flex',             // <-- adaugă flex
                    justifyContent: 'space-between', // <-- aliniaza titlu si sageata la margini
                    alignItems: 'center'         // <-- aliniaza vertical centrata
                }}
            >
                {title} {isOpen ? <FaChevronUp  /> : <FaChevronDown />}
            </div>

            {isOpen && (
                <div style={{ marginTop: '0.5rem', color: '#374151' }}>
                    {content}
                </div>
            )}
        </div>
    );
};

export default DropdownSection;
