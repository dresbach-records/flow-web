import React from 'react';
import './rewards.css';
// FASE 1: sem saldo/atividades fictícios (REGRA DE CONCLUSÃO FLOW).
// Recompensas reais chegam com o backend (Fase 9).
export function RewardsPage(){return <main className="rewards-page"><div className="rewards-wrap"><header><span className="rewards-pill">FLOW REWARDS</span><h1>Seu saldo de recompensas</h1><p>Participe de atividades elegíveis e acompanhe suas recompensas no FLOW.</p></header><section className="rewards-balance"><small>Saldo disponível</small><strong>R$ 0,00</strong><button disabled title="Saques chegam com o backend de recompensas (Fase 9)">Solicitar saque (em breve)</button></section><section className="rewards-list"><h2>Histórico</h2><p style={{fontSize:13,color:'#64748B'}}>Nenhuma atividade registrada ainda. O histórico real aparece aqui.</p></section></div></main>}
