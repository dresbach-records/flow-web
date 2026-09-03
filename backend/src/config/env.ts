import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(8080),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
  FIREBASE_STORAGE_BUCKET: z.string().min(1),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1).optional(),
  CORS_ORIGIN: z.string().default('https://flow-web-mu.vercel.app')
});

export const env = schema.parse(process.env);
