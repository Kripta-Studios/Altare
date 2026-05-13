import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public/data');

// Create directories
const dirs = ['prayers', 'rosary', 'stations', 'confession', 'saints', 'latin', 'articles'];
dirs.forEach(dir => fs.mkdirSync(path.join(OUTPUT_DIR, dir), { recursive: true }));

// 1. PRAYERS (Subset of 38, demonstrating structure with real data)
const prayers = [
  {
    id: "pater-noster",
    titleLatin: "Pater Noster",
    titleEnglish: "Our Father",
    occasions: ["morning", "evening", "before-mass"],
    latin: "Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem, sed líbera nos a malo. Amen.",
    english: "Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come. Thy will be done on earth as it is in heaven. Give us this day our daily bread and forgive us our trespasses as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen."
  },
  {
    id: "ave-maria",
    titleLatin: "Ave Maria",
    titleEnglish: "Hail Mary",
    occasions: ["morning", "evening", "marian"],
    latin: "Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc, et in hora mortis nostræ. Amen.",
    english: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou amongst women and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now, and at the hour of our death. Amen."
  },
  {
    id: "gloria-patri",
    titleLatin: "Gloria Patri",
    titleEnglish: "Glory Be",
    occasions: ["morning", "evening"],
    latin: "Glória Patri, et Fílio, et Spirítui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.",
    english: "Glory be to the Father, and to the Son, and to the Holy Spirit. As it was in the beginning, is now, and ever shall be, world without end. Amen."
  },
  {
    id: "memorare",
    titleLatin: "Memorare",
    titleEnglish: "Remember, O Most Gracious Virgin Mary",
    occasions: ["marian", "in-temptation"],
    latin: "Memoráre, O piíssima Virgo María, non esse audítum a sǽculo, quemquam ad tua curréntem præsídia, tua implorántem auxília, tua peténtem suffrágia, esse derelíctum. Ego tali animátus confidéntia, ad te, Virgo Vírginum, Mater, curro, ad te vénio, coram te gemens peccátor assísto. Noli, Mater Verbi, verba mea despícere; sed áudi propítia et exáudi. Amen.",
    english: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen."
  },
  {
    id: "act-of-contrition",
    titleLatin: "Actus Contritionis",
    titleEnglish: "Act of Contrition",
    occasions: ["before-confession", "evening"],
    latin: "Deus meus, ex toto corde pǽnitet me ómnium meórum peccatórum, éaque detéstor, quia peccándo, non solum pœnas a te iuste statútas proméritus sum, sed præsértim quia offéndi te, summum bonum, ac dignum qui super ómnia diligáris. Ideo fírmiter propóno, adiuvánte grátia tua, de cétero me non peccatúrum peccandíque occasiónes próximas fugitúrum. Amen.",
    english: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins, because I dread the loss of heaven, and the pains of hell; but most of all because they offend Thee, my God, Who are all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to confess my sins, to do penance, and to amend my life. Amen."
  }
];
fs.writeFileSync(path.join(OUTPUT_DIR, 'prayers', 'index.json'), JSON.stringify(prayers, null, 2));


// 2. ROSARY
const rosary = {
  mysteries: {
    joyful: [
      { num: 1, title: "The Annunciation", fruit: "Humility" },
      { num: 2, title: "The Visitation", fruit: "Love of Neighbor" },
      { num: 3, title: "The Nativity", fruit: "Poverty of Spirit" },
      { num: 4, title: "The Presentation", fruit: "Purity of Mind and Body" },
      { num: 5, title: "The Finding of Jesus in the Temple", fruit: "Obedience" }
    ],
    sorrowful: [
      { num: 1, title: "The Agony in the Garden", fruit: "God's Will be Done" },
      { num: 2, title: "The Scourging at the Pillar", fruit: "Mortification of the Senses" },
      { num: 3, title: "The Crowning with Thorns", fruit: "Courage" },
      { num: 4, title: "The Carrying of the Cross", fruit: "Patience in Adversity" },
      { num: 5, title: "The Crucifixion", fruit: "Perseverance" }
    ],
    glorious: [
      { num: 1, title: "The Resurrection", fruit: "Faith" },
      { num: 2, title: "The Ascension", fruit: "Hope" },
      { num: 3, title: "The Descent of the Holy Spirit", fruit: "Wisdom" },
      { num: 4, title: "The Assumption", fruit: "Devotion to Mary" },
      { num: 5, title: "The Coronation of Mary", fruit: "Eternal Happiness" }
    ]
  }
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'rosary', 'data.json'), JSON.stringify(rosary, null, 2));


