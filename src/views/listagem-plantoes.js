import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import usePesquisaPaginacao from '../hooks/usePesquisaPaginacao';
import { BarraPesquisa, Paginacao } from '../components/pesquisa-paginacao';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/escalas`;

const CAMPOS = ['idServidor', 'dataPlantao', 'horaInicio', 'horaFim', 'tipoPlantao'];

function ListagemPlantoes() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate('/cadastro-plantoes');
  };

  const editar = (id) => {
    navigate(`/cadastro-plantoes/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  const lista = usePesquisaPaginacao(dados, CAMPOS);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso('Plantão excluído com sucesso!');
        setDados(dados.filter((dado) => dado.id !== id));
      })
      .catch(() => {
        mensagemErro('Erro ao excluir o registro');
      });
  }

  React.useEffect(() => {
    axios
      .get(baseURL)
      .then((response) => setDados(response.data))
      .catch((error) => {
        console.error('Erro ao carregar escalas:', error);
        mensagemErro('Erro ao carregar a listagem');
        setDados([]);
      });
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Plantões'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <div className='d-flex justify-content-between align-items-center flex-wrap gap-2'>
                <button type='button' className='btn btn-warning' onClick={() => cadastrar()}>
                  Novo Plantão
                </button>
                <BarraPesquisa lista={lista} />
              </div>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>ID do servidor</th>
                    <th scope='col'>Data</th>
                    <th scope='col'>Início</th>
                    <th scope='col'>Fim</th>
                    <th scope='col'>Tipo</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.itens.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.idServidor ?? '-'}</td>
                      <td>{dado.dataPlantao ?? '-'}</td>
                      <td>{dado.horaInicio ?? '-'}</td>
                      <td>{dado.horaFim ?? '-'}</td>
                      <td>{dado.tipoPlantao ?? '-'}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction='row'>
                          <IconButton
                            aria-label='edit'
                            onClick={() => editar(dado.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label='delete'
                            onClick={() => excluir(dado.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {lista.total === 0 && (
                    <tr>
                      <td colSpan={6}>Nenhum registro encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Paginacao lista={lista} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemPlantoes;
