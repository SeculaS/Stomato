import { useState, useEffect, useRef } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import DropdownSection from "./DropdownSelection";
const backendUrl = process.env.REACT_APP_BACKEND_URL;
export default function AcordGene() {
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
        formType: 'general'
    });

    useEffect(() => {
        if (!cnp) return;

        const fetchPatientData = async () => {
            try {
                const response = await fetch(`${backendUrl}/get-form-data?cnp=${encodeURIComponent(cnp)}`);
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
        context.moveTo(x, y)
        setIsDrawing(true);
    };

    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const { x, y } = getPos(e);
        const context = canvasRef.current.getContext('2d');
        setIsSigned(true);
        context.lineTo(x, y);
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
                alert("Nu ati semnat documentul!");
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
                -GENERAL-</center></h2>
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
                Actul/actele medicale propuse: obturații coronare, tratamente endodontice, chirurgie dentară, tratamente
                parodontale, tratament de albire, restaurări radiculare, tratamente protetice.
            </label>
            <label>
                Altele:
                <input name="others" type="text" value={formData.others} onChange={handleChange} />
            </label>
            <label><strong>
                În cadrul tratamentului stomatologic medicii dentiști au obligația de a informa pacienții asupra tratamentului recomandat. Tratamentul poate fi efectuat doar după ce pacientul a fost informat corespunzător, a înțeles informațiile respective și și-a exprimat acordul asupra tratamentului. Această procedură poartă numele de ACORD INFORMAT.
                <br/>
                Vă rugăm să citiți cu atenție informațiile următoare și să luați la cunoștiință acest formular care acoperă informațiile din cursul consultației sau/și a tratamentelor ce vor fi efectuate.
                <br/>
                Referitor la tratamentele stomatologice întreprinse/efectuate în clinica noastră dorim să vă aducem la cunoștiință câteva informații legate de acestea:
            </strong>
            </label>
            <DropdownSection title="ANESTEZIA" content={
                <>
                    În clinica noastră manoperele stomatologice se execută sub efectul anesteziei locale, excepție fac unele
                    igienizări și cateva manopere invazive. Efectul unei anestezii variază între 1 și 4 ore. Pacienții cărora nu
                    li s-a mai administrat un anestezic în trecut, beneficiază de un test, care se face la nivelul brațului înainte
                    de administrarea în cavitatea bucală. Cei care stiu că sunt alergici la anestezic trebuie să anunțe medicul
                    în prealabil. Exista si contraindicații în administrarea anestezicului la femeile însărcinate în trimestrul I
                    sau III iar persoanele care suferă de hipertensiune arterială sau femeile însărcinate în trimestrul II
                    beneficiază de un anestezic în cantitate mică, fară adrenalină, la indicația medicului cardiolog/ginecolog.
                    <br/>Pacientul are obligația de a informa medicul, înainte de administrarea anestezicului, dacă suferă de o
                    boală de inima, dacă a suferit un atac cerebral sau dacă are un tratament medicamentos pe care îl
                    urmează. Postanestezie pacientul poate rămâne cu o ușoară senzație de amorțeală, cu un hematom sau un
                    disconfort/durere în locul unde s-a administrat anestezia. Anestezia poate să nu fie eficientă în cazul
                    consumului de bauturi pe bază de cofeină sau a substanțelor stupefiante și psihotrope.
                </>
            }></DropdownSection>
            <DropdownSection title="OBTURAŢII (PLOMBE), RESTAURĂRI CORONARE/RADICULARE" content={
                <>
                    Deși reprezintă manopere stomatologice de rutină, realizarea sau înlocuirea obturaţiilor sau restaurărilor
                    coronare/radiculare, pot prezenta unele riscuri și efecte secundare care pot fi, fără a se limita la:
                    <br/>hipersensibilitate tranzitorie a dintelui, inflamaţie a pulpei dentare cu necesitatea ulterioară a
                    tratamentului endodontic (de canal), apariţia unor fisuri/fracturi ale smalţului dentar, longevitate mai
                    redusă a restaurărilor în raport cu cele precedente.
                    <br/>De asemenea uneori, datorită ţesutului carios nedescoperit iniţial, poate fi necesară o restaurare mai
                    întinsă decât cea planificată iniţial, ajungând – în cazuri extreme – până la necesitatea extracţiei dintelui.
                    <br/>In cazul persistenţei sensibilităţii sau a modificărilor ocluzale (ale muşcăturii/masticaţiei) va trebui să
                    solicitati o programare la medicul curant pentru elucidarea cauzelor.
                    <br/>Uneori culoarea obturaţiilor nu poate coincide perfect cu cea a dinţilor naturali.
                    <br/>In unele cazuri va trebuie să acordati o atenţie sporită în evitarea masticaţiei pe partea pe care s-au
                    realizat noile obturaţii în primele 24 de ore de la intervenţie, pentru a evita fracturarea lor.
                    In timp, obturaţiile estetice îşi pot modifica culoarea din cauza alimentelor colorate, a fumatului etc.
                </>
            }></DropdownSection>
            <DropdownSection title="TRATAMENTUL ENDODONTIC (SCOS DE NERV)" content={
                <>
                    Am înţeles că tratamentul de canal nu garantează salvarea dintelui şi că există situaţii în care, în ciuda
                    tuturor eforturilor depuse pentru salvarea dintelui, acesta trebuie extras. Am înţeles alternativele
                    tratamentului de canal reprezentate de extracţia dintelui sau non-intervenţie. De asemenea am înţeles
                    posibilele consecinţe ale nefinalizării tratamentului de canal odată ce acesta a fost început.
                    <br/>Am înţeles că ocazional, în timpul sau după efectuarea tratamentului de canal, pot apărea următoarele:
                    durere, tumefacţie (umflătură), infecţie, reinfecţie, iritarea sau lezarea mucoasei bucale înconjurătoare,
                    afectare parodontală (pierderea suportului osos şi mobilizarea dintelui ca urmare a infecţiei), ruperea
                    unor instrumente (cum ar fi acele de canal) în interiorul rădăcinii dintelui datorită unor canale calcificate,
                    perforaţia coroanei sau a rădăcinii dintelui. Am înţeles de asemenea că rata de succes a tratamentului
                    endodontic este de 85 - 95% şi că uneori tratamentul endodontic trebuie repetat sau/şi pot fi necesare
                    mici intervenţii chirurgicale asupra dintelui respectiv. Am înţeles de asemenea că tratamentul de canal
                    poate necesita uneori mai multe şedinţe pentru a fi finalizat.
                    <br/>Am înţeles că tratamentul endodontic poate determina colorarea şi o susceptibilitate mai mare la fractură
                    a dintelui, de aceea este obligatoriu ca după finalizarea tratamentului endodontic, dintele să primească o
                    restaurare definitivă: obturaţie sau lucrare protetică (coroană).
                    <br/>Intervenţiile necesare, asupra dintelui, cum ar fi tratamentele de albire sau restaurare ulterioare nu sunt,
                    în general, incluse în costul tratamentului endodontic.
                </>
            }></DropdownSection>
            <DropdownSection title="EXTRACŢIA, ALTE INTERVENŢII DE CHIRURGIE ORALĂ" content={
                <>
                    În timpul anesteziei, extracţiei dentare și a altor intervenţii de chirurgie orală poate apărea prin afectarea
                    nervilor din vecinătate: reducerea/pierderea sensibilităţii dinţilor vecini, a buzelor, limbii şi a ţesuturilor
                    înconjurătoare (parestezie/anestezie) pe o perioadă nedeterminată de timp.
                    <br/>In cazul complicaţiilor, poate apărea necesitatea unui tratament de specialitate la un medic chirurg
                    maxilo-facial, tratament de specialitate al cărui cost intră în responsabilitatea cabinetului.
                </>
            }></DropdownSection>
            <DropdownSection title="BOALA PARODONTALĂ" content={
                <>
                    Afectarea prin boală parodontală a dintilor se manifestă prin afectarea gingiei şi a osului adiacent și poate
                    duce la pierderea dinţilor şi a lucrărilor dentare. Planul de tratament poate cuprinde: un program
                    de întreţinere/dispensarizare, intervenţii de scaling, chiuretaj gingival, planare radiculară şi în unele
                    cazuri intervenţii parodontale, inclusiv chirurgicale, asupra dinţilor, gingiei şi osului, adiţie osoasă şi/sau
                    extracţii. Absenţa intervenţiei poate agrava starea de sănătate parodontală .
                    <br/>Acestea reprezintă manopere de tratament în cadrul bolii parodontale menite a rezolva și stabiliza
                    suportul dinților. Dupa realizarea intervenţiilor de scaling, chiuretaj gingival şi planare radiculară dinţii
                    vor avea o mobilitate iniţial crescută iar gingiile se vor retrage. Rădăcinile dentare astfel expuse vor fi
                    mai sensibile. De obicei hipermobilitatea şi hipersensibilitatea se remit spontan în circa şase luni, însă pot
                    necesita tratament suplimentar. Rădăcinile expuse au o structură mai poroasă decât smalţul dinţilor, sunt
                    mai susceptibile la retenţia alimentelor şi coloraţie decât restul suprafeţelor dentare. Retracţia gingivală
                    din zona frontală maxilară poate fi urmată de modificări de fonaţie (articulare a cuvintelor) sau
                    modificari estetice prin pierderea gingiei interdentare. Acestea pot necesita intervenţie terapeutică
                    suplimentară.
                    <br/>In final, după intervenţiile de scaling, chiuretaj gingival şi planare radiculară este necesară o reevaluare
                    diagnostică, în urma căreia pot fi recomandate şi alte intervenţii parodontale.
                    <br/>Intervenţiile parodontale sunt indicate în cazul persistenţei pungilor parodontale/infecţiei. Intervenţiile
                    parodontale au drept scop reducerea/eliminarea pungilor parodontale, eliminarea ţesuturilor parodontale
                    patologice şi curăţirea riguroasă a suprafeţelor radiculare. În cursul acestor interventii se pot face
                    manopere de grefare osoasă sau gingivală în scopul recâștigării de tesut moale sau osos pierdut. Există
                    situaţii în care după tratamentul parodontal, datorită unor factori cum ar fi faza avansată a bolii, absenţa
                    unui program susţinut de întreţinere/dispensarizare, factori nutriţionali, endocrini, afecţiuni generale etc.,
                    problemele parodontale pot persista sau chiar se pot agrava – mergând până la pierderea dinţilor.
                </>
            }></DropdownSection>
            <DropdownSection title="BRUXISMUL, ALTE PARAFUNCŢII OCLUZALE" content={
                <>
                    Puteti prezenta o forma de obiceiuri nefuncţionale care determină suprasolicitarea arcadelor dentare ca de
                    exemplu: bruxismul (scrâşnitul dinţilor), încleştarea maxilarelor, onicofagia (roaderea unghiilor) etc.
                    Acestea pot determina pierderea prematură a restaurărilor dentare, uzură patologică/fisuri/fracturi ale
                    dinţilor naturali, pierderea structurilor de suport şi mobilizarea dinţilor. Dorim sa va informăm că în
                    aceste cazuri este necesar să informați medicul dentist curant şi să urmati un protocol de tratament
                    distinct, pentru a combate/reduce riscul de suprasolicitare la nivelul arcadelor/restaurărilor dentare.
                </>
            }></DropdownSection>
            <DropdownSection title="TRATAMENTUL DE ALBIRE" content={
                <>
                    Este posibil ca după tratamentul de albire dinţii să prezinte hipersensibilitate persistentă. De asemenea în
                    timpul şi după tratamentul de albire este posibilă apariţia sensibilităţii/leziunilor la nivelul gingiei,
                    acestea fiind de intensitate, în general, mica și se remit spontan în timp scurt.
                    Intensitatea şi durata efectului de albire este variabilă și depinde de natura alimentelor consumate și de
                    igiena dentară personală.
                </>
            }></DropdownSection>
            <DropdownSection title="ÎNTREŢINEREA ŞI DISPENSARIZAREA" content={
            <>
                Pentru a preveni pierderea suportului dinţilor trebuie să fie împiedicata formarea depozitelor microbiene
                (placă microbiană) de la nivelul suprafeţelor dentare. Pentru a asigura funcţionalitatea şi longevitatea
                restaurărilor stomatologice, a dinţilor şi a ţesuturilor de suport ale acestora este nevoie de
                un program riguros zilnic de întreţinere şi igienizare, care poate fi explicat în timpul ședintelor de consult
                sau tratament.
                <br/>De asemenea este necesar să vă prezentați de cel puţin două ori pe an pentru control, igienizare
                profesională periodică, precum şi pentru remedierea precoce a eventualelor probleme apărute.
                Nerespectarea acestor reguli poate determina eşecul prematur al tratamentelor, cu apariţia unor
                complicaţii locale sau la distanţă.
            </>
        }></DropdownSection>
            <DropdownSection title="FAŢETE, COROANE ŞI PUNŢI" content={
                <>
                    Pentru aplicarea faţetelor/coroanelor este necesară prepararea (şlefuirea) dinţilor. Uneori forma şi
                    culoarea faţetelor/coroanelor nu coincide perfect cu forma şi culoarea dinţilor naturali, uneori va trebui
                    să purtati coroane provizorii până la aplicarea celor finale iar aceste coroane se pot descimenta uşor.
                    <br/><br/>Se pot solicita modificări de formă sau culoare a noilor faţete/coroane/punţi numai înainte ca acestea să
                    fie fixate definitiv. De asemenea trebuie respectată programarea pentru cimentarea finală, deoarece
                    întârzierile pot duce la migrarea dinţilor preparaţi, limitanţi sau antagonişti breşei edentate. Aceste
                    întârzieri pot necesita refacerea faţetelor/coroanelor/punţilor cu costuri adiţionale care cad în
                    responsabilitatea pacientului.
                    <br/><br/>După fixarea (cimentarea) faţetelor/coroanelor poate apărea sensibilitate la nivelul dinţilor pe care
                    acestea sunt aplicate. În cazul în care această sensibilitate este persistentă, va rugam sa ne informati cu
                    privire la aceasta situatie.
                    <br/>Faţetele/coroanele din ceramică/compozit (fără metal) sunt restaurări fragile, care se pot fisura/fractura
                    relativ uşor, chiar în cazurile în care sunt corect concepute şi realizate.
                </>
            }></DropdownSection>
            <DropdownSection title="PROTEZE MOBILIZABILE (TOTALE/PARŢIALE)" content={
                <>
                    Purtarea unei proteze mobilizabile poate fi uneori dificilă. Pot apărea zone dureroase persistente,
                    modificări de fonaţie (articularea sunetelor) şi dificultăţi în masticaţie. Protezarea imediată (plasarea
                    protezei imediat după extracţiile dinţilor) poate fi dureroasă. Protezarea imediată poate necesita
                    numeroase ajustări şi rebazări. Toate protezele vor avea nevoie de căptuşiri sau rebazări la anumite
                    intervale de timp. Costurile rebazării sau căptuşirii nu sunt incluse în costul protezei.
                </>
            }></DropdownSection>


            <label><b>
                Prin semnarea acestui acord informat declar ca:
                <br/>Am primit și înteles informațiile asupra diagnosticului, prognosticului și evoluției afecțiunilor de
                care sufăr, despre natura și scopul actului medical, asupra intervențiilor și strategiei de tratament
                propuse, asupra beneficiilor dar și a riscurilor, complicatiilor potentiale asociate actului medical
                propus.
                <br/>Am primit și inteles informațiile asupra tratamentelor alternative posibile, care pot fi:
                neefectuarea niciunui tratament, să se aștepte până simptomele devin mai clare sau extracția
                dintelui. În cazul neefectuării niciunui tratament, mi s-au explicat riscurile și consecințele.
                <br/>Am fost informat și înteleg necesitatea controalelor preventive și riscurile nerespectării
                recomandărilor medicale.
                <br/>Am primit informații asupra regulilor de funcționare a cabinetului, asupra necesității respectării
                programărilor și secvențelor acestora.
                <br/>Inteleg că în timpul și după efectuarea tratamentului, pot contacta medicul curant dacă apar
                întrebări și nelămuriri ulterioare. Deasemenea pot solicita o a doua opinie formulată de catre un
                alt medic.
                <br/>
                Am luat cunoştinţă că datele personale sunt păstrate în fisa pacientului, sunt arhivate şi sunt
                utilizate la întocmirea raportărilor statistice și în scop de cercetare științifică de către instituţiile
                abilitate. Aceste date sunt confidenţiale şi nu vor fi furnizate în alte scopuri, fără avizul meu. În
                consecinţă şi în condiţiile precizate, îmi dau liber şi în cunoştinţă de cauză consimţământul
                la prelucrarea datelor personale cu caracter personal.
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
