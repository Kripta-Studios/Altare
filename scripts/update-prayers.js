import fs from 'fs';
import path from 'path';

const prayersEn = [
  {
    id: 'pater-noster',
    titleLatin: 'Pater Noster',
    titleVernacular: {
      en: 'Our Father',
      es: 'Padre Nuestro',
      fr: 'Notre Père',
      de: 'Vater Unser',
      it: 'Padre Nostro'
    },
    occasions: ['morning', 'evening', 'before-mass'],
    latin: 'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.',
    vernacular: {
      en: 'Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread and forgive us our trespasses as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.',
      es: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
      fr: 'Notre Père, qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd’hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi à ceux qui nous ont offensés. Et ne nous laisse pas entrer en tentation, mais délivre-nous du mal. Amen.',
      de: 'Vater unser im Himmel, geheiligt werde dein Name. Dein Reich komme. Dein Wille geschehe, wie im Himmel so auf Erden. Unser tägliches Brot gib uns heute. Und vergib uns unsere Schuld, wie auch wir vergeben unsern Schuldigern. Und führe uns nicht in Versuchung, sondern erlöse uns von dem Bösen. Amen.',
      it: 'Padre nostro, che sei nei cieli, sia santificato il tuo nome, venga il tuo regno, sia fatta la tua volontà, come in cielo così in terra. Dacci oggi il nostro pane quotidiano, e rimetti a noi i nostri debiti come noi li rimettiamo ai nostri debitori, e non ci indurre in tentazione, ma liberaci dal male. Amen.'
    }
  },
  {
    id: 'ave-maria',
    titleLatin: 'Ave Maria',
    titleVernacular: {
      en: 'Hail Mary',
      es: 'Ave María',
      fr: 'Je vous salue Marie',
      de: 'Gegrüßet seist du, Maria',
      it: 'Ave Maria'
    },
    occasions: ['morning', 'evening', 'marian'],
    latin: 'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc, et in hora mortis nostræ. Amen.',
    vernacular: {
      en: 'Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now, and at the hour of our death. Amen.',
      es: 'Dios te salve, María, llena eres de gracia, el Señor es contigo. Bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
      fr: 'Je vous salue Marie, pleine de grâce ; le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni. Sainte Marie, Mère de Dieu, priez pour nous, pauvres pécheurs, maintenant et à l’heure de notre mort. Amen.',
      de: 'Gegrüßet seist du, Maria, voll der Gnade, der Herr ist mit dir. Du bist gebenedeit unter den Frauen, und gebenedeit ist die Frucht deines Leibes, Jesus. Heilige Maria, Mutter Gottes, bitte für uns Sünder jetzt und in der Stunde unseres Todes. Amen.',
      it: 'Ave, o Maria, piena di grazia, il Signore è con te. Tu sei benedetta fra le donne e benedetto è il frutto del tuo seno, Gesù. Santa Maria, Madre di Dio, prega per noi peccatori, adesso e nell’ora della nostra morte. Amen.'
    }
  },
  {
    id: 'gloria-patri',
    titleLatin: 'Gloria Patri',
    titleVernacular: {
      en: 'Glory Be',
      es: 'Gloria Patri',
      fr: 'Gloire au Père',
      de: 'Ehre sei dem Vater',
      it: 'Gloria al Padre'
    },
    occasions: ['morning', 'evening'],
    latin: 'Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.',
    vernacular: {
      en: 'Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen.',
      es: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, y por los siglos de los siglos. Amén.',
      fr: 'Gloire au Père, et au Fils, et au Saint-Esprit. Comme il était au commencement, maintenant et toujours, et dans les siècles des siècles. Amen.',
      de: 'Ehre sei dem Vater und dem Sohn und dem Heiligen Geist. Wie im Anfang, so auch jetzt und alle Zeit und in Ewigkeit. Amen.',
      it: 'Gloria al Padre e al Figlio e allo Spirito Santo. Come era nel principio, ora e sempre nei secoli dei secoli. Amen.'
    }
  },
  {
    id: 'memorare',
    titleLatin: 'Memorare',
    titleVernacular: {
      en: 'Remember, O Most Gracious Virgin Mary',
      es: 'Acordaos, oh piadosísima Virgen',
      fr: 'Souvenez-vous, ô très miséricordieuse Vierge',
      de: 'Gedenke, o gütigste Jungfrau Maria',
      it: 'Ricordati, o piissima Vergine'
    },
    occasions: ['marian', 'in-temptation'],
    latin: 'Memoráre, O piíssima Virgo María, non esse audítum a sǽculo, quemquam ad tua curréntem præsídia, tua implorántem auxília, tua peténtem suffrágia, esse derelíctum. Ego tali animátus confidéntia, ad te, Virgo Vírginum, Mater, curro, ad te vénio, coram te gemens peccátor assísto. Noli, Mater Verbi, verba mea despícere; sed áudi propítia et exáudi. Amen.',
    vernacular: {
      en: 'Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen.',
      es: 'Acordaos, oh piadosísima Virgen María, que jamás se ha oído decir que ninguno de los que han acudido a vuestra protección, implorando vuestra asistencia y reclamando vuestro socorro, haya sido abandonado de vos. Animado con esta confianza, a vos también acudo, oh Madre, Virgen de las vírgenes; y gimiendo bajo el peso de mis pecados, me atrevo a comparecer ante vuestra presencia soberana. Oh Madre de Dios, no desechéis mis súplicas, antes bien, escuchadlas y acogedlas benignamente. Amén.',
      fr: 'Souvenez-vous, ô très miséricordieuse Vierge Marie, qu’on n’a jamais entendu dire qu’aucun de ceux qui ont eu recours à votre protection, imploré votre assistance ou réclamé vos suffrages, ait été abandonné. Animé de cette confiance, je me réfugie vers vous, ô Vierge des vierges, ô ma Mère, et, gémissant sous le poids de mes péchés, je me prosterne à vos pieds. Ô Mère du Verbe incarné, ne méprisez pas mes prières, mais écoutez-les favorablement et daignez les exaucer. Amen.',
      de: 'Gedenke, o gütigste Jungfrau Maria, es ist noch nie gehört worden, dass jemand, der zu dir seine Zuflucht nahm, deinen Beistand anrief und um deine Fürbitte flehte, von dir verlassen worden ist. Von diesem Vertrauen beseelt, nehme ich meine Zuflucht zu dir, o Jungfrau der Jungfrauen, meine Mutter, zu dir komme ich, vor dir stehe ich als ein seufzender Sünder. O Mutter des ewigen Wortes, verschmähe nicht meine Worte, sondern höre sie gnädig an und erhöre mich. Amen.',
      it: 'Ricordati, o piissima Vergine Maria, che non si è mai udito al mondo che alcuno abbia ricorso al tuo patrocinio, implorato il tuo aiuto, chiesto la tua protezione e sia stato abbandonato. Animato da tale confidenza, a te ricorro, o Madre, Vergine delle vergini; a te vengo e, peccatore contrito, innanzi a te mi prostro. O Madre del Verbo, non disprezzare le mie preghiere, ma ascoltami propizia ed esaudiscimi. Amen.'
    }
  },
  {
    id: 'act-of-contrition',
    titleLatin: 'Actus Contritionis',
    titleVernacular: {
      en: 'Act of Contrition',
      es: 'Acto de Contrición',
      fr: 'Acte de Contrition',
      de: 'Reuegebet',
      it: 'Atto di Dolore'
    },
    occasions: ['before-confession', 'evening'],
    latin: 'Deus meus, ex toto corde pǽnitet me ómnium meórum peccatórum, éaque detéstor, quia peccándo, non solum pœnas a te iuste statútas proméritus sum, sed præsértim quia offéndi te, summum bonum, ac dignum qui super ómnia diligáris. Ideo fírmiter propóno, adiuvánte grátia tua, de cétero me non peccatúrum peccandíque occasiónes próximas fugitúrum. Amen.',
    vernacular: {
      en: 'O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because I dread the loss of heaven, and the pains of hell; but most of all because they offend Thee, my God, Who are all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life. Amen.',
      es: 'Dios mío, me arrepiento de todo corazón de todos mis pecados y los aborrezco, porque al pecar, no solo merezco las penas establecidas por ti justamente, sino principalmente porque te ofendí a ti, sumo Bien y digno de amor por encima de todas las cosas. Por eso propongo firmemente, con la ayuda de tu gracia, no pecar más en adelante y huir de toda ocasión de pecado. Amén.',
      fr: 'Mon Dieu, j\'ai un très grand regret de vous avoir offensé, parce que vous êtes infiniment bon, infiniment aimable, et que le péché vous déplaît ; je prends la ferme résolution, avec le secours de votre sainte grâce, de ne plus vous offenser et de faire pénitence.',
      de: 'O mein Gott, ich bereue von ganzem Herzen, dich beleidigt zu haben, weil du der allerhöchste und liebenswürdigste Gott bist. Ich nehme mir fest vor, mit Hilfe deiner Gnade nicht mehr zu sündigen und die Gelegenheit zur Sünde zu meiden. Amen.',
      it: 'Mio Dio, mi pento e mi dolgo con tutto il cuore dei miei peccati, perché peccando ho meritato i tuoi castighi, e molto più perché ho offeso Te, infinitamente buono e degno di essere amato sopra ogni cosa. Propongo con il tuo santo aiuto di non offenderti mai più e di fuggire le occasioni prossime di peccato. Signore, misericordia, perdonami. Amen.'
    }
  }
];

fs.writeFileSync(path.join(process.cwd(), 'public', 'data', 'prayers', 'index.json'), JSON.stringify(prayersEn, null, 2));

console.log('Successfully updated prayers/index.json with multilingual support');
