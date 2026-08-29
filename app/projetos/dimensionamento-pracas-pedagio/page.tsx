import type { Metadata } from 'next';
import analysis from './analysis.json';
import PlazaExplorer from './PlazaExplorer';
import styles from './plazas.module.css';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Dimensionamento de praças de pedágio | Matheus de Souza',
  description: 'Teoria de filas aplicada a 207 praças, com escala horária e cenários de capacidade por sentido.',
};

const pipeline = [
  ['01', 'Auditoria', 'Validação de esquema, cobertura, horas, lotes, praças, sentidos e classes veiculares.'],
  ['02', 'Demanda', 'Agregação do volume médio de 2025 por hora e separação entre TAG e pagamento manual.'],
  ['03', 'Serviço', 'Tempos distintos por canal e composição entre veículos leves, motos e pesados.'],
  ['04', 'Filas M/G/c', 'Estimativa de utilização, probabilidade de espera e tempo médio em fila para múltiplas cabines.'],
  ['05', 'Dimensionamento', 'Menor número de cabines que satisfaz simultaneamente utilização e espera máximas.'],
  ['06', 'Robustez', 'Teste de estresse com 20% mais demanda e tempos de atendimento 20% maiores.'],
];

const macro = analysis.macro;

function NetworkProfile() {
  const max = Math.max(...macro.networkProfile);
  return <div className={styles.networkBars} aria-label="Perfil horário agregado da rede">
    {macro.networkProfile.map((value, hour) => <div key={hour} title={`${String(hour).padStart(2,'0')}h · ${value.toLocaleString('pt-BR')} veículos/h`}><i style={{height:`${value / max * 100}%`}}/>{hour % 3 === 0 ? <small>{String(hour).padStart(2,'0')}</small> : null}</div>)}
  </div>;
}

