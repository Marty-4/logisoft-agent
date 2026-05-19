const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const key = process.env.MISTRAL_API_KEY;


const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

export async function generateEmailContent(nom, entreprise) {
  const prompt = `Tu es un assistant commercial pour Logisoft, une entreprise qui crée des applications, sites web, applications web de gestion et des agents IA pour automatiser les tâches, répondre aux appels et fixer des rendez-vous.
Rédige un email professionnel et concis destiné à ${nom}, de l'entreprise ${entreprise}.
L'email doit :
- Présenter brièvement Logisoft et ses services.
- Proposer un rendez-vous de démonstration gratuit.
- Être signé par "Moi, fondateur de Logisoft".
- Contenir une phrase d'accroche adaptée au contexte de l'entreprise (si possible).
Ne mets pas d'objet d'email dans le corps, je le gérerai séparément.`;
  const response = await fetch(MISTRAL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: 'mistral-small-latest',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Erreur API Mistral:', data);
    throw new Error(data?.detail || 'Erreur inconnue de Mistral');
  }

  return data.choices[0].message.content;
}