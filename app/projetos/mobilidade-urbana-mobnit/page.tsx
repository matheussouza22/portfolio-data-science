import type { Metadata } from 'next';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const pipeline = [
  ['01', 'Auditoria', 'Leitura de esquema, datas, categorias, cobertura e granularidade de cada base.'],
  ['02', 'Consolidação', 'Padronização das 24 faixas horárias e dos três dias úteis observados.'],
  ['03', 'Demanda', 'Agregação de passageiros estimados por dia, hora, turno e modalidade.'],
  ['04', 'Oferta observada', 'Cobertura por empresa, consórcio, linha e veículo no período.'],
  ['05', 'Integrações', 'Taxas ponderadas pelo total de passageiros, sem médias simples de percentuais.'],
  ['06', 'Decisão', 'Tradução dos resultados em prioridades de operação e próximos dados necessários.'],
];

const topLines = [
  ['47', '63,1 mil', '7,4%'], ['30', '61,3 mil', '7,2%'], ['48', '37,8 mil', '4,4%'],
  ['33', '37,4 mil', '4,4%'], ['67', '35,8 mil', '4,2%'], ['46', '35,5 mil', '4,2%'],
  ['49.2', '34,4 mil', '4,0%'], ['49.1', '32,2 mil', '3,8%'], ['36', '31,6 mil', '3,7%'],
  ['62B', '30,6 mil', '3,6%'],
];

