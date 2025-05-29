
import React, { useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";

import {FaDownload} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import html2pdf from 'html2pdf.js';
import backgroundImage from "./video-poster.png";
import {toast} from "react-toastify";


const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default function ViewChir() {
    const { id } = useParams();
    const targetReff = useRef({});
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        medic:'',
        cnp: '',
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
        if (!id) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`${backendUrl}/get-form-data-fromid?id=${encodeURIComponent(id)}`);
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
    }, [id]);



    const handleDownload = (acord) => {
        const element = targetReff.current;
        const options = {
            filename: `${acord.firstName}_${acord.lastName}-${acord.consentTimestamp}_chir.pdf`,
            margin:       0.5,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };



    return (
        <div className={"form-container"} style={{maxWidth:'800px'}}>
            <div ref={targetReff} style={{
                backgroundImage: `url(${backgroundImage})`,
                background: `url("${backgroundImage}")`,
                backgroundSize: "contain",

            }}>
                <p style={{textAlign: "right"}}><strong>Nr. fișă:</strong> {id}</p>
                <h2><center>ACORDUL PACIENTULUI INFORMAT <br/> CHIRURGIE </center></h2>


                <p><strong>Nume Prenume pacient:</strong> {formData.firstName}{' '}{formData.lastName} </p>

                <p><strong>Domiciliu:</strong> {formData.address}</p>

                <p><strong>Actul/actele medicale propuse:</strong> {formData.others}</p>

                <section>
                    <h2>Informații generale</h2>
                    <p> În cadrul tratamentului stomatologic medicii dentiști au obligația de a informa pacienții asupra tratamentului recomandat. Tratamentul poate fi efectuat doar după ce pacientul a fost informat corespunzător, a înțeles informațiile respective și și-a exprimat acordul asupra tratamentului. Această procedură poartă numele de ACORD INFORMAT.
                        <br/>
                        Vă rugăm să citiți cu atenție informațiile următoare și să luați la cunoștiință acest formular care acoperă informațiile din cursul consultației sau/și a tratamentelor ce vor fi efectuate.
                        <br/>
                        Referitor la tratamentele stomatologice întreprinse/efectuate în clinica noastră dorim să vă aducem la cunoștiință câteva informații legate de acestea:</p>

                </section>

                <section>
                    <>
                        <h2>Referitor la tratamentele CHIRURGICALE efectuate în cabinetul nostru dorim să vă informăm
                            urmatoarele:</h2>
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
                        </ul><p style={{fontSize: 12}}>
                        În cazul în care aveți o lucrare protetică provizorie, imediat după inserarea implanturilor dentare, trebuie
                        să aveți în vedere faptul că aceasta are o durată limitată de viață, 4 – 6 luni. Nefinalizarea tratamentului
                        protetic, prin neînlocuirea acestea cu o lucrare protetică definitivă pe implanturi, poate duce de la ruperea
                        lucrării inițiale până la pierderea implanturilor inserate. Lucrare protetică provizorie are rolul de a vă
                        ajuta să puteți mânca, să puteți vorbi, să puteți zâmbi și să nu aveți niciun disconfort social pe durata
                        întregului tratament.
                    </p>
                    </>
                </section>
                <br/>
                <section style={{fontSize:15}}>
                    <strong>
                        <p>
                            <p>Prin semnarea acestui acord informat declar că:</p>
                            <p>Am primit și înteles informațiile asupra diagnosticului, prognosticului și evoluției afecțiunilor de care sufăr, despre natura și scopul actului medical, asupra intervențiilor și strategiei de tratament propuse, asupra beneficiilor dar și a riscurilor, complicațiilor potențiale asociate actuluin medical propus.
                            </p><p>
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
                            <p>Am luat cunoștință că datele personale sunt păstrate în fișa pacientului, sunt arhivate și sunt utilizate la întocmirea raporturilor statistice și în scop de cercetare științifică de către instituțiile abilitate. Aceste date sunt confidențiale și nu vor fi furnizate în alte scopuri, fără avizul meu. În consecință și în condițiile precizate, îmi dau liber și în cunoștință de cauză consimțămâmtul la prelucrarea datelor personale cu caracter personal.</p>
                        </p><p>

                        Prin semnarea prezentei Accept efectuarea actului medical, de către <u>{formData.medic}</u> {' '}
                        al Dental Point Clinic precum și angajații/colaboratorii acestuia, sunt de acord cu efectuarea analizelor paraclinice necesare pentru stabilirea diagnosticului, a efectuării investigațiilor radiologice și dacă este necesar a realizării de fotografii în scop diagnostic, didactic sau științific cu respectarea confidențialității actului medical.

                    </p>
                    </strong>
                    <p>
                        *Acest formular aparține Clinicii Dental Point, sustragerea, copierea sau multiplicarea lui se va pedepsi conform
                        legii.
                    </p>
                </section>
                {formData.tutor !== '' && (
                    <p><strong>Nume Prenume tutore:</strong> {formData.tutor}</p>
                )}
                <p><strong>Semnătura:</strong> <img src={formData.signature} alt={"err"}/></p>
                <p style={{textAlign: "right"}}> <strong>Data:</strong> {formData.signedDate}</p>
                <p style={{textAlign: "right"}}> <strong>Digitally signed(hash):</strong> {formData.consent}</p>
                <em style={{fontSize: "10px"}}>
                    Documentul reprezintă o procedură standard a clinicii Dental Point care nu trebuie să constituie un motiv de îngrijorare
                    pentru pacient. Dimpotrivă, vă stăm la dispoziție cu toate informațiile și răspunsurile necesare pentru ca dvs. să puteți lua
                    decizia corectă în vederea realizării tratamentului.
                </em>
            </div>
            <div style={{ textAlign:"center", display: 'flex', justifyContent: 'right', marginTop: 30, marginRight:30}}>

                <TooltipButton tooltipText={"Download PDF"}
                               onClick={r => handleDownload(formData)}
                               style={{
                                   border: 'none',
                                   borderRadius: '50%',
                                   width: 60,
                                   height: 60,
                                   cursor: 'pointer',
                                   boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                               }}
                ><FaDownload/></TooltipButton>

            </div>
        </div>
    );
}
