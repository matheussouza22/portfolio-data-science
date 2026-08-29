export type Project = {
  type: string;
  title: string;
  metric: string;
  metricLabel: string;
  description: string;
  technologies: string[];
  image?: string;
  imageAlt?: string;
  projectUrl?: string;
  external?: boolean;
  bars?: number[];
  theme: 'lilac' | 'mint' | 'white';
};

/*
 * COMO ADICIONAR UM PROJETO
 * 1. Coloque a imagem em public/projects/.
 * 2. Copie um objeto abaixo e edite as informações.
 * 3. Use image: '/projects/nome-do-arquivo.jpg'.
 * Os cards são criados automaticamente na ordem desta lista.
 */
export const projects: Project[] = [
  {
    type: 'MODELO PREDITIVO',
    title: 'Previsão de inadimplência',
    metric: '0,952',
    metricLabel: 'ROC AUC',
    description: 'Modelo de risco para estimar a probabilidade de atraso e priorizar cobranças com validação temporal.',
    technologies: ['Python', 'HistGradientBoosting', 'Scikit-learn'],
    image: '/projects/inadimplencia/model-comparison.png',
    imageAlt: 'Comparação de desempenho dos modelos de risco',
    projectUrl: '/projetos/previsao-de-inadimplencia/',
    external: false,
    theme: 'lilac',
  },
  {
    type: 'TRANSPORTES & MOBILIDADE',
    title: 'Mobilidade urbana · MobNit',
    metric: '851 mil',
    metricLabel: 'passageiros estimados',
    description: 'Análise horária da demanda, picos, linhas e integrações no transporte público municipal de Niterói.',
    technologies: ['Python', 'Pandas', 'Mobilidade', 'Visualização'],
    image: '/projects/mobnit/perfil-horario.png',
    imageAlt: 'Perfil horário da demanda estimada no transporte público de Niterói',
    projectUrl: '/projetos/mobilidade-urbana-mobnit/',
    external: false,
    theme: 'mint',
  },
  {
    type: 'PESQUISA OPERACIONAL · TRANSPORTES',
    title: 'Dimensionamento de praças de pedágio',
    metric: '207',
    metricLabel: 'praças analisadas',
    description: 'Teoria de filas aplicada à demanda horária, com escala operacional e cenário robusto por praça e sentido.',
    technologies: ['Python', 'M/G/c', 'Otimização', 'Transportes'],
    image: '/projects/pracas-pedagio/capa.svg',
    imageAlt: 'Perfil horário e dimensionamento de cabines de pedágio',
    projectUrl: '/projetos/dimensionamento-pracas-pedagio/',
    external: false,
    theme: 'lilac',
  },
  {
    type: 'BUSINESS INTELLIGENCE',
    title: 'Performance comercial',
    metric: '12h',
    metricLabel: 'economizadas/semana',
    description: 'Painel executivo unificando vendas, metas e forecast para uma leitura diária do negócio.',
    technologies: ['Power BI', 'SQL', 'DAX'],
    bars: [71, 43, 88, 64],
    theme: 'mint',
  },
  {
    type: 'NLP',
    title: 'Voz do cliente',
    metric: '86%',
    metricLabel: 'de acurácia',
    description: 'Análise de sentimento e tópicos em avaliações para revelar dores e oportunidades de produto.',
    technologies: ['NLP', 'BERT', 'Python'],
    bars: [35, 58, 77, 89],
    theme: 'white',
  },
];