export const metadata: Metadata = {
  title: 'Mobilidade urbana · MobNit | Matheus de Souza',
  description: 'Análise da demanda horária, linhas, modalidades tarifárias e integrações dos ônibus municipais de Niterói.',
  openGraph: {
    title: 'Mobilidade urbana · MobNit',
    description: '851 mil passageiros estimados, 56 linhas e uma leitura operacional do sistema municipal.',
    images: ['/projects/mobnit/perfil-horario.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobilidade urbana · MobNit',
    description: '851 mil passageiros estimados, 56 linhas e uma leitura operacional do sistema municipal.',
    images: ['/projects/mobnit/perfil-horario.png'],
  },
};

export default function MobNitCase() {
  return (
    <main className="caseStudy mobStudy">
      <header className="caseNav shell">
        <a className="brand" href={`${publicBasePath}/`} aria-label="Voltar para o portfólio"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a>
        <nav className="caseMenu" aria-label="Navegação do estudo"><a href="#metodo">Método</a><a href="#demanda">Demanda</a><a href="#integracoes">Integrações</a><a href="#recomendacoes">Recomendações</a></nav>
        <a className="caseBack" href={`${publicBasePath}/#projetos`}>← Portfólio</a>
      </header>

      <section className="caseHero shell mobHero">
        <div>
          <span className="caseLabel">MOBNIT · TRANSPORTES & MOBILIDADE</span>
          <h1>Mobilidade urbana em <em>Niterói.</em></h1>
          <p>Uma leitura operacional da demanda estimada, dos picos horários, das linhas e das integrações dos ônibus municipais de Niterói.</p>
          <div className="caseTags"><span>Python</span><span>Pandas</span><span>Análise temporal</span><span>Planejamento de transportes</span></div>
        </div>
        <aside className="caseHeroPanel mobHeroPanel">
          <span>JANELA ANALISADA</span>
          <b>6 — 8 de maio de 2025</b>
          <div className="caseScore"><strong>851 mil</strong><small>PASSAGEIROS ESTIMADOS</small></div>
          <p>Três dias úteis observados em 24 faixas horárias, cobrindo 56 linhas, 514 veículos e nove empresas.</p>
        </aside>
      </section>

      <section className="caseMetrics shell" aria-label="Resumo da análise">
        <div><b>423.600</b><span>registros horários</span></div>
        <div><b>56</b><span>linhas analisadas</span></div>
        <div><b>514</b><span>veículos observados</span></div>
        <div><b>07h</b><span>maior pico de demanda</span></div>
      </section>

      <section className="caseSection shell mobIntro">
        <div className="caseSectionTitle"><span className="caseLabel">/ PERGUNTA DE PLANEJAMENTO</span><h2>Quando e onde a rede exige mais <em>atenção?</em></h2></div>
        <div className="caseIntroGrid">
          <div className="caseLead"><p>O estudo considera exclusivamente as linhas municipais de ônibus de Niterói e busca identificar os momentos de maior pressão operacional, as linhas que concentram demanda, o papel de cada modalidade tarifária e como as integrações variam entre operadores.</p></div>
          <div className="caseDefinition mobDefinition"><span>UNIDADE DE ANÁLISE</span><b>linha × veículo × modalidade × hora</b><p>O indicador principal é uma estimativa horária obtida pela distribuição de passageiros com pesos de hora e turno. Portanto, os volumes representam demanda modelada, não contagem direta em campo.</p></div>
        </div>
      </section>

      <section className="caseSection mobProcess" id="metodo">
        <div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ MÉTODO</span><h2>Da base operacional ao <em>diagnóstico.</em></h2></div><div className="processGrid">{pipeline.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
      </section>

      <section className="caseSection shell mobSources">
        <div className="caseSectionTitle"><span className="caseLabel">/ FONTES E ESCOPO</span><h2>Recorte comparável, premissas <em>explícitas.</em></h2></div>
        <div className="sourceGrid mobSourceGrid">
          <article><span>01</span><b>Demanda horária</b><strong>423,6 mil</strong><p>Arquivo datado de 6 a 8 de maio, utilizado para todos os indicadores de demanda.</p></article>
          <article><span>02</span><b>Integrações</b><strong>1.000</strong><p>Registros por empresa, linha e veículo; a cobertura disponível é somente de 6 de maio.</p></article>
          <article><span>03</span><b>Consolidado amplo</b><strong>52,9 mi</strong><p>Arquivo de referência maior, mantido fora da comparação por não ter cobertura equivalente de integração.</p></article>
          <article><span>04</span><b>Tipo de dia</b><strong>Útil</strong><p>Os três dias da janela principal são úteis, permitindo comparação temporal homogênea.</p></article>
        </div>
        <aside className="scopeNote"><span>CRITÉRIO DE ESCOPO</span><p>O estudo usa o arquivo explicitamente recortado entre 6 e 8 de maio. A base de integrações não cobre os três dias; seus resultados aparecem em seção separada e não são extrapolados para toda a janela.</p></aside>
      </section>

      <section className="caseSection caseDark" id="demanda">
        <div className="shell">
          <div className="caseSplit"><div className="caseCopy"><span className="caseLabel">/ EVOLUÇÃO DIÁRIA</span><h2>Volume estável com leve <em>crescimento.</em></h2><p>A demanda estimada avançou de 280 mil passageiros em 6 de maio para 288 mil em 8 de maio — alta de 3,0% entre o primeiro e o último dia.</p><div className="mobCallout"><strong>283,7 mil</strong><span>média diária estimada</span></div></div><figure className="caseChart"><img src={`${publicBasePath}/projects/mobnit/demanda-diaria.png`} alt="Demanda estimada de passageiros por dia"/><figcaption>Os três dias apresentam volumes próximos, sem ruptura aparente.</figcaption></figure></div>
          <div className="mobDailyStrip"><div><span>06 MAI</span><b>280.017</b></div><div><span>07 MAI</span><b>282.643</b></div><div><span>08 MAI</span><b>288.307</b></div><div><span>VARIAÇÃO</span><b>+3,0%</b></div></div>
        </div>
      </section>

      <section className="caseSection shell mobHourly">
        <div className="caseSectionTitle"><span className="caseLabel">/ PERFIL HORÁRIO</span><h2>Dois picos definem o ritmo da <em>operação.</em></h2></div>
        <figure className="caseChart lightChart mobWideChart"><img src={`${publicBasePath}/projects/mobnit/perfil-horario.png`} alt="Perfil horário da demanda estimada de passageiros"/><figcaption>Soma dos três dias: máximo às 7h e segundo pico às 17h.</figcaption></figure>
        <div className="peakGrid"><article><span>PICO DA MANHÃ</span><b>07h</b><strong>81,1 mil passageiros</strong><p>Aceleração intensa entre 5h e 7h sugere atenção à disponibilidade de frota no início do pico.</p></article><article><span>PICO DA TARDE</span><b>17h</b><strong>72,3 mil passageiros</strong><p>A demanda volta a subir a partir das 15h, indicando necessidade de preservar regularidade até 18h.</p></article></div>
        <div className="shiftBars" aria-label="Distribuição da demanda por turno"><div><span>Manhã</span><i><b style={{width:'40.9%'}}/></i><strong>40,9%</strong></div><div><span>Tarde</span><i><b style={{width:'39.4%'}}/></i><strong>39,4%</strong></div><div><span>Noite</span><i><b style={{width:'16.4%'}}/></i><strong>16,4%</strong></div><div><span>Madrugada</span><i><b style={{width:'3.3%'}}/></i><strong>3,3%</strong></div></div>
      </section>

      <section className="caseSection mobModes">
        <div className="shell chartGrid"><figure className="caseChart"><img src={`${publicBasePath}/projects/mobnit/modalidades.png`} alt="Participação da demanda por modalidade tarifária"/><figcaption>Distribuição dos 851 mil passageiros estimados.</figcaption></figure><div className="insightPanel mobModePanel"><span>/ MODALIDADES</span><b>A leitura tarifária também é operacional.</b><p>O cartão eletrônico representa 57,1% da demanda estimada. A gratuidade responde por 27,9%, participação relevante para dimensionamento, acessibilidade e compensação do serviço.</p><div><strong>57,1%</strong><small>cartão eletrônico</small></div><div><strong>27,9%</strong><small>gratuidade</small></div><div><strong>15,0%</strong><small>dinheiro</small></div></div></div>
        <div className="shell consortiumStrip"><div><span>TRANSOCEÂNICO</span><b>54,1%</b><small>460,5 mil passageiros estimados</small></div><div><span>TRANSNIT</span><b>45,9%</b><small>390,5 mil passageiros estimados</small></div></div>
      </section>

      <section className="caseSection shell mobLines">
        <div className="caseSectionTitle"><span className="caseLabel">/ LINHAS</span><h2>Quase metade da demanda em dez <em>linhas.</em></h2><p>As dez linhas mais movimentadas concentram 47,0% do volume estimado; as linhas 47 e 30, juntas, respondem por 14,6%.</p></div>
        <div className="chartGrid"><figure className="caseChart lightChart"><img src={`${publicBasePath}/projects/mobnit/top-linhas.png`} alt="Dez linhas com maior demanda estimada"/><figcaption>Volume estimado acumulado entre 6 e 8 de maio.</figcaption></figure><div className="modelTableWrap mobLineTable"><table className="modelTable"><thead><tr><th>Linha</th><th>Volume</th><th>Participação</th></tr></thead><tbody>{topLines.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></div>
      </section>

      <section className="caseSection mobIntegration" id="integracoes">
        <div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ INTEGRAÇÕES</span><h2>Uma leitura útil — com limite de <em>cobertura.</em></h2><p>A base disponível registra 1.483 integrações em 11.666 passageiros no dia 6 de maio, taxa ponderada de 12,7%.</p></div><div className="chartGrid reverse"><div className="integrationSummary"><span>RESULTADO AGREGADO</span><strong>12,7%</strong><b>taxa observada de integração</b><p>Viação Fortaleza apresenta a maior taxa, 21,8%, mas sobre uma base menor de passageiros. Por isso, taxa e volume devem ser analisados em conjunto.</p><aside><b>Importante</b><p>O arquivo contém somente uma data. O indicador não deve ser tratado como média do período nem como característica permanente das empresas.</p></aside></div><figure className="caseChart"><img src={`${publicBasePath}/projects/mobnit/integracao-empresas.png`} alt="Taxa observada de integração por empresa"/><figcaption>Razão entre integrações e passageiros por empresa em 6 de maio.</figcaption></figure></div></div>
      </section>

      <section className="caseSection caseDelivery mobRecommendations" id="recomendacoes">
        <div className="shell"><div className="caseSectionTitle compact"><span className="caseLabel">/ IMPLICAÇÕES PARA O PLANEJAMENTO</span><h2>Dos padrões observados à decisão <em>operacional.</em></h2></div><div className="decisionGrid"><article><span>01</span><h3>Proteger os picos</h3><p>Programar frota, partidas e contingência antes das 7h e preservar regularidade entre 16h e 18h.</p></article><article><span>02</span><h3>Priorizar corredores</h3><p>Investigar lotação, velocidade e confiabilidade das linhas 47 e 30, que lideram o volume estimado.</p></article><article><span>03</span><h3>Segmentar a rede</h3><p>Usar a concentração das dez principais linhas para orientar monitoramento e alocação de recursos.</p></article><article><span>04</span><h3>Qualificar integrações</h3><p>Expandir a janela de integração antes de redesenhar conexões ou comparar definitivamente operadores.</p></article></div></div>
      </section>

      <section className="caseSection shell mobLimits">
        <div className="caseSectionTitle"><span className="caseLabel">/ LIMITAÇÕES E PRÓXIMOS PASSOS</span><h2>Mais tempo, mais contexto, melhores <em>decisões.</em></h2></div><div className="limitGrid"><article><b>Janela curta</b><p>Três dias úteis não capturam sazonalidade semanal, mensal, férias, eventos ou chuva.</p></article><article><b>Demanda estimada</b><p>Os volumes resultam de pesos horários; validação com contagens, GPS ou bilhetagem aumenta a confiança.</p></article><article><b>Integração parcial</b><p>Apenas 6 de maio está disponível, impedindo inferência robusta de tendência ou estabilidade.</p></article><article><b>Próxima camada</b><p>Combinar demanda com frequência, intervalo, velocidade, cumprimento de viagens e capacidade do veículo.</p></article></div>
      </section>

      <section className="caseClosing mobClosing"><div className="shell"><span className="caseLabel">/ CONCLUSÃO</span><h2>Dados operacionais em uma visão de <em>rede.</em></h2><p>A análise revela quando a rede municipal de ônibus é mais pressionada, quais linhas concentram movimento e onde a informação ainda precisa amadurecer. É uma base objetiva para planejar oferta, priorizar monitoramento e orientar novas investigações.</p><a className="primary large" href="mailto:matheus.souza@poli.ufrj.br">Conversar sobre mobilidade <span>↗</span></a></div></section>

      <footer className="caseFooter shell"><a className="brand" href={`${publicBasePath}/`}><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a><p>Data Science · Engenharia de Transportes · Mobilidade</p><a href={`${publicBasePath}/#projetos`}>Ver outros projetos ↑</a></footer>
    </main>
  );
}