export default function TollPlazasCase() {
  return <main className={`caseStudy ${styles.study}`}>
    <header className="caseNav shell">
      <a className="brand" href={`${publicBasePath}/`} aria-label="Voltar para o portfólio"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a>
      <nav className="caseMenu" aria-label="Navegação do estudo"><a href="#explorador">Explorador</a><a href="#metodo">Método</a><a href="#macro">Análise macro</a></nav>
      <a className="caseBack" href={`${publicBasePath}/#projetos`}>← Portfólio</a>
    </header>
    <section className={`caseHero shell ${styles.hero}`}>
      <div><span className="caseLabel">TEORIA DE FILAS · ENGENHARIA DE TRANSPORTES</span><h1>Praças dimensionadas pelo <em>ritmo da demanda.</em></h1><p>Uma análise operacional de 2025 que transforma volume horário, tipo de atendimento e nível de serviço em escala de cabines por praça e sentido.</p><div className="caseTags"><span>Python</span><span>M/G/c</span><span>Pesquisa Operacional</span><span>Planejamento</span></div></div>
      <aside className={`caseHeroPanel ${styles.heroPanel}`}><span>ESCOPO ANALISADO</span><b>Rede pedagiada · 2025</b><div className="caseScore"><strong>{analysis.macro.plazas}</strong><small>PRAÇAS</small></div><p>{analysis.macro.records.toLocaleString('pt-BR')} registros, {analysis.macro.namedDirections} combinações nominais de praça e sentido.</p></aside>
    </section>
    <section className={`caseMetrics shell ${styles.metrics}`} aria-label="Resumo do estudo"><div><b>{analysis.macro.operationalUnits}</b><span>unidades operacionais</span></div><div><b>{analysis.macro.lots}</b><span>lotes rodoviários</span></div><div><b>{analysis.macro.networkPeakHour}h</b><span>pico agregado da rede</span></div><div><b>{analysis.macro.operatingReduction}%</b><span>redução potencial de cabine-horas</span></div></section>
    <section className={`caseSection shell ${styles.intro}`}><div className="caseSectionTitle"><span className="caseLabel">/ PROBLEMA DE PLANEJAMENTO</span><h2>Capacidade suficiente, sem operar o pico o <em>dia inteiro.</em></h2></div><div className={styles.introGrid}><p>A abordagem tradicional resume cada praça em um único número de cabines. Aqui, o dimensionamento físico continua protegido pelo pico, mas a operação passa a seguir a curva horária: abre-se a capacidade necessária em cada período e preserva-se uma reserva explícita para estresse.</p><aside><span>DUAS CAMADAS DE DECISÃO</span><b>Infraestrutura + escala operacional</b><p>A capacidade-base representa o envelope físico teórico. A escala dinâmica indica quantas cabines precisam estar ativas em cada hora.</p></aside></div></section>

    <section className={`caseSection shell ${styles.explorerSection}`} id="explorador"><div className="caseSectionTitle"><span className="caseLabel">/ EXPLORADOR INTERATIVO</span><h2>Cada praça, cada sentido, <em>hora a hora.</em></h2><p>Selecione o recorte para visualizar demanda, composição, espera e dimensionamento individual.</p></div><PlazaExplorer units={analysis.units}/></section>

    <section className={`caseSection ${styles.method}`} id="metodo"><div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ MÉTODO</span><h2>Do registro horário à <em>decisão de capacidade.</em></h2></div><div className="processGrid">{pipeline.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div><div className={styles.assumptions}><article><span>MODELO DE FILAS</span><b>{analysis.method.queue}</b><p>Chegadas Poisson, variabilidade do serviço por composição veicular e busca incremental do menor número de servidores.</p></article><article><span>NÍVEL DE SERVIÇO</span><b>ρ ≤ 85%</b><p>{analysis.method.sla}. Tempos médios-base: 5–7 s em TAG e 25–40 s no manual.</p></article><article><span>CENÁRIO ROBUSTO</span><b>1,20 × demanda e serviço</b><p>Teste conservador para antecipar crescimento, incidentes ou perda de produtividade sem confundi-lo com previsão.</p></article></div></div></section>

    <section className={`caseSection ${styles.macro}`} id="macro"><div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ ANÁLISE MACRO</span><h2>A rede atinge o maior volume às <em>17h.</em></h2><p>Somadas as unidades operacionais, o pico médio alcança {macro.networkPeakDemand.toLocaleString('pt-BR')} veículos por hora.</p></div><div className={styles.macroGrid}><article className={styles.profileCard}><div><span>PERFIL AGREGADO · 24 HORAS</span><b>{macro.networkPeakDemand.toLocaleString('pt-BR')} veíc./h</b><small>pico às {macro.networkPeakHour}h</small></div><NetworkProfile/></article><article className={styles.capacityCard}><span>CAPACIDADE TEÓRICA DA REDE</span><div><b>{macro.basePhysicalTotal.toLocaleString('pt-BR')}</b><small>cabines no envelope-base</small></div><div><b>{macro.robustPhysicalTotal.toLocaleString('pt-BR')}</b><small>cabines no envelope robusto</small></div><p>O cenário de estresse eleva a referência agregada em <strong>{macro.robustIncrease}%</strong>. Não é uma recomendação de construir tudo de imediato, mas um limite para testar resiliência.</p></article></div>
      <div className={styles.macroMetrics}><article><span>EFICIÊNCIA OPERACIONAL</span><b>−{macro.operatingReduction}%</b><p>de cabine-horas frente a manter o envelope-base ativo nas 24 horas.</p></article><article><span>QUALIDADE DA BASE</span><b>{macro.lowCoverageUnits}</b><p>unidades têm cobertura média inferior a 20 horas/dia e exigem validação adicional.</p></article><article><span>IDENTIDADE DOS LOCAIS</span><b>{macro.duplicatedNames}</b><p>nomes praça–sentido aparecem em mais de um lote; o filtro preserva o lote para não misturar operações.</p></article></div>
      <div className={styles.ranking}><div><span className="caseLabel">/ MAIORES ENVELOPES-BASE</span><h3>Onde a capacidade modelada é mais alta.</h3></div><div className={styles.rankingTable}><div className={styles.rankingHead}><span>Praça · sentido</span><span>Base</span><span>Robusto</span></div>{macro.topCapacity.slice(0,8).map((item,index) => <div className={styles.rankingRow} key={item.id}><b>{String(index+1).padStart(2,'0')}</b><span><strong>{item.plaza} · {item.direction}</strong><small>{item.lot}</small></span><em>{item.booths}</em><em>{item.robust}</em></div>)}</div></div>
    </div></section>

    <section className={`caseSection ${styles.decisions}`}><div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ PLANO DE MELHORIA</span><h2>Dimensionar melhor é combinar obra, escala e <em>controle.</em></h2></div><div className={styles.decisionGrid}><article><span>01</span><h3>Adotar escala horária</h3><p>Planejar abertura por classe a cada hora, evitando manter o envelope de pico integralmente ativo nos vales.</p></article><article><span>02</span><h3>Proteger o pico</h3><p>Tratar a capacidade robusta como contingência para demanda 20% maior e atendimento 20% mais lento.</p></article><article><span>03</span><h3>Priorizar os extremos</h3><p>Auditar primeiro Barueri, Osasco e demais unidades no topo de capacidade, sem somar lotes de mesmo nome.</p></article><article><span>04</span><h3>Medir a operação real</h3><p>Conectar inventário de cabines, filas observadas, indisponibilidade e tempo real de serviço para calcular o déficit físico.</p></article></div></div></section>

    <section className={`caseSection shell ${styles.limits}`}><div className="caseSectionTitle"><span className="caseLabel">/ LEITURA RESPONSÁVEL</span><h2>O que o modelo responde — e o que ainda <em>falta medir.</em></h2></div><div className={styles.limitGrid}><article><b>Demanda média</b><p>O perfil utiliza médias horárias de 2025. Percentis diários e sazonalidade elevariam a proteção contra dias excepcionais.</p></article><article><b>Sem inventário físico</b><p>Não é possível afirmar quantas novas cabines construir sem comparar a necessidade teórica ao número existente e disponível.</p></article><article><b>Premissas de serviço</b><p>Os tempos por veículo e canal são parâmetros. Cronometragem em campo deve calibrar as distribuições por praça.</p></article><article><b>Fila não observada</b><p>Espera e utilização são resultados do modelo M/G/c, não medições de sensores ou vídeo.</p></article></div></section>

    <section className={`caseClosing ${styles.closing}`}><div className="shell"><span className="caseLabel">/ CONCLUSÃO</span><h2>Capacidade planejada com <em>visão de sistema.</em></h2><p>O estudo transforma mais de 14 milhões de registros em uma política operacional verificável: capacidade para o pico, escala adequada aos vales e reserva explícita para cenários adversos.</p><a className="primary large" href="mailto:matheus.souza@poli.ufrj.br">Conversar sobre o estudo <span>↗</span></a></div></section>
    <footer className="caseFooter shell"><a className="brand" href={`${publicBasePath}/`}><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a><p>Data Science · Pesquisa Operacional · Transportes</p><a href={`${publicBasePath}/#projetos`}>Ver outros projetos ↑</a></footer>
  </main>;
}
