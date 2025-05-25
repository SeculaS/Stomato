import React, { useState, useRef } from 'react';
import {useNavigate} from "react-router-dom";
import TooltipButton from "./TooltipButton";
import {FaArrowLeft} from "react-icons/fa6";
import {FaArrowRight} from "react-icons/fa6";
import {FaCheckCircle} from "react-icons/fa";
import axios from "axios";

export default function MedicalForm() {
    const [showGDPRModal, setShowGDPRModal] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const canvasRef = useRef(null);
    const [cnp, setCnp] = useState(null);
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        address: '',
        CNP: '',
        birthDate: '',
        phone: '',
        email: '',
        guidedBy: '',
        gumBleeding: '',
        toothSensitivity: '',
        orthoProblems: '',
        bruxism: '',
        medicalHistory: {},
        pregnant: '',
        pregnancyMonth: '',
        signedDate: '',
        signature: '',
        nursing: '',
        consent: '',
        consentTimestamp: null,
        others: '',
        under18: '',
        tutoreNume: '',
        tutoreCNP: ''
      });


    const navigate = useNavigate();
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
    const { name, value } = e.target;
      const canvas = canvasRef.current;
      if(canvas) {
          const context = canvas.getContext('2d');
          context.lineWidth = 2;
          context.lineCap = 'round';
          context.strokeStyle = '#000000';
      }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
        if(!isOver18(formData.birthDate) && formData.birthDate !== '') formData.under18 = 'da';
        else formData.under18 = 'nu';
  };
    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top,
            };
        } else {
            return {
                x: e.nativeEvent.offsetX,
                y: e.nativeEvent.offsetY,
            };
        }
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const { x, y } = getPos(e);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);

        setIsDrawing(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        setIsSigned(true);
        context.stroke();
    };

    const stopDrawing = (e) => {
        e.preventDefault();
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        setIsSigned(false);
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCNP(formData.CNP)) {
            alert("CNP invalid! Verifică formatul și cifra de control.");
            return;
        }
        setCnp(formData.CNP);
        if (!isOver18(formData.birthDate) && (!validateCNP(formData.tutoreCNP) || formData.tutoreNume.length < 1)) {
            alert("CNP sau nume tutore invalid!");
            return;
        }
        if(formData.firstName.length < 1 || formData.lastName.length < 1){
            alert("Nume sau prenume invalid!");
            return;
        }

        if(formData.address.length < 1){
            alert("Adresa invalida!");
            return;
        }
        if(!isValidBirthDate(formData.birthDate)) {
            alert("Data de nastere este invalida!");
            return;
        }
        if(!isCurrentDate(formData.signedDate)) {
            alert("Se poate semna doar la data curenta!");
            return;
        }
        if(formData.gumBleeding.length < 1 || formData.toothSensitivity.length < 1 || formData.bruxism.length < 1 || formData.orthoProblems.length < 1){
            alert("Nu ai raspuns la \"Intrebari despre sanatatea orala\"!");
            return;
        }
        try {
            await axios.post('http://localhost:4000/check-cnp', { cnp });
            setMessage('DISP'); // "CNP-ul este disponibil."
        } catch (err) {
            if (err.response && err.response.data.error) {
                setMessage(err.response.data.error); // "CNP-ul există deja"
            } else {
                setMessage('Eroare la conectare cu serverul.');
            }
        }
        try {
            if(message !== 'DISP') {
                alert(message);
                return;
            }
            if(!isSigned) {
                alert("Nu ati semnat documentul!");
                return;
            }
            const canvas = canvasRef.current;
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            let imgData = new FormData();
            imgData.append('img', blob, `signature-${Date.now()}_${formData.firstName}${formData.lastName}${formData.formType}.png`);

            const res = await fetch('http://localhost:4000/upload', {
                method: 'POST',
                body: imgData,
            });


            const data = await res.json();
            formData.signature = data.imageUrl;

            const response = await fetch('http://localhost:4000/submit-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert('Formular trimis cu succes! ' + result.message);
                navigate('/patienti')
            } else {
                alert('Eroare la trimitere: ' + result.error);
            }
        } catch (error) {
            console.error('Eroare la trimiterea datelor:', error);
            alert('A apărut o eroare. Verifică consola pentru detalii.');
        }
    };


    return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>FISA CHESTIONAR</h2>
        {step === 1 && (<>
            <h3>DATE PERSONALE</h3>
            <label>
            Nume:
            <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} required={true} />
</label>

    <label>
        Prenume:
        <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} required={true} />
    </label>

    <label>
        Adresă (conform C.I.):
        <input name="address" type="text" value={formData.address} onChange={handleChange} required={true}  />
    </label>
    <label>
        Cod numeric personal:
        <input name="CNP" type="number" value={formData.CNP} onChange={handleChange} required={true} />
    </label>

    <label>
        Data nașterii:
        <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required={true} onKeyDown={(e) => e.preventDefault()} />
    </label>

    <label>
        Telefon:
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} required={true} />
    </label>

    <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} required={true} />
    </label>



    {formData.under18 === 'da' && (
        <>
            <label>
                Nume tutore:
                <input
                    type="text"
                    name="tutoreNume"
                    value={formData.tutoreNume || ''}
                    onChange={handleChange}
                />
            </label>

            <label>
                CNP tutore:
                <input
                    type="text"
                    name="tutoreCNP"
                    value={formData.tutoreCNP || ''}
                    onChange={handleChange}
                />
            </label>
        </>
    )}
    <label>
        Cum ați aflat de clinică?
        <input name="guidedBy" type="text" value={formData.guidedBy} onChange={handleChange} />
    </label>
    </>
        )}
        {step === 2 && (
            <>
                <h3>Întrebări despre sănătatea orală</h3>

                <label>
                    Vă sângerează gingiile la periaj?
                    <select name="gumBleeding" value={formData.gumBleeding || ''} onChange={handleChange}>
                        <option value="">Selectează</option>
                        <option value="da">DA</option>
                        <option value="nu">NU</option>
                        <option value="uneori">UNEORI</option>
                    </select>
                </label>

                <label>
                    Dinții sunt sensibili la rece/cald/presiune?
                    <select name="toothSensitivity" value={formData.toothSensitivity || ''} onChange={handleChange}>
                        <option value="">Selectează</option>
                        <option value="da">DA</option>
                        <option value="nu">NU</option>
                        <option value="uneori">UNEORI</option>
                    </select>
                </label>

                <label>
                    Ați avut probleme după tratamente ortodontice?
                    <select name="orthoProblems" value={formData.orthoProblems || ''} onChange={handleChange}>
                        <option value="">Selectează</option>
                        <option value="da">DA</option>
                        <option value="nu">NU</option>
                        <option value="uneori">UNEORI</option>
                    </select>
                </label>

                <label>
                    Scrâșniți sau încleștați dinții?
                    <select name="bruxism" value={formData.bruxism || ''} onChange={handleChange}>
                        <option value="">Selectează</option>
                        <option value="da">DA</option>
                        <option value="nu">NU</option>
                        <option value="uneori">UNEORI</option>
                    </select>
                </label>
            </>
        )}
        {step === 3 && (
            <>

                <h3>Istoric medical</h3>
                <p>Bifați bolile pe care le aveți sau le-ați avut:</p>

                {[
                    'Boli de inimă',
                    'Proteze valvulare/vasculare',
                    'Diabet',
                    'Hepatită',
                    'TBC sau boli infecțioase',
                    'Reumatism',
                    'Probleme respiratorii',
                    'Tulburări de coagulare',
                    'Anemie sau transfuzie',
                    'Boli renale',
                    'Glaucom',
                    'Epilepsie',
                    'Migrene',
                    'Osteoporoză',
                    'Ulcer gastric',
                    'Tiroidă',
                    'Boli neurologice',
                    'Probleme psihice'
                ].map((conditie, index) => (
                    <label key={index} className="checkbox">
                        <input
                            type="checkbox"
                            checked={formData.medicalHistory[conditie] || false}
                            onChange={(e) => {
                                setFormData(prev => ({
                                    ...prev,
                                    medicalHistory: {
                                        ...prev.medicalHistory,
                                        [conditie]: e.target.checked
                                    }
                                }));
                            }}
                        />
                        {conditie}
                    </label>
                ))}{ (parseInt(formData.CNP[0])%2 === 0 && formData.CNP.length > 0) && ( <>
                <h3>Secțiune pentru femei</h3>

                <label>
                    Sunteți însărcinată?
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="pregnant"
                                value="da"
                                checked={formData.pregnant === 'da'}
                                onChange={handleChange}
                            /> DA
                        </label>
                        <label style={{ marginLeft: '2rem' }}>
                            <input
                                type="radio"
                                name="pregnant"
                                value="nu"
                                checked={formData.pregnant === 'nu'}
                                onChange={handleChange}
                            /> NU
                        </label>
                    </div>
                </label>

                {(formData.pregnant === 'da') && (
                    <label>
                        Dacă da, în ce lună?
                        <input
                            type="text"
                            name="pregnancyMonth"
                            value={formData.pregnancyMonth || ''}
                            onChange={handleChange}
                            placeholder="Ex: luna a 5-a"
                        />
                    </label>
                )}

                <label>
                    Alăptați?
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="nursing"
                                value="da"
                                checked={formData.nursing === 'da'}
                                onChange={handleChange}
                            /> DA
                        </label>
                        <label style={{ marginLeft: '2rem' }}>
                            <input
                                type="radio"
                                name="nursing"
                                value="nu"
                                checked={formData.nursing === 'nu'}
                                onChange={handleChange}
                            /> NU
                        </label>
                    </div>
                </label> </>)}


            </>
        )}
        {step === 4 && (
            <>

                <h3>Declarație pacient</h3>
                <p style={{ fontSize: '0.9rem', textAlign: 'justify' }}>

                    Certific autenticitatea informațiilor furnizate și precizez că la întrebările pe care le-am pus (dacă este cazul) mi s-a răspuns satisfăcător.
                    Nu îl voi face răspunzător pe medicul curant și/sau pe vreunul din membrii echipei, pentru acțiunile terapeutice întreprinse sau omise
                    din cauza greșelilor sau omisiunilor mele în completarea acestui formular. Acest chestionar respectă recomandările CMDR Timiș,
                    iar toate informațiile pe care ni le furnizați sunt strict confidențiale, fiind folosite doar în scopul îndeplinirii actului medical.
                    Vă mulțumim pentru timpul acordat completării acestui formular.
                    <br /><br />
                    <em>*Acest formular aparține Clinicii Dental Point. Sustragerea, copierea sau multiplicarea lui se va pedepsi conform legii.</em>
                </p>


                <label>
                    Alte probleme:
                    <input
                        type="text"
                        name="others"
                        value={formData.others || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Data completării:
                    <input
                        type="date"
                        name="signedDate"
                        value={formData.signedDate || ''}
                        onChange={handleChange}
                        required={true} />
                </label>



                <p style={{ fontSize: '0.9rem', textAlign: 'justify' }}>
                    <strong>Scopul colectării datelor</strong> este acordarea de servicii de sănătate în condițiile legii.<br />
                    Sunteți obligat(ă) să furnizați datele, acestea fiind necesare legalității acordării.
                    {' '}<br/>
                    <span
                        style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => setShowGDPRModal(true)}
                    >
    Click aici pentru detalii
  </span>.
                </p>


                {showGDPRModal && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 1000,
                        }}
                        onClick={() => setShowGDPRModal(false)}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '2rem',
                                borderRadius: '8px',
                                maxWidth: '600px',
                                width: '90%',
                                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                                position: 'relative'
                            }}
                            onClick={(e) => e.stopPropagation()} // oprește propagarea clickului ca să nu închidă
                        >
                            <h2>Informare GDPR</h2>
                            <p>
                                Prin completarea acestui formular vă dați consimțământul pentru prelucrarea datelor cu caracter personal în scopul furnizării de servicii medicale, conform Regulamentului UE 2016/679 (GDPR). Aveți dreptul de acces, rectificare, ștergere și restricționare a datelor. Datele nu vor fi partajate cu terți fără consimțământul dumneavoastră, cu excepția cazurilor prevăzute de lege.
                            </p>
                            <button onClick={() => setShowGDPRModal(false)}>Închide</button>
                        </div>
                    </div>
                )}
                <label>
                    Semnătura pacientului:

                </label>
                <div style={{
                    padding: '16px',
                    border: '2px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    display: 'inline-block',
                    backgroundColor: '#f9f9f9'
                }}>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={100}
                        className="border border-gray-300 rounded touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div><br/><br/>
                <button onClick={clearCanvas} type={"button"}>Șterge semnatura</button> {' '}


            </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '30px 30px 0 30px' }}>
        {step > 1 && (
            <>
                <div style={{ display: "flex-start"}}>
                    <TooltipButton tooltipText={"Previous step"} type={"button"}
                                   onClick={r=>prevStep()}
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
                                       display: 'flex',               // ← adăugat
                                       alignItems: 'center',         // ← adăugat
                                       justifyContent: 'center',
                                   }}
                    >
                        <FaArrowLeft/>
                    </TooltipButton>
                </div>
            </>
            )}
            {step === 1 && (
                <>
                    <div style={{ display: "flex-start"}}>
                        <TooltipButton tooltipText={"Previous step"} type={"button"}
                                       onClick={r=>prevStep()}
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
                                           display: 'none',               // ← adăugat
                                           alignItems: 'center',         // ← adăugat
                                           justifyContent: 'center',
                                       }}
                        >
                            <FaArrowLeft/>
                        </TooltipButton>
                    </div>
                </>
            )}
        <div style={{ display: 'flex-end'}}>
            {step < 4 && ( <>

            <TooltipButton tooltipText={"Next step"} type={"button"}
                           onClick={r=>nextStep()}
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
                               display: 'flex',               // ← adăugat
                               alignItems: 'center',         // ← adăugat
                               justifyContent: 'center',
                           }}
            >
                <FaArrowRight/>
            </TooltipButton>
            </>
            )}
            {step === 4 && (
                <>
                    <TooltipButton tooltipText={"Trimite"} type={"submit"}

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
                                       display: 'flex',               // ← adăugat
                                       alignItems: 'center',         // ← adăugat
                                       justifyContent: 'center',
                                   }}
                    >
                        <FaCheckCircle/>
                    </TooltipButton>
                </>
            )}
        </div>
        </div>

    </form>

  );

}

function validateCNP(cnp) {
    if (!/^\d{13}$/.test(cnp)) return false;

    const controlKey = "279146358279";
    const cnpDigits = cnp.split("").map(Number);
    const sum = cnpDigits.slice(0, 12).reduce((acc, digit, i) => {
        return acc + digit * Number(controlKey[i]);
    }, 0);

    const remainder = sum % 11;
    const controlDigit = remainder === 10 ? 1 : remainder;

    return controlDigit === cnpDigits[12];
}

function isValidBirthDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false; // Nu e o dată validă

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date <= today;
}
function isCurrentDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false; // Nu e o dată validă

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date.getDate() === today.getDate(); // permite doar datele de azi
}
function isOver18(birthDateString) {
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) return false; // dată invalidă

    const today = new Date();
    const eighteenYearsAgo = new Date(
        today.getFullYear() - 18, today.getMonth(), today.getDate()
    );
    console.log(eighteenYearsAgo.toDateString());
    return birthDate <= eighteenYearsAgo;
}