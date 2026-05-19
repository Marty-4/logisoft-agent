import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger manuellement le fichier .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Vérifier que les variables sont bien chargées
console.log('EMAIL présent ?', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
console.log('KEY présent ?', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('SHEET_ID présent ?', !!process.env.GOOGLE_SHEET_ID);

// Importer les fonctions après avoir chargé les variables
import { getSheet, getProspectsToProcess } from './lib/googleSheets.js';

(async () => {
  try {
    const sheet = await getSheet();
    console.log('✅ Feuille connectée :', sheet.title);
    const rows = await sheet.getRows();
    console.log(`📊 Nombre de lignes : ${rows.length}`);
    rows.forEach(r => console.log(r.get('email'), r.get('statut')));
    const aEnvoyer = await getProspectsToProcess();
    console.log(`📬 Prospects à envoyer : ${aEnvoyer.length}`);
  } catch (e) {
    console.error('❌ Erreur :', e.message);
  }
})();