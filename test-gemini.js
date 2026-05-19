import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Afficher un bout de la clé pour vérifier (ne pas exposer en entier si possible)
const key = process.env.GEMINI_API_KEY;
console.log('Clé trouvée ?', !!key);
if (key) {
  console.log('Début de la clé :', key.substring(0, 8) + '...');
} else {
  console.error('Aucune clé GEMINI_API_KEY trouvée dans .env.local');
}

import { generateEmailContent } from './lib/gemini.js';

(async () => {
  try {
    const email = await generateEmailContent('Jean', 'Boulangerie du Coin');
    console.log('✅ Email généré :\n', email);
  } catch (error) {
    console.error('❌ Erreur Gemini :', error.message);
  }
})();