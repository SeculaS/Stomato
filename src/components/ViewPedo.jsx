
import React, { useState, useEffect, useRef} from 'react';
import {useParams} from "react-router-dom";

import {FaDownload} from "react-icons/fa6";
import TooltipButton from "./TooltipButton";
import html2pdf from 'html2pdf.js';

export default function ViewPedo() {
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
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };



     return (
        <div className={"form-container"} style={{maxWidth:'800px'}}>
            <div ref={targetReff}>
                <p style={{textAlign: "right"}}><strong>Nr. fișă:</strong> {id}</p>
            <h1><center>ACORDUL PACIENTULUI INFORMAT <br/> PEDODONȚIE</center></h1>


            <p><strong>Nume Prenume pacient:</strong> {formData.firstName}{' '}{formData.lastName} </p>
            {formData.tutor !== '' && (
                <p><strong>Nume Prenume tutore:</strong> {formData.tutor}</p>
            )}
            <p><strong>Domiciliu:</strong> {formData.address}</p>

            <p><strong>Actul/actele medicale propuse:</strong> urgențe pedodontice, obturații coronare, tratamente endodontice, chirurgie dentară, sigilări dentare, igienizare, bruxism, aparat dentar mobil.</p>
            <p><strong>Altele:</strong> {formData.others} </p>
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
                <h2>Informații detaliate despre tratamente</h2>
                <h3>ANESTEZIA</h3>
                <p>În acest cabinet manoperele stomatologice se execută sub efectul anesteziei locale, excepție fac
                    unele igienizări și cateva manopere invazive. Efectul unei anestezii variază între 1 și 4 ore.
                    <br/>Pacienții cărora nu li s-a mai administrat un anestezic în trecut, beneficiază de un test, care se
                    face la nivelul brațului înainte de administrarea în cavitatea bucală. Cei care stiu că sunt alergici
                    la anestezic trebuie să anunțe medicul în prealabil. Aparținătorul pacientului are obligația de a
                    informa medicul, înainte de administrarea anestezicului, dacă suferă de o boală de inima,
                    malformații congenitale, afecțiuni respiratorii sau dacă are un tratament medicamentos pe care
                    îl urmează. Postanestezie pacientul poate rămâne cu o ușoară senzație de amorțeală, cu un
                    hematom sau un disconfort/durere în locul unde s-a administrat anestezia.</p>
                <h3>TRATAMENTUL URGENTELOR PEDODONTICE</h3>
                <p>
                    În cazul unui abces dentar, tratamentul variază de la drenajul infecției de la nivelul dintelui și
                    a gingiei adiacente, până la aplicarea unui pansament calmant devit
                </p>
                <h3>OBTURAŢII (PLOMBE), RESTAURĂRI CORONARE</h3>
                <p>
                    Deși reprezintă manopere stomatologice de rutină, realizarea sau înlocuirea obturaţiilor sau
                    restaurărilor coronare, pot prezenta unele riscuri și efecte secundare care pot fi, fără a se limita
                    la: hipersensibilitate tranzitorie a dintelui, inflamaţie a pulpei dentare cu necesitatea ulterioară
                    a tratamentului endodontic (de canal), apariţia unor fisuri/fracturi ale smalţului dentar,
                    longevitate mai redusă a restaurărilor în raport cu cele precedente.
                    <br/>De asemenea uneori, datorită ţesutului carios nedescoperit iniţial, poate fi necesară o restaurare
                    mai întinsă decât cea planificată iniţial, ajungând – în cazuri extreme – până la necesitatea
                    extracţiei dintelui. In cazul persistenţei sensibilităţii sau a modificărilor ocluzale (ale
                    muşcăturii/masticaţiei) va trebui să solicitati o programare la medicul curant pentru elucidarea
                    cauzelor.
                    <br/>Uneori culoarea obturaţiilor nu poate coincide perfect cu cea a dinţilor naturali.
                    In unele cazuri va trebuie să acordati o atenţie sporită în evitarea masticaţiei pe partea pe care
                    s-au realizat noile obturaţii în primele 24 de ore de la intervenţie, pentru a evita fracturarea lor.
                    In timp, obturaţiile estetice îşi pot modifica culoarea din cauza alimentelor colorate.
                </p>
                <h3>INACTIVAREA CARIEI CU SDF</h3>
                <p>
                    Pentru copiii ce prezintã multiple procese carioase, sunt necooperanți sau de vârstă mică, se
                    poate aplica o soluție pe bază de argint ce transformă caria activă în una ce nu mai evoluează,
                    stopând afectarea nervului dentar. Manopera este una simplă, noninvazivă, având ca efect
                    advers colorarea procesului carios în negru. Peste aceasta solutie, in cazurile recomandate, se
                    poate aplica o obturatie realizata dintr-un material compatibil.
                </p>
                <h3>
                    TRATAMENTUL ENDODONTIC (SCOS DE NERV)
                </h3>
                <p>
                    Am înţeles că tratamentul de canal nu garantează salvarea dintelui şi că există situaţii în care,
                    în ciuda tuturor eforturilor depuse pentru salvarea dintelui, acesta trebuie extras. Am înţeles
                    alternativele tratamentului de canal reprezentate de extracţia dintelui sau non-intervenţie. De
                    asemenea am înţeles posibilele consecinţe ale nefinalizării tratamentului de canal odată ce
                    acesta a fost început.
                    <br/>Am înţeles că ocazional, în timpul sau după efectuarea tratamentului de canal, pot apărea
                    următoarele: durere, tumefacţie (umflătură), infecţie, reinfecţie, iritarea sau lezarea mucoasei
                    bucale înconjurătoare, afectare parodontală (pierderea suportului osos şi mobilizarea dintelui
                    ca urmare a infecţiei), ruperea unor instrumente (cum ar fi acele de canal) în interiorul rădăcinii
                    dintelui datorită unor canale calcificate, perforaţia coroanei sau a rădăcinii dintelui. Am înţeles
                    de asemenea că rata de succes a tratamentului endodontic la copii este mai mică de 85 - 95%
                    şi că uneori tratamentul endodontic trebuie repetat. Am înţeles de asemenea că tratamentul de
                    canal poate necesita uneori mai multe şedinţe pentru a fi finalizat.
                    <br/>Am înţeles că tratamentul endodontic poate determina colorarea şi o susceptibilitate mai mare
                    la fractură a dintelui, de aceea este obligatoriu ca după finalizarea tratamentului endodontic,
                    dintele să primească o restaurare definitivă: obturaţie sau acoperirea cu o capă prefabricată
                    (coroană).
                </p>
                <h3>
                    EXTRACŢIA, FRENOTOMIA
                </h3>
                <p>
                    În timpul anesteziei, extracţiei dentare și a altor intervenţii de chirurgie orală poate apărea prin
                    afectarea nervilor din vecinătate: reducerea/pierderea sensibilităţii dinţilor vecini, a buzelor,
                    limbii şi a ţesuturilor înconjurătoare (parestezie/anestezie) pe o perioadă nedeterminată de
                    timp.
                    <br/>Frenotomia reprezintă îndepărtarea frenului superior ce nu permite apropierea incisvilor
                    centrali superiori în timpul tratamentului ortodontic.
                    <br/>In cazul complicaţiilor, poate apărea necesitatea unui tratament de specialitate la un medic
                    chirurg maxilo-facial, tratament de specialitate al cărui cost intră în responsabilitatea
                    cabinetului.
                </p>
                <h3>
                    SIGILAREA DINȚILOR PERMANENȚI
                </h3>
                <p>
                    Sigilarea reprezintă o manoperă non-invazivă, de protecție împotriva cariei.
                    <br/>Se efectuează din momentul erupției molarilor permanenți, până la maxim 6 luni de la apariția
                    acestora pe arcadă. Presupune curățarea dintelui și aplicarea unui material ce se infiltrează în
                    profunzimea șanțurilor dentare.
                    <br/>Pelicula de sigilant se aplica in strat subțire si se poate exfolia în timp.
                </p>
                <h3>IGIENIZAREA ȘI FLUORIZAREA DINȚILOR</h3>
                <p>
                    Aplicarea fluorului după igienizarea dentară, este esențială după vârsta de 6 ani sau înainte de
                    6 ani pentru copiii cu procese carioase multiple și agresive.
                    <br/>Fluorul asigură întărirea structurilor dentare dure și remineralizarea proceselor carioase
                    incipiente ce se prezintă asemeni unor pete albe.
                </p>
                <h3>
                    BRUXISMUL, ALTE PARAFUNCŢII OCLUZALE
                </h3>
                <p>
                    Copilul poate prezenta o formă de obiceiuri nefuncţionale care determină suprasolicitarea
                    arcadelor dentare ca de exemplu: bruxismul (scrâşnitul dinţilor), încleştarea maxilarelor,
                    onicofagia (roaderea unghiilor) etc. Acestea pot determina pierderea prematură a restaurărilor
                    dentare, uzură patologică/fisuri/fracturi ale dinţilor naturali, pierderea structurilor de suport şi
                    mobilizarea dinţilor, apariția unor anomalii dentare ce duc la necesitatea unui tratament
                    ortodontic. Dorim să vă informăm că în aceste cazuri este necesar să informați medicul dentist
                    curant şi să urmati un protocol de tratament distinct, pentru a combate/reduce riscul de
                    suprasolicitare la nivelul arcadelor/restaurărilor dentare.
                </p>
                <h3>
                    APLICAREA MENȚINĂTOARELOR DE SPAȚIU
                </h3>
                <p>
                    În situația afectării iremediabile a unui dinte temporar (multiple abcese, rest dentar, mobilitate,
                    afectarea dintelui permanent aflat sub cel temporar), se impune extracția dintelui temporar și
                    aplicarea unui menținător ce asigură păstrarea spațiului necesar pentru erupția dintelui
                    permanent și previne apariția ulterioară a unor probleme ortodontice.
                </p>
                <h3>
                    APLICAREA APARATELOR DENTARE MOBILIZABILE ȘI A TRAINERELOR
                </h3>
                <p>
                    Obiceiurile vicioase ale copiilor și anomaliile dentare de diferite tipuri, se pot trata cu aparate
                    dentare mobilizabile sau mobile, până la debutul pubertății.
                    <br/>Aceste aparate dentare se vor purta pe durata nopții și minim 2 ore pe timpul zilei și nu se vor
                    utiliza în timpul practicării sporturilor sau ale diferitelor activități ce prezintă pericol de
                    accidentare.
                </p>
                <h3>ÎNTREŢINEREA ŞI DISPENSARIZAREA</h3>
                <p>
                    Pentru a preveni pierderea suportului dinţilor trebuie să fie împiedicata formarea depozitelor
                    microbiene (placă microbiană) de la nivelul suprafeţelor dentare. Pentru a asigura
                    funcţionalitatea şi longevitatea restaurărilor stomatologice, a dinţilor şi a ţesuturilor de suport
                    ale acestora este nevoie de un program riguros zilnic de întreţinere şi igienizare, care poate fi
                    explicat în timpul ședintelor de consult sau tratament.
                    <br/>De asemenea este necesar să vă prezentați de cel puţin două ori pe an pentru control, igienizare
                    profesională periodică, precum şi pentru remedierea precoce a eventualelor probleme apărute.
                    <br/>Nerespectarea acestor reguli poate determina eşecul prematur al tratamentelor, cu apariţia unor
                    complicaţii locale sau la distanţă.
                </p>
            </section>

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
                    <br/>Prin semnarea prezentei Accept efectuarea actului medical, de catre medicul dentist {' '} <u>{formData.medic}</u>
                    al Dental Point Clinic precum
                    și angajații/colaboratorii acestuia, sunt de acord cu efectuarea analizelor paraclinice
                    necesare pentru stabilirea diagnosticului, a efectuării investigațiilor radiologice și daca
                    este necesar a realizării de fotografii în scop diagnostic, didactic sau stiințific cu
                    respectarea confidențialității actului medical.
                </strong>
                <p>
                    *Acest formular aparține Clinicii Dental Point, sustragerea, copierea sau multiplicarea lui se va pedepsi conform
                    legii.
                </p>
            </section>

            <p style={{textAlign: "right"}}><strong>Semnătura:</strong> {formData.signature}</p>
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
