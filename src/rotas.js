import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

import Navbar from './components/navbar';

import Login from './views/login';

import ListagemServidores from './views/listagem-servidores';
import CadastroServidor from './views/cadastro-servidores';

import ListagemOcorrencias from './views/listagem-ocorrencias';
import CadastroOcorrencia from './views/cadastro-ocorrencias';

import ListagemViaturas from './views/listagem-viaturas';
import CadastroViatura from './views/cadastro-viaturas';

import ListagemDiligencias from './views/listagem-diligencias';
import CadastroDiligencia from './views/cadastro-diligencias';

import ListagemPlantoes from './views/listagem-plantoes';
import CadastroPlantao from './views/cadastro-plantoes';

import ListagemRelatorios from './views/listagem-relatorios';

import CadastrosAuxiliares from './views/cadastros-auxiliares';
import CadastroDominio from './views/cadastro-dominio';


// Só deixa abrir a página se houver usuário logado; senão volta para o login.
function Privada({ children }) {
  return sessionStorage.getItem('usuario') ? children : <Navigate to='/' replace />;
}

function Rotas() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />

        <Route path='/listagem-servidores' element={<Privada><ListagemServidores /></Privada>} />
        <Route path='/cadastro-servidores' element={<Privada><CadastroServidor /></Privada>} />
        <Route path='/cadastro-servidores/:idParam' element={<Privada><CadastroServidor /></Privada>} />

        <Route path='/listagem-ocorrencias' element={<Privada><ListagemOcorrencias /></Privada>} />
        <Route path='/cadastro-ocorrencias' element={<Privada><CadastroOcorrencia /></Privada>} />
        <Route path='/cadastro-ocorrencias/:idParam' element={<Privada><CadastroOcorrencia /></Privada>} />

        <Route path='/listagem-viaturas' element={<Privada><ListagemViaturas /></Privada>} />
        <Route path='/cadastro-viaturas' element={<Privada><CadastroViatura /></Privada>} />
        <Route path='/cadastro-viaturas/:idParam' element={<Privada><CadastroViatura /></Privada>} />

        <Route path='/listagem-diligencias' element={<Privada><ListagemDiligencias /></Privada>} />
        <Route path='/cadastro-diligencias' element={<Privada><CadastroDiligencia /></Privada>} />
        <Route path='/cadastro-diligencias/:idParam' element={<Privada><CadastroDiligencia /></Privada>} />

        <Route path='/listagem-plantoes' element={<Privada><ListagemPlantoes /></Privada>} />
        <Route path='/cadastro-plantoes' element={<Privada><CadastroPlantao /></Privada>} />
        <Route path='/cadastro-plantoes/:idParam' element={<Privada><CadastroPlantao /></Privada>} />

        <Route path='/listagem-relatorios' element={<Privada><ListagemRelatorios /></Privada>} />

        <Route path='/cadastros-auxiliares' element={<Privada><CadastrosAuxiliares /></Privada>} />
        <Route path='/cadastros/:slug' element={<Privada><CadastroDominio /></Privada>} />


        <Route path='*' element={<p>Página não encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;