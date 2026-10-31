import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/escalas`;

function CadastroPlantao() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [idServidor, setIdServidor] = useState('');
  const [dataPlantao, setDataPlantao] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [tipoPlantao, setTipoPlantao] = useState('');

  useEffect(() => {
    if (!idParam) return;
    axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        const d = response.data;
        setIdServidor(d.idServidor ?? '');
        setDataPlantao(d.dataPlantao ?? '');
        setHoraInicio(d.horaInicio ?? '');
        setHoraFim(d.horaFim ?? '');
        setTipoPlantao(d.tipoPlantao ?? '');
      })
      .catch((error) => {
        console.error(error);
        mensagemErro('Erro ao carregar o registro');
      });
  }, [idParam]);

  async function salvar() {
    const dados = {
      idServidor: Number(idServidor),
      dataPlantao,
      horaInicio,
      horaFim,
      tipoPlantao,
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, dados);
        mensagemSucesso('Plantão cadastrado com sucesso!');
      } else {
        await axios.patch(`${baseURL}/${idParam}`, dados);
        mensagemSucesso('Plantão alterado com sucesso!');
      }
      navigate('/listagem-plantoes');
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao salvar o registro');
    }
  }

  function cancelar() {
    navigate('/listagem-plantoes');
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Plantão'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='ID do servidor: *' htmlFor='inputIdServidor'>
                <input
                  type='number'
                  id='inputIdServidor'
                  value={idServidor}
                  className='form-control'
                  name='idServidor'
                  onChange={(e) => setIdServidor(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Data do plantão: *' htmlFor='inputDataPlantao'>
                <input
                  type='date'
                  id='inputDataPlantao'
                  value={dataPlantao}
                  className='form-control'
                  name='dataPlantao'
                  onChange={(e) => setDataPlantao(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Hora de início: *' htmlFor='inputHoraInicio'>
                <input
                  type='time'
                  id='inputHoraInicio'
                  value={horaInicio}
                  className='form-control'
                  name='horaInicio'
                  onChange={(e) => setHoraInicio(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Hora de fim: *' htmlFor='inputHoraFim'>
                <input
                  type='time'
                  id='inputHoraFim'
                  value={horaFim}
                  className='form-control'
                  name='horaFim'
                  onChange={(e) => setHoraFim(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Tipo:' htmlFor='inputTipoPlantao'>
                <select
                  className='form-select'
                  id='inputTipoPlantao'
                  name='tipoPlantao'
                  value={tipoPlantao}
                  onChange={(e) => setTipoPlantao(e.target.value)}
                >
                  <option value=''> </option>
                  <option value='12x36'>12x36</option>
                  <option value='Administrativo'>Administrativo</option>
                </select>
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

export default CadastroPlantao;
