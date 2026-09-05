// FLOW — Shared components barrel (FASE 3).
// Esta camada exporta APENAS UI reutilizável (ui, layout, social, etc).
// Páginas (AuthPage, CreatorCenter, AdminApp, ...) NÃO pertencem aqui:
// vivem em src/app/*, src/admin/* e são compostas via src/pages/index.ts.
// (Antes, este barrel reexportava páginas — violação de camadas corrigida.)
export * from './ui';
export * as Layout from './layout';
