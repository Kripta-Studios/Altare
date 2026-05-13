import { useState, useEffect, useMemo } from 'react';
import { BilingualText } from '../components/ui/BilingualText';
import { getToday } from '../lib/calendar';

interface Mystery {
  num: number;
  title: string;
  fruit: string;
}

interface RosaryData {
  mysteries: {
    joyful: Mystery[];
    sorrowful: Mystery[];
    glorious: Mystery[];
  }
}

interface Prayer {
  id: string;
  titleLatin: string;
  titleEnglish: string;
  latin: string;
  english: string;
}

function getMysterySet(d: Date): 'joyful' | 'sorrowful' | 'glorious' {
  const dow = d.getDay();
  if (dow === 2 || dow === 5) return 'sorrowful';
  if (dow === 0 || dow === 3) return 'glorious';
  return 'joyful';
}

export default function Rosary() {
  const today = useMemo(() => getToday(), []);
  const [data, setData] = useState<RosaryData | null>(null);
  const [prayers, setPrayers] = useState<Record<string, Prayer>>({});
  const [step, setStep] = useState(0);

  const activeSet = getMysterySet(today);

  useEffect(() => {
    async function loadData() {
      try {
        const [rosaryRes, prayersRes] = await Promise.all([
          fetch('/data/rosary/data.json'),
          fetch('/data/prayers/index.json')
        ]);
        
        if (rosaryRes.ok && prayersRes.ok) {
          setData(await rosaryRes.json());
          
          const prayersArray: Prayer[] = await prayersRes.json();
          const pMap: Record<string, Prayer> = {};
          prayersArray.forEach(p => { pMap[p.id] = p; });
          
          // Fallback static texts if missing from JSON for the Rosary flow
          if (!pMap['pater-noster']) pMap['pater-noster'] = { id: 'pater-noster', titleLatin: 'Pater Noster', titleEnglish: 'Our Father', latin: 'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.', english: 'Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread and forgive us our trespasses as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.' };
          if (!pMap['ave-maria']) pMap['ave-maria'] = { id: 'ave-maria', titleLatin: 'Ave Maria', titleEnglish: 'Hail Mary', latin: 'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc, et in hora mortis nostræ. Amen.', english: 'Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now, and at the hour of our death. Amen.' };
          if (!pMap['gloria-patri']) pMap['gloria-patri'] = { id: 'gloria-patri', titleLatin: 'Gloria Patri', titleEnglish: 'Glory Be', latin: 'Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.', english: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.' };
          if (!pMap['fatima']) pMap['fatima'] = { id: 'fatima', titleLatin: 'Oratio Fatimae', titleEnglish: 'O My Jesus', latin: 'O mi Iesu, dimitte nobis debita nostra, libera nos ab igne inferni, conduc in caelum omnes animas, praesertim illas quae maxime indigent misericordia tua. Amen.', english: 'O my Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy. Amen.' };
          if (!pMap['credo']) pMap['credo'] = { id: 'credo', titleLatin: 'Symbolum Apostolorum', titleEnglish: 'Apostles Creed', latin: 'Credo in Deum, Patrem omnipotentem, Creatorem caeli et terrae. Et in Iesum Christum, Filium eius unicum, Dominum nostrum: qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus: descendit ad inferos; tertia die resurrexit a mortuis; ascendit ad caelos; sedet ad dexteram Dei Patris omnipotentis: inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, Sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.', english: 'I believe in God, the Father Almighty, Creator of heaven and earth, and in Jesus Christ, His only Son, our Lord, who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died and was buried; He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from there He will come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.' };
          if (!pMap['salve-regina']) pMap['salve-regina'] = { id: 'salve-regina', titleLatin: 'Salve Regina', titleEnglish: 'Hail Holy Queen', latin: 'Salve, Regina, mater misericordiae, vita, dulcedo, et spes nostra, salve. Ad te clamamus exsules filii Hevae. Ad te suspiramus, gementes et flentes in hac lacrimarum valle. Eia, ergo, advocata nostra, illos tuos misericordes oculos ad nos converte. Et Iesum, benedictum fructum ventris tui, nobis post hoc exsilium ostende. O clemens, O pia, O dulcis Virgo Maria. V. Ora pro nobis, sancta Dei Genetrix. R. Ut digni efficiamur promissionibus Christi.', english: 'Hail, holy Queen, Mother of mercy, hail, our life, our sweetness and our hope. To thee do we cry, poor banished children of Eve: to thee do we send up our sighs, mourning and weeping in this valley of tears. Turn then, most gracious Advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus, O clement, O loving, O sweet Virgin Mary! V. Pray for us, O Holy Mother of God. R. That we may be made worthy of the promises of Christ.' };

          setPrayers(pMap);
        }
      } catch (err) {
        console.error('Failed to load rosary data', err);
      }
    }
    loadData();
  }, []);

  if (!data || Object.keys(prayers).length === 0) {
    return <div className="page"><div className="page-header"><h1>Holy Rosary</h1></div><div style={{textAlign:'center', padding: '2rem'}}>Loading...</div></div>;
  }

  const mysteries = data.mysteries[activeSet];
  
  const isDecade = step > 6 && step <= 76;
  const mysteryIndex = isDecade ? Math.floor((step - 7) / 14) : -1;
  const beadInDecade = isDecade ? ((step - 7) % 14) : -1;

  let displayTitle = '';
  let displaySubtitle = '';
  let beadType = 'small';
  let prayerData: Prayer | null = null;

  if (step === 0) {
    displayTitle = 'Sign of the Cross';
    displaySubtitle = 'Start at the Crucifix';
    beadType = 'cross';
    prayerData = { id: 'sign', titleLatin: 'Signum Crucis', titleEnglish: 'Sign of the Cross', latin: 'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.', english: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.' };
  } else if (step === 1) {
    displayTitle = 'Apostles Creed';
    displaySubtitle = 'Crucifix';
    beadType = 'cross';
    prayerData = prayers['credo'];
  } else if (step === 2) {
    displayTitle = 'Our Father';
    displaySubtitle = 'First large bead';
    beadType = 'large';
    prayerData = prayers['pater-noster'];
  } else if (step >= 3 && step <= 5) {
    displayTitle = 'Hail Mary';
    displaySubtitle = `For Faith, Hope, & Charity (${step - 2}/3)`;
    beadType = 'small';
    prayerData = prayers['ave-maria'];
  } else if (step === 6) {
    displayTitle = 'Glory Be';
    displaySubtitle = 'Space before medal';
    beadType = 'space';
    prayerData = prayers['gloria-patri'];
  } else if (isDecade) {
    const currentMystery = mysteries[mysteryIndex];
    if (beadInDecade === 0) {
      displayTitle = currentMystery.title;
      displaySubtitle = `Fruit: ${currentMystery.fruit}`;
      beadType = 'announce';
    } else if (beadInDecade === 1) {
      displayTitle = 'Our Father';
      displaySubtitle = `Mystery ${mysteryIndex + 1} - Large Bead`;
      beadType = 'large';
      prayerData = prayers['pater-noster'];
    } else if (beadInDecade >= 2 && beadInDecade <= 11) {
      displayTitle = 'Hail Mary';
      displaySubtitle = `Bead ${beadInDecade - 1} of 10`;
      beadType = 'small';
      prayerData = prayers['ave-maria'];
    } else if (beadInDecade === 12) {
      displayTitle = 'Glory Be';
      beadType = 'space';
      prayerData = prayers['gloria-patri'];
    } else if (beadInDecade === 13) {
      displayTitle = 'O My Jesus (Fatima Prayer)';
      beadType = 'space';
      prayerData = prayers['fatima'];
    }
  } else if (step === 77) {
    displayTitle = 'Hail Holy Queen';
    displaySubtitle = 'Center Medal';
    beadType = 'medal';
    prayerData = prayers['salve-regina'];
  } else {
    displayTitle = 'Sign of the Cross';
    displaySubtitle = 'Finish';
    beadType = 'cross';
    prayerData = { id: 'sign', titleLatin: 'Signum Crucis', titleEnglish: 'Sign of the Cross', latin: 'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.', english: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.' };
  }

  const handleNext = () => setStep(s => Math.min(s + 1, 78));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="page" style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header animate-fade-in" style={{ paddingBottom: '1rem' }}>
        <h1 style={{ marginBottom: 4 }}>Holy Rosary</h1>
        <p className="page-subtitle">The {activeSet.charAt(0).toUpperCase() + activeSet.slice(1)} Mysteries</p>
      </div>
      
      <div className="card animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem', marginBottom: '80px', overflowY: 'auto' }}>
        
        {/* Visual Bead Header */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: '1.5rem', minHeight: 60 }}>
          {step > 0 && <div className="rosary-bead" style={{ opacity: 0.5, transform: 'scale(0.8)' }}></div>}
          <div className={`rosary-bead active ${beadType === 'large' ? 'large' : beadType === 'cross' ? 'cross' : ''}`} 
               style={{ background: beadType === 'cross' ? 'transparent' : 'var(--accent)', 
                        border: beadType === 'cross' ? 'none' : '',
                        fontSize: beadType === 'cross' ? '2.5rem' : '' }}>
            {beadType === 'cross' ? '✝' : ''}
            {beadType === 'announce' ? '📖' : ''}
          </div>
          {step < 78 && <div className="rosary-bead" style={{ opacity: 0.5, transform: 'scale(0.8)' }}></div>}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--accent)', marginBottom: 8, fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>
            {displayTitle}
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
            {displaySubtitle}
          </p>
        </div>

        {/* Prayer Content */}
        <div style={{ flex: 1 }}>
          {prayerData && (
             <BilingualText 
               latin={prayerData.latin}
               english={prayerData.english}
               dropCap={true}
             />
          )}
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
          <button onClick={handlePrev} disabled={step === 0} style={{
            background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border)',
            padding: '12px 24px', borderRadius: '24px', fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.3 : 1
          }}>
            Back
          </button>
          
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {step + 1} / 79
          </div>

          <button onClick={handleNext} disabled={step === 78} style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '12px 32px', borderRadius: '24px', fontFamily: 'var(--font-ui)', fontWeight: 600, cursor: step === 78 ? 'not-allowed' : 'pointer', opacity: step === 78 ? 0.3 : 1
          }}>
            {step === 78 ? 'Finish' : 'Next'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
