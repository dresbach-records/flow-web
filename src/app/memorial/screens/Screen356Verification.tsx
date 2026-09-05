import { useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import type { MemorialScreenProps } from './types';

export default function Screen356Verification({ onNavigate }: MemorialScreenProps) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');

  return (
    <div style={{ padding: '40px 36px', maxWidth: 680, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>
        Verificação da solicitação
      </h2>
      <p style={{ margin: '0 0 28px', color: '#64748B', fontSize: 15 }}>
        Para garantir a segurança, precisamos de algumas informações.
      </p>

      <div className="m-form-group">
        <label>Nome do solicitante</label>
        <input
          type="text"
          className="m-input"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        />
      </div>

      <div className="m-form-group">
        <label>Relação com o usuário falecido</label>
        <select
          className="m-select"
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
        >
          <option value="">Selecione...</option>
          <option value="parent">Familiar de 1º grau (Cônjuge, Filho, Pai/Mãe)</option>
          <option value="relative">Outro familiar</option>
          <option value="legal">Representante legal / inventariante</option>
          <option value="friend">Amigo próximo</option>
        </select>
      </div>

      <div className="m-form-group">
        <label>Data do falecimento</label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="m-input"
            placeholder="DD / MM / AAAA"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #CBD5E1' }}
          />
          <Calendar size={18} color="#94A3B8" style={{ position: 'absolute', right: 12, top: 14 }} />
        </div>
      </div>

      <div className="m-form-group">
        <label>Documentação comprobatória</label>
        <div style={{ border: '2px dashed #CBD5E1', borderRadius: 14, padding: '24px 16px', textAlign: 'center', background: '#F8FAFC' }}>
          <Upload size={28} color="#8B5CF6" style={{ marginBottom: 8 }} />
          <p style={{ margin: '0 0 12px', fontSize: 14, color: '#475569' }}>
            Certidão de óbito, notícia, obituário ou documento oficial.
          </p>
          <button className="m-btn-secondary" type="button" style={{ padding: '8px 18px', fontSize: 13 }}>
            Selecionar arquivo
          </button>
        </div>
      </div>

      <button
        className="m-btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}
        onClick={() => onNavigate(357)}
      >
        Enviar para análise
      </button>
    </div>
  );
}
