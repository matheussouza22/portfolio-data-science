import type { Metadata } from 'next';
import styles from './certificados.module.css';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Certificados | Matheus de Souza',
  description: 'Formação complementar de Matheus de Souza em Data Science, Machine Learning e Python.',
  openGraph: {
    title: 'Certificados | Matheus de Souza',
    description: 'Formação complementar em Data Science, Machine Learning e Python.',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Certificados | Matheus de Souza',
    description: 'Formação complementar em Data Science, Machine Learning e Python.',
    images: [],
  },
};

const certificates = [
  {
    title: 'Exploratory Data Analysis for Machine Learning',
    institution: 'IBM · Coursera',
    date: 'Setembro de 2026',
    hours: 'Formação on-line',
    focus: 'Análise exploratória · Machine Learning',
    preview: '/certificados/previews/analise-exploratoria-machine-learning.jpg',
    document: '/certificados/documentos/analise-exploratoria-machine-learning.pdf',
  },
  {
    title: 'Álgebra Linear para Data Science e Machine Learning',
    institution: 'IA Expert Academy',
    date: 'Março de 2025',
    hours: '10 horas',
    focus: 'Álgebra Linear · Data Science',
    preview: '/certificados/previews/algebra-linear-data-science.jpg',
    document: '/certificados/documentos/algebra-linear-data-science.pdf',
  },
  {
    title: 'Redes Neurais Artificiais em Python',
    institution: 'IA Expert Academy',
    date: 'Setembro de 2024',
    hours: '8 horas',
    focus: 'Deep Learning · Python',
    preview: '/certificados/previews/redes-neurais-python.jpg',
    document: '/certificados/documentos/redes-neurais-python.pdf',
  },
  {
    title: 'Python para Finanças',
    institution: 'Código.py · DATA',
    date: 'Julho de 2023',
    hours: '120 horas',
    focus: 'Python · Finanças · Dados',
    preview: '/certificados/previews/python-para-financas.png',
    document: '/certificados/documentos/python-para-financas.pdf',
    privacy: true,
  },
];

export default function CertificatesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href={`${publicBasePath}/`} aria-label="Voltar ao portfólio">
          <span className={styles.bolt} aria-hidden="true" />
          <b>MATHEUS DE SOUZA</b>
        </a>
        <a className={styles.back} href={`${publicBasePath}/#sobre`}>Voltar ao portfólio <span>↗</span></a>
      </header>

      <section className={styles.hero}>
        <div>
          <span className={styles.kicker}>/ FORMAÇÃO CONTÍNUA</span>
          <h1>Certificados em<br/><em>dados & tecnologia.</em></h1>
        </div>
        <div className={styles.intro}>
          <p>Uma seleção de cursos que complementam minha formação acadêmica e sustentam minha prática em análise, modelagem e desenvolvimento de soluções orientadas por dados.</p>
          <div className={styles.counter}><b>04</b><span>formações<br/>complementares</span></div>
        </div>
      </section>

      <section className={styles.collection} aria-labelledby="lista-certificados">
        <div className={styles.collectionHead}>
          <span id="lista-certificados">CERTIFICADOS SELECIONADOS</span>
          <span>2023 — 2026</span>
        </div>
        <div className={styles.grid}>
          {certificates.map((certificate, index) => (
            <article className={styles.card} key={certificate.title}>
              <a className={styles.preview} href={`${publicBasePath}${certificate.document}`} target="_blank" rel="noreferrer" aria-label={`Abrir certificado: ${certificate.title}`}>
                <img src={`${publicBasePath}${certificate.preview}`} alt={`Prévia do certificado ${certificate.title}`} />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </a>
              <div className={styles.cardBody}>
                <div className={styles.meta}><span>{certificate.institution}</span><span>{certificate.date}</span></div>
                <h2>{certificate.title}</h2>
                <p>{certificate.focus}</p>
                <div className={styles.cardFooter}>
                  <span>{certificate.hours}</span>
                  <a href={`${publicBasePath}${certificate.document}`} target="_blank" rel="noreferrer">Abrir certificado <span>↗</span></a>
                </div>
                {certificate.privacy ? <small className={styles.privacy}>Versão pública com dado pessoal ocultado.</small> : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.nextStep}>
        <span className={styles.kicker}>/ PRÁTICA APLICADA</span>
        <h2>Conhecimento que se transforma<br/>em <em>projetos reais.</em></h2>
        <a href={`${publicBasePath}/#projetos`}>Explorar projetos <span>↓</span></a>
      </section>

      <footer className={styles.footer}>
        <span>MATHEUS DE SOUZA · DATA SCIENCE</span>
        <a href="mailto:matheus.souza@poli.ufrj.br">matheus.souza@poli.ufrj.br ↗</a>
      </footer>
    </main>
  );
}
