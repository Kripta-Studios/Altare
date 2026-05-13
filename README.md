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
- **Liturgy Integration:** Full Ordo Missae and Daily Propers with local automatic translation scripts.

## Local Development & Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Generate the Liturgical Data (Requires Node.js):**
   ```bash
   node scripts/parse-divinum.js
   node scripts/generate-missing-data.js
   node scripts/auto-translate.js
   node scripts/build-ordo.js
   node scripts/translate-ordo.js
   node scripts/translate-prayers.js
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 🚀 Guía de Despliegue en VPS (Producción)

Dado que **Altare** es una aplicación PWA *completamente estática* (no requiere base de datos ni backend en ejecución permanente), el despliegue es muy sencillo. No necesitas servicios de Systemd ni dejar Node.js corriendo.

### Paso 1: Clonar y compilar la aplicación (En el VPS)
1. Clona el repositorio en tu servidor:
   ```bash
   git clone https://github.com/tu-usuario/altare.git /opt/altare
   cd /opt/altare
   ```
2. Instala las dependencias y genera los datos (incluyendo la traducción automática de textos faltantes):
   ```bash
   npm install
   node scripts/parse-divinum.js
   node scripts/generate-missing-data.js
   node scripts/auto-translate.js
   node scripts/build-ordo.js
   node scripts/translate-ordo.js
   node scripts/translate-prayers.js
   ```
3. Genera la versión final optimizada para producción:
   ```bash
   npm run build
   ```
   Esto generará la carpeta `dist/` con todos los archivos estáticos necesarios.

### Paso 2: Configurar el Servidor Web

Puedes usar cualquier servidor web. Al usar `HashRouter` (navegación con `#`), no necesitas reglas complejas de reescritura.

#### Opción A: Usando Nginx (Recomendado)
Crea un archivo de configuración para tu dominio en `/etc/nginx/sites-available/altare`:
```nginx
server {
    listen 80;
    server_name misal.midominio.com; # Cambia por tu dominio

    root /opt/altare/dist;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```
Habilita el sitio y reinicia Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/altare /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

#### Opción B: Usando Caddy (Ideal para HTTPS automático)
Si tienes un subdirectorio (ej. `misal.midominio.com/altare`), añade esto a tu `/etc/caddy/Caddyfile`:
```caddyfile
    # Aplicación Altare
    handle_path /altare/* {
        root * /opt/altare/dist
        file_server
    }
```
Recarga Caddy:
```bash
sudo systemctl reload caddy
```

### Paso 3: Disfrutar
¡Listo! Cualquier usuario que entre desde su móvil verá la opción de "Instalar aplicación" (Añadir a la pantalla de inicio) para usar el Misal 100% offline.
