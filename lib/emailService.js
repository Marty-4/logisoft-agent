// lib/emailService.js
import * as brevo from '@getbrevo/brevo';

export async function sendEmail({ to, subject, html }) {
  // Configure l'API Brevo
  const defaultClient = brevo.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const apiInstance = new brevo.TransactionalEmailsApi();

  const sender = {
    email: process.env.FROM_EMAIL, // ton adresse d'expéditeur vérifiée
    name: 'Logisoft',
  };

  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
    console.log(`✅ Email envoyé à ${to}`);
  } catch (error) {
    console.error(`❌ Erreur Brevo pour ${to}:`, error);
    throw error; // pour que la route cron capture l'échec
  }
}