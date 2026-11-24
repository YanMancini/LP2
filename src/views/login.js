import React, { useState } from 'react';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css';
import './login.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function entrar(e) {
    e.preventDefault();

    if (!login.trim() || !senha) {
      mensagemErro('Informe login e senha');
      return;
    }

    setEntrando(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/servidores`, {
        params: { login: login.trim(), senha },
      });
      const usuario = data.find((s) => s.status !== 'inativo');

      if (!usuario) {
        mensagemErro('Login ou senha inválidos');
        setEntrando(false);
        return;
      }

      const { senha: _omitida, ...semSenha } = usuario;
      sessionStorage.setItem('usuario', JSON.stringify(semSenha));
      mensagemSucesso(`Bem-vindo(a), ${usuario.nomeCompleto}!`);
      // Recarrega a página para o menu (navbar) aparecer já com o usuário logado.
      window.location.href = '/listagem-relatorios';
    } catch (error) {
      console.error(error);
      mensagemErro('Erro ao realizar o login');
      setEntrando(false);
    }
  }

  return (
    <div className='container'>
      <div className='login-wrapper'>
        <div className='login-panel'>
          <aside className='login-brand'>
            <span className='login-brand-mark'>
              <ShieldIcon />
            </span>
            <h2>SDP</h2>
            <p className='login-brand-sub'>Sistema de Delegacia de Polícia</p>
            <ul className='login-brand-list'>
              <li>Registro de ocorrências</li>
              <li>Controle de viaturas e plantões</li>
              <li>Acompanhamento de diligências</li>
            </ul>
          </aside>

          <form className='login-form' onSubmit={entrar}>
            <h3>Acesso ao sistema</h3>
            <p className='login-hint'>Entre com suas credenciais funcionais.</p>

            <label htmlFor='inputLogin'>Login</label>
            <div className='login-field'>
              <PersonIcon />
              <input
                type='text'
                id='inputLogin'
                className='form-control'
                value={login}
                autoComplete='username'
                autoFocus
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>

            <label htmlFor='inputSenha'>Senha</label>
            <div className='login-field'>
              <LockOutlinedIcon />
              <input
                type='password'
                id='inputSenha'
                className='form-control'
                value={senha}
                autoComplete='current-password'
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button type='submit' className='btn btn-warning login-submit' disabled={entrando}>
              {entrando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
