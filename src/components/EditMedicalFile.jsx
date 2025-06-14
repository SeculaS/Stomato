import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function EditMedicalFile() {
    const { cnp } = useParams();
    const navigate = useNavigate();
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
        consentTimestamp: '',
        others: '',
        under18: '',
        tutoreNume: '',
        tutoreCNP: '',
        alergii: '',
        tratamente: '',
    });

    useEffect(() => {
        if (!cnp) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`${backendUrl}/get-form-data?cnp=${encodeURIComponent(cnp)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    toast.error(errorData.error || 'Eroare la încărcarea datelor!');
                    return;
                }
                const data = await response.json();
                setFormData(data.any);
            } catch (error) {
                console.error('Eroare la fetch:', error);
                toast.error('Eroare la comunicarea cu serverul');
            }
        };

        fetchPatientData();
    }, [cnp]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = {
            ...formData,
            [name]: value
        };
        updatedFormData.under18 = isOver18(updatedFormData.birthDate) ? 'nu' : 'da';
        if(updatedFormData.CNP.length >= 9) updatedFormData.birthDate = setBirthDate(updatedFormData.CNP);
        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateCNP(formData.CNP)) {
            toast.error("CNP invalid!");
            return;
        }

        if (!isOver18(formData.birthDate) &&
            (!validateCNP(formData.tutoreCNP) || formData.tutoreNume.length < 1)) {
            toast.error("CNP sau nume tutore invalid!");
            return;
        }

        if (formData.firstName.length < 1 || formData.lastName.length < 1) {
            toast.error("Nume sau prenume invalid!");
            return;
        }

        if (formData.signature.length < 1) {
            toast.error("Semnătura invalidă!");
            return;
        }

        if (formData.address.length < 1) {
            toast.error("Adresă invalidă!");
            return;
        }

        if (!isValidBirthDate(formData.birthDate)) {
            toast.error("Data de naștere este invalidă!");
            return;
        }


        if (formData.gumBleeding.length < 1 || formData.toothSensitivity.length < 1 ||
            formData.bruxism.length < 1 || formData.orthoProblems.length < 1) {
            toast.error("Nu ai răspuns la toate întrebările despre sănătatea orală!");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/update-patient/${encodeURIComponent(formData.CNP)}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.message || 'Eroare la actualizarea pacientului!');
                return;
            }

            toast.success('Pacient actualizat cu succes!');
            navigate('/patienti')
        } catch (error) {
            console.error('Eroare la submit:', error);
            toast.error('Eroare la comunicarea cu serverul!');
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
                <input name="CNP" type="number" value={formData.CNP} onChange={handleChange} required={true} disabled={true}/>
            </label>

            <label>
                Data nașterii:
                <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required={true} onKeyDown={(e) => e.preventDefault()} disabled={true} />
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
            <label>
                Alergii(separate prin ","):
                <input name="alergii" type="text" value={formData.alergii} onChange={handleChange} />
            </label>
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
                <div>
                <label key={index} className="custom-checkbox">
                    <input style={{width: '100%'}}
                           type="checkbox"
                           checked={formData.medicalHistory?.[conditie] || false}
                           onChange={(e) => {
                               setFormData(prev => ({
                                   ...prev,
                                   medicalHistory: {
                                       ...prev.medicalHistory,
                                       [conditie]: e.target.checked
                                   }
                               }));
                           }}
                    /><span className="checkmark" style={{width: '9px', height: '9px'}}></span>
                    {conditie}
                </label>
                </div>
            ))}
            {parseInt(formData.CNP[0])%2 === 0 && ( <>
            <h3>Secțiune pentru femei</h3>

            <label>
                Sunteți însărcinată?
                <div>
                    <label>
                        <input style={{width:'10%'}}
                            type="radio"
                            name="pregnant"
                            value="da"
                            checked={formData.pregnant === 'da'}
                            onChange={handleChange}
                        /> DA
                    </label>
                    <label>
                        <input style={{width:'10%'}}
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
                        <input style={{width:'10%'}}
                            type="radio"
                            name="nursing"
                            value="da"
                            checked={formData.nursing === 'da'}
                            onChange={handleChange}
                        /> DA
                    </label>
                    <label>
                        <input style={{width:'10%'}}
                            type="radio"
                            name="nursing"
                            value="nu"
                            checked={formData.nursing === 'nu'}
                            onChange={handleChange}
                        /> NU
                    </label>
                </div>
            </label> </>)}

            <label>
                Alte probleme:
                <input
                    type="text"
                    name="others"
                    value={formData.others || ''}
                    onChange={handleChange}
                />
            </label>



            <button type="submit">Salveaza</button>
        </form>

    );
}

// VALIDĂRI

function validateCNP(cnp_val) {
    console.log(cnp_val);
    console.log(cnp_val.length);
    return cnp_val.length === 13;

}
function isValidBirthDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
}


function isOver18(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return birthDate <= eighteenYearsAgo;
}
function setBirthDate(cnp) {
    const genderDigit = parseInt(cnp[0], 10);
    const year = parseInt(cnp.slice(1, 3), 10);
    const month = parseInt(cnp.slice(3, 5), 10);
    const day = parseInt(cnp.slice(5, 7), 10);

    let fullYear;

    if (genderDigit === 1 || genderDigit === 2) {
        fullYear = 1900 + year;
    } else if (genderDigit === 3 || genderDigit === 4) {
        fullYear = 1800 + year;
    } else if (genderDigit === 5 || genderDigit === 6) {
        fullYear = 2000 + year;
    } else if (genderDigit === 7 || genderDigit === 8 || genderDigit === 9) {
        fullYear = 2000 + year;
    }

    const birthDate = new Date(fullYear, month - 1, day+1); // luni de la 0 la 11

    if (birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day+1) {
        return 'Data invalida';
    }

    return birthDate.toISOString().split('T')[0]; // format YYYY-MM-DD
}