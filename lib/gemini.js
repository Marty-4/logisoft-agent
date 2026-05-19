import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateEmailContent(nom, entreprise) {
  const prompt = `Tu es un assistant commercial pour Logisoft, une entreprise qui crée des applications, sites web, applications web de gestion et des agents IA pour automatiser les tâches, répondre aux appels et fixer des rendez-vous.
Rédige un email professionnel et concis destiné à ${nom}, de l'entreprise ${entreprise}.
L'email doit :
- Présenter brièvement Logisoft et ses services.
- Proposer un rendez-vous de démonstration gratuit.
- Être signé par "Moi, fondateur de Logisoft".
- Contenir une phrase d'accroche adaptée au contexte de l'entreprise (si possible).
Ne mets pas d'objet d'email dans le corps, je le gérerai séparément.`;

  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });

  return response.text;
}