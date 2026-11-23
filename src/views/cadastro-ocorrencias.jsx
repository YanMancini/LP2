import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import axios from 'axios';

import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import '../custom.css';
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
  const [carregando, setCarregando] = useState(Boolean(idParam));
  const orig = useRef({});

  const specs = especsAtivas(tipos, tiposSel);

  const rowsDe = (spec) => {
    const rows = detalhes[spec.tabela];
    if (rows?.length) return rows;
    return spec.modo === 'unico' ? [novaLinha()] : [];
  };

  // Carrega as listas auxiliares.
  useEffect(() => {
    let ativo = true;

    Promise.all([
      axios.get(`${BASE_URL}/tiposCrime`),
      axios.get(`${BASE_URL}/pessoas`),
    ])
      .then(([tiposResp, pessoasResp]) => {
        if (!ativo) return;
        setTipos(Array.isArray(tiposResp.data) ? tiposResp.data : []);
        setPessoasCad(Array.isArray(pessoasResp.data) ? pessoasResp.data : []);
      })
      .catch((error) => {
        console.error(error);
        mensagemErro('Não foi possível carregar os tipos de ocorrência e as pessoas.');
      });

    return () => {
      ativo = false;
    };
  }, []);

  // Ao editar, carrega boletim, classificações, envolvidos e detalhes específicos.
  useEffect(() => {
    if (!idParam || !tipos.length) {
      if (!idParam) setCarregando(false);
      return;
    }

    let ativo = true;

    (async () => {
      try {
        setCarregando(true);

        const [boResp, clsResp, envResp] = await Promise.all([
          axios.get(`${baseURL}/${idParam}`),
          axios.get(`${BASE_URL}/classificacoesBO`, {
            params: { idBoletim: idParam },
          }),
          axios.get(`${BASE_URL}/envolvimentosBO`, {
            params: { idBoletim: idParam },
          }),
        ]);

        const dadosBO = boResp.data;
        const cls = Array.isArray(clsResp.data) ? clsResp.data : [];
        const env = Array.isArray(envResp.data) ? envResp.data : [];

        const boRow = { ...dadosBO, _k: 'bo' };
        SPEC_BOLETIM.campos.forEach((campo) => {
          if (boRow[campo.nome] == null) {
            boRow[campo.nome] = campo.tipo === 'checkbox' ? true : '';
          }
        });

        const selecionados = cls.map((item) => item.idTipoCrime);
        const envRows = env.map((item) => ({
          ...item,
          _k: `e${item.id}`,
        }));

        const carregado = {};
        for (const spec of especsAtivas(tipos, selecionados)) {
          carregado[spec.tabela] = await carregarTabela(
            spec,
            idParam,
            carregado
          );
        }

        if (!ativo) return;

        orig.current = {
          classificacoesBO: cls,
          envolvimentosBO: envRows,
          boletins: [{ id: dadosBO.id }],
          ...carregado,
        };

        setBo(boRow);
        setTiposSel(selecionados);
        setPessoas(envRows);
        setDetalhes(carregado);
      } catch (error) {
        console.error(error);
        mensagemErro('Erro ao carregar a ocorrência. Verifique a conexão com o servidor.');
      } finally {
        if (ativo) setCarregando(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [idParam, tipos]);

  function alternarTipo(id) {
  setTiposSel([id]);
}

  async function salvar() {
    if (salvando || carregando) return;

    if (idParam && !orig.current.boletins) {
      mensagemErro('A ocorrência ainda não foi carregada. Recarregue a página.');
      return;
    }

    const erros = validar({
      tiposSel,
      specs,
      rowsDe,
      pessoas,
      bo,
    });

    if (erros.length) {
      mensagemErro(erros.slice(0, 5).join(' | '));
      return;
    }

    setSalvando(true);

    const ctx = {
      criados: [],
      excluir: [],
      keyMap: {},
      pai: {},
      idBoletim: null,
    };

    try {
      // 1. Salva o registro principal.
      const boRow = { ...bo };
      await salvarTabela(
        SPEC_BOLETIM,
        [boRow],
        idParam ? orig.current.boletins : [],
        ctx
      );
      ctx.idBoletim = ctx.keyMap[boRow._k] ?? boRow.id;

      // 2. Salva as classificações selecionadas.
      const anterior = orig.current;
      const classificacoes = tiposSel.map((id) => {
        const existente = (anterior.classificacoesBO || []).find(
          (item) => String(item.idTipoCrime) === String(id)
        );

        return {
          _k: `t${id}`,
          ...(existente?.id ? { id: existente.id } : {}),
          idTipoCrime: id,
        };
      });

      await salvarTabela(
        SPEC_CLASSIFICACAO,
        classificacoes,
        anterior.classificacoesBO || [],
        ctx
      );

      // 3. Cria pessoas novas antes de gravar os vínculos.
      const envolvidos = pessoas.map((item) => ({ ...item }));

      for (const pessoa of envolvidos) {
        if (!pessoa.idPessoa) {
          if (!pessoa.nomeCompleto?.trim()) {
            throw new Error('Informe o nome da pessoa envolvida ou selecione um cadastro existente.');
          }

          const { data } = await axios.post(`${BASE_URL}/pessoas`, {
            nomeCompleto: pessoa.nomeCompleto.trim(),
            cpf: pessoa.cpf || '',
            rg: pessoa.rg || null,
            dataNascimento: pessoa.dataNascimento || null,
            telefone: pessoa.telefone || null,
            ativo: true,
          });

          ctx.criados.push({ tabela: 'pessoas', id: data.id });
          pessoa.idPessoa = data.id;
        }
      }

      await salvarTabela(
        SPEC_ENVOLVIMENTO,
        envolvidos,
        anterior.envolvimentosBO || [],
        ctx
      );

      // 4. Salva detalhes específicos na ordem definida no config:
      // primeiro as tabelas-pai e depois as tabelas-filhas.
      for (const spec of specs) {
        await salvarTabela(
          spec,
          rowsDe(spec).map((item) => ({ ...item })),
          anterior[spec.tabela] || [],
          ctx
        );
      }

      // 5. Agenda exclusão dos detalhes associados a naturezas desmarcadas.
      Object.keys(anterior)
        .filter(
          (tabela) =>
            !['boletins', 'classificacoesBO', 'envolvimentosBO'].includes(tabela) &&
            !specs.some((spec) => spec.tabela === tabela)
        )
        .reverse()
        .forEach((tabela) => {
          (anterior[tabela] || []).forEach((item) => {
            if (item.id != null) {
              ctx.excluir.push({ tabela, id: item.id });
            }
          });
        });

      // 6. Executa exclusões ao final, para preservar relações pai/filho.
      await executarExclusoes(ctx);

      mensagemSucesso(
        idParam
          ? 'Ocorrência alterada com sucesso!'
          : 'Ocorrência cadastrada com sucesso!'
      );
      navigate('/listagem-ocorrencias');
    } catch (error) {
      console.error(error);
      const falhas = await desfazer(ctx);

      if (idParam) {
        mensagemErro(
          'Erro ao salvar. Alterações parciais podem ter sido gravadas; reabra a ocorrência e confira os dados.'
        );
      } else if (falhas) {
        mensagemErro(
          `Erro ao salvar. ${falhas} registro(s) criado(s) não puderam ser removidos. Avise o administrador.`
        );
      } else {
        mensagemErro('Erro ao salvar. Nenhuma gravação foi concluída.');
      }

      setSalvando(false);
    }
  }

  function cancelar() {
    navigate('/listagem-ocorrencias');
  }

  const refs = { ...detalhes, pessoasCad };

  if (carregando) {
    return (
      <div className="container">
        <Card title="Carregando ocorrência...">
          <p>Buscando os dados do boletim e seus detalhes.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <Card title={idParam ? 'Edição de Ocorrência' : 'Cadastro de Ocorrência'}>
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <h5>Dados gerais</h5>

              <CamposForm
                campos={SPEC_BOLETIM.campos}
                row={bo}
                prefix="bo"
                onChange={(nome, valor) =>
                  setBo((atual) => ({ ...atual, [nome]: valor }))
                }
              />

              <h5>Natureza da ocorrência: *</h5>
              <div className="mb-3">
                {tipos
                  .filter((tipo) => tipo.ativo !== false)
                  .map((tipo) => (
                    <div className="form-check" key={tipo.id}>
                      <input
                        type="radio"
                        name="tipoCrime"
                        className="form-check-input"
                        id={`tipo-${tipo.id}`}
                        checked={tiposSel.some((id) => String(id) === String(tipo.id))}
                        onChange={() => alternarTipo(tipo.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`tipo-${tipo.id}`}
                      >
                        {tipo.nomeTipo}
                      </label>
                    </div>
                  ))}
              </div>

              <SecaoLista
                spec={SPEC_ENVOLVIMENTO}
                rows={pessoas}
                onChange={setPessoas}
                refs={refs}
              />

              {specs.map((spec) => (
                <SecaoLista
                  key={spec.tabela}
                  spec={spec}
                  rows={rowsDe(spec)}
                  refs={refs}
                  onChange={(rows) =>
                    setDetalhes((atual) => ({
                      ...atual,
                      [spec.tabela]: rows,
                    }))
                  }
                />
              ))}

              <Stack spacing={1} padding={1} direction="row">
                <button
                  onClick={salvar}
                  type="button"
                  className="btn btn-success"
                  disabled={salvando || carregando}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>

                <button
                  onClick={cancelar}
                  type="button"
                  className="btn btn-danger"
                  disabled={salvando}
                >
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
