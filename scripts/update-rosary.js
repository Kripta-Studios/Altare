import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'public/data/rosary/data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Dictionaries
const translations = {
  "The Annunciation": { es: "La Anunciación", fr: "L'Annonciation", de: "Die Verkündigung", it: "L'Annunciazione" },
  "Humility": { es: "Humildad", fr: "Humilité", de: "Demut", it: "Umiltà" },
  "The Visitation": { es: "La Visitación", fr: "La Visitation", de: "Die Heimsuchung", it: "La Visitazione" },
  "Love of Neighbor": { es: "Amor al prójimo", fr: "Amour du prochain", de: "Nächstenliebe", it: "Amore per il prossimo" },
  "The Nativity": { es: "El Nacimiento", fr: "La Nativité", de: "Die Geburt Christi", it: "La Natività" },
  "Poverty of Spirit": { es: "Pobreza de espíritu", fr: "Pauvreté d'esprit", de: "Armut im Geiste", it: "Povertà di spirito" },
  "The Presentation": { es: "La Presentación", fr: "La Présentation", de: "Die Darstellung im Tempel", it: "La Presentazione" },
  "Purity of Mind and Body": { es: "Pureza de mente y cuerpo", fr: "Pureté du corps et de l'esprit", de: "Reinheit von Geist und Körper", it: "Purezza di mente e corpo" },
  "The Finding of Jesus in the Temple": { es: "El Niño Perdido y Hallado en el Templo", fr: "Le Recouvrement de Jésus au Temple", de: "Das Wiederauffinden Jesu im Tempel", it: "Il Ritrovamento di Gesù nel Tempio" },
  "Obedience": { es: "Obediencia", fr: "Obéissance", de: "Gehorsam", it: "Obbedienza" },
  
  "The Agony in the Garden": { es: "La Agonía en el Huerto", fr: "L'Agonie au Jardin", de: "Todesangst Christi", it: "L'Agonia nell'Orto" },
  "God's Will be Done": { es: "Que se haga la Voluntad de Dios", fr: "Que la Volonté de Dieu soit faite", de: "Gottes Wille geschehe", it: "Sia fatta la Volontà di Dio" },
  "The Scourging at the Pillar": { es: "La Flagelación", fr: "La Flagellation", de: "Die Geißelung", it: "La Flagellazione" },
  "Mortification of the Senses": { es: "Mortificación de los sentidos", fr: "Mortification des sens", de: "Abtötung der Sinne", it: "Mortificazione dei sensi" },
  "The Crowning with Thorns": { es: "La Coronación de Espinas", fr: "Le Couronnement d'Épines", de: "Die Dornenkrönung", it: "La Coronazione di Spine" },
  "Courage": { es: "Valentía", fr: "Courage", de: "Mut", it: "Coraggio" },
  "The Carrying of the Cross": { es: "Jesús con la Cruz a Cuestas", fr: "Le Portement de Croix", de: "Die Kreuztragung", it: "La Salita al Calvario" },
  "Patience in Adversity": { es: "Paciencia en la adversidad", fr: "Patience dans l'adversité", de: "Geduld im Leiden", it: "Pazienza nelle avversità" },
  "The Crucifixion": { es: "La Crucifixión", fr: "Le Crucifiement", de: "Die Kreuzigung", it: "La Crocifissione" },
  "Perseverance": { es: "Perseverancia", fr: "Persévérance", de: "Beharrlichkeit", it: "Perseveranza" },
  
  "The Resurrection": { es: "La Resurrección", fr: "La Résurrection", de: "Die Auferstehung", it: "La Risurrezione" },
  "Faith": { es: "Fe", fr: "Foi", de: "Glaube", it: "Fede" },
  "The Ascension": { es: "La Ascensión", fr: "L'Ascension", de: "Die Himmelfahrt", it: "L'Ascensione" },
  "Hope": { es: "Esperanza", fr: "Espérance", de: "Hoffnung", it: "Speranza" },
  "The Descent of the Holy Spirit": { es: "La Venida del Espíritu Santo", fr: "La Descente du Saint-Esprit", de: "Die Sendung des Heiligen Geistes", it: "La Discesa dello Spirito Santo" },
  "Wisdom": { es: "Sabiduría", fr: "Sagesse", de: "Weisheit", it: "Sapienza" },
  "The Assumption": { es: "La Asunción", fr: "L'Assomption", de: "Die Aufnahme Mariens in den Himmel", it: "L'Assunzione" },
  "Devotion to Mary": { es: "Devoción a María", fr: "Dévotion à Marie", de: "Verehrung Mariens", it: "Devozione a Maria" },
  "The Coronation of Mary": { es: "La Coronación de María", fr: "Le Couronnement de Marie", de: "Die Krönung Mariens im Himmel", it: "L'Incoronazione di Maria" },
  "Eternal Happiness": { es: "Felicidad Eterna", fr: "Bonheur éternel", de: "Ewige Seligkeit", it: "Felicità Eterna" }
};

for (const set in data.mysteries) {
  for (const mystery of data.mysteries[set]) {
    mystery.titleVernacular = translations[mystery.title] || {};
    mystery.titleVernacular.en = mystery.title;
    
    mystery.fruitVernacular = translations[mystery.fruit] || {};
    mystery.fruitVernacular.en = mystery.fruit;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Rosary data updated!');
