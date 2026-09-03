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
    image: '/projects/inadimplencia/capa-risco-preditivo.png',
    imageAlt: 'Fluxo de dados passando por um modelo preditivo e sendo separado em grupos de risco',
    projectUrl: '/projetos/previsao-de-inadimplencia/',
    external: false,
    theme: 'lilac',
  },
  {
    type: 'FUNDAMENTOS DE MACHINE LEARNING',
    title: 'Regressão Linear do Zero',
    metric: '0,0002',
    metricLabel: 'diferença no MSE',
    description: 'Gradiente Descendente implementado manualmente, análise de convergência e investigação da multicolinearidade no dataset Diabetes.',
    technologies: ['Python', 'NumPy', 'Otimização', 'Scikit-learn'],
    image: '/projects/regressao-linear/capa-regressao-linear.png',
    imageAlt: 'Curva de convergência do Gradiente Descendente em fundo preto com destaques lilás e verde-água',
    projectUrl: '/projetos/regressao-linear-do-zero/',
    external: false,
    theme: 'mint',
  },
  {
    type: 'TRANSPORTES & MOBILIDADE',
    title: 'Mobilidade urbana · MobNit',
    metric: '851 mil',
    metricLabel: 'passageiros estimados',
    description: 'Análise horária da demanda, picos, linhas e integrações dos ônibus municipais de Niterói.',
    technologies: ['Python', 'Pandas', 'Mobilidade', 'Visualização'],
    image: '/projects/mobnit/capa-onibus-municipais.png',
    imageAlt: 'Ônibus municipais percorrendo uma rede urbana com fluxos de demanda em lilás e verde-água',
    projectUrl: '/projetos/mobilidade-urbana-mobnit/',
    external: false,
    theme: 'mint',
  },
  {
    type: 'PESQUISA OPERACIONAL · TRANSPORTES',
    title: 'Dimensionamento de praças de pedágio',
    metric: '207',
    metricLabel: 'praças analisadas',
    description: 'Dados da ARTESP e teoria de filas aplicados à demanda horária, com escala e cenário robusto por praça e sentido.',
    technologies: ['Python', 'M/G/c', 'Otimização', 'Transportes'],
    image: '/projects/pracas-pedagio/capa-teoria-filas.png',
    imageAlt: 'Praça de pedágio com fluxos em lilás e verde-água representando a análise de filas',
    projectUrl: '/projetos/dimensionamento-pracas-pedagio/',
    external: false,
    theme: 'lilac',
  },
];
