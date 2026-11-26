import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import './pesquisa-paginacao.css';

export function BarraPesquisa({ lista, placeholder = 'Pesquisar...' }) {
  return (
    <div className='barra-pesquisa'>
      <SearchIcon className='barra-pesquisa-icone' />
      <input
        type='search'
        className='form-control'
        placeholder={placeholder}
        aria-label='Pesquisar na listagem'
        value={lista.busca}
        onChange={(e) => lista.setBusca(e.target.value)}
      />
      {lista.busca && (
        <button
          type='button'
          className='barra-pesquisa-limpar'
          aria-label='Limpar pesquisa'
          onClick={() => lista.setBusca('')}
        >
          <CloseIcon fontSize='small' />
        </button>
      )}
    </div>
  );
}

// Números da página: 1 ... 4 5 6 ... 12
function paginasVisiveis(atual, total) {
  const set = new Set([1, total, atual - 1, atual, atual + 1]);
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const saida = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) saida.push('...');
    saida.push(n);
  });
  return saida;
}

export function Paginacao({ lista, opcoes = [5, 10, 20, 50] }) {
  const { pagina, totalPaginas, total, inicio, porPagina } = lista;
  const de = total === 0 ? 0 : inicio + 1;
  const ate = Math.min(inicio + porPagina, total);

  return (
    <div className='paginacao'>
      <div className='paginacao-info'>
        {total === 0 ? 'Nenhum registro' : `Exibindo ${de}–${ate} de ${total}`}
        <label className='paginacao-tamanho'>
          por página
          <select
            className='form-select form-select-sm'
            value={porPagina}
            onChange={(e) => lista.setPorPagina(Number(e.target.value))}
          >
            {opcoes.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      {totalPaginas > 1 && (
        <ul className='pagination pagination-sm mb-0'>
          <li className={`page-item${pagina === 1 ? ' disabled' : ''}`}>
            <button
              type='button'
              className='page-link'
              aria-label='Página anterior'
              onClick={() => lista.setPagina(pagina - 1)}
            >
              &laquo;
            </button>
          </li>
          {paginasVisiveis(pagina, totalPaginas).map((n, i) =>
            n === '...' ? (
              <li key={`r${i}`} className='page-item disabled'>
                <span className='page-link'>…</span>
              </li>
            ) : (
              <li key={n} className={`page-item${n === pagina ? ' active' : ''}`}>
                <button type='button' className='page-link' onClick={() => lista.setPagina(n)}>
                  {n}
                </button>
              </li>
            )
          )}
          <li className={`page-item${pagina === totalPaginas ? ' disabled' : ''}`}>
            <button
              type='button'
              className='page-link'
              aria-label='Próxima página'
              onClick={() => lista.setPagina(pagina + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
