import { useMemo, useState } from 'react';

const SEM_DADOS = [];

// Minúsculas e sem acento: "Diligência" é encontrada ao digitar "diligencia".
const normalizar = (valor) =>
  String(valor ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/**
 * Pesquisa e paginação no navegador (o json-server devolve a lista inteira).
 *
 * @param dados   lista completa (aceita null enquanto carrega)
 * @param campos  nomes dos campos pesquisados (deve ser uma constante estável)
 * @param porPaginaInicial  itens por página (padrão 10)
 */
export default function usePesquisaPaginacao(dados, campos, porPaginaInicial = 10) {
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(porPaginaInicial);

  const lista = dados ?? SEM_DADOS;

  // Todos os termos digitados precisam aparecer em algum dos campos (E lógico).
  const filtrados = useMemo(() => {
    const termos = normalizar(busca).split(/\s+/).filter(Boolean);
    if (!termos.length) return lista;
    return lista.filter((item) => {
      const texto = normalizar(campos.map((campo) => item[campo]).join(' '));
      return termos.every((termo) => texto.includes(termo));
    });
  }, [lista, busca, campos]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  // Se a lista encolher (exclusão, nova busca), a página atual é ajustada sozinha.
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * porPagina;

  return {
    busca,
    setBusca: (valor) => {
      setBusca(valor);
      setPagina(1);
    },
    pagina: paginaAtual,
    setPagina,
    porPagina,
    setPorPagina: (valor) => {
      setPorPagina(valor);
      setPagina(1);
    },
    totalPaginas,
    total: filtrados.length,
    inicio,
    itens: filtrados.slice(inicio, inicio + porPagina),
  };
}
