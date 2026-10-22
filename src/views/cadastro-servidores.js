import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

const baseURL = `${BASE_URL}/servidores`;

function CadastroServidor() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [matriculaFuncional, setMatriculaFuncional] = useState('');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpf, setCpf] = useState('');
  const [login, setLogin] = useState('');
  const [contato, setContato] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [senha, setSenha] = useState('');
  const [idPerfil, setIdPerfil] = useState('');
  const [cargo, setCargo] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!idParam) return;
    axios
      .get(`${baseURL}/${idParam}`)
      .then((response) => {
        const d = response.data;
        setMatriculaFuncional(d.matriculaFuncional ?? '');
        setNomeCompleto(d.nomeCompleto ?? '');
        setCpf(d.cpf ?? '');
        setLogin(d.login ?? '');
        setContato(d.contato ?? '');
        setDataAdmissao(d.dataAdmissao ?? '');
        setSenha(d.senha ?? '');
        setIdPerfil(d.idPerfil ?? '');
        setCargo(d.cargo ?? '');
        setStatus(d.status ?? '');
      })
      .catch((error) => {
        console.error(error);
        mensagemErro('Erro ao carregar o registro');
      });
  }, [idParam]);

  async function salvar() {
    const dados = {
      matriculaFuncional: Number(matriculaFuncional),
      nomeCompleto,
      cpf,
      login,
      contato: contato === '' ? null : contato,
      dataAdmissao,
      senha,
      idPerfil: idPerfil === '' ? null : Number(idPerfil),
      cargo,
      status,
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, dados);
        mensagemSucesso('Servidor cadastrado com sucesso!');
      } else {
        await axios.patch(`${baseURL}/${idParam}`, dados);
        mensagemSucesso('Servidor alterado com sucesso!');
      }
      navigate('/listagem-servidores');
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao salvar o registro');
    }
  }

  function cancelar() {
    navigate('/listagem-servidores');
  }

  return (
    <div className='container'>
      <Card title='Cadastro de Servidor'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='bs-component'>
              <FormGroup label='Matrícula: *' htmlFor='inputMatriculaFuncional'>
                <input
                  type='number'
                  id='inputMatriculaFuncional'
                  value={matriculaFuncional}
                  className='form-control'
                  name='matriculaFuncional'
                  onChange={(e) => setMatriculaFuncional(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Nome completo: *' htmlFor='inputNomeCompleto'>
                <input
                  type='text'
                  id='inputNomeCompleto'
                  value={nomeCompleto}
                  className='form-control'
                  name='nomeCompleto'
                  onChange={(e) => setNomeCompleto(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='CPF: *' htmlFor='inputCpf'>
                <input
                  type='text'
                  id='inputCpf'
                  value={cpf}
                  className='form-control'
                  name='cpf'
                  onChange={(e) => setCpf(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Login: *' htmlFor='inputLogin'>
                <input
                  type='text'
                  id='inputLogin'
                  value={login}
                  className='form-control'
                  name='login'
                  onChange={(e) => setLogin(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Contato:' htmlFor='inputContato'>
                <input
                  type='text'
                  id='inputContato'
                  value={contato}
                  className='form-control'
                  name='contato'
                  onChange={(e) => setContato(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Data de admissão:' htmlFor='inputDataAdmissao'>
                <input
                  type='date'
                  id='inputDataAdmissao'
                  value={dataAdmissao}
                  className='form-control'
                  name='dataAdmissao'
                  onChange={(e) => setDataAdmissao(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Senha:' htmlFor='inputSenha'>
                <input
                  type='password'
                  id='inputSenha'
                  value={senha}
                  className='form-control'
                  name='senha'
                  onChange={(e) => setSenha(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='ID do perfil:' htmlFor='inputIdPerfil'>
                <input
                  type='number'
                  id='inputIdPerfil'
                  value={idPerfil}
                  className='form-control'
                  name='idPerfil'
                  onChange={(e) => setIdPerfil(e.target.value)}
                />
              </FormGroup>
              <FormGroup label='Cargo: *' htmlFor='inputCargo'>
                <select
                  className='form-select'
                  id='inputCargo'
                  name='cargo'
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                >
                  <option value=''> </option>
                  <option value='Delegado'>Delegado</option>
                  <option value='Escrivão'>Escrivão</option>
                  <option value='Investigador'>Investigador</option>
                  <option value='Administrativo'>Administrativo</option>
                </select>
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
                  <option value='ativo'>ativo</option>
                  <option value='inativo'>inativo</option>
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

export default CadastroServidor;
