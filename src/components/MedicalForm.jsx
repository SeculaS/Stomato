import { useState } from 'react';
import {useNavigate} from "react-router-dom";


export default function MedicalForm() {
    const [showGDPRModal, setShowGDPRModal] = useState(false);
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
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if(!isOver18(formData.birthDate)) formData.under18 = 'da';
    else formData.under18 = 'nu';
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateCNP(formData.CNP)) {
            alert("CNP invalid! Verifică formatul și cifra de control.");
            return;
        }
        if (!isOver18(formData.birthDate) && (!validateCNP(formData.tutoreCNP) || formData.tutoreNume.length < 1)) {
            alert("CNP sau nume tutore invalid!");
            return;
        }
        if(formData.firstName.length < 1 || formData.lastName.length < 1){
            alert("Nume sau prenume invalid!");
            return;
        }
        if(formData.signature.length < 1){
            alert("Semnatura invalida, scrieti numele si prenumele!");
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
      <h2>Chestionar Medical – Date personale</h2>

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

<label>
  Semnătura pacientului:
  <input
    type="text"
    name="signature"
    value={formData.signature || ''}
    onChange={handleChange}
    placeholder="Introduceți numele complet"
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
<button type="submit">Trimite</button>
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