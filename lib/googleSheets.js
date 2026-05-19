import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

let doc = null;

export async function getSheet() {
  if (doc) return doc.sheetsByIndex[0];

  const jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

export async function getProspectsToProcess() {
  const sheet = await getSheet();
  const rows = await sheet.getRows();
  return rows.filter(row => row.get('statut') === 'à envoyer');
}

export async function updateProspectStatus(row, status) {
  row.set('statut', status);
  await row.save();
}