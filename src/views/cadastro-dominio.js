import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import axios from 'axios';

import Card from '../components/card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import { BASE_URL } from '../config/axios';
import '../custom.css';

import { DOMINIOS } from './dominios';
import usePesquisaPaginacao from '../hooks/usePesquisaPaginacao';
import { BarraPesquisa, Paginacao } from '../components/pesquisa-paginacao';

const CAMPOS_BUSCA = ['nome', 'situacao'];

// Tela única de cadastro/listagem para qualquer tabela auxiliar de dominios.js.
function CadastroDominio() {
  const { slug } = useParams();
  const dom = DOMINIOS[slug];
  const campo = dom?.campoNome || 'nome';
  const url = dom ? `${BASE_URL}/${dom.tabela}` : '';

  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState('');
  const [editando, setEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    if (!dom) return;
    setCarregando(true);
    try {
      const { data } = await axios.get(url);
      setItens(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      mensagemErro('Não foi possível carregar. Verifique se a tabela existe na API.');
    } finally {
      setCarregando(false);
    }
  }, [dom, url]);

  useEffect(() => {
    setNome('');
    setEditando(null);
    carregar();
  }, [carregar]);

  // O nome fica em "nome" (ou "nomeTipo" em tiposCrime); a situação vira texto pesquisável.
  const linhas = React.useMemo(
    () =>
      itens.map((i) => ({
        ...i,
        nome: i[campo],
        situacao: i.ativo === false ? 'Inativo' : 'Ativo',
      })),
    [itens, campo]
  );
  const lista = usePesquisaPaginacao(linhas, CAMPOS_BUSCA);

  if (!dom) return <Navigate to='/cadastros-auxiliares' replace />;

  async function salvar(e) {
    e.preventDefault();
    const valor = nome.trim();
    if (!valor) {
      mensagemErro('Informe o nome.');
      return;
    }
    const repetido = itens.some(
      (i) =>
        String(i.id) !== String(editando) &&
        String(i[campo] ?? '').toLowerCase() === valor.toLowerCase()
    );
    if (repetido) {
      mensagemErro('Já existe um registro com esse nome.');
      return;
    }
    try {
      if (editando != null) {
        await axios.patch(`${url}/${editando}`, { [campo]: valor });
      } else {
        await axios.post(url, { [campo]: valor, ativo: true });
      }
      mensagemSucesso(editando != null ? 'Registro alterado!' : 'Registro cadastrado!');
      setNome('');
      setEditando(null);
      carregar();
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao salvar.');
    }
  }

  // Desativa em vez de excluir, para não quebrar registros antigos.
  async function alternarAtivo(item) {
    try {
      await axios.patch(`${url}/${item.id}`, { ativo: item.ativo === false });
      carregar();
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao alterar a situação.');
    }
  }

  async function carregarPadroes() {
    try {
      for (const p of dom.padroes) {
        await axios.post(url, { [campo]: p, ativo: true });
      }
      mensagemSucesso('Valores padrão carregados!');
      carregar();
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao carregar os valores padrão.');
      carregar();
    }
  }

  return (
    <div className='container'>
      <Card title={dom.titulo}>
        <form className='row g-2 align-items-end' onSubmit={salvar}>
          <div className='col-md-8'>
            <label htmlFor='inputNome' className='form-label'>
              {editando != null ? 'Editando registro' : 'Novo registro'}
            </label>
            <input
              id='inputNome'
              className='form-control'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className='col-md-4 d-flex gap-2'>
            <button type='submit' className='btn btn-success'>
              {editando != null ? 'Salvar' : 'Adicionar'}
            </button>
            {editando != null && (
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => {
                  setEditando(null);
                  setNome('');
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {!carregando && itens.length === 0 && dom.padroes && (
          <div className='mt-3'>
            <button type='button' className='btn btn-outline-primary btn-sm' onClick={carregarPadroes}>
              Carregar valores padrão ({dom.padroes.length})
            </button>
          </div>
        )}

        <div className='mt-3'>
          <BarraPesquisa lista={lista} />
        </div>

        <table className='table table-hover'>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Situação</th>
              <th style={{ width: 220 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={3}>Carregando...</td>
              </tr>
            ) : itens.length === 0 ? (
              <tr>
                <td colSpan={3}>Nenhum registro cadastrado.</td>
              </tr>
            ) : lista.total === 0 ? (
              <tr>
                <td colSpan={3}>Nenhum registro encontrado.</td>
              </tr>
            ) : (
              lista.itens.map((i) => (
                <tr key={i.id}>
                  <td>{i[campo]}</td>
                  <td>{i.ativo === false ? 'Inativo' : 'Ativo'}</td>
                  <td>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-primary me-2'
                      onClick={() => {
                        setEditando(i.id);
                        setNome(i[campo] ?? '');
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger'
                      onClick={() => alternarAtivo(i)}
                    >
                      {i.ativo === false ? 'Reativar' : 'Desativar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Paginacao lista={lista} />

        <Link to='/cadastros-auxiliares'>&larr; Voltar aos cadastros</Link>
      </Card>
    </div>
  );
}

export default CadastroDominio;
