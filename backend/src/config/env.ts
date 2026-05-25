import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  smtpHost: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  contactRecipient: process.env.CONTACT_RECIPIENT ?? 'solventatrade@gmail.com',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
  mongoDbName: process.env.MONGODB_DB_NAME ?? 'solventa',
};