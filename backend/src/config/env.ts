import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(8080),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().min(1),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1).optional(),
  GOOGLE_CLOUD_PROJECT: z.string().min(1).optional(),
  GOOGLE_CLOUD_LOCATION: z.string().min(1).default('global'),
  FLOW_GUARDIAN_ENABLED: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  FLOW_GUARDIAN_MODEL: z.string().min(1).default('gemini-2.5-flash'),
  FLOW_GUARDIAN_TIMEOUT_MS: z.coerce.number().int().positive().default(8000),
  CORS_ORIGIN: z.string().default('https://flowsocial.fun,http://localhost:3000'),
  VAPID_PUBLIC: z.string().min(1).optional(),
  VAPID_PRIVATE: z.string().min(1).optional(),
  VAPID_SUBJECT: z.string().min(1).optional()
});

export const env = schema.parse(process.env);
