# Altare

A Progressive Web App (PWA) companion for the Traditional Latin Mass (1962 Roman Missal).
Features offline-first capabilities, automated liturgical calendar resolution, daily propers, and traditional devotions in multiple languages.

## Project Architecture
- **Framework:** React 18 with TypeScript
- **Bundler:** Vite 5 + Vite PWA Plugin (Workbox caching for offline)
- **Styling:** Vanilla CSS + CSS Variables for theming (Parchment, White, Walnut)
- **Routing:** HashRouter (Ensures flawless navigation in static/PWA environments)
- **Storage:** Dexie.js (IndexedDB) for persistent settings and streaks
- **Data Source:** Divinum Officium (Extracted to static JSON files)

## Local Development & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Generate the Liturgical Data (Requires Node.js):**
   ```bash
   node scripts/parse-divinum.js
   node scripts/generate-missing-data.js
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 🚀 Guía de Despliegue en VPS (Producción)

Dado que **Altare** es una aplicación PWA *completamente estática* (no tiene backend ni base de datos externa), **NO necesitas crear un archivo `.service` de systemd**, ni necesitas mantener a Node.js corriendo con `npm run preview`. Caddy es un servidor web excelente y puede servir los archivos estáticos de forma nativa con un rendimiento máximo.

### Paso 1: Generar los archivos de Producción (En tu PC local o en el VPS)
Abre la terminal en la carpeta del proyecto y ejecuta:
```bash
npm install
node scripts/parse-divinum.js
node scripts/generate-missing-data.js
npm run build
```
Esto generará una carpeta llamada **`dist/`**. Esta carpeta contiene TODA la aplicación (HTML, CSS, JS, JSONs y el Service Worker).

### Paso 2: Subir los archivos al VPS
Crea una carpeta en tu servidor, por ejemplo en `/home/NexIA/Altare`, y copia el contenido de la carpeta `dist/` dentro. 
*(Si hiciste el `npm run build` directamente dentro del servidor VPS, asegúrate de que Caddy apunte a esa carpeta `dist`).*

### Paso 3: Configurar el Caddyfile
Abre tu `/etc/caddy/Caddyfile` y añade una nueva ruta en la sección de "Webs Estáticas" que ya tienes. 
Como hemos diseñado la aplicación usando `HashRouter`, la navegación funciona a la perfección sin necesidad de reglas complejas de reescritura de URL.

Añade este bloque a tu `Caddyfile` actual:

```caddyfile
    # Aplicación Altare (Traditional Latin Mass PWA)
    handle_path /altare/* {
        root * /home/NexIA/Altare/dist
        file_server
    }
```

### Paso 4: Recargar Caddy
Una vez guardado el `Caddyfile`, aplica los cambios en el servidor:
```bash
sudo systemctl reload caddy
```

¡Y listo! La aplicación estará disponible en `https://gex-dashboard.hopto.org/altare/`. 
Cualquier usuario que entre con el móvil podrá darle a "Instalar aplicación" y se guardará en su teléfono para usarla 100% offline.
