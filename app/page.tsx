const skills = [
  { n: '01', title: 'Machine Learning', text: 'Modelos preditivos que transformam padrões em decisões práticas.', tags: ['Python', 'Scikit-learn', 'XGBoost'] },
  { n: '02', title: 'Análise de Dados', text: 'Investigações que encontram a história por trás dos números.', tags: ['Pandas', 'SQL', 'Estatística'] },
  { n: '03', title: 'Data Visualization', text: 'Dashboards claros para tornar dados complexos fáceis de entender.', tags: ['Power BI', 'Tableau', 'Plotly'] },
  { n: '04', title: 'Engenharia de Dados', text: 'Pipelines confiáveis, dados organizados e análises que escalam.', tags: ['ETL', 'Cloud', 'Databricks'] },
];

const toolbelt = [
  'PYTHON', 'MACHINE LEARNING', 'SQL', 'POWER BI', 'ESTATÍSTICA',
  'PESQUISA OPERACIONAL', 'OTIMIZAÇÃO', 'SIMULAÇÃO', 'PANDAS',
  'SCIKIT-LEARN', 'GIT', 'DATA VISUALIZATION',
];

import { projects } from './projects';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <a className="brand" href="#top" aria-label="Início"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a>
        <nav aria-label="Navegação principal"><a href="#sobre">Sobre</a><a href="#projetos">Projetos</a><a href="#skills">Skills</a></nav>
        <a className="navCta" href="mailto:matheus.souza@poli.ufrj.br">Vamos conversar <span>↗</span></a>
      </header>

      <section className="hero shell" id="top">
        <div className="heroCopy">
          <div className="eyebrow"><i /> MATHEUS DE SOUZA · DATA SCIENCE</div>
          <h1>Transformando dados em <em>insights.</em></h1>
          <p>Sou Matheus de Souza. Construo análises, modelos e produtos de dados que conectam tecnologia a decisões reais de negócio.</p>
          <div className="actions"><a className="primary" href="#projetos">Explorar projetos <span>↓</span></a><a className="textLink" href="#sobre">Conheça meu trabalho ↗</a></div>
          <div className="availability"><span className="faces"><i>Py</i><i>SQL</i><i>AI</i></span><span><b>Disponível para novos projetos</b><small>Brasil · Remoto</small></span></div>
        </div>
        <div className="dataVisual" aria-label="Visualização abstrata de dados">
          <div className="terminal"><span>● ● ●</span><code>model.fit(X_train, y_train)</code></div>
          <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
          <div className="chartCard"><div className="chartTop"><span>MODEL ACCURACY</span><b>94.8%</b></div><div className="chart"><i/><i/><i/><i/><i/><i/><i/></div><small>performance_ultimos_7_dias</small></div>
          <span className="floatTag tag1">+ insight</span><span className="floatTag tag2">{'{ data }'}</span>
        </div>
      </section>

      <div className="ticker" aria-label={`Tecnologias: ${toolbelt.join(', ')}`}><div className="tickerTrack"><div className="tickerSet">{toolbelt.map((tool)=><span className="tickerItem" key={tool}>{tool}<b>✦</b></span>)}</div><div className="tickerSet" aria-hidden="true">{toolbelt.map((tool)=><span className="tickerItem" key={`repeat-${tool}`}>{tool}<b>✦</b></span>)}</div></div></div>

      <section className="section shell" id="skills">
        <div className="sectionHead"><div><span className="kicker">/ O QUE EU FAÇO</span><h2>Dados do problema<br/>até a <em>decisão.</em></h2></div><p>Combino pensamento analítico, código e contexto de negócio para criar soluções úteis.</p></div>
        <div className="skillGrid">{skills.map((s)=><article className="skillCard" key={s.n}><span className="num">{s.n}</span><div className="skillIcon">{s.n === '01' ? '⌁' : s.n === '02' ? '⌗' : s.n === '03' ? '◒' : '⛁'}</div><h3>{s.title}</h3><p>{s.text}</p><div className="tags">{s.tags.map(t=><span key={t}>{t}</span>)}</div></article>)}</div>
      </section>

      <section className="projects section" id="projetos"><div className="shell">
        <div className="sectionHead light"><div><span className="kicker">/ PROJETOS SELECIONADOS</span><h2>Problemas reais.<br/><em>Impacto mensurável.</em></h2></div><p>Uma seleção de projetos que une profundidade técnica, visão de produto e comunicação clara.</p></div>
        <div className="projectGrid">{projects.map((p)=><article className={`projectCard theme-${p.theme}`} key={p.title}><div className="miniDash">{p.image ? <img src={`${publicBasePath}${p.image}`} alt={p.imageAlt ?? `Imagem do projeto ${p.title}`} /> : <><span>{p.type}</span><div className="bars">{p.bars?.map((b,i)=><i key={i} style={{height:`${b}%`}} />)}</div></>}<div className="metric"><b>{p.metric}</b><small>{p.metricLabel}</small></div></div><div className="projectBody"><span>{p.type}</span><h3>{p.title}</h3><p>{p.description}</p><div className="tags dark">{p.technologies.map(t=><span key={t}>{t}</span>)}</div>{p.projectUrl && p.projectUrl !== '#' ? <a className="projectLink" href={p.external === false ? `${publicBasePath}${p.projectUrl}` : p.projectUrl} target={p.external === false ? undefined : '_blank'} rel={p.external === false ? undefined : 'noreferrer'}>Ver projeto <span>↗</span></a> : null}</div></article>)}</div>
      </div></section>

      <section className="about section shell" id="sobre">
        <div className="portrait"><img className="portraitPhoto" src={`${publicBasePath}/matheus-perfil.png`} alt="Matheus de Souza"/><div className="statusCard"><i/> ABERTO A OPORTUNIDADES</div></div>
        <div className="aboutCopy"><span className="kicker">/ SOBRE MIM</span><h2>Curiosidade para investigar.<br/><em>Rigor para entregar.</em></h2><p>Eu sou Matheus de Souza, cientista de dados apaixonado por transformar perguntas difíceis em respostas que movem negócios. Meu trabalho vive no encontro entre estatística, tecnologia e comunicação.</p><p>Acredito que a melhor solução é aquela que as pessoas entendem, confiam e realmente usam.</p><div className="education"><span className="educationLabel">FORMAÇÃO ACADÊMICA</span><div><b>Bacharel em Matemática Aplicada</b><small>Universidade Federal do Rio de Janeiro · UFRJ</small></div><div><b>Mestrando em Engenharia de Transportes</b><small>COPPE · Universidade Federal do Rio de Janeiro</small></div></div><a className="certificateButton" href={`${publicBasePath}/certificados/`}>Ver certificados <span>↗</span></a><div className="stats"><div><b>ML</b><span>modelos preditivos</span></div><div><b>BI</b><span>análises e dashboards</span></div><div><b>AI</b><span>soluções inteligentes</span></div></div></div>
      </section>

      <section className="contact"><div className="shell contactInner"><span className="kicker">/ VAMOS CONSTRUIR ALGO</span><h2>Tem um desafio de dados?<br/><em>Vamos conversar.</em></h2><p>Estou disponível para projetos, colaborações e oportunidades em Data Science.</p><a className="primary large" href="mailto:matheus.souza@poli.ufrj.br">matheus.souza@poli.ufrj.br <span>↗</span></a></div></section>
      <footer className="shell"><a className="brand" href="#top" aria-label="Voltar ao início"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a><p>Data Science · Machine Learning · Analytics</p><div><a href="#">LinkedIn ↗</a><a href="#">GitHub ↗</a></div></footer>
    </main>
  );
}
