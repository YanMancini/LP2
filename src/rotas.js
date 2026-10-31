import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

import Navbar from './components/navbar';

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

function Rotas() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to='/listagem-servidores' replace />} />

        <Route path='/listagem-servidores' element={<ListagemServidores />} />
        <Route path='/cadastro-servidores' element={<CadastroServidor />} />
        <Route path='/cadastro-servidores/:idParam' element={<CadastroServidor />} />

        <Route path='/listagem-ocorrencias' element={<ListagemOcorrencias />} />
        <Route path='/cadastro-ocorrencias' element={<CadastroOcorrencia />} />
        <Route path='/cadastro-ocorrencias/:idParam' element={<CadastroOcorrencia />} />

        <Route path='/listagem-viaturas' element={<ListagemViaturas />} />
        <Route path='/cadastro-viaturas' element={<CadastroViatura />} />

        <Route path='/listagem-diligencias' element={<ListagemDiligencias />} />
        <Route path='/cadastro-diligencias' element={<CadastroDiligencia />} />

        <Route path='/listagem-plantoes' element={<ListagemPlantoes />} />
        <Route path='/cadastro-plantoes' element={<CadastroPlantao />} />

        <Route path='/listagem-relatorios' element={<ListagemRelatorios />} />

        <Route path='*' element={<p>Página não encontrada</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;