import dotenv from 'dotenv';

dotenv.config();

const rawClientUrls = process.env.CLIENT_URL ?? 'http://localhost:5173';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  clientUrls: rawClientUrls
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== ''),
  smtpHost: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? '',
  smtpPass: process.env.SMTP_PASS ?? '',
  contactRecipient: process.env.CONTACT_RECIPIENT ?? 'solventatrade@gmail.com',
  resendApiKey: process.env.RESEND_API_KEY ?? '',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
  mongoDbName: process.env.MONGODB_DB_NAME ?? 'solventa',
};