import { useState } from 'react';

export default function MedicalForm() {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        address: '',
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
        consent: false,
        consentTimestamp: null
      });
      
      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Datele completate:\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h2>Chestionar Medical – Date personale</h2>

      <label>
        Nume:
        <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} />
      </label>

      <label>
        Prenume:
        <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} />
      </label>

      <label>
        Adresă (conform C.I.):
        <input name="address" type="text" value={formData.address} onChange={handleChange} />
      </label>

      <label>
        Data nașterii:
        <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} />
      </label>

      <label>
        Telefon:
        <input name="phone" type="text" value={formData.phone} onChange={handleChange} />
      </label>

      <label>
        Email:
        <input name="email" type="email" value={formData.email} onChange={handleChange} />
      </label>

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
))}
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

{formData.pregnant === 'da' && (
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
</label>

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
  Data completării:
  <input
    type="date"
    name="signedDate"
    value={formData.signedDate || ''}
    onChange={handleChange}
  />
</label>

<label>
  Semnătura pacientului:
  <input
    type="text"
    name="signature"
    value={formData.signature || ''}
    onChange={handleChange}
    placeholder="Introduceți numele complet"
  />
</label>

<h3>Informare GDPR</h3>
<p style={{ fontSize: '0.9rem', textalign: 'justify' }}>
  <strong>Scopul colectării datelor</strong> este acordarea de servicii de sănătate în condițiile legii.<br />
  Sunteți obligat(ă) să furnizați datele, acestea fiind necesare legalității acordării.
</p>


<button type="submit">Trimite</button>
    </form>
    

  );
  
}
