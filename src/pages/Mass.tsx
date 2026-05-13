import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BilingualText } from '../components/ui/BilingualText';
import { getLiturgicalDay, getToday } from '../lib/calendar';

interface ProperData {
  id: string;
  titleLatin: string;
  titleVernacular: Record<string, string>;
  hasGloria?: boolean;
  hasCredo?: boolean;
  introit: { la: string } & Record<string, string>;
  collect: ({ la: string } & Record<string, string>)[];
  epistle: { la: string } & Record<string, string>;
  gradual: { la: string } & Record<string, string>;
  gospel: { la: string } & Record<string, string>;
  offertory: { la: string } & Record<string, string>;
  secret: ({ la: string } & Record<string, string>)[];
  communionAntiphon: { la: string } & Record<string, string>;
  postcommunion: ({ la: string } & Record<string, string>)[];
}

interface OrdoData {
  id: string;
  [key: string]: any;
}

import { useSettingsStore } from '../store/useSettingsStore';
import { useTranslation } from '../lib/i18n';
import { Icon } from '../components/ui/Icon';

const bookMap: Record<string, string> = {
  'JUAN': 'John', 'JOHN': 'John', 'GV': 'John', 'JOH': 'John', 'JN': 'John', 'IOANNEM': 'John',
  'LUCAS': 'Luke', 'LUKE': 'Luke', 'LC': 'Luke', 'LK': 'Luke', 'LUCAM': 'Luke',
  'MATEO': 'Matthew', 'MATTHEW': 'Matthew', 'MT': 'Matthew', 'MATTHAEUM': 'Matthew',
  'MARCOS': 'Mark', 'MARK': 'Mark', 'MC': 'Mark', 'MK': 'Mark', 'MARCUM': 'Mark'
};

function normalizeBook(name: string): string {
  const n = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s/g, '');
  return bookMap[n] || name;
}

