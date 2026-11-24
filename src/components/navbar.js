import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';

import ShieldIcon from '@mui/icons-material/Shield';

import NavbarItem from './navbarItem';

const ITENS = [
  { href: '/listagem-servidores', label: 'Servidores' },
  { href: '/listagem-ocorrencias', label: 'Ocorrências' },
  { href: '/listagem-viaturas', label: 'Viaturas' },
  { href: '/listagem-diligencias', label: 'Diligências' },
  { href: '/listagem-plantoes', label: 'Plantões' },
  { href: '/listagem-relatorios', label: 'Relatórios' },
  { href: '/cadastros', label: 'Cadastros' },
];

function Navbar() {
  // O login grava o usuário no sessionStorage; sem ele, o menu fica escondido.
  const logado = !!sessionStorage.getItem('usuario');

  function sair() {
    sessionStorage.removeItem('usuario');
  }

  return (
    <div className='navbar navbar-expand-lg fixed-top navbar-dark bg-primary'>
      <div className='container'>
        <a href={logado ? '/listagem-relatorios' : '/'} className='navbar-brand'>
          <span className='brand-mark'>
            <ShieldIcon />
          </span>
          SDP
        </a>
        {logado && (
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarResponsive'
            aria-controls='navbarResponsive'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
        )}
        <div className='collapse navbar-collapse' id='navbarResponsive'>
          <ul className='navbar-nav me-auto'>
            {ITENS.map((i) => (
              <NavbarItem key={i.href} render={logado} href={i.href} label={i.label} />
            ))}
          </ul>
          <ul className='navbar-nav'>
            <NavbarItem render={logado} href='/' label='Sair' onClick={sair} />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;