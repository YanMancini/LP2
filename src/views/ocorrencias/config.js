// Configuração de todos os formulários de ocorrência.
// IMPORTANTE: os nomes de campos e de chaves estrangeiras (fkPai) abaixo são
// suposições. Se algum nome for diferente no db.json, ajuste SÓ AQUI.

let contador = 0;
export const novaLinha = (extra = {}) => ({ _k: `n${++contador}`, ...extra });

const t = (nome, label, tipo = 'text', extra = {}) => ({ nome, label, tipo, ...extra });

const UF_CAT_CNH = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

export const SPEC_BOLETIM = {
  tabela: 'boletins',
  modo: 'unico',
  raiz: true,
  campos: [
    t('numeroProtocolo', 'Protocolo', 'text', { obrigatorio: true }),
    t('dataOcorrencia', 'Data da ocorrência', 'date', { obrigatorio: true }),
    t('horaOcorrencia', 'Hora da ocorrência', 'time', { obrigatorio: true }),
    t('local', 'Local', 'text', { obrigatorio: true }),
    t('descricaoFatos', 'Descrição dos fatos', 'textarea'),
    t('statusBO', 'Status', 'select', { opcoes: ['Registrado', 'Em investigação', 'Arquivado'] }),
    t('idServidorRegistrante', 'ID do servidor registrante', 'number'),
    t('idRondaOrigem', 'ID da ronda de origem', 'number'),
    t('ativo', 'Ativo', 'checkbox'),
  ],
};

export const SPEC_CLASSIFICACAO = {
  tabela: 'classificacoesBO',
  modo: 'lista',
  titulo: 'Tipos de crime',
  campos: [t('idTipoCrime', 'Tipo', 'hidden')],
};

export const SPEC_ENVOLVIMENTO = {
  tabela: 'envolvimentosBO',
  modo: 'lista',
  titulo: 'Pessoa envolvida',
  campos: [
    t('papel', 'Papel', 'select', {
      obrigatorio: true,
      opcoes: ['Vítima', 'Suspeito', 'Testemunha', 'Comunicante', 'Desaparecido'],
    }),
    t('idPessoa', 'Pessoa cadastrada', 'pessoa'),
    t('observacoes', 'Observações', 'textarea'),
    t('nomeCompleto', 'Nome completo (nova pessoa)', 'text', { local: true, obrigatorio: true, visivel: (r) => !r.idPessoa }),
    t('cpf', 'CPF', 'text', { local: true, valida: 'cpf', visivel: (r) => !r.idPessoa }),
    t('rg', 'RG', 'text', { local: true, visivel: (r) => !r.idPessoa }),
    t('dataNascimento', 'Data de nascimento', 'date', { local: true, visivel: (r) => !r.idPessoa }),
    t('telefone', 'Telefone', 'text', { local: true, visivel: (r) => !r.idPessoa }),
  ],
};

const DET_FURTO = {
  tabela: 'detalhesFurto',
  modo: 'unico',
  titulo: 'Furto / Roubo',
  campos: [
    t('localExatoSubtracao', 'Local exato da subtração'),
    t('houveIdentificacaoSuspeito', 'Houve identificação de suspeito', 'checkbox'),
  ],
};
const ITENS_FURTADOS = {
  tabela: 'itensFurtados',
  modo: 'lista',
  pai: 'detalhesFurto',
  fkPai: 'idDetalheFurto',
  titulo: 'Item subtraído',
  campos: [
    t('descricaoObjeto', 'Descrição do objeto', 'text', { obrigatorio: true }),
    t('numeroSerieImei', 'Nº de série / IMEI'),
    t('valorEstimado', 'Valor estimado', 'number'),
  ],
};

// formulario (campo de tiposCrime) -> tabelas, sempre pai antes dos filhos
export const FORMULARIOS = {
  transito: [
    {
      tabela: 'detalhesAcidenteTransito',
      modo: 'unico',
      titulo: 'Acidente de trânsito',
      campos: [
        t('houveVitimaLesao', 'Houve vítima com lesão', 'checkbox'),
        t('descricaoDinamica', 'Descrição da dinâmica', 'textarea'),
        t('danosMateriais', 'Danos materiais', 'textarea'),
      ],
    },
    {
      tabela: 'condutores',
      modo: 'lista',
      pai: 'detalhesAcidenteTransito',
      fkPai: 'idDetalheAcidente',
      titulo: 'Condutor',
      campos: [
        t('nomeCompleto', 'Nome completo', 'text', { obrigatorio: true }),
        t('cpf', 'CPF', 'text', { valida: 'cpf' }),
        t('rg', 'RG'),
        t('numeroCNH', 'CNH (nº)', 'text', { valida: 'cnh' }),
        t('categoriaCNH', 'Categoria da CNH', 'select', { opcoes: UF_CAT_CNH }),
        t('validadeCNH', 'Validade da CNH', 'date'),
        t('ufCNH', 'UF da CNH'),
      ],
    },
    {
      tabela: 'veiculosEnvolvidos',
      modo: 'lista',
      pai: 'detalhesAcidenteTransito',
      fkPai: 'idDetalheAcidente',
      titulo: 'Veículo',
      campos: [
        t('placa', 'Placa', 'text', { obrigatorio: true, valida: 'placa' }),
        t('marca', 'Marca'),
        t('modelo', 'Modelo'),
        t('cor', 'Cor'),
        t('renavam', 'RENAVAM'),
        t('numeroCRLV', 'Nº do CRLV'),
        t('proprietarioNome', 'Nome do proprietário'),
        t('proprietarioCPF', 'CPF do proprietário', 'text', { valida: 'cpf' }),
        t('idCondutor', 'Condutor', 'ref', { ref: 'condutores' }),
      ],
    },
  ],
  furto: [DET_FURTO, ITENS_FURTADOS],
  roubo: [
    DET_FURTO,
    ITENS_FURTADOS,
    {
      tabela: 'detalhesRoubo',
      modo: 'unico',
      pai: 'detalhesFurto',
      fkPai: 'idDetalheFurto',
      titulo: 'Roubo',
      campos: [
        t('houveUsoArma', 'Houve uso de arma', 'checkbox'),
        t('tipoArma', 'Tipo de arma', 'select', { opcoes: ['Fogo', 'Branca', 'Simulacro', 'Outra'] }),
        t('houveAmeacaOuAgressao', 'Houve ameaça ou agressão', 'checkbox'),
        t('descricaoViolencia', 'Descrição da violência', 'textarea'),
        t('quantidadeSuspeitos', 'Quantidade de suspeitos', 'number'),
        t('descricaoFisicaSuspeitos', 'Descrição física dos suspeitos', 'textarea'),
        t('meioFuga', 'Meio de fuga'),
      ],
    },
  ],
  extravio: [
    {
      tabela: 'detalhesExtravio',
      modo: 'unico',
      titulo: 'Extravio',
      campos: [
        t('tipoDocumentoPerdido', 'Tipo de documento perdido', 'text', { obrigatorio: true }),
        t('numeroDocumento', 'Nº do documento'),
        t('orgaoEmissor', 'Órgão emissor'),
        t('dataAproximadaPerda', 'Data aproximada da perda', 'date'),
        t('circunstanciaPerda', 'Circunstância da perda', 'textarea'),
        t('outrosObjetosExtraviados', 'Outros objetos (separe por vírgula)', 'tags'),
      ],
    },
  ],
  lesaoCorporal: [
    {
      tabela: 'detalhesLesaoCorporal',
      modo: 'unico',
      titulo: 'Lesão corporal',
      campos: [
        t('tipoAgressao', 'Tipo de agressão', 'select', { opcoes: ['Lesão corporal', 'Vias de fato'] }),
        t('relacaoVitimaAgressor', 'Relação vítima/agressor', 'select', { opcoes: ['Desconhecido', 'Conhecido', 'Familiar', 'Cônjuge/Companheiro'] }),
        t('descricaoLesoes', 'Descrição das lesões', 'textarea'),
        t('meioEmpregado', 'Meio empregado'),
        t('houveAtendimentoMedico', 'Houve atendimento médico', 'checkbox'),
        t('localAtendimento', 'Local do atendimento'),
        t('necessidadeExameCorpoDelito', 'Necessita exame de corpo de delito', 'checkbox'),
        t('violenciaDomestica', 'Violência doméstica', 'checkbox'),
      ],
    },
  ],
  armaMunicaoExplosivo: [
    {
      tabela: 'detalhesArmaMunicaoExplosivo',
      modo: 'unico',
      titulo: 'Arma / Munição / Explosivo',
      campos: [
        t('tipoArtefato', 'Tipo de artefato', 'select', { opcoes: ['Arma', 'Munição', 'Explosivo'] }),
        t('quantidade', 'Quantidade', 'number'),
        t('numeracaoRegistroArma', 'Numeração / registro da arma'),
        t('situacaoEncontrada', 'Situação em que foi encontrado', 'select', { opcoes: ['Apreendida', 'Encontrada', 'Entregue', 'Portada'] }),
        t('necessidadePericia', 'Necessita perícia', 'checkbox'),
      ],
    },
  ],
  fatoAtipico: [
    {
      tabela: 'detalhesFatoAtipico',
      modo: 'unico',
      titulo: 'Fato atípico',
      campos: [
        t('finalidadeRegistro', 'Finalidade do registro'),
        t('descricaoFatoNaoCriminal', 'Descrição do fato não criminal', 'textarea'),
        t('documentosAnexados', 'Documentos anexados (separe por vírgula)', 'tags'),
      ],
    },
  ],
  dano: [
    {
      tabela: 'detalhesDano',
      modo: 'unico',
      titulo: 'Dano / Pichação',
      campos: [
        t('bemAtingido', 'Bem atingido', 'text', { obrigatorio: true }),
        t('tipoDano', 'Tipo', 'select', { opcoes: ['Dano', 'Pichação', 'Vandalismo'] }),
        t('valorPrejuizo', 'Valor do prejuízo', 'number'),
        t('patrimonioPublico', 'Patrimônio público', 'checkbox'),
      ],
    },
  ],
  ameaca: [
    {
      tabela: 'detalhesAmeaca',
      modo: 'unico',
      titulo: 'Ameaça',
      campos: [
        t('meioUtilizado', 'Meio utilizado', 'select', { opcoes: ['Pessoalmente', 'Telefone', 'Mensagem', 'Rede social', 'Outro'] }),
        t('conteudoAmeaca', 'Conteúdo da ameaça', 'textarea'),
        t('houvePortArma', 'Autor portava arma', 'checkbox'),
      ],
    },
  ],
  medidaProtetiva: [
    {
      tabela: 'detalhesMedidaProtetiva',
      modo: 'unico',
      titulo: 'Medida protetiva',
      campos: [
        t('numeroProcesso', 'Nº do processo'),
        t('tipoMedida', 'Tipo de medida'),
        t('dataDecisao', 'Data da decisão', 'date'),
        t('descumprimento', 'Houve descumprimento', 'checkbox'),
      ],
    },
  ],
  estelionato: [
    {
      tabela: 'detalhesEstelionato',
      modo: 'unico',
      titulo: 'Estelionato',
      campos: [
        t('meioFraude', 'Meio da fraude', 'select', { opcoes: ['Internet', 'Telefone', 'Pessoalmente', 'Cartão', 'Pix/Transferência', 'Outro'] }),
        t('valorPrejuizo', 'Valor do prejuízo', 'number'),
        t('descricaoGolpe', 'Descrição do golpe', 'textarea'),
      ],
    },
  ],
  pessoaDesaparecida: [
    {
      tabela: 'detalhesPessoaDesaparecida',
      modo: 'unico',
      titulo: 'Pessoa desaparecida',
      campos: [
        t('ultimoLocalVisto', 'Último local visto'),
        t('dataDesaparecimento', 'Data do desaparecimento', 'date'),
        t('vestimentas', 'Vestimentas'),
        t('caracteristicasFisicas', 'Características físicas', 'textarea'),
        t('menorDeIdade', 'Menor de idade', 'checkbox'),
      ],
    },
  ],
  geral: [],
};

// Tabelas ativas (sem repetir) para os tipos marcados
export function especsAtivas(tipos, tiposSel) {
  const vistos = {};
  const lista = [];
  tiposSel.forEach((id) => {
    const tipo = tipos.find((x) => String(x.id) === String(id));
    (FORMULARIOS[tipo?.formulario] || []).forEach((spec) => {
      if (!vistos[spec.tabela]) {
        vistos[spec.tabela] = true;
        lista.push(spec);
      }
    });
  });
  return lista;
}