
import React, { useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";

import {FaDownload} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import html2pdf from 'html2pdf.js';
import backgroundImage from "./video-poster.png"

export default function ViewEndo() {
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
        formType: 'pedodontic'
    });

    useEffect(() => {
        if (!id) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/get-form-data-fromid?id=${encodeURIComponent(id)}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || 'Eroare la încărcarea datelor!');
                    return;
                }
                const data = await response.json();
                setFormData(data.any);
            } catch (error) {
                console.error('Eroare la fetch:', error);
                alert('Eroare la comunicarea cu serverul');
            }
        };

        fetchPatientData();
    }, [id]);



    const handleDownload = (acord) => {
        const element = targetReff.current;
        const options = {
            filename: `${acord.firstName}_${acord.lastName}-${acord.consentTimestamp}_endo.pdf`,
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
                <h2><center>ACORDUL PACIENTULUI INFORMAT <br/> TRATAMENTUL ENDODONTIC </center></h2>


                <p><strong>Nume Prenume pacient:</strong> {formData.firstName}{' '}{formData.lastName} </p>
                {formData.tutor !== '' && (
                    <p><strong>Nume Prenume tutore:</strong> {formData.tutor}</p>
                )}
                <p><strong>Domiciliu:</strong> {formData.address}</p>

                <p><strong>Actul/actele medicale propuse:</strong> Tratament endodontic/Retratament endodontic</p>

                <section>
                    <h2>Informații generale</h2>
                    <p>În cadrul tratamentului stomatologic medicii dentiști au obligația de a informa pacienții
                        asupra tratamentului recomandat. Tratamentul poate fi efectuat doar după ce pacientul
                        a fost informat corespunzător, a înteles informatiile respective și și-a exprimat acordul
                        asupra tratamentului. Această procedură poartă numele de ACORD INFORMAT.<br/>
                        Vă rugăm să cititi cu atenție informațiile următoare și să luați la cunoștință acest
                        formular care acoperă informațiile din cursul consultației sau/și a tratamentelor ce vor fi
                        efectuate.<br/>
                        Referitor la tratamentele stomatologice întreprinse/efectuate în clinica noastră dorim să
                        vă aducem la cunoștință cateva informații legate de acestea:</p>
                </section>

                <section>
                    <>
                    <h2>Informații detaliate despre tratamente</h2>
                    Referitor la tratamentul endodontic, dorim să vă aducem la cunoștinta că:
                    <ul>
                        <li>Un tratament de canal este o procedură efectuată în scopul pastrării unui dinte ce altfel riscă să fie
                            pierdut (eventual extras).</li>
                        <li>
                            Deși tratamentul de canal este o terapie cu un grad mare de succes, există multi factori ce pot contribui
                            la succesul sau eșecul acestui tratament, factori ce nu pot fi determinați întotdeauna de la începutul
                            tratamentului. Datorită acestor factori rezultatul nu poate fi întotdeauna garantat.
                            <br/>O parte din acești factori pot fi, dar nu se rezumă doar la:
                            <ul>
                                <li>rezistența la infecție a organismului, forma și locația precum și anatomia rădăcinii dintelui sau
                                    prezența bolii parodontale;</li>
                                <li>prezența unei fracturi a radacinii ce fie a trecut neobservată fie a apărut dupa tratament;</li>
                                <li>neprezentarea la ședințele planificate în cursul planului de tratament sau imposibilitatea ca dintele
                                    să fie restaurat cât mai prompt după finalizarea tratamentului endodontic;</li>
                            </ul>
                        </li>
                        <li>
                            În unele cazuri va fi nevoie ca tratamentul endodontic sa fie refacut (retratament endodontic), existând
                            și posibilitatea unei abordări chirurgicale pentru tratamentul leziunii apicale ce nu răspunde la tratament.
                            În cel mai rău caz, când nicio formă de tratament nu este eficientă, dintele va trebui extras.
                        </li>
                        <li>
                            Pentru a se putea efectua tratamentul de canal, coroanele sau dispozitivele coronaro – radiculare
                            (știfturile) ce reconstituie dintele este posibil să fie îndepărtate. Acest lucru poate face ca respectiva punte
                            sau coroană să fie afectată sau chiar rădăcina respectivă să sufere o fractură în încercarea de a îndepărta
                            coroana sau dispozitivul respectiv.
                        </li>
                        <li>
                            Exista posibilitatea ca în timpul tratamentului de canal, instrumentarul endodontic, să se poată rupe în
                            interiorul canalului radicular. Acest lucru nu afectează, în cele mai multe cazuri, rezultatul pozitiv al tratamentului cu condiția să se aplice protocolul de tratament necesar. Se pot produce perforații ale
                            coroanei sau rădăcinii, uneori din cauza calcifierii canalelor este chiar imposibilă gasirea acestora.
                        </li>
                        <li>
                            Exista posibilitatea ca în timpul tratamentului endodontic sa fie aduse prejudicii asupra plombelor,
                            coroanelor sau punților existente pe dintele respectiv. De asemenea datorită necesitătii de a crea un acces
                            prin dinte spre canalele radiculare, dintele poate deveni mai fragil și se poate fractura.
                        </li>
                        <li>
                            Cateodată dintele nu va răspunde la tratamentul endodontic, unele dureri vor fi permanente lucru ce va
                            face necesară stabilirea unor terapii alternative, de exemplu, efectuarea unei rezecții apicale.
                        </li>
                        <li>
                            În urma tratamentului endodontic pot să apară unele reacții secundare precum: durere la locul
                            anesteziei, crampe musculare, dureri ale articulației, inflamație moderată însoțită de durere.
                        </li>
                        <li>
                            În cursul tratamentului endodontic poate fi necesară prescrierea de medicație ajutătoare, cel mai
                            frecvent antibiotic, antialgice și antiinflamatoare, medicație ce reduce anxietatea. Unele din aceste
                            medicamente precum și administrarea de anestezice pot da reacții alergice, manifestări digestive,
                            discomfort, producerea de hematoame sau senzație de anestezie a buzei și limbii ce este de cele mai
                            multe ori tranzitorie.
                        </li>
                        <li>
                            În cazul efectelor secundare sau a unor nelămuriri asupra terapiei efectuate este necesar să luați
                            legatura cu medicul curant.
                        </li>
                        <li>
                            Este responsabilitatea D-voastra de a aduce la cunoștința personalului medical al cabinetului orice
                            modificare a stării D-voastră de sănătate, pentru a vi se putea administra un tratament corespunzător.
                        </li>
                        <li>
                            După finalizarea tratamentului endodontic este necesară restaurarea dintelui. Este responsabilitatea d-
                            voastră să vă adresați medicului curant pentru realizarea obturației coronare (plombei) sau coroanei
                            necesare.
                        </li>

                    </ul>

                </>
                </section>
                <br/><br/><br/><br/><br/><br/>
                <section>
                    <strong>
                        Prin semnarea acestui acord informat declar ca:
                        <br/>Am primit și înteles informațiile asupra diagnosticului, prognosticului și evoluției
                        afecțiunilor de care sufăr, despre natura și scopul actului medical, asupra intervențiilor
                        și strategiei de tratament propuse, asupra beneficiilor dar și a riscurilor, complicatiilor
                        potentiale asociate actului medical propus.
                        <br/>Am primit și inteles informațiile asupra tratamentelor alternative posibile, care pot fi:
                        neefectuarea niciunui tratament, să se aștepte până simptomele devin mai clare sau
                        extracția dintelui. În cazul neefectuării niciunui tratament, mi s-au explicat riscurile și
                        consecințele.
                        <br/>Am fost informat și înteleg necesitatea controalelor preventive și riscurile nerespectării
                        recomandărilor medicale.
                        <br/>Am primit informații asupra regulilor de funcționare a cabinetului, asupra necesității
                        respectării programărilor și secvențelor acestora.
                        <br/>Inteleg că în timpul și după efectuarea tratamentului, pot contacta medicul curant dacă
                        apar întrebări și nelămuriri ulterioare. Deasemenea pot solicita o a doua opinie
                        formulată de catre un alt medic.
                        <br/>Am luat cunoştinţă că datele personale sunt păstrate în fisa pacientului, sunt arhivate şi
                        sunt utilizate la întocmirea raportărilor statistice și în scop de cercetare științifică decătre
                        instituţiile abilitate. Aceste date sunt confidenţiale şi nu vor fi furnizate în alte scopuri,
                        fără avizul meu. În consecinţă şi în condiţiile precizate, îmi dau liber şi în cunoştinţă de
                        cauză consimţământul la prelucrarea datelor personale cu caracter personal.
                        <br/><br/><br/><br/>Prin semnarea prezentei Accept efectuarea actului medical, de catre medicul dentist {' '} <u>{formData.medic}</u>{' '}
                        al Dental Point Clinic precum
                        și angajații/colaboratorii acestuia, sunt de acord cu efectuarea analizelor paraclinice
                        necesare pentru stabilirea diagnosticului, a efectuării investigațiilor radiologice și daca
                        este necesar a realizării de fotografii în scop diagnostic, didactic sau stiințific cu
                        respectarea confidențialității actului medical.
                        <>
                            { parseInt(formData.cnp[0])%2===0 && (
                                <p>
                                    Pentru femei:
                                    Am fost informată privind riscurile administrării anesteziei locale pe perioada sarcinii, pentru
                                    manoperele stomatologice și sunt de acord cu efectuarea anesteziei.
                                </p>
                            )}
                        </>
                    </strong>
                    <p>
                        *Acest formular aparține Clinicii Dental Point, sustragerea, copierea sau multiplicarea lui se va pedepsi conform
                        legii.
                    </p>
                </section>

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
