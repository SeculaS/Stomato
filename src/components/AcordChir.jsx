import { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DropdownSection from "./DropdownSelection";
export default function AcordChir() {
    const { cnp } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        medic:'',
        cnp: cnp,
        address: '',
        tutor: '',
        signedDate: '',
        signature: '',
        consent: '',
        others: '',
        consentTimestamp: '',
        formType: 'chirurgie'
    });

    useEffect(() => {
        if (!cnp) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/get-form-data?cnp=${encodeURIComponent(cnp)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || 'Eroare la încărcarea datelor!');
                    return;
                }
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    address: data.any.address,
                    lastName: data.any.lastName,
                    firstName: data.any.firstName,
                    tutor: data.any.tutoreNume,
                    signedDate: new Date().toISOString().split("T")[0]
                }));
            } catch (error) {
                console.error('Eroare la fetch:', error);
                alert('Eroare la comunicarea cu serverul');
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
        setFormData(updatedFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/submit-form-pedodontic', {
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
        <form className="form-container" onSubmit={handleSubmit} style={{ maxWidth: '1000px'}}>
            <h2><center>ACORDUL PACIENTULUI INFORMAT<br/>
                -CHIRURGIE-</center></h2>
            <hr/>
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
                Medic:
                <input name="medic" type="text" value={formData.medic} onChange={handleChange} required={true}  />
            </label>



            {formData.tutor !== '' && (
                <>
                    <label>
                        Nume tutore:
                        <input
                            type="text"
                            name="tutor"
                            value={formData.tutor || ''}
                            onChange={handleChange}
                        />
                    </label>


                </>
            )}
            <label>
                Actul medical propus:
                <input name="others" type="text" value={formData.others} onChange={handleChange} required={true}  />
            </label>
            <label><strong>
                În cadrul tratamentului stomatologic medicii dentiști au obligația de a informa pacienții asupra tratamentului recomandat. Tratamentul poate fi efectuat doar după ce pacientul a fost informat corespunzător, a înțeles informațiile respective și și-a exprimat acordul asupra tratamentului. Această procedură poartă numele de ACORD INFORMAT.
                <br/>
                Vă rugăm să citiți cu atenție informațiile următoare și să luați la cunoștiință acest formular care acoperă informațiile din cursul consultației sau/și a tratamentelor ce vor fi efectuate.
                <br/>
                Referitor la tratamentele stomatologice întreprinse/efectuate în clinica noastră dorim să vă aducem la cunoștiință câteva informații legate de acestea:
            </strong>
            </label>
            <DropdownSection title="Referitor la tratamentele CHIRURGICALE efectuate în cabinetul nostru dorim să vă informăm
urmatoarele:" content={
                <>
                    Toate procedurile de chirurgie efectuate în cabinetul de medicină dentară presupun o serie de riscuri și
                    efecte secundare, unele dintre ele inevitabile cum ar fi:
                    <ul>
                        <li>reacții alergice/toxice la medicamente și substanțe anestezice pre, intra și postoperator;</li>
                        <li>
                            hemoragie intra și postoperatorie;
                        </li>
                        <li>hematoame, echimoze, edeme postoperatorii;</li>
                        <li>dureri în teritoriul oro-maxilo-facial; </li>
                        <li>dehiscența plăgilor;</li>
                        <li>lezarea dintilor invecinati;</li>
                        <li>hipoestezia/anestezia nervului alveolar inferior, mentonier, lingual, infraorbitar;</li>
                        <li>infecții ale spațiilor fasciale cervico-faciale;</li>
                        <li>osteită/osteomielita oaselor maxilare;</li>
                        <li>comunicare oro-sinuzală sau oro-nazală;</li>
                        <li>sinuzite maxilare;</li>
                        <li>fracturi ale oaselor maxilare;</li>
                        <li>accidente prin ruperea instrumentului in timpul manevrelor chirurgicale;</li>
                        <li>escoriații, plăgi, ulcerații produse prin contactul mucoaselor cu instrumentarul chirurgical sau cu
                            substanțe medicamentoase;</li>
                        <li>
                            înaintea manoperei chirurgicale, este posibil să primiți medicație anxiolitică, caz în care nu este
                            recomandat condusul niciunui mijloc de transport și nici folosirea utilajelor;
                        </li>
                    </ul>
                    În cazul în care aveți o lucrare protetică provizorie, imediat după inserarea implanturilor dentare, trebuie
                    să aveți în vedere faptul că aceasta are o durată limitată de viață, 4 – 6 luni. Nefinalizarea tratamentului
                    protetic, prin neînlocuirea acestea cu o lucrare protetică definitivă pe implanturi, poate duce de la ruperea
                    lucrării inițiale până la pierderea implanturilor inserate. Lucrare protetică provizorie are rolul de a vă
                    ajuta să puteți mânca, să puteți vorbi, să puteți zâmbi și să nu aveți niciun disconfort social pe durata
                    întregului tratament.

                </>
            }></DropdownSection>


            <label><b>
                <p>
                    <p>Prin semnarea acestui acord informat declar că:</p><br/>
                    <p>Am primit și înteles informațiile asupra diagnosticului, prognosticului și evoluției afecțiunilor de care sufăr, despre natura și scopul actului medical, asupra intervențiilor și strategiei de tratament propuse, asupra beneficiilor dar și a riscurilor, complicațiilor potențiale asociate actuluin medical propus.
                    </p><br/><p>
                    Am primit și înțeles informațiile asupra tratamentelor alternative posibile care pot fi: neefectuarea niciunui tratament, să se aștepte până simptomele devin mai clare sau extracția dintelui. În cazul neefectuării niciunui tratament,  mi s-au explicat riscurile și consecințele.

                </p>
                    <p>Am fost informat și înțeleg necesitatea controalelor preventive și riscurile nerespectșrii recomandărilor medicale.
                    </p><p>Am primit informații asupra regulilor de funcționare a cabinetului, asupra necesității respectării programărilor și secvențelor acestora.
                </p>
                    <p>Înțeleg că în timpul și după efectuarea tratamentului, pot contacta medicul curant dacă apar întrebări și nelămuriri ulterioare. De asemenea pot solicita o a doua opinie formulată de către un alt medic.
                    </p>
                    <p>
                        Informat fiind ca intervențiile chirurgicale din sfera oro-maxilo-faciala pot fi efectuate și de către
                        un chirurg maxilo facial, imi exprim acordul cu efectuarea lor în cabinetul de medicina dentara
                        Dental Point.
                    </p>
                    <br/>
                    <p>Am luat cunoștință că datele personale sunt păstrate în fișa pacientului, sunt arhivate și sunt utilizate la întocmirea raporturilor statistice și în scop de cercetare științifică de către instituțiile abilitate. Aceste date sunt confidențiale și nu vor fi furnizate în alte scopuri, fără avizul meu. În consecință și în condițiile precizate, îmi dau liber și în cunoștință de cauză consimțămâmtul la prelucrarea datelor personale cu caracter personal.</p>
                </p><p>

                Prin semnarea prezentei Accept efectuarea actului medical, de către <u>{formData.medic}</u> {' '}
                al Dental Point Clinic precum și angajații/colaboratorii acestuia, sunt de acord cu efectuarea analizelor paraclinice necesare pentru stabilirea diagnosticului, a efectuării investigațiilor radiologice și dacă este necesar a realizării de fotografii în scop diagnostic, didactic sau științific cu respectarea confidențialității actului medical.

            </p>
            </b>
            </label>
            <label>
                Data completării:
                <input
                    type="date"
                    name="signedDate"
                    value={
                        formData.signedDate || ''
                    }
                    onChange={handleChange}
                    required={true} disabled={true}/>
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
            <button type="submit">Trimite</button>
        </form>

    );
}
