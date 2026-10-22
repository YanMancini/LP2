import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/diligencias`;

function ListagemDiligencias() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate('/cadastro-diligencias');
  };

  const editar = (id) => {
    navigate(`/cadastro-diligencias/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso('Diligência excluído com sucesso!');
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
        console.error('Erro ao carregar diligencias:', error);
        mensagemErro('Erro ao carregar a listagem');
        setDados([]);
      });
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Diligências'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Nova Diligência
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Tipo</th>
                    <th scope='col'>Descrição</th>
                    <th scope='col'>Solicitada em</th>
                    <th scope='col'>Prazo</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.tipoDiligencia ?? '-'}</td>
                      <td>{dado.descricao ?? '-'}</td>
                      <td>{dado.dataSolicitada ?? '-'}</td>
                      <td>{dado.prazo ?? '-'}</td>
                      <td>{dado.status ?? '-'}</td>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemDiligencias;
