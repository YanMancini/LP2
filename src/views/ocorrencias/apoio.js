import axios from 'axios';
import { BASE_URL } from '../../config/axios';
import { SPEC_ENVOLVIMENTO, SPEC_BOLETIM } from './config';

// ---------- validações ----------
function cpfValido(valor) {
  const c = valor.replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  for (let n = 9; n < 11; n++) {
    let soma = 0;
    for (let i = 0; i < n; i++) soma += Number(c[i]) * (n + 1 - i);
    if (((soma * 10) % 11) % 10 !== Number(c[n])) return false;
  }
  return true;
}

const VALIDADORES = {
  cpf: { fn: cpfValido, msg: 'CPF inválido' },
  placa: {
    fn: (v) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(v.toUpperCase().replace('-', '')),
    msg: 'placa inválida',
  },
  cnh: { fn: (v) => /^\d{11}$/.test(v.replace(/\D/g, '')), msg: 'CNH deve ter 11 dígitos' },
};

export function validar({ tiposSel, specs, rowsDe, pessoas, bo }) {
  const erros = [];
  if (!tiposSel.length) erros.push('Marque ao menos um tipo de crime.');
  const checar = (spec, rows) =>
    rows.forEach((r, i) =>
      spec.campos.forEach((c) => {
        if (c.visivel && !c.visivel(r)) return;
        const v = r[c.nome];
        const vazio = v === '' || v == null;
        const onde = spec.titulo ? `${spec.titulo} ${i + 1}` : 'Dados gerais';
        if (c.obrigatorio && vazio) erros.push(`${onde}: ${c.label} é obrigatório.`);
        else if (!vazio && c.valida && !VALIDADORES[c.valida].fn(String(v)))
          erros.push(`${onde}: ${VALIDADORES[c.valida].msg}.`);
      })
    );
  checar(SPEC_BOLETIM, [bo]);
  checar(SPEC_ENVOLVIMENTO, pessoas);
  specs.forEach((s) => checar(s, rowsDe(s)));
  return erros;
}

// ---------- gravação ----------
function montarPayload(spec, row, ctx) {
  const p = {};
  spec.campos.forEach((c) => {
    if (c.local) return;
    const v = row[c.nome];
    if (c.tipo === 'ref') p[c.nome] = v ? ctx.keyMap[v] ?? null : null;
    else if (c.tipo === 'number') p[c.nome] = v === '' || v == null ? null : Number(v);
    else if (c.tipo === 'checkbox') p[c.nome] = !!v;
    else p[c.nome] = v ?? '';
  });
  if (!spec.raiz) {
    if (spec.pai) p[spec.fkPai] = ctx.pai[spec.pai];
    else p.idBoletim = ctx.idBoletim;
  }
  return p;
}

// Compara linhas atuais x originais: PATCH nos existentes, POST nos novos,
// e agenda DELETE (executado no fim) para os removidos.
export async function salvarTabela(spec, rows, originais, ctx) {
  const base = `${BASE_URL}/${spec.tabela}`;
  const idsAtuais = rows.filter((r) => r.id != null).map((r) => String(r.id));
  for (const r of rows) {
    const p = montarPayload(spec, r, ctx);
    if (r.id != null) {
      await axios.patch(`${base}/${r.id}`, p);
      ctx.keyMap[r._k] = r.id;
    } else {
      const { data } = await axios.post(base, p);
      ctx.criados.push({ tabela: spec.tabela, id: data.id });
      ctx.keyMap[r._k] = data.id;
    }
  }
  (originais || [])
    .filter((o) => !idsAtuais.includes(String(o.id)))
    .forEach((o) => ctx.excluir.push({ tabela: spec.tabela, id: o.id }));
  ctx.pai[spec.tabela] = rows[0] ? ctx.keyMap[rows[0]._k] : undefined;
}

export async function executarExclusoes(ctx) {
  for (const e of ctx.excluir) await axios.delete(`${BASE_URL}/${e.tabela}/${e.id}`);
}

// Desfaz o que foi CRIADO nesta tentativa. Retorna quantos não conseguiu apagar.
export async function desfazer(ctx) {
  let falhas = 0;
  for (const c of [...ctx.criados].reverse()) {
    try {
      await axios.delete(`${BASE_URL}/${c.tabela}/${c.id}`);
    } catch (e) {
      falhas++;
    }
  }
  return falhas;
}

// ---------- carregamento (edição) ----------
export async function carregarTabela(spec, idBoletim, carregado) {
  const params = spec.pai ? { [spec.fkPai]: carregado[spec.pai]?.[0]?.id } : { idBoletim };
  if (spec.pai && params[spec.fkPai] === undefined) return [];
  const { data } = await axios
    .get(`${BASE_URL}/${spec.tabela}`, { params })
    .catch(() => ({ data: [] }));
  return data.map((d) => {
    const r = { ...d, _k: `e${d.id}` };
    spec.campos.forEach((c) => {
      if (c.tipo === 'ref') r[c.nome] = d[c.nome] != null ? `e${d[c.nome]}` : '';
      else if (d[c.nome] == null) r[c.nome] = c.tipo === 'checkbox' ? false : '';
    });
    return r;
  });
}
