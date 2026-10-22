import React from 'react';

import Card from '../components/card';

import { mensagemErro } from '../components/toastr';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

// Conta quantos registros existem para cada valor de um campo.
function contar(lista, campo) {
  const resultado = {};
  lista.forEach((item) => {
    const chave = item[campo] ?? 'Não informado';
    resultado[chave] = (resultado[chave] || 0) + 1;
  });
  return Object.entries(resultado);
}

function Resumo({ titulo, total, linhas, rotulo }) {
  return (
    <div className='col-lg-6' style={{ marginBottom: 24 }}>
      <h5>
        {titulo} <span className='badge bg-primary'>{total}</span>
      </h5>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th scope='col'>{rotulo}</th>
            <th scope='col'>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {linhas.length === 0 ? (
            <tr>
              <td colSpan='2'>Sem registros</td>
            </tr>
          ) : (
            linhas.map(([nome, qtd]) => (
              <tr key={nome}>
                <td>{nome}</td>
                <td>{qtd}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ListagemRelatorios() {
  const [dados, setDados] = React.useState(null);

  React.useEffect(() => {
    Promise.all([
      axios.get(`${BASE_URL}/boletins`),
      axios.get(`${BASE_URL}/viaturas`),
      axios.get(`${BASE_URL}/diligencias`),
      axios.get(`${BASE_URL}/escalas`),
      axios.get(`${BASE_URL}/servidores`),
    ])
      .then(([boletins, viaturas, diligencias, escalas, servidores]) => {
        setDados({
          boletins: boletins.data,
          viaturas: viaturas.data,
          diligencias: diligencias.data,
          escalas: escalas.data,
          servidores: servidores.data,
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar relatórios:', error);
        mensagemErro('Erro ao carregar os relatórios');
        setDados({
          boletins: [],
          viaturas: [],
          diligencias: [],
          escalas: [],
          servidores: [],
        });
      });
  }, []);

  if (!dados) return <p>Carregando...</p>;

  return (
    <div className='container'>
      <Card title='Relatórios'>
        <div className='row'>
          <Resumo
            titulo='Ocorrências'
            rotulo='Status'
            total={dados.boletins.length}
            linhas={contar(dados.boletins, 'statusBO')}
          />
          <Resumo
            titulo='Viaturas'
            rotulo='Status'
            total={dados.viaturas.length}
            linhas={contar(dados.viaturas, 'status')}
          />
          <Resumo
            titulo='Diligências'
            rotulo='Status'
            total={dados.diligencias.length}
            linhas={contar(dados.diligencias, 'status')}
          />
          <Resumo
            titulo='Plantões'
            rotulo='Tipo'
            total={dados.escalas.length}
            linhas={contar(dados.escalas, 'tipoPlantao')}
          />
          <Resumo
            titulo='Servidores'
            rotulo='Cargo'
            total={dados.servidores.length}
            linhas={contar(dados.servidores, 'cargo')}
          />
        </div>
      </Card>
    </div>
  );
}

export default ListagemRelatorios;
