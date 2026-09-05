// FLOW — Aparência (decisão real de produto: Light UI único, sem dark mode).
export default function AparenciaPage() {
  return (
    <div style={{ maxWidth: 840, margin: '0 auto', padding: '24px 20px 60px' }}>
      <h1 style={{ margin: '0 0 6px 0', fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Aparência</h1>
      <p style={{ margin: '0 0 18px 0', fontSize: 14, color: '#64748B' }}>
        A FLOW utiliza exclusivamente Light UI. Não há modo escuro.
      </p>
      <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 24 }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0F172A' }}>Tema claro</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
          Fundo #F8FAFC, superfícies brancas e texto azul-marinho. A identidade é única em
          todas as plataformas e não possui alternativa de tema.
        </p>
      </div>
    </div>
  );
}
