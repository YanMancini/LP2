// Cadastros auxiliares: listas que antes eram fixas no código (config.js)
// ou digitadas em texto livre. A chave é o trecho usado na URL (/cadastros/:slug).
//  - tabela:    nome da tabela na API
//  - campoNome: campo que guarda o texto (padrão: 'nome')
//  - padroes:   valores iniciais (os que já estavam fixos no config.js)

export const DOMINIOS = {
  'tipos-crime': { tabela: 'tiposCrime', titulo: 'Tipos de crime', campoNome: 'nomeTipo' },

  'status-boletim': {
    tabela: 'statusBoletim',
    titulo: 'Status do boletim',
    padroes: ['Registrado', 'Em investigação', 'Arquivado'],
  },
  'papeis-envolvimento': {
    tabela: 'papeisEnvolvimento',
    titulo: 'Papéis na ocorrência',
    padroes: ['Vítima', 'Suspeito', 'Testemunha', 'Comunicante', 'Desaparecido', 'Condutor', 'Proprietário'],
  },
 /* 'tipos-agressao': {
    tabela: 'tiposAgressao',
    titulo: 'Tipos de agressão',
    padroes: ['Lesão corporal', 'Vias de fato'],
  },
  'relacoes-vitima-agressor': {
    tabela: 'relacoesVitimaAgressor',
    titulo: 'Relação vítima-agressor',
    padroes: ['Desconhecido', 'Conhecido', 'Familiar', 'Cônjuge/Companheiro'],
  },
  'tipos-arma': {
    tabela: 'tiposArma',
    titulo: 'Tipos de arma',
    padroes: ['Fogo', 'Branca', 'Simulacro', 'Outra', 'Não informado'],
  },
  'tipos-artefato': {
    tabela: 'tiposArtefato',
    titulo: 'Tipos de artefato',
    padroes: ['Arma', 'Munição', 'Explosivo'],
  },
  'situacoes-arma': {
    tabela: 'situacoesArma',
    titulo: 'Situações da arma/munição',
    padroes: ['Apreendida', 'Encontrada', 'Entregue', 'Portada'],
  },
  'meios-ameaca': {
    tabela: 'meiosAmeaca',
    titulo: 'Meios de ameaça',
    padroes: ['Pessoalmente', 'Telefone', 'Mensagem', 'Rede social', 'Outro'],
  },
  'meios-fraude': {
    tabela: 'meiosFraude',
    titulo: 'Meios de fraude',
    padroes: ['Internet', 'Telefone', 'Pessoalmente', 'Cartão', 'Pix/Transferência', 'Outro'],
  },
  'tipos-dano': {
    tabela: 'tiposDano',
    titulo: 'Tipos de dano',
    padroes: ['Dano', 'Pichação', 'Vandalismo'],
  },
  'situacoes-desaparecimento': {
    tabela: 'situacoesDesaparecimento',
    titulo: 'Situações de desaparecimento',
    padroes: ['Desaparecimento de Pessoa', 'Localização de Desaparecido', 'Localização de Desconhecido'],
  },

  // Eram texto livre nos formulários
  'marcas-veiculo': { tabela: 'marcasVeiculo', titulo: 'Marcas de veículo' },
  'cores-veiculo': { tabela: 'coresVeiculo', titulo: 'Cores de veículo' },
  'tipos-documento': { tabela: 'tiposDocumento', titulo: 'Tipos de documento/objeto' },
  'orgaos-emissores': { tabela: 'orgaosEmissores', titulo: 'Órgãos emissores' },*/
};
