import { useSettingsStore } from '../store/useSettingsStore';

const translations: Record<string, Record<string, string>> = {
  "Settings": { es: "Ajustes", fr: "Paramètres", de: "Einstellungen", it: "Impostazioni" },
  "Preferences & Configuration": { es: "Preferencias y Configuración", fr: "Préférences et Configuration", de: "Einstellungen & Konfiguration", it: "Preferenze e Configurazione" },
  "Appearance": { es: "Apariencia", fr: "Apparence", de: "Aussehen", it: "Aspetto" },
  "Theme": { es: "Tema", fr: "Thème", de: "Thema", it: "Tema" },
  "Text Size": { es: "Tamaño de Texto", fr: "Taille du Texte", de: "Textgröße", it: "Dimensione Testo" },
  "Translation Language": { es: "Idioma de Traducción", fr: "Langue de Traduction", de: "Übersetzungssprache", it: "Lingua di Traduzione" },
  "Display Layout": { es: "Diseño de Pantalla", fr: "Mise en page", de: "Anzeigelayout", it: "Layout di Visualizzazione" },
  "Today's Mass": { es: "Misa de Hoy", fr: "Messe d'Aujourd'hui", de: "Heutige Messe", it: "Messa di Oggi" },
  "Follow the Propers": { es: "Sigue los Propios", fr: "Suivez les Propres", de: "Folgen Sie den Proprien", it: "Segui i Propri" },
  "Daily Prayers": { es: "Oraciones Diarias", fr: "Prières Quotidiennes", de: "Tägliche Gebete", it: "Preghiere Quotidiane" },
  "Start your rule": { es: "Comienza tu regla", fr: "Commencez votre règle", de: "Beginnen Sie Ihre Regel", it: "Inizia la tua regola" },
  "Holy Rosary": { es: "Santo Rosario", fr: "Saint Rosaire", de: "Heiliger Rosenkranz", it: "Santo Rosario" },
  "Tap to view prayers": { es: "Toca para ver oraciones", fr: "Appuyez pour voir les prières", de: "Tippen, um Gebete anzuzeigen", it: "Tocca per vedere le preghiere" },
  "Tap to view today's Mass": { es: "Toca para ver la Misa de hoy", fr: "Appuyez pour voir la messe", de: "Tippen, um die Messe anzuzeigen", it: "Tocca per vedere la Messa" },
  "Holy Mass": { es: "Santa Misa", fr: "Sainte Messe", de: "Heilige Messe", it: "Santa Messa" },
  "Loading Missal...": { es: "Cargando Misal...", fr: "Chargement du Missel...", de: "Messbuch wird geladen...", it: "Caricamento Messale..." },
  "Error loading texts": { es: "Error cargando textos", fr: "Erreur de chargement", de: "Fehler beim Laden", it: "Errore di caricamento" },
  "Proper not found for today.": { es: "Propio no encontrado para hoy.", fr: "Propre introuvable.", de: "Proprium nicht gefunden.", it: "Proprio non trovato." },
  "Sunday": { es: "Domingo", fr: "Dimanche", de: "Sonntag", it: "Domenica" },
  "days until Sunday": { es: "días hasta el Domingo", fr: "jours jusqu'à dimanche", de: "Tage bis Sonntag", it: "giorni a Domenica" },
  "day until Sunday": { es: "día hasta el Domingo", fr: "jour jusqu'à dimanche", de: "Tag bis Sonntag", it: "giorno a Domenica" },
  "Joyful Mysteries": { es: "Misterios Gozosos", fr: "Mystères Joyeux", de: "Freudenreiche Geheimnisse", it: "Misteri Gaudiosi" },
  "Sorrowful Mysteries": { es: "Misterios Dolorosos", fr: "Mystères Douloureux", de: "Schmerzhafte Geheimnisse", it: "Misteri Dolorosi" },
  "Glorious Mysteries": { es: "Misterios Gloriosos", fr: "Mystères Glorieux", de: "Glorreiche Geheimnisse", it: "Misteri Gloriosi" },
  "Gloria": { es: "Gloria", fr: "Gloria", de: "Gloria", it: "Gloria" },
  "Credo": { es: "Credo", fr: "Credo", de: "Credo", it: "Credo" },
  "No Gloria": { es: "Sin Gloria", fr: "Pas de Gloria", de: "Kein Gloria", it: "Nessun Gloria" },
  "No Credo": { es: "Sin Credo", fr: "Pas de Credo", de: "Kein Credo", it: "Nessun Credo" }
};

export function useTranslation() {
  const lang = useSettingsStore((s) => s.vernacularLang);
  
  const t = (key: string) => {
    if (lang === 'en') return key;
    return translations[key]?.[lang] || key;
  };

  return { t, lang };
}