export default function Mass() {
  const today = useMemo(() => getToday(), []);
  const litDay = useMemo(() => getLiturgicalDay(today), [today]);
  const vernacularLang = useSettingsStore((s) => s.vernacularLang);
  const { t } = useTranslation();
  
  const [proper, setProper] = useState<ProperData | null>(null);
  const [ordo, setOrdo] = useState<OrdoData | null>(null);
  const [meditations, setMeditations] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOrdinary, setShowOrdinary] = useState(true);

  useEffect(() => {
    async function loadMass() {
      try {
        setLoading(true);
        const properId = litDay.properId.toLowerCase();
        
        const [properRes, ordoRes, medRes] = await Promise.all([
          fetch(`/data/propers/${properId}.json`),
          fetch(`/data/ordinary/ordo.json`),
          fetch(`/data/meditations.json?v=${Date.now()}`).catch(() => null)
        ]);

        if (properRes.ok) setProper(await properRes.json());
        if (ordoRes.ok) setOrdo(await ordoRes.json());
        if (medRes && medRes.ok) {
          const medData = await medRes.json();
          console.log('Meditations loaded:', Object.keys(medData).length);
          setMeditations(medData);
        }

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMass();
  }, [litDay.properId]);

  // Helper to find matching meditation
  const getMeditation = (proper: ProperData | null) => {
    if (!proper || !meditations) return null;
    
    const allText = JSON.stringify(proper);
    // Find all markers globally
    const markers = allText.matchAll(/!((?:\d\s*)?[A-Za-z]+)\s*(\d+):(\d+)(?:-(\d+))?/g);
    
    for (const match of markers) {
      const book = normalizeBook(match[1].trim());
      const chapter = match[2];
      const startVerse = match[3];
      const endVerse = match[4] ? `-${match[4]}` : '';
      const key = `${book} ${chapter}:${startVerse}${endVerse}`;
      
      const entry = meditations[key];
      if (entry) {
        console.log('Meditation found for:', key);
        return entry[vernacularLang] || entry['en'] || entry['it'] || entry['es'] || entry['de'] || entry['fr'] || null;
      }
    }
    return null;
  };

  const meditation = getMeditation(proper);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>{t("Loading Missal...")}</p>
      </div>
    );
  }

  if (error || !proper) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>{t("Holy Mass")}</h1>
          <p className="page-subtitle">{t("Error loading texts")}</p>
        </div>
        <div className="card" style={{ color: 'var(--accent)' }}>
          <p>{error || t("Proper not found for today.")}</p>
        </div>
      </div>
    );
  }

  // Helper to safely format Divinum Officium text which might contain newlines and markers like "v." or "!"
  const formatDOText = (text: string) => {
    if (!text) return '';
    return text.split('\n')
      .filter(line => !line.startsWith('!')) // Remove rubric markers for now
      .join('\n');
  };

  return (
    <div className="page">
      <div className={`season-band ${litDay.color}`} style={{ borderRadius: '0 0 8px 8px', marginBottom: '1rem' }} />

      <div className="page-header animate-fade-in">
        <h1 style={{ marginBottom: 4 }}>{proper.titleVernacular?.[vernacularLang] || proper.titleVernacular?.['en'] || proper.titleLatin}</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }} lang="la">
          {proper.titleLatin}
        </p>
      </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            onClick={() => setShowOrdinary(!showOrdinary)}
            className="chip active"
            style={{ opacity: showOrdinary ? 1 : 0.6 }}
          >
            {showOrdinary ? t("Hide Ordinary") : t("Show Full Mass")}
          </button>
        </div>

        {showOrdinary && ordo && (
          <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', textAlign: 'center' }}>
              {t("Prayers at the Foot of the Altar")}
            </h2>
            <BilingualText latin={ordo.signumCrucis?.la} vernacular={ordo.signumCrucis?.vernacular} />
            <BilingualText latin={ordo.introibo?.la} vernacular={ordo.introibo?.vernacular} />
            <BilingualText latin={ordo.adDeum?.la} vernacular={ordo.adDeum?.vernacular} />
            
            {/* Omit Ps 42 in Passiontide and Requiems. Simplified for now */}
            <div className="rubric">{t("Psalm 42 (Omitted in Passiontide and Requiem)")}</div>
            <BilingualText latin={ordo.judicaMe?.la} vernacular={ordo.judicaMe?.vernacular} />
            
            <BilingualText latin={ordo.adjutorium?.la} vernacular={ordo.adjutorium?.vernacular} />
            <div className="rubric">{t("Priest's Confession")}</div>
            <BilingualText latin={ordo.confiteorSacerdos?.la} vernacular={ordo.confiteorSacerdos?.vernacular} />
            <BilingualText latin={ordo.misereaturSacerdos?.la} vernacular={ordo.misereaturSacerdos?.vernacular} />
            
            <div className="rubric">{t("Ministers' Confession")}</div>
            <BilingualText latin={ordo.confiteorMinistri?.la} vernacular={ordo.confiteorMinistri?.vernacular} />
            <BilingualText latin={ordo.misereaturMinistri?.la} vernacular={ordo.misereaturMinistri?.vernacular} />
            <BilingualText latin={ordo.indulgentiam?.la} vernacular={ordo.indulgentiam?.vernacular} />
            
            <BilingualText latin={ordo.versicles1?.la} vernacular={ordo.versicles1?.vernacular} />
            
            <div className="rubric">{t("Ascending the Altar")}</div>
            <BilingualText latin={ordo.auferANobis?.la} vernacular={ordo.auferANobis?.vernacular} />
            <BilingualText latin={ordo.oramusTe?.la} vernacular={ordo.oramusTe?.vernacular} />
          </div>
        )}

        <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            Introitus
          </h2>
          <BilingualText 
            latin={formatDOText(proper.introit?.la)}
            vernacular={proper.introit}
            dropCap={true}
            seasonColor={litDay.color}
          />
        </div>

        {showOrdinary && ordo && (
          <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Kyrie Eleison")}
            </h2>
            <BilingualText latin={ordo.kyrie?.la} vernacular={ordo.kyrie?.vernacular} />
            
            {proper.hasGloria && (
              <>
                <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                  {t("Gloria in excelsis")}
                </h2>
                <BilingualText latin={ordo.gloria?.la} vernacular={ordo.gloria?.vernacular} dropCap={true} seasonColor={litDay.color} />
              </>
            )}
            
            <div style={{ marginTop: '1rem' }}>
              <BilingualText latin={ordo.dominusVobiscum?.la} vernacular={ordo.dominusVobiscum?.vernacular} />
            </div>
          </div>
        )}

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Oratio
        </h2>
        {proper.collect?.map((c, i) => (
          <div key={i} style={{ marginBottom: i < proper.collect.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(c.la)}
              vernacular={c}
              dropCap={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Lectio
        </h2>
        <BilingualText 
          latin={formatDOText(proper.epistle?.la)}
          vernacular={proper.epistle}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Graduale & Alleluia
        </h2>
        <BilingualText 
          latin={formatDOText(proper.gradual?.la)}
          vernacular={proper.gradual}
          dropCap={true}
        />
      </div>

      {showOrdinary && ordo && (
        <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
          <div className="rubric">{t("Before the Gospel")}</div>
          <BilingualText latin={ordo.mundaCor?.la} vernacular={ordo.mundaCor?.vernacular} />
          <BilingualText latin={ordo.evangeliumIntro?.la} vernacular={ordo.evangeliumIntro?.vernacular} />
        </div>
      )}

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Evangelium
        </h2>
        <BilingualText 
          latin={formatDOText(proper.gospel?.la)}
          vernacular={proper.gospel}
          dropCap={true}
        />
        {showOrdinary && ordo && (
          <div style={{ marginTop: '1rem' }}>
            <BilingualText latin={ordo.lausTibiChriste?.la} vernacular={ordo.lausTibiChriste?.vernacular} />
          </div>
        )}
      </div>

      {meditation ? (
        <div className="card animate-slide-up" style={{ marginBottom: 16, borderLeft: '4px solid var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.05)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.8rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icon name="scroll" size={18} /> {t("Words of the Popes")}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
            {meditation}
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            — Vatican News
          </p>
        </div>
      ) : (
        <div className="card animate-slide-up" style={{ marginBottom: 16, borderLeft: '4px solid var(--accent-soft)', backgroundColor: 'rgba(var(--accent-rgb), 0.02)', padding: '0.75rem 1rem' }}>
          <Link to="/meditations" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon name="book" size={16} color="var(--accent-soft)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
                {t("Search Papal meditation manually...")}
              </span>
            </div>
            <span style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>→</span>
          </Link>
        </div>
      )}

      {showOrdinary && ordo && proper.hasCredo && (
        <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
            Credo
          </h2>
          <BilingualText latin={ordo.credo?.la} vernacular={ordo.credo?.vernacular} dropCap={true} seasonColor={litDay.color} />
          <div style={{ marginTop: '1rem' }}>
            <BilingualText latin={ordo.dominusVobiscum?.la} vernacular={ordo.dominusVobiscum?.vernacular} />
          </div>
        </div>
      )}

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Offertorium
        </h2>
        
        {showOrdinary && ordo && (
          <div style={{ marginBottom: '1rem' }}>
            <BilingualText latin={ordo.dominusVobiscum?.la} vernacular={ordo.dominusVobiscum?.vernacular} />
          </div>
        )}

        <BilingualText 
          latin={formatDOText(proper.offertory?.la)}
          vernacular={proper.offertory}
          dropCap={true}
        />

        {showOrdinary && ordo && (
          <div style={{ marginTop: '1rem' }}>
            <div className="rubric">{t("Offering of the Bread")}</div>
            <BilingualText latin={ordo.suscripeSanctePater?.la} vernacular={ordo.suscripeSanctePater?.vernacular} />
            <div className="rubric">{t("Preparation of the Chalice")}</div>
            <BilingualText latin={ordo.deusQuiHumanae?.la} vernacular={ordo.deusQuiHumanae?.vernacular} />
            <div className="rubric">{t("Offering of the Chalice")}</div>
            <BilingualText latin={ordo.offerimusTibi?.la} vernacular={ordo.offerimusTibi?.vernacular} />
            <BilingualText latin={ordo.inSpirituHumilitatis?.la} vernacular={ordo.inSpirituHumilitatis?.vernacular} />
            <div className="rubric">{t("Lavabo")}</div>
            <BilingualText latin={ordo.lavabo?.la} vernacular={ordo.lavabo?.vernacular} />
            <div className="rubric">{t("Prayer to the Holy Trinity")}</div>
            <BilingualText latin={ordo.suscipeSanctaTrinitas?.la} vernacular={ordo.suscipeSanctaTrinitas?.vernacular} />
            <div className="rubric">{t("Orate Fratres")}</div>
            <BilingualText latin={ordo.orateFratres?.la} vernacular={ordo.orateFratres?.vernacular} />
          </div>
        )}
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Secreta
        </h2>
        {proper.secret?.map((s, i) => (
          <div key={i} style={{ marginBottom: i < proper.secret.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(s.la)}
              vernacular={s}
              dropCap={i === 0}
            />
          </div>
        ))}

        {showOrdinary && ordo && (
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              Præfatio
            </h2>
            <BilingualText latin={ordo.sursumCorda?.la} vernacular={ordo.sursumCorda?.vernacular} />
            <BilingualText 
              latin={ordo.prefaceTrinitatis?.la} 
              vernacular={ordo.prefaceTrinitatis?.vernacular} 
              dropCap={true} 
            />
            
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Sanctus")}
            </h2>
            <BilingualText latin={ordo.sanctus?.la} vernacular={ordo.sanctus?.vernacular} dropCap={true} />
            
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Canon Missae")}
            </h2>
            <div className="rubric">{t("General Intercession")}</div>
            <BilingualText latin={ordo.teIgitur?.la} vernacular={ordo.teIgitur?.vernacular} dropCap={true} />
            <div className="rubric">{t("Commemoration of the Living")}</div>
            <BilingualText latin={ordo.mementoVivi?.la} vernacular={ordo.mementoVivi?.vernacular} />
            <BilingualText latin={ordo.communicantes?.la} vernacular={ordo.communicantes?.vernacular} />
            
            <div className="rubric">{t("Consecration")}</div>
            <BilingualText latin={ordo.hancIgitur?.la} vernacular={ordo.hancIgitur?.vernacular} />
            <BilingualText latin={ordo.quamOblationem?.la} vernacular={ordo.quamOblationem?.vernacular} />
            <BilingualText latin={ordo.quiPridie?.la} vernacular={ordo.quiPridie?.vernacular} />
            <BilingualText latin={ordo.similiModo?.la} vernacular={ordo.similiModo?.vernacular} />
            
            <div className="rubric">{t("Offering of the Sacrifice")}</div>
            <BilingualText latin={ordo.undeEtMemores?.la} vernacular={ordo.undeEtMemores?.vernacular} />
            <BilingualText latin={ordo.supraQuae?.la} vernacular={ordo.supraQuae?.vernacular} />
            <BilingualText latin={ordo.supplicesTeRogamus?.la} vernacular={ordo.supplicesTeRogamus?.vernacular} />
            
            <div className="rubric">{t("Commemoration of the Dead")}</div>
            <BilingualText latin={ordo.mementoDefuncti?.la} vernacular={ordo.mementoDefuncti?.vernacular} />
            <BilingualText latin={ordo.nobisQuoque?.la} vernacular={ordo.nobisQuoque?.vernacular} />
            <BilingualText latin={ordo.perQuem?.la} vernacular={ordo.perQuem?.vernacular} />
            
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Pater Noster & Agnus Dei")}
            </h2>
            <BilingualText latin={ordo.paterNoster?.la} vernacular={ordo.paterNoster?.vernacular} dropCap={true} />
            <BilingualText latin={ordo.liberaNos?.la} vernacular={ordo.liberaNos?.vernacular} />
            <BilingualText latin={ordo.paxDomini?.la} vernacular={ordo.paxDomini?.vernacular} />
            <BilingualText latin={ordo.haecCommixtio?.la} vernacular={ordo.haecCommixtio?.vernacular} />
            
            <div style={{ marginTop: '1rem' }}>
              <BilingualText latin={ordo.agnusDei?.la} vernacular={ordo.agnusDei?.vernacular} />
            </div>
            
            <div className="rubric" style={{ marginTop: '1rem' }}>{t("Prayers for Communion")}</div>
            <BilingualText latin={ordo.domineJesuChristeQuiDixisti?.la} vernacular={ordo.domineJesuChristeQuiDixisti?.vernacular} />
            <BilingualText latin={ordo.domineJesuChristeFiliDei?.la} vernacular={ordo.domineJesuChristeFiliDei?.vernacular} />
            <BilingualText latin={ordo.perceptioCorporis?.la} vernacular={ordo.perceptioCorporis?.vernacular} />
            
            <div className="rubric" style={{ marginTop: '1rem' }}>{t("Priest's Communion")}</div>
            <BilingualText latin={ordo.panemCaelestem?.la} vernacular={ordo.panemCaelestem?.vernacular} />
            <BilingualText latin={ordo.corpusDomini?.la} vernacular={ordo.corpusDomini?.vernacular} />
            <BilingualText latin={ordo.quidRetribuam?.la} vernacular={ordo.quidRetribuam?.vernacular} />
            <BilingualText latin={ordo.sanguisDomini?.la} vernacular={ordo.sanguisDomini?.vernacular} />
            
            <div className="rubric" style={{ marginTop: '1rem' }}>{t("Communion of the Faithful")}</div>
            <BilingualText latin={ordo.ecceAgnusDei?.la} vernacular={ordo.ecceAgnusDei?.vernacular} />
            <BilingualText latin={ordo.corpusDominiPopulo?.la} vernacular={ordo.corpusDominiPopulo?.vernacular} />
            
            <div className="rubric" style={{ marginTop: '1rem' }}>{t("Purification of the Chalice")}</div>
            <BilingualText latin={ordo.quodOre?.la} vernacular={ordo.quodOre?.vernacular} />
            <BilingualText latin={ordo.corpusTuum?.la} vernacular={ordo.corpusTuum?.vernacular} />
          </div>
        )}
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Communio
        </h2>
        <BilingualText 
          latin={formatDOText(proper.communionAntiphon?.la)}
          vernacular={proper.communionAntiphon}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Postcommunio
        </h2>
        {proper.postcommunion?.map((p, i) => (
          <div key={i} style={{ marginBottom: i < proper.postcommunion.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(p.la)}
              vernacular={p}
              dropCap={i === 0}
            />
          </div>
        ))}
        
        {showOrdinary && ordo && (
          <div style={{ marginTop: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Conclusion")}
            </h2>
            <BilingualText latin={ordo.iteMissaEst?.la} vernacular={ordo.iteMissaEst?.vernacular} />
            <BilingualText latin={ordo.placeatTibi?.la} vernacular={ordo.placeatTibi?.vernacular} />
            <BilingualText latin={ordo.benedicatVos?.la} vernacular={ordo.benedicatVos?.vernacular} />
            
            <h2 style={{ fontSize: '1.2rem', margin: '1.5rem 0 1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
              {t("Last Gospel")}
            </h2>
            <BilingualText latin={ordo.initiumEvangelii?.la} vernacular={ordo.initiumEvangelii?.vernacular} dropCap={true} />
          </div>
        )}
      </div>
      
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          *The Ordinary of the Mass (Ordo Missae) is currently rendered dynamically alongside the propers.*
        </p>
      </div>
    </div>
  );
}
