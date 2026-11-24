import React from 'react';
import { Link } from 'react-router-dom';

import Card from '../components/card';
import '../custom.css';

import { DOMINIOS } from './dominios';

// Página-índice com um botão para cada cadastro auxiliar.
function Cadastros() {
  return (
    <div className='container'>
      <Card title='Cadastros auxiliares'>
        <div className='row'>
          {Object.entries(DOMINIOS).map(([slug, d]) => (
            <div className='col-md-4 mb-2' key={slug}>
              <Link className='btn btn-outline-primary w-100' to={`/cadastros/${slug}`}>
                {d.titulo}
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Cadastros;
