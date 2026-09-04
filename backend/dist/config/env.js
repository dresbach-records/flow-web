import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({
    PORT: z.coerce.number().default(8080),
    DATABASE_URL: z.string().min(1),
    MONGODB_URI: z.string().min(1),
    MONGODB_DATABASE: z.string().default('flow'),
    JWT_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    CORS_ORIGIN: z.string().default('https://flow-web-mu.vercel.app')
});
export const env = schema.parse(process.env);
