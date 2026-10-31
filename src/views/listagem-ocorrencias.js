import React from 'react';

import Card from '../components/card';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/boletins`;

function ListagemOcorrencias() {
  const navigate = useNavigate();

  const cadastrar = () => {
    navigate('/cadastro-ocorrencias');
  };

  const editar = (id) => {
    navigate(`/cadastro-ocorrencias/${id}`);
  };

  const [dados, setDados] = React.useState(null);
  const [tiposPorBO, setTiposPorBO] = React.useState({});

  // O json-server não apaga em cascata: em vez de excluir, inativa o boletim.
  async function inativar(id) {
    if (!window.confirm('Inativar esta ocorrência?')) return;
    await axios
      .patch(`${baseURL}/${id}`, { ativo: false })
      .then(() => {
        mensagemSucesso('Ocorrência inativada com sucesso!');
        setDados(dados.map((dado) => (dado.id === id ? { ...dado, ativo: false } : dado)));
      })
      .catch(() => {
        mensagemErro('Erro ao inativar o registro');
      });
  }

  React.useEffect(() => {
    axios
      .get(baseURL)
      .then((response) => setDados(response.data))
      .catch((error) => {
        console.error('Erro ao carregar boletins:', error);
        mensagemErro('Erro ao carregar a listagem');
        setDados([]);
      });

    Promise.all([
      axios.get(`${BASE_URL}/classificacoesBO`),
      axios.get(`${BASE_URL}/tiposCrime`),
    ])
      .then(([cls, tipos]) => {
        const nomes = {};
        tipos.data.forEach((t) => {
          nomes[String(t.id)] = t.nomeTipo;
        });
        const mapa = {};
        cls.data.forEach((c) => {
          const chave = String(c.idBoletim);
          mapa[chave] = [...(mapa[chave] || []), nomes[String(c.idTipoCrime)]].filter(Boolean);
        });
        setTiposPorBO(mapa);
      })
      .catch(() => {});
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Listagem de Ocorrências'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <button
                type='button'
                className='btn btn-warning'
                onClick={() => cadastrar()}
              >
                Nova Ocorrência
              </button>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th scope='col'>Protocolo</th>
                    <th scope='col'>Data</th>
                    <th scope='col'>Hora</th>
                    <th scope='col'>Local</th>
                    <th scope='col'>Tipo(s)</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {dados
                    .filter((dado) => dado.ativo !== false)
                    .map((dado) => (
                      <tr key={dado.id}>
                        <td>{dado.numeroProtocolo ?? '-'}</td>
                        <td>{dado.dataOcorrencia ?? '-'}</td>
                        <td>{dado.horaOcorrencia ?? '-'}</td>
                        <td>{dado.local ?? '-'}</td>
                        <td>{(tiposPorBO[String(dado.id)] || []).join(', ') || '-'}</td>
                        <td>{dado.statusBO ?? '-'}</td>
                        <td>
                          <Stack spacing={1} padding={0} direction='row'>
                            <IconButton
                              aria-label='edit'
                              onClick={() => editar(dado.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              aria-label='inativar'
                              onClick={() => inativar(dado.id)}
                            >
                              <BlockIcon />
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

export default ListagemOcorrencias;