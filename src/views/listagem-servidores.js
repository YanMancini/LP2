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

const baseURL = `${BASE_URL}/servidores`;

function ListagemServidores() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate('/cadastro-servidores');
  };

  const editar = (id) => {
    navigate(`/cadastro-servidores/${id}`);
  };

  const [dados, setDados] = React.useState(null);

  async function excluir(id) {
    await axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        mensagemSucesso('Servidor excluído com sucesso!');
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
        console.error('Erro ao carregar servidores:', error);
        mensagemErro('Erro ao carregar a listagem');
        setDados([]);
      });
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Servidores'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Novo Servidor
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Matrícula</th>
                    <th scope='col'>Nome</th>
                    <th scope='col'>Cargo</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados.map((dado) => (
                    <tr key={dado.id}>
                      <td>{dado.matriculaFuncional ?? '-'}</td>
                      <td>{dado.nomeCompleto ?? '-'}</td>
                      <td>{dado.cargo ?? '-'}</td>
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

export default ListagemServidores;
