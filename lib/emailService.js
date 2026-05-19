import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  // Créer le transporteur SMTP Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,            // ton adresse Gmail complète
      pass: process.env.GMAIL_APP_PASSWORD,    // le mot de passe d'application (16 caractères)
    },
  });

  // Envoyer l'email
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });

  console.log('Message envoyé :', info.messageId);
  return info;
}