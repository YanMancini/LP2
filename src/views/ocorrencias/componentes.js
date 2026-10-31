import React from 'react';
import FormGroup from '../../components/form-group';
import { novaLinha } from './config';

const rotulo = (r, i) => `${i + 1} - ${r.nomeCompleto || r.numeroCNH || r.placa || r.descricaoObjeto || ''}`;

export function CamposForm({ campos, row, onChange, refs = {}, prefix }) {
  return campos
    .filter((c) => c.tipo !== 'hidden' && (!c.visivel || c.visivel(row)))
    .map((c) => {
      const id = `${prefix}-${c.nome}`;
      const v = row[c.nome] ?? (c.tipo === 'checkbox' ? false : '');
      let input;
      if (c.tipo === 'select') {
        input = (
          <select className='form-select' id={id} value={v} onChange={(e) => onChange(c.nome, e.target.value)}>
            <option value=''> </option>
            {c.opcoes.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        );
      } else if (c.tipo === 'ref') {
        input = (
          <select className='form-select' id={id} value={v} onChange={(e) => onChange(c.nome, e.target.value)}>
            <option value=''> </option>
            {(refs[c.ref] || []).map((r, i) => (
              <option key={r._k} value={r._k}>{rotulo(r, i)}</option>
            ))}
          </select>
        );
      } else if (c.tipo === 'pessoa') {
        input = (
          <select
            className='form-select'
            id={id}
            value={v}
            onChange={(e) => {
              const p = (refs.pessoasCad || []).find((x) => String(x.id) === e.target.value);
              onChange(c.nome, p ? p.id : '');
            }}
          >
            <option value=''>— Nova pessoa —</option>
            {(refs.pessoasCad || []).map((p) => (
              <option key={p.id} value={p.id}>{p.nomeCompleto}{p.cpf ? ` (${p.cpf})` : ''}</option>
            ))}
          </select>
        );
      } else if (c.tipo === 'textarea') {
        input = <textarea id={id} rows='3' className='form-control' value={v} onChange={(e) => onChange(c.nome, e.target.value)} />;
      } else if (c.tipo === 'checkbox') {
        input = <input type='checkbox' id={id} className='form-check-input' checked={!!v} onChange={(e) => onChange(c.nome, e.target.checked)} />;
      } else {
        input = <input type={c.tipo} id={id} className='form-control' value={v} onChange={(e) => onChange(c.nome, e.target.value)} />;
      }
      return (
        <FormGroup key={c.nome} label={`${c.label}:${c.obrigatorio ? ' *' : ''}`} htmlFor={id}>
          {input}
        </FormGroup>
      );
    });
}

// Seção de uma tabela: 'unico' = um registro; 'lista' = adicionar/remover linhas
export function SecaoLista({ spec, rows, onChange, refs }) {
  if (spec.modo === 'unico') {
    return (
      <div className='mb-3'>
        <h5>{spec.titulo}</h5>
        <CamposForm
          campos={spec.campos}
          row={rows[0]}
          prefix={spec.tabela}
          refs={refs}
          onChange={(n, v) => onChange([{ ...rows[0], [n]: v }])}
        />
      </div>
    );
  }
  return (
    <div className='mb-3'>
      <h5>{spec.titulo}</h5>
      {rows.map((r, i) => (
        <div className='border rounded p-2 mb-2' key={r._k}>
          <CamposForm
            campos={spec.campos}
            row={r}
            prefix={`${spec.tabela}-${i}`}
            refs={refs}
            onChange={(n, v) => onChange(rows.map((x) => (x._k === r._k ? { ...x, [n]: v } : x)))}
          />
          <button type='button' className='btn btn-sm btn-outline-danger' onClick={() => onChange(rows.filter((x) => x._k !== r._k))}>
            Remover
          </button>
        </div>
      ))}
      <button type='button' className='btn btn-sm btn-outline-primary' onClick={() => onChange([...rows, novaLinha()])}>
        + Adicionar
      </button>
    </div>
  );
}