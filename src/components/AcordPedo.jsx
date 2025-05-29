import { useState, useEffect, useRef } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DropdownSection from "./DropdownSelection";
import {toast} from "react-toastify";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default function AcordPedo() {
    const { cnp } = useParams();
    const navigate = useNavigate();
    const [isDrawing, setIsDrawing] = useState(false);
    const [isSigned, setIsSigned] = useState(false);
    const canvasRef = useRef(null);

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
        formType: 'pedodontic'
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
                toast.error('Eroare la comunicarea cu serverul');
            }
        };

        fetchPatientData();
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineWidth = 2;
        context.lineCap = 'round';
        context.strokeStyle = '#000000';
    }, [cnp]);
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
            if(!isSigned) {
                toast.error("Nu ati semnat documentul!");
                return;
            }
            const canvas = canvasRef.current;
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            let imgData = new FormData();
            imgData.append('img', blob, `signature-${Date.now()}_${formData.firstName}${formData.lastName}${formData.formType}.png`);

            const res = await fetch(`${backendUrl}/upload`, {
                method: 'POST',
                body: imgData,
            });


            const data = await res.json();
            formData.signature = data.imageUrl;

            const response = await fetch(`${backendUrl}/submit-form-pedodontic`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Formular trimis cu succes! ' + result.message);
                navigate('/patienti')
            } else {
                toast.error('Eroare la trimitere: ' + result.error);
            }
        } catch (error) {
            console.error('Eroare la trimiterea datelor:', error);
            toast.error('A apărut o eroare. Verifică consola pentru detalii.');
        }

    };



    return (
        <form className="form-container" onSubmit={handleSubmit} style={{ maxWidth: '1000px'}}>
            <h2><center>ACORDUL PACIENTULUI INFORMAT<br/>
                -PEDODONȚIE-</center></h2>
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
                Actul/actele medicale propuse: urgențe pedodontice, obturații, coronare, tratamente endodontice, chirugie dentară, sigilări dentare, igienizare, bruxism, aparat dentar mobil.
            </label>
            <label>
                Altele:
                <input name="others" type="text" value={formData.others} onChange={handleChange} />
            </label>
            <label>
                În cadrul tratamentului stomatologic medicii dentiști au obligația de a informa pacienții asupra tratamentului recomandat. Tratamentul poate fi efectuat doar după ce pacientul a fost informat corespunzător, a înțeles informațiile respective și și-a exprimat acordul asupra tratamentului. Această procedură poartă numele de ACORD INFORMAT.

                Vă rugăm să citiți cu atenție informațiile următoare și să luați la cunoștiință acest formular care acoperă informațiile din cursul consultației sau/și a tratamentelor ce vor fi efectuate.

                Referitor la tratamentele stomatologice întreprinse/efectuate în clinica noastră dorim să vă aducem la cunoștiință câteva informații legate de acestea:

            </label>
            <DropdownSection title="ANESTEZIA" content="În acest cabinet manoperele stomatologice se execută sub efectul anesteziei locale, excepție fac unele igienizări și câteva manopere invazive. Efectul unei anastezii variază între 1 și 4 ore. Pacienții cărora nu li s-a mai administrat un anestezic în trecut, beneficiază de un test, care se face la nivelul brațului înainte de administrarea în cavitatea bucală. Cei care știu că sunt alergici la anestezic trebuie să anunțe medicul în prealabil. Aparținătorul pacientului are obligația de a informa medicul, înainte de a administra anastezicului, dacă suferă de o boală de inimă, malformații congenitale, afecțiuni respiratorii sau dacă are un tratament medicamentos pe care îl urmează, Postanestezie pacientul poate rămâne cu o ușoară senzație de amorțeală, cu un hematom sau un disconfort/durere în locul unde s-a administrat anestezia."></DropdownSection>
            <DropdownSection title="TRATAMENTUL URGENȚELOR PEDODONTICE"
                             content="În cazul unui abces dentar, tratamentul variază de la drenajul infecției de la nivelul dintelui și a gingiei adiacente, până la aplicarea unui pansament calmant devitalizant."></DropdownSection>
            <DropdownSection title="OBTURAȚII (PLOMBE), RESTAURĂRI CORONARE"
            content={
                <>
                    <p>Deși reprezintă manopere stomatologice de rutină, realizarea sau înlocuirea obrurațiilor sau restaurărilor coroanelor, pot prezenta unele riscuri și efecte secundare care pot fi, fără a se limita la: hipersensibilitate tranzitorie a dintelui, inflamație a pulpei dentare cu necesitatea ulterioară a tratamentului endodontic (de canal), apariția unor fisuri/fracturi ale smalțului dentar, longevitate mai redusă a restaurărilor în raport cu cele precedente.</p>
                    <p>De asemenea uneori, datorită țesutului carios nedescoperit inițial, poate fi necesară o restaurare mai întinsă decât cea planificată inițial, ajungând – în cazuri extreme – până la necesitatea extracției dintelui. În cazul persistenței sensibilității sau a modificărilor ocluzale (ale mușcăturii/masticației) va trebui să solicitați o programare la medicul curant pentru elucidarea cauzelor.</p>
                    <p>Uneori culoarea obturațiilor nu poate coincide perfect cu cea a dinților naturali.</p>
                    <p>În unele cazuri vă trebuie să acordați o atenție sporită în evitarea masticației pe partea pe care s-au realizat noile obturați în primele 24 de ore de la intervenție, pentru a evita fracturarea lor.În timp, obturațiile estetice își pot modifica culoarea din cauza alimentelor colorate.</p>

                </>
            }></DropdownSection>
           <DropdownSection title={"INACTIVAREA CARIEI CU SDF"} content={"Pentru copiii ce prezintă multiple procese carioase sunt necooperanți sau de vârstă mică, se poate aplica  o soluție pe bază de argint ce transformă caria activă în una ce nu mai evoluează, stopând afectarea nervului dentar. Manopera este una simplă, noninvazivă, având ca efect advers colorarea procesului carios în negru. Peste această soluție, în cazurile recomandate, se poate aplica o obturație realizată dintr-un material compatibil."}></DropdownSection>
            <DropdownSection title={"TRATAMENTUL ENDODONTIC (SCOS DE NERV)"} content={
                <>
                    <p>Am înțeles că tratametul de canal nu garantează salvarea dintelui și că există situații în care, în ciuda tuturor eforturilor depuse pentru salvarea dintelui, acesta trebuie extras. Am înțeles alternativele tratamentului de canal reprezentate de extracția dintelui sau non-intervenție. De asemenea am înțeles posibilele consecințe ale nefinalizării tratamentului de canal odată ce acesta a fost început.
                    </p><p>Am înțeles că ocazional, în timpul sau după efectuarea tratamentului de canal, pot apărea următoarele: durere, tumefacție (umflătură), infecție, reinfecție, iritarea sau lezarea mucoasei bucale înconjurătoare, afectare parodontală (pierderea suportului osos și mobilizarea dintelui ca urmare a infecției), ruperea unor instrumente (cum ar fi acele de canal) în interiorul rădăcinii dintelui datorită unor canale calcificate, perforația coroanei sau a rădăcinii dintelui. Am înțeles de asemenea că rata de succes a tratamentului endodontic la copii este mai mică de 85-95% și că uneori tratamentul endodontic trebuie repetat. Am înțeles de asemenea că tratamentul de canal poate necesita unoeri mai multe ședințe pentru a fi finalizat.
                </p><p>Am înțeles că tratamentul endodontic poate determina colorarea și o susceptibilitate mai mare la fractură a dintelui, de aceea este obligatoriu că după finalizarea tratamentului endodontic, dintele să primească o restaurare definitivă: obturație sau acoperirea cu o capă prefabricată (coroană).
                </p>
                </>
            }>

            </DropdownSection>
            <DropdownSection title={"EXTRACȚIA, FRENOTOMIA"} content={
                <>
                    <p>În timpul anesteziei, extracției dentare și a altor intervenții de chirurgie orală poate apărea prin afectarea nervilor din vecinătate: reducerea/pierderea sensibilității dinților vecini, a buzelor, limbii și a țesuturilor înconjurătoare (parestezie/anestezie) pe o perioadă nedeterminată de timp.
                    </p><p>Frenotomia reprezintă îndepărtarea frenului superior ce nu permite apropierea incisivilor centrali superiori în timpul tratamentului ortodontic.</p>
                    <p>În cazul complicațiilor, poate apărea necesitatea unui tratament de specialitate la un medic chirurg maxilo-facial, tratament de specialitate al cărui cost intră în responsabilitatea cabinetului.
                    </p>
                </>
            }></DropdownSection>
            <DropdownSection title={"SIGILAREA DINȚILOR PERMANENȚI"} content={
                <>
                    <p>Sigilarea reprezintă o manoperă non-invazivă, de protecție împotriva cariei.
                    </p><p>Se efectuează din momentul erupției molarilor permanenți, până la maxim 6 luni de la apariția acestora pe arcadă. Presupune curățarea dintelui și aplicarea unui material ce se infiltrează în profunzimea șanțurilor dentare.
                </p><p>Pelicula de sigilant se aplică în strat subțire și se poate exfolia în timp.
                </p>
                </>
            } >

            </DropdownSection>
            <DropdownSection title={"IGIENIZAREA ȘI FLUORIZAREA DINȚILOR"} content={
                <>
                    <p>Aplicarea fluorului după igienizarea dentară, este esențială după vârsta de 6 ani sau înainte de 6 ani pentru copiii cu procese carioase multiple și agresive.
                    </p><p>
                    Fluorul asigură întărirea structurilor dentare dure și remineralizarea proceselor carioase incipiente ce se prezintă asemeni unor pete albe.
                </p>
                </>
            }></DropdownSection>
            <DropdownSection title={"BRUXISMUL, ALTE PARAFUNCȚII OCAZIONALE"} content={"Copilul poate prezenta o formă de obiceiuri nefuncționale care determină suprasolicitarea arcadelor dentare ca de exemplu: bruxismul (scrâșnitul dinților), încleștarea maxilarelor, onicofagia (roaderea unghiilor) etc. Acestea pot determina pierderea prematură a restaurărilor dentare, uzură patologică/fisuri/fracturi ale dinților naturali, pierderea structurilor de suport și mobilizarea dinților, apariția unor anomalii dentare ce duc la necesitatea unui tratament ortodontic. Dorim să vă informăm că în aceste cazuri este necesar să informați medicul dentist curant și să urmați un protocol de tratament distinct, pentru a combate/reduce riscul de suprasolicitare la nivelul arcadelor/restaurărilor dentare."}>

            </DropdownSection>
            <DropdownSection title={"APLICAREA MENȚINĂTOARELOR DE SPAȚIU"} content={"În situația afectării iremediabile a unui dinte temporar (multiple abcese, rest dentar, mobilitate, afectarea dintelui permanent aflat sub cel temporar), se impune extracția dintelui temporar și aplicarea unui menținător ce asigură păstrarea spațiului necesar pentru erupția dintelui permanent și previne apariția ulterioară a unor probleme ortodontice."}></DropdownSection>
            <DropdownSection title={"APLICAREA APARATELOR DENTARE MOBILIZABILE SI A TRAINERELOR"}
                             content={
                                <>
                                    <p>Obiceiurile vicioase ale copiilor și anomaliile dentare de diferite tipuri, se pot trata cu aparate dentare mobilizabile sau mobile, până la debutul pubertății.
                                    </p><p>Aceste aparate dentare se vor purta pe durata nopții și minim 2 ore pe timpul zilei și nu se vor utiliza în timpul practicării sporturilor sau ale diferitelor activități ce prezintă pericol de accidenatre.
                                    </p>
                                </>
                            }>
            </DropdownSection>
            <DropdownSection title={"ÎNTREȚINEREA ȘI DISPENSARIZAREA "} content={
                <>
                    <p>Pentru a preveni pierderea suportului dinților trebuie să fie împiedicată formarea depozitelor microbiene (placă microbiană) de la nivelul suprafețelor dentare. Pentru a asigura funcționalitatea ți longevitatea restaurărilor stomatologice, a dinților și a țesuturilor de suport ale acestora este nevoie de un program riguros zilnic de întreținere și igienizare, care poate fi explicat în timpul ședințelor de consult sau tratament.
                    </p><p>De asemenea este necesar să vă prezentați de cel puțin două ori pe an pentru control, igienizare profesională periodică, precum și pentru remedierea precoce a eventualelor probleme apărute. Nerespectarea acestor reguli poate determina eșecul prematur al tratamentelor, cu apariția unor complicații locale sau la distanță.
                </p>
                </>
            }></DropdownSection>

            <label>
                <b>
                    <p>Prin semnarea acestui acord informat declar că:</p><br/>
                    <p>Am primit și înteles informațiile asupra diagnosticului, prognosticului și evoluției afecțiunilor de care sufăr, despre natura și scopul actului medical, asupra intervențiilor și strategiei de tratament propuse, asupra beneficiilor dar și a riscurilor, complicațiilor potențiale asociate actuluin medical propus.
                    </p><br/><p>
                    Am primit și înțeles informațiile asupra tratamentelor alternative posibile care pot fi: neefectuarea niciunui tratament, să se aștepte până simptomele devin mai clare sau extracția dintelui. În cazul neefectuării niciunui tratament,  mi s-au explicat riscurile și consecințele.

                </p>
                    <p>Am fost informat și înțeleg necesitatea controalelor preventive și riscurile nerespectșrii recomandărilor medicale.
                    </p><p>Am primit informații asupra regulilor de funcționare a cabinetului, asupra necesității respectării programărilor și secvențelor acestora.
                </p>
                    <p>Înțeleg că în timpul și după efectuarea tratamentului, pot contacta medicul curant dacă apar întrebări și nelămuriri ulterioare. De asemenea pot solicita o a doua opinie formulată de către un alt medic.
                    </p><br/>
                    <p>Am luat cunoștință că datele personale sunt păstrate în fișa pacientului, sunt arhivate și sunt utilizate la întocmirea raporturilor statistice și în scop de cercetare științifică de către instituțiile abilitate. Aceste date sunt confidențiale și nu vor fi furnizate în alte scopuri, fără avizul meu. În consecință și în condițiile precizate, îmi dau liber și în cunoștință de cauză consimțămâmtul la prelucrarea datelor personale cu caracter personal.</p>
                    <p>

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
                width={700}
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
            <button type="submit">Trimite</button>

        </form>

    );
}
