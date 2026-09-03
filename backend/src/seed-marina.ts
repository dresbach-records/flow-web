import { seedMarinaPosts } from './services/persona.service.js';

const created = await seedMarinaPosts();
console.log(`Marina Silva: ${created} novos posts agendados.`);
