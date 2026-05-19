import { NextResponse } from 'next/server';
import { getSheet, getProspectsToProcess, updateProspectStatus } from '@/lib/googleSheets';
import { generateEmailContent } from '@/lib/gemini';
import { sendEmail } from '@/lib/emailService';

// --- Nouvelle fonction de recherche de prospects (Hunter.io) ---
const HUNTER_API_KEY = process.env.HUNTER_API_KEY;
const HUNTER_DOMAIN_SEARCH_URL = 'https://api.hunter.io/v2/domain-search';

async function findProspects(domain) {
  const url = `${HUNTER_DOMAIN_SEARCH_URL}?domain=${encodeURIComponent(domain)}&api_key=${HUNTER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json();
    console.error('Erreur Hunter :', err);
    throw new Error(err?.errors?.[0]?.details || 'Échec recherche Hunter');
  }
  const data = await res.json();
  return data.data.emails
    .filter(e => e.verification && e.verification.status === 'valid')
    .map(e => ({
      email: e.value,
      nom: `${e.first_name} ${e.last_name}`,
      entreprise: data.data.organization || domain,
    }));
}

// --- Nouvelle version de la route CRON ---
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
    // ========================================================
    // ÉTAPE 1 : RECHERCHE DE NOUVEAUX PROSPECTS
    // ========================================================
    console.log('Recherche de nouveaux prospects...');
    // Liste des domaines à cibler (à personnaliser !)
    const domainesACibler = ['totalenergies.cg', 'snpc-group.com','tridentenergy.com','mtn.cg','airtel.cg','alink-telecom.com','intercon-congo.com','bgfibank.com','banquepostale-congo.com','ecobank.com','societegenerale.cg','bci.cg','bdeac.org','bouygues-es.com','cmec.com','odellya.cg','siliconeconnect.com','cowema.org','lobservatoire242.cg','soromholding.cg',' emploi.cg'];

    let nouveauxProspects = [];
    for (const domain of domainesACibler) {
      try {
        const prospects = await findProspects(domain);
        nouveauxProspects = [...nouveauxProspects, ...prospects];
        console.log(`${prospects.length} prospects trouvés pour ${domain}`);
      } catch (err) {
        console.error(`Échec pour ${domain} :`, err.message);
      }
    }

    // Ajouter les nouveaux prospects à la Google Sheet (s'ils n'y sont pas déjà)
    if (nouveauxProspects.length > 0) {
      const sheet = await getSheet();
      const existingRows = await sheet.getRows();
      const existingEmails = new Set(existingRows.map(r => r.get('email')));

      for (const p of nouveauxProspects) {
        if (!existingEmails.has(p.email)) {
          await sheet.addRow({
            email: p.email,
            nom: p.nom,
            entreprise: p.entreprise,
            statut: 'à envoyer',
          });
          console.log(`Ajouté : ${p.email}`);
        }
      }
    }

    // ========================================================
    // ÉTAPE 2 : ENVOI DES EMAILS (CODE EXISTANT)
    // ========================================================
    const prospects = await getProspectsToProcess();

    if (prospects.length === 0) {
      return NextResponse.json({ message: 'Aucun prospect à traiter.' });
    }

    const results = [];

    for (const row of prospects) {
      const email = row.get('email');
      const nom = row.get('nom');
      const entreprise = row.get('entreprise');

      try {
        const contenu = await generateEmailContent(nom, entreprise);
        const sujet = `Optimisez ${entreprise} avec Logisoft – Démo offerte`;

        await sendEmail({
          to: email,
          subject: sujet,
          html: `<p>${contenu.replace(/\n/g, '<br/>')}</p>`,
        });

        await updateProspectStatus(row, 'envoyé');
        results.push(`✅ Envoyé à ${email}`);
      } catch (error) {
        console.error(`Erreur pour ${email}:`, error);
        await updateProspectStatus(row, 'erreur');
        results.push(`❌ Échec pour ${email}`);
      }
    }

    return NextResponse.json({ message: 'Traitement terminé', results });
  } catch (error) {
    console.error('Erreur globale:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}