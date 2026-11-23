
// Configuração dos formulários de ocorrência.
// Os nomes das tabelas e campos abaixo foram conferidos com o db.json enviado.
// As tabelas sem registros de exemplo foram mantidas, mas seus campos precisam
// ser confirmados no backend antes de uso em produção.

let contador = 0;
export const novaLinha = (extra = {}) => ({
  _k: `n${++contador}`,
  ...extra,
});

const t = (nome, label, tipo = 'text', extra = {}) => ({
  nome,
  label,
  tipo,
  ...extra,
});

const UF_CAT_CNH = [
  'A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE',
];

export const SPEC_BOLETIM = {
  tabela: 'boletins',
  modo: 'unico',
  raiz: true,
  campos: [
    t('numeroProtocolo', 'Número do protocolo', 'text', { obrigatorio: true }),
    t('dataOcorrencia', 'Data da ocorrência', 'date', { obrigatorio: true }),
    t('horaOcorrencia', 'Hora da ocorrência', 'time', { obrigatorio: true }),
    t('local', 'Local da ocorrência', 'text', { obrigatorio: true }),
    t('descricaoFatos', 'Descrição dos fatos', 'textarea', { obrigatorio: true }),
    t('statusBO', 'Status do boletim', 'select', {
      opcoes: ['Registrado', 'Em investigação', 'Arquivado'],
    }),
    t('idServidorRegistrante', 'Servidor registrante (ID)', 'number'),
    t('idRondaOrigem', 'Ronda de origem (ID)', 'number'),
    t('ativo', 'Registro ativo', 'checkbox'),
  ],
};

export const SPEC_CLASSIFICACAO = {
  tabela: 'classificacoesBO',
  modo: 'lista',
  titulo: 'Classificação da ocorrência',
  campos: [t('idTipoCrime', 'Tipo de ocorrência', 'hidden')],
};

export const SPEC_ENVOLVIMENTO = {
  tabela: 'envolvimentosBO',
  modo: 'lista',
  titulo: 'Pessoas envolvidas',
  campos: [
    t('papel', 'Papel na ocorrência', 'select', {
      obrigatorio: true,
      opcoes: [
        'Vítima',
        'Suspeito',
        'Testemunha',
        'Comunicante',
        'Desaparecido',
        'Condutor',
        'Proprietário',
      ],
    }),
    t('idPessoa', 'Pessoa já cadastrada', 'pessoa'),
    t('observacoes', 'Observações sobre o envolvimento', 'textarea'),
    t('nomeCompleto', 'Nome completo (novo cadastro)', 'text', {
      local: true,
      obrigatorio: true,
      visivel: (r) => !r.idPessoa,
    }),
    t('cpf', 'CPF', 'text', {
      local: true,
      valida: 'cpf',
      visivel: (r) => !r.idPessoa,
    }),
    t('rg', 'RG', 'text', {
      local: true,
      visivel: (r) => !r.idPessoa,
    }),
    t('dataNascimento', 'Data de nascimento', 'date', {
      local: true,
      visivel: (r) => !r.idPessoa,
    }),
    t('telefone', 'Telefone', 'text', {
      local: true,
      visivel: (r) => !r.idPessoa,
    }),
  ],
};

// Furto e roubo compartilham a tabela detalhesFurto.
// Roubo possui, adicionalmente, a tabela detalhesRoubo.
const DET_FURTO = {
  tabela: 'detalhesFurto',
  modo: 'unico',
  titulo: 'Dados da subtração',
  campos: [
    t('localExatoSubtracao', 'Local exato da subtração'),
    t('houveIdentificacaoSuspeito', 'Houve identificação de suspeito?', 'checkbox'),
  ],
};

const ITENS_FURTADOS = {
  tabela: 'itensFurtados',
  modo: 'lista',
  pai: 'detalhesFurto',
  fkPai: 'idDetalheFurto',
  titulo: 'Bens subtraídos',
  campos: [
    t('descricaoObjeto', 'Descrição do objeto', 'text', { obrigatorio: true }),
    t('numeroSerieImei', 'Número de série / IMEI'),
    t('valorEstimado', 'Valor estimado (R$)', 'number'),
  ],
};

export const FORMULARIOS = {
  transito: [
    {
      tabela: 'detalhesAcidenteTransito',
      modo: 'unico',
      titulo: 'Dados do acidente de trânsito',
      campos: [
        t('houveVitimaLesao', 'Houve vítima com lesão?', 'checkbox'),
        t('descricaoDinamica', 'Descrição da dinâmica do acidente', 'textarea'),
        t('danosMateriais', 'Danos materiais', 'textarea'),
      ],
    },
    {
      tabela: 'condutores',
      modo: 'lista',
      pai: 'detalhesAcidenteTransito',
      fkPai: 'idDetalheAcidente',
      titulo: 'Condutores envolvidos',
      campos: [
        t('nomeCompleto', 'Nome completo', 'text', { obrigatorio: true }),
        t('cpf', 'CPF', 'text', { valida: 'cpf' }),
        t('rg', 'RG'),
        t('numeroCNH', 'Número da CNH', 'text', { valida: 'cnh' }),
        t('categoriaCNH', 'Categoria da CNH', 'select', { opcoes: UF_CAT_CNH }),
        t('validadeCNH', 'Validade da CNH', 'date'),
        t('ufCNH', 'UF de emissão da CNH', 'select', {
          opcoes: [
            'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
            'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
            'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
          ],
        }),
        t('idPessoa', 'Pessoa vinculada (ID)', 'number'),
      ],
    },
    {
      tabela: 'veiculosEnvolvidos',
      modo: 'lista',
      pai: 'detalhesAcidenteTransito',
      fkPai: 'idDetalheAcidente',
      titulo: 'Veículos envolvidos',
      campos: [
        t('placa', 'Placa', 'text', { obrigatorio: true, valida: 'placa' }),
        t('marca', 'Marca'),
        t('modelo', 'Modelo'),
        t('cor', 'Cor'),
        t('renavam', 'RENAVAM'),
        t('numeroCRLV', 'Número do CRLV'),
        t('proprietarioNome', 'Nome do proprietário'),
        t('proprietarioCPF', 'CPF do proprietário', 'text', { valida: 'cpf' }),
        t('idCondutor', 'ID do condutor relacionado', 'number'),
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
      titulo: 'Circunstâncias do roubo',
      campos: [
        t('houveUsoArma', 'Houve uso de arma?', 'checkbox'),
        t('tipoArma', 'Tipo de arma', 'select', {
          opcoes: ['Fogo', 'Branca', 'Simulacro', 'Outra', 'Não informado'],
        }),
        t('houveAmeacaOuAgressao', 'Houve ameaça ou agressão?', 'checkbox'),
        t('descricaoViolencia', 'Descrição da ameaça ou violência', 'textarea'),
        t('quantidadeSuspeitos', 'Quantidade de suspeitos', 'number'),
        t('descricaoFisicaSuspeitos', 'Características dos suspeitos', 'textarea'),
        t('meioFuga', 'Meio utilizado na fuga'),
      ],
    },
  ],

  extravio: [
    {
      tabela: 'detalhesExtravio',
      modo: 'unico',
      titulo: 'Dados do extravio ou perda',
      campos: [
        t('tipoDocumentoPerdido', 'Tipo de documento ou objeto perdido', 'text', {
          obrigatorio: true,
        }),
        t('numeroDocumento', 'Número do documento'),
        t('orgaoEmissor', 'Órgão emissor'),
        t('dataAproximadaPerda', 'Data aproximada da perda', 'date'),
        t('circunstanciaPerda', 'Circunstâncias da perda', 'textarea'),
        t('outrosObjetosExtraviados', 'Outros objetos extraviados', 'tags'),
      ],
    },
  ],

  lesaoCorporal: [
    {
      tabela: 'detalhesLesaoCorporal',
      modo: 'unico',
      titulo: 'Dados da lesão corporal / vias de fato',
      campos: [
        t('tipoAgressao', 'Tipo de agressão', 'select', {
          opcoes: ['Lesão corporal', 'Vias de fato'],
        }),
        t('relacaoVitimaAgressor', 'Relação entre vítima e agressor', 'select', {
          opcoes: ['Desconhecido', 'Conhecido', 'Familiar', 'Cônjuge/Companheiro'],
        }),
        t('descricaoLesoes', 'Descrição das lesões', 'textarea'),
        t('meioEmpregado', 'Meio empregado na agressão'),
        t('houveAtendimentoMedico', 'Houve atendimento médico?', 'checkbox'),
        t('localAtendimento', 'Local do atendimento médico'),
        t('necessidadeExameCorpoDelito', 'Necessita exame de corpo de delito?', 'checkbox'),
        t('violenciaDomestica', 'Há contexto de violência doméstica?', 'checkbox'),
      ],
    },
  ],

  armaMunicaoExplosivo: [
    {
      tabela: 'detalhesArmaMunicaoExplosivo',
      modo: 'unico',
      titulo: 'Dados da arma, munição ou explosivo',
      campos: [
        t('tipoArtefato', 'Tipo de artefato', 'select', {
          opcoes: ['Arma', 'Munição', 'Explosivo'],
        }),
        t('quantidade', 'Quantidade', 'number'),
        t('numeracaoRegistroArma', 'Numeração / registro da arma'),
        t('situacaoEncontrada', 'Situação em que foi encontrada', 'select', {
          opcoes: ['Apreendida', 'Encontrada', 'Entregue', 'Portada'],
        }),
        t('necessidadePericia', 'Necessita perícia?', 'checkbox'),
      ],
    },
  ],

  fatoAtipico: [
    {
      tabela: 'detalhesFatoAtipico',
      modo: 'unico',
      titulo: 'Dados do fato atípico / preservação de direitos',
      campos: [
        t('finalidadeRegistro', 'Finalidade do registro'),
        t('descricaoFatoNaoCriminal', 'Descrição do fato', 'textarea'),
        t('documentosAnexados', 'Documentos anexados', 'tags'),
      ],
    },
  ],

  dano: [
    {
      tabela: 'detalhesDano',
      modo: 'unico',
      titulo: 'Dados do dano / pichação',
      campos: [
        t('bemAtingido', 'Bem atingido', 'text', { obrigatorio: true }),
        t('tipoDano', 'Tipo de dano', 'select', {
          opcoes: ['Dano', 'Pichação', 'Vandalismo'],
        }),
        t('valorPrejuizo', 'Valor estimado do prejuízo (R$)', 'number'),
        t('patrimonioPublico', 'O bem é patrimônio público?', 'checkbox'),
      ],
    },
  ],

  ameaca: [
    {
      tabela: 'detalhesAmeaca',
      modo: 'unico',
      titulo: 'Dados da ameaça',
      campos: [
        t('meioUtilizado', 'Meio utilizado', 'select', {
          opcoes: ['Pessoalmente', 'Telefone', 'Mensagem', 'Rede social', 'Outro'],
        }),
        t('conteudoAmeaca', 'Conteúdo da ameaça', 'textarea'),
        t('houvePortArma', 'O autor portava arma?', 'checkbox'),
      ],
    },
  ],

  medidaProtetiva: [
    {
      tabela: 'detalhesMedidaProtetiva',
      modo: 'unico',
      titulo: 'Dados da medida protetiva',
      campos: [
        t('numeroProcesso', 'Número do processo'),
        t('tipoMedida', 'Tipo de medida protetiva'),
        t('dataDecisao', 'Data da decisão', 'date'),
        t('descumprimento', 'Houve descumprimento?', 'checkbox'),
      ],
    },
  ],

  estelionato: [
    {
      tabela: 'detalhesEstelionato',
      modo: 'unico',
      titulo: 'Dados do estelionato / fraude',
      campos: [
        t('meioFraude', 'Meio utilizado na fraude', 'select', {
          opcoes: ['Internet', 'Telefone', 'Pessoalmente', 'Cartão', 'Pix/Transferência', 'Outro'],
        }),
        t('valorPrejuizo', 'Valor do prejuízo (R$)', 'number'),
        t('descricaoGolpe', 'Descrição do golpe', 'textarea'),
      ],
    },
  ],

  pessoaDesaparecida: [
    {
      tabela: 'detalhesPessoaDesaparecida',
      modo: 'unico',
      titulo: 'Dados do desaparecimento / localização',
      campos: [
        t('situacao', 'Situação', 'select', {
          obrigatorio: true,
          opcoes: [
            'Desaparecimento de Pessoa',
            'Localização de Desaparecido',
            'Localização de Desconhecido',
          ],
        }),
        t('ultimoLocalVisto', 'Último local em que foi vista'),
        t('dataDesaparecimento', 'Data do desaparecimento', 'date'),
        t('vestimentas', 'Vestimentas'),
        t('caracteristicasFisicas', 'Características físicas', 'textarea'),
        t('menorDeIdade', 'É menor de idade?', 'checkbox'),
      ],
    },
  ],

  // O db.json não possui tabela de detalhes específica para homicídio.
  // Por isso, essa natureza usa os dados gerais, a descrição dos fatos
  // e os registros de pessoas envolvidas, sem gravar campos não existentes.
  geral: [],
};

const POR_NOME = {
  'Acidente de Trânsito': 'transito',
  'Furto': 'furto',
  'Roubo': 'roubo',
  'Extravio / Perda de Documentos ou Objetos': 'extravio',
  'Lesão Corporal': 'lesaoCorporal',
  'Arma de Fogo, Munições ou Explosivos': 'armaMunicaoExplosivo',
  'Fato Atípico / Preservação de Direitos': 'fatoAtipico',
  'Homicídio': 'geral',
};

export function especsAtivas(tipos, tiposSel) {
  const vistos = new Set();
  const lista = [];

  tiposSel.forEach((id) => {
    const tipo = tipos.find((item) => String(item.id) === String(id));
    const formulario = FORMULARIOS[tipo?.formulario || POR_NOME[tipo?.nomeTipo?.trim()]] || [];

    formulario.forEach((spec) => {
      if (!vistos.has(spec.tabela)) {
        vistos.add(spec.tabela);
        lista.push(spec);
      }
    });
  });

  return lista;
}
