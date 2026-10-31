import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/viaturas`;

function CadastroViatura() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [status, setStatus] = useState('');
  const [unidadeLotacao, setUnidadeLotacao] = useState('');

  useEffect(() => {
    if (!idParam) return;
    axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        const d = response.data;
        setPlaca(d.placa ?? '');
        setModelo(d.modelo ?? '');
        setAno(d.ano ?? '');
        setStatus(d.status ?? '');
        setUnidadeLotacao(d.unidadeLotacao ?? '');
      })
      .catch((error) => {
        console.error(error);
        mensagemErro('Erro ao carregar o registro');
      });
  }, [idParam]);

  async function salvar() {
    const dados = {
      placa,
      modelo,
      ano: ano === '' ? null : Number(ano),
      status,
      unidadeLotacao: unidadeLotacao === '' ? null : unidadeLotacao,
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, dados);
        mensagemSucesso('Viatura cadastrado com sucesso!');
      } else {
        await axios.patch(`${baseURL}/${idParam}`, dados);
        mensagemSucesso('Viatura alterado com sucesso!');
      }
      navigate('/listagem-viaturas');
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao salvar o registro');
    }
  }

  function cancelar() {
    navigate('/listagem-viaturas');
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Viatura'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Placa: *' htmlFor='inputPlaca'>
                <input
                  type='text'
                  id='inputPlaca'
                  value={placa}
                  className='form-control'
                  name='placa'
                  onChange={(e) => setPlaca(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Modelo: *' htmlFor='inputModelo'>
                <input
                  type='text'
                  id='inputModelo'
                  value={modelo}
                  className='form-control'
                  name='modelo'
                  onChange={(e) => setModelo(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Ano:' htmlFor='inputAno'>
                <input
                  type='number'
                  id='inputAno'
                  value={ano}
                  className='form-control'
                  name='ano'
                  onChange={(e) => setAno(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Status:' htmlFor='inputStatus'>
                <select
                  className='form-select'
                  id='inputStatus'
                  name='status'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value=''> </option>
                  <option value='Disponível'>Disponível</option>
                  <option value='Em manutenção'>Em manutenção</option>
                  <option value='Em uso'>Em uso</option>
                </select>
              </FormGroup>
              <FormGroup label='Unidade de lotação:' htmlFor='inputUnidadeLotacao'>
                <input
                  type='text'
                  id='inputUnidadeLotacao'
                  value={unidadeLotacao}
                  className='form-control'
                  name='unidadeLotacao'
                  onChange={(e) => setUnidadeLotacao(e.target.value)}
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction='row'>
                <button
                  onClick={salvar}
                  type='button'
                  className='btn btn-success'
                >
                  Salvar
                </button>
                <button
                  onClick={cancelar}
                  type='button'
                  className='btn btn-danger'
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

export default CadastroViatura;