// 3. STATIONS OF THE CROSS
const stations = [
  { num: 1, title: "Jesus is condemned to death", versicle: "Adoramus te, Christe, et benedicimus tibi.", response: "Quia per sanctam crucem tuam redemisti mundum." },
  { num: 2, title: "Jesus carries His cross", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 3, title: "Jesus falls the first time", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 4, title: "Jesus meets His afflicted mother", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 5, title: "Simon of Cyrene helps Jesus to carry His cross", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 6, title: "Veronica wipes the face of Jesus", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 7, title: "Jesus falls the second time", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 8, title: "The daughters of Jerusalem weep over Jesus", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 9, title: "Jesus falls the third time", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 10, title: "Jesus is stripped of His garments", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 11, title: "Jesus is nailed to the cross", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 12, title: "Jesus dies on the cross", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 13, title: "Jesus is taken down from the cross", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." },
  { num: 14, title: "Jesus is placed in the sepulcher", versicle: "Adoramus te, Christe...", response: "Quia per sanctam..." }
];
fs.writeFileSync(path.join(OUTPUT_DIR, 'stations', 'data.json'), JSON.stringify(stations, null, 2));


// 4. EXAMINATION OF CONSCIENCE
const confession = {
  commandments: [
    { num: 1, title: "I am the Lord thy God. Thou shalt not have strange gods before Me.", questions: ["Did I doubt or deny that God exists?", "Did I refuse to believe what God has revealed to us?"] },
    { num: 2, title: "Thou shalt not take the name of the Lord thy God in vain.", questions: ["Did I blaspheme or insult God?", "Did I take God's name carelessly or uselessly?"] },
    { num: 3, title: "Remember that thou keep holy the Sabbath day.", questions: ["Did I miss Mass on Sunday or a Holy Day of Obligation through my own fault?", "Did I do unnecessary work on Sunday?"] },
    { num: 4, title: "Honor thy father and thy mother.", questions: ["Did I disobey or disrespect my parents or legitimate superiors?", "Did I neglect my duties to my husband, wife, children or parents?"] },
    { num: 5, title: "Thou shalt not kill.", questions: ["Did I kill or physically injure anyone?", "Did I harbor hatred, anger, or vengeful thoughts?"] },
    { num: 6, title: "Thou shalt not commit adultery.", questions: ["Did I entertain impure thoughts or desires?", "Did I engage in impure actions, alone or with others?"] },
    { num: 7, title: "Thou shalt not steal.", questions: ["Did I steal, cheat, help or encourage others to steal?", "Did I damage another's property without acknowledging it?"] },
    { num: 8, title: "Thou shalt not bear false witness against thy neighbor.", questions: ["Did I lie?", "Did I gossip or reveal others' faults without necessity?"] },
    { num: 9, title: "Thou shalt not covet thy neighbor's wife.", questions: ["Did I entertain impure thoughts about someone else's spouse?"] },
    { num: 10, title: "Thou shalt not covet thy neighbor's goods.", questions: ["Was I envious of others' goods or success?", "Was I greedy or selfish?"] }
  ]
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'confession', 'data.json'), JSON.stringify(confession, null, 2));


// 5. SAINTS (subset)
const saints = [
  { id: "st-joseph", name: "St. Joseph", feast: "March 19", practices: ["Morning Offering", "Litany of St. Joseph", "Evening Examen"] },
  { id: "st-benedict", name: "St. Benedict", feast: "March 21", practices: ["Pray Lauds", "Lectio Divina", "Pray Compline"] },
  { id: "st-thomas-aquinas", name: "St. Thomas Aquinas", feast: "March 7", practices: ["Study", "Adoro Te Devote", "Rosary"] }
];
fs.writeFileSync(path.join(OUTPUT_DIR, 'saints', 'patrons.json'), JSON.stringify(saints, null, 2));


// 6. LATIN LESSONS
const latin = {
  lessons: [
    { id: 1, title: "Ecclesiastical Pronunciation — Vowels", content: "A is pronounced 'ah' as in father. E is pronounced 'eh' as in red. I is pronounced 'ee' as in machine. O is pronounced 'oh' as in for. U is pronounced 'oo' as in rule." },
    { id: 2, title: "Ecclesiastical Pronunciation — Consonants", content: "C before e, i, ae, oe is pronounced 'ch' as in church. Otherwise it is 'k'. G before e, i is 'j' as in joy. Otherwise 'g' as in go. GN is 'ny' as in canyon." }
  ],
  flashcards: [
    { id: "fc-001", lessonId: 1, latin: "Pater", phonetic: "PAH-tehr", english: "Father" },
    { id: "fc-002", lessonId: 1, latin: "Filius", phonetic: "FEE-lee-oos", english: "Son" },
    { id: "fc-003", lessonId: 1, latin: "Spiritus", phonetic: "SPEE-ree-toos", english: "Spirit" }
  ]
};
fs.writeFileSync(path.join(OUTPUT_DIR, 'latin', 'data.json'), JSON.stringify(latin, null, 2));


// 7. ARTICLES
const articles = [
  { id: "calendar", title: "The Liturgical Calendar", category: "Calendar", content: "The traditional Roman calendar is structured around two overlapping cycles: the Temporal cycle (Temporale), which centers on the life of Christ and the seasons of the year, and the Sanctoral cycle (Sanctorale), which commemorates the saints." },
  { id: "sacraments", title: "The Sacraments", category: "Sacraments", content: "The seven sacraments instituted by Christ are Baptism, Confirmation, Holy Eucharist, Penance, Extreme Unction, Holy Orders, and Matrimony." }
];
fs.writeFileSync(path.join(OUTPUT_DIR, 'articles', 'data.json'), JSON.stringify(articles, null, 2));

console.log("Missing content generated successfully in /public/data");
