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
    title: 'Previsão de churn',
    metric: '−28%',
    metricLabel: 'redução potencial',
    description: 'Modelo de classificação para identificar clientes com risco de cancelamento e priorizar ações de retenção.',
    technologies: ['Python', 'LightGBM', 'SHAP'],
    image: '/og.png',
    imageAlt: 'Visual do projeto de previsão de churn',
    projectUrl: '#',
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
