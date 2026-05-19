import { NextResponse } from 'next/server';
import { getProspectsToProcess, updateProspectStatus } from '@/lib/googleSheets';
import { generateEmailContent } from '@/lib/gemini';
import { sendEmail } from '@/lib/emailService';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Sécurité : vérifie que le secret correspond
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  try {
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
        // Génération du contenu par Gemini
        const contenu = await generateEmailContent(nom, entreprise);
        const sujet = `Optimisez ${entreprise} avec Logisoft – Démo offerte`;

        // Envoi de l'email
        await sendEmail({
          to: email,
          subject: sujet,
          html: `<p>${contenu.replace(/\n/g, '<br/>')}</p>`,
        });

        // Mise à jour du statut
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