import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

import {
  SPEC_BOLETIM,
  SPEC_CLASSIFICACAO,
  SPEC_ENVOLVIMENTO,
  especsAtivas,
  novaLinha,
} from './ocorrencias/config';
import { CamposForm, SecaoLista } from './ocorrencias/componentes';
import {
  validar,
  salvarTabela,
  executarExclusoes,
  desfazer,
  carregarTabela,
} from './ocorrencias/apoio';

const baseURL = `${BASE_URL}/boletins`;

function CadastroOcorrencia() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [bo, setBo] = useState({ _k: 'bo', ativo: true });
  const [tipos, setTipos] = useState([]);
  const [tiposSel, setTiposSel] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [pessoasCad, setPessoasCad] = useState([]);
  const [detalhes, setDetalhes] = useState({});
  const [salvando, setSalvando] = useState(false);
  const orig = useRef({});

  const specs = especsAtivas(tipos, tiposSel);
  const rowsDe = (spec) => detalhes[spec.tabela] ?? (spec.modo === 'unico' ? [novaLinha()] : []);

  // listas de apoio
  useEffect(() => {
    axios.get(`${BASE_URL}/tiposCrime`).then((r) => setTipos(r.data)).catch(() => mensagemErro('Erro ao carregar os tipos de crime'));
    axios.get(`${BASE_URL}/pessoas`).then((r) => setPessoasCad(r.data)).catch(() => {});
  }, []);

  // edição: carrega o boletim e tudo que se liga a ele
  useEffect(() => {
    if (!idParam || !tipos.length) return;
    (async () => {
      try {
        const d = (await axios.get(`${baseURL}/${idParam}`)).data;
        const cls = (await axios.get(`${BASE_URL}/classificacoesBO`, { params: { idBoletim: idParam } })).data;
        const env = (await axios.get(`${BASE_URL}/envolvimentosBO`, { params: { idBoletim: idParam } })).data;
        const boRow = { ...d, _k: 'bo' };
        SPEC_BOLETIM.campos.forEach((c) => {
          if (boRow[c.nome] == null) boRow[c.nome] = c.tipo === 'checkbox' ? true : '';
        });
        const sel = cls.map((c) => c.idTipoCrime);
        const envRows = env.map((e) => ({ ...e, _k: `e${e.id}` }));
        const carregado = {};
        for (const spec of especsAtivas(tipos, sel)) {
          carregado[spec.tabela] = await carregarTabela(spec, idParam, carregado);
        }
        orig.current = {
          classificacoesBO: cls,
          envolvimentosBO: envRows,
          boletins: [{ id: d.id }],
          ...carregado,
        };
        setBo(boRow);
        setTiposSel(sel);
        setPessoas(envRows);
        setDetalhes(carregado);
      } catch (error) {
        console.error(error);
        mensagemErro('Erro ao carregar o registro');
      }
    })();
  }, [idParam, tipos]);

  function alternarTipo(id) {
    setTiposSel((sel) =>
      sel.some((x) => String(x) === String(id)) ? sel.filter((x) => String(x) !== String(id)) : [...sel, id]
    );
  }

  async function salvar() {
    const erros = validar({ tiposSel, specs, rowsDe, pessoas, bo });
    if (erros.length) {
      mensagemErro(erros.slice(0, 5).join(' | '));
      return;
    }

    setSalvando(true);
    const ctx = { criados: [], excluir: [], keyMap: {}, pai: {}, idBoletim: null };
    try {
      // 1) boletim
      const boRow = { ...bo };
      await salvarTabela(SPEC_BOLETIM, [boRow], idParam ? orig.current.boletins : [], ctx);
      ctx.idBoletim = ctx.keyMap[boRow._k];

      // 2) tipos de crime
      const o = orig.current;
      const cls = tiposSel.map((id) => ({
        _k: `t${id}`,
        id: (o.classificacoesBO || []).find((x) => String(x.idTipoCrime) === String(id))?.id,
        idTipoCrime: id,
      }));
      await salvarTabela(SPEC_CLASSIFICACAO, cls, o.classificacoesBO, ctx);

      // 3) pessoas novas e envolvimentos
      const pes = pessoas.map((p) => ({ ...p }));
      for (const p of pes) {
        if (!p.idPessoa) {
          const { data } = await axios.post(`${BASE_URL}/pessoas`, {
            nomeCompleto: p.nomeCompleto,
            cpf: p.cpf ?? '',
            rg: p.rg || null,
            dataNascimento: p.dataNascimento || null,
            telefone: p.telefone || null,
            ativo: true,
          });
          ctx.criados.push({ tabela: 'pessoas', id: data.id });
          p.idPessoa = data.id;
        }
      }
      await salvarTabela(SPEC_ENVOLVIMENTO, pes, o.envolvimentosBO, ctx);

      // 4) detalhes (pai antes dos filhos, ordem garantida pelo config)
      for (const spec of specs) {
        await salvarTabela(spec, rowsDe(spec).map((r) => ({ ...r })), o[spec.tabela], ctx);
      }

      // 5) exclusões (por último)
      await executarExclusoes(ctx);

      mensagemSucesso(idParam ? 'Ocorrência alterada com sucesso!' : 'Ocorrência cadastrada com sucesso!');
      navigate('/listagem-ocorrencias');
    } catch (error) {
      console.error(error);
      const falhas = await desfazer(ctx);
      if (idParam) {
        mensagemErro('Erro ao salvar. Alterações parciais podem ter sido gravadas: reabra a ocorrência e confira.');
      } else if (falhas) {
        mensagemErro(`Erro ao salvar. ${falhas} registro(s) criado(s) não puderam ser removidos; avise o administrador.`);
      } else {
        mensagemErro('Erro ao salvar. Nada foi gravado.');
      }
      setSalvando(false);
    }
  }

  function cancelar() {
    navigate('/listagem-ocorrencias');
  }

  const refs = { ...detalhes, pessoasCad };

  return (
    <div className='container'>
      <Card title={idParam ? 'Edição de Ocorrência' : 'Cadastro de Ocorrência'}>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <h5>Dados gerais</h5>
              <CamposForm
                campos={SPEC_BOLETIM.campos}
                row={bo}
                prefix='bo'
                onChange={(n, v) => setBo((b) => ({ ...b, [n]: v }))}
              />

              <h5>Tipos de crime: *</h5>
              <div className='mb-3'>
                {tipos.filter((tp) => tp.ativo !== false).map((tp) => (
                  <div className='form-check' key={tp.id}>
                    <input
                      type='checkbox'
                      className='form-check-input'
                      id={`tipo-${tp.id}`}
                      checked={tiposSel.some((x) => String(x) === String(tp.id))}
                      onChange={() => alternarTipo(tp.id)}
                    />
                    <label className='form-check-label' htmlFor={`tipo-${tp.id}`}>
                      {tp.nomeTipo}
                    </label>
                  </div>
                ))}
              </div>

              <SecaoLista spec={SPEC_ENVOLVIMENTO} rows={pessoas} onChange={setPessoas} refs={refs} />

              {specs.map((spec) => (
                <SecaoLista
                  key={spec.tabela}
                  spec={spec}
                  rows={rowsDe(spec)}
                  refs={refs}
                  onChange={(rows) => setDetalhes((d) => ({ ...d, [spec.tabela]: rows }))}
                />
              ))}

              <Stack spacing={1} padding={1} direction='row'>
                <button onClick={salvar} type='button' className='btn btn-success' disabled={salvando}>
                  Salvar
                </button>
                <button onClick={cancelar} type='button' className='btn btn-danger'>
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroOcorrencia;