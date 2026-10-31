import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/diligencias`;

function CadastroDiligencia() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [idInquerito, setIdInquerito] = useState('');
  const [tipoDiligencia, setTipoDiligencia] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataSolicitada, setDataSolicitada] = useState('');
  const [prazo, setPrazo] = useState('');
  const [idResponsavel, setIdResponsavel] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!idParam) return;
    axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        const d = response.data;
        setIdInquerito(d.idInquerito ?? '');
        setTipoDiligencia(d.tipoDiligencia ?? '');
        setDescricao(d.descricao ?? '');
        setDataSolicitada(d.dataSolicitada ?? '');
        setPrazo(d.prazo ?? '');
        setIdResponsavel(d.idResponsavel ?? '');
        setStatus(d.status ?? '');
      })
      .catch((error) => {
        console.error(error);
        mensagemErro('Erro ao carregar o registro');
      });
  }, [idParam]);

  async function salvar() {
    const dados = {
      idInquerito: Number(idInquerito),
      tipoDiligencia,
      descricao,
      dataSolicitada,
      prazo: prazo === '' ? null : prazo,
      idResponsavel: idResponsavel === '' ? null : Number(idResponsavel),
      status,
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, dados);
        mensagemSucesso('Diligência cadastrado com sucesso!');
      } else {
        await axios.patch(`${baseURL}/${idParam}`, dados);
        mensagemSucesso('Diligência alterado com sucesso!');
      }
      navigate('/listagem-diligencias');
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao salvar o registro');
    }
  }

  function cancelar() {
    navigate('/listagem-diligencias');
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Diligência'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='ID do inquérito: *' htmlFor='inputIdInquerito'>
                <input
                  type='number'
                  id='inputIdInquerito'
                  value={idInquerito}
                  className='form-control'
                  name='idInquerito'
                  onChange={(e) => setIdInquerito(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Tipo: *' htmlFor='inputTipoDiligencia'>
                <select
                  className='form-select'
                  id='inputTipoDiligencia'
                  name='tipoDiligencia'
                  value={tipoDiligencia}
                  onChange={(e) => setTipoDiligencia(e.target.value)}
                >
                  <option value=''> </option>
                  <option value='Oitiva'>Oitiva</option>
                  <option value='Perícia'>Perícia</option>
                </select>
              </FormGroup>
              <FormGroup label='Descrição:' htmlFor='inputDescricao'>
                <textarea
                  id='inputDescricao'
                  rows='4'
                  value={descricao}
                  className='form-control'
                  name='descricao'
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Data solicitada:' htmlFor='inputDataSolicitada'>
                <input
                  type='date'
                  id='inputDataSolicitada'
                  value={dataSolicitada}
                  className='form-control'
                  name='dataSolicitada'
                  onChange={(e) => setDataSolicitada(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Prazo:' htmlFor='inputPrazo'>
                <input
                  type='date'
                  id='inputPrazo'
                  value={prazo}
                  className='form-control'
                  name='prazo'
                  onChange={(e) => setPrazo(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='ID do responsável:' htmlFor='inputIdResponsavel'>
                <input
                  type='number'
                  id='inputIdResponsavel'
                  value={idResponsavel}
                  className='form-control'
                  name='idResponsavel'
                  onChange={(e) => setIdResponsavel(e.target.value)}
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
                  <option value='Pendente'>Pendente</option>
                  <option value='Concluída'>Concluída</option>
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

export default CadastroDiligencia;
