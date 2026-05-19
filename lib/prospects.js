// lib/prospects.js
import fetch from 'node-fetch';

const HUNTER_API_KEY = process.env.HUNTER_API_KEY; // On ajoutera cette clé plus tard
const HUNTER_API_URL = 'https://api.hunter.io/v2/domain-search';

export async function findProspects(domain) {
  console.log(`Recherche de prospects pour le domaine : ${domain}`);
  
  const response = await fetch(`${HUNTER_API_URL}?domain=${domain}&api_key=${HUNTER_API_KEY}`);
  
  if (!response.ok) {
    const err = await response.json();
    console.error('Erreur API Hunter:', err);
    throw new Error(err?.errors?.[0]?.details || 'Échec de la recherche de prospects');
  }

  const data = await response.json();
  
  // On filtre et on structure les résultats pour notre Google Sheet
  const prospects = data.data.emails
    .filter(e => e.verification && e.verification.status === 'valid')
    .map(e => ({
      email: e.value,
      nom: `${e.first_name} ${e.last_name}`,
      entreprise: data.data.organization || domain,
      poste: e.position || 'Non spécifié'
    }));

  console.log(`${prospects.length} prospects trouvés pour ${domain}`);
  return prospects;
}