import type { Metadata } from 'next';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const pipeline = [
  ['01', 'Leitura e auditoria', 'Padronização dos quatro arquivos, tipos, datas, chaves e duplicidades.'],
  ['02', 'Target', 'Inadimplente quando o pagamento ocorre cinco dias ou mais após o vencimento.'],
  ['03', 'Features sem vazamento', 'Histórico acumulado usa somente cobranças anteriores à safra observada.'],
  ['04', 'Pré-processamento', 'Imputação, padronização numérica e one-hot encoding das categorias.'],
  ['05', 'Validação temporal', 'Treino no passado, calibração em março e teste fora do tempo entre abril e junho.'],
  ['06', 'Score final', 'Treino com toda a base conhecida e geração de 12.275 probabilidades.'],
];

const models = [
  ['Baseline pela média', '0,500', '0,062', '0,234', '0,059'],
  ['Regressão logística L2', '0,909', '0,585', '0,138', '0,037'],
  ['XGBoost regularizado', '0,941', '0,663', '0,122', '0,034'],
  ['LightGBM calibrado', '0,944', '0,672', '0,128', '0,034'],
  ['HistGradientBoosting flexível', '0,952', '0,697', '0,112', '0,031'],
];

const testDistribution = [
  ['Média', '3,91%'], ['Mediana', '0,44%'], ['Percentil 90', '7,86%'],
  ['Percentil 95', '21,11%'], ['Percentil 99', '69,49%'], ['Máximo', '95,97%'],
];

export const metadata: Metadata = {
  title: 'Previsão de inadimplência | Matheus de Souza',
  description: 'Estudo de caso completo de risco de crédito: preparação dos dados, modelagem, validação temporal e resultados.',
  openGraph: {
    title: 'Previsão de inadimplência · Estudo de caso',
    description: 'Do dado bruto à priorização de risco com ROC AUC de 0,952.',
    images: ['/projects/inadimplencia/model-comparison.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Previsão de inadimplência · Estudo de caso',
    description: 'Do dado bruto à priorização de risco com ROC AUC de 0,952.',
    images: ['/projects/inadimplencia/model-comparison.png'],
  },
};

export default function ChurnCase() {
  return (
    <main className="caseStudy">
      <header className="caseNav shell">
        <a className="brand" href={`${publicBasePath}/`} aria-label="Voltar para o portfólio"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a>
        <nav className="caseMenu" aria-label="Navegação do estudo"><a href="#processo">Processo</a><a href="#resultados">Resultados</a><a href="#conclusoes">Conclusões</a></nav>
        <a className="caseBack" href={`${publicBasePath}/#projetos`}>← Portfólio</a>
      </header>

      <section className="caseHero shell">
        <div>
          <span className="caseLabel">CASE DATARISK · CREDIT SCORING</span>
          <h1>Previsão de <em>inadimplência.</em></h1>
          <p>Uma solução ponta a ponta para estimar a probabilidade de atraso de pelo menos cinco dias — da preparação das quatro bases à priorização das cobranças de maior risco.</p>
          <div className="caseTags"><span>Python</span><span>Scikit-learn</span><span>HistGradientBoosting</span><span>Validação temporal</span></div>
        </div>
        <aside className="caseHeroPanel">
          <span>MODELO SELECIONADO</span>
          <b>HistGradientBoosting</b>
          <div className="caseScore"><strong>0,952</strong><small>ROC AUC</small></div>
          <p>Forte separação entre cobranças de maior e menor risco, com estabilidade na validação fora do tempo.</p>
        </aside>
      </section>

      <section className="caseMetrics shell" aria-label="Resumo do projeto">
        <div><b>77.414</b><span>cobranças de desenvolvimento</span></div>
        <div><b>7,02%</b><span>taxa geral de inadimplência</span></div>
        <div><b>46</b><span>variáveis de modelagem</span></div>
        <div><b>12.275</b><span>probabilidades entregues</span></div>
      </section>

      <section className="caseSection caseIntro shell">
        <div className="caseSectionTitle">
          <span className="caseLabel">/ O DESAFIO</span>
          <h2>Transformar histórico em <em>prioridade.</em></h2>
        </div>
        <div className="caseIntroGrid">
          <div className="caseLead"><p>O objetivo foi construir um score probabilístico para cada cobrança futura. O resultado permite ordenar a carteira, concentrar esforço operacional nos casos de maior risco e definir ações preventivas antes do atraso.</p></div>
          <div className="caseDefinition"><span>DEFINIÇÃO DO EVENTO</span><b>DATA_PAGAMENTO − DATA_VENCIMENTO ≥ 5 dias</b><p>O evento modelado é a inadimplência de cada cobrança, definida pelo atraso observado após o vencimento.</p></div>
        </div>
      </section>

      <section className="caseSection caseProcess" id="processo">
        <div className="shell">
          <div className="caseSectionTitle compact"><span className="caseLabel">/ PIPELINE</span><h2>Do dado bruto ao <em>score.</em></h2></div>
          <div className="processGrid">{pipeline.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </div>
      </section>

      <section className="caseSection shell">
        <div className="caseSectionTitle"><span className="caseLabel">/ PREPARAÇÃO DOS DADOS</span><h2>Quatro fontes, uma visão <em>consistente.</em></h2></div>
        <div className="sourceGrid">
          <article><span>01</span><b>Base cadastral</b><strong>1.315</strong><p>Perfil, porte, segmento, localização, e-mail e data de cadastro.</p></article>
          <article><span>02</span><b>Informações mensais</b><strong>24.401</strong><p>Renda do mês anterior e quantidade de funcionários por safra.</p></article>
          <article><span>03</span><b>Pagamentos — desenvolvimento</b><strong>77.414</strong><p>Emissão, vencimento, pagamento, valor e taxa para construir o target.</p></article>
          <article><span>04</span><b>Pagamentos — teste</b><strong>12.275</strong><p>Cobranças futuras sem data de pagamento para receber o score final.</p></article>
        </div>
        <div className="prepGrid">
          <article className="imbalanceCard"><span className="caseLabel">TARGET DESBALANCEADO</span><div className="donut" aria-label="7,02 por cento de inadimplentes"><b>7,02%</b></div><p>5.436 registros positivos e 71.978 negativos. Por isso, acurácia isolada não foi usada para escolher o modelo.</p></article>
          <article className="leakageCard"><span className="caseLabel">CONTROLE DE VAZAMENTO</span><h3>Cada mês conhece apenas o passado.</h3><p>As métricas históricas são acumuladas por cliente e deslocadas antes do merge. Assim, atraso médio, taxa de inadimplência e valores históricos nunca utilizam o resultado da cobrança que está sendo prevista.</p><code>historico(t) = agregação das safras &lt; t</code></article>
        </div>
      </section>

      <section className="caseSection caseFeatures">
        <div className="shell caseFeatureLayout">
          <div className="caseSectionTitle compact"><span className="caseLabel">/ ENGENHARIA DE FEATURES</span><h2>Contexto atual + memória do <em>cliente.</em></h2><p>Foram construídas 40 variáveis numéricas e 6 categóricas, todas disponíveis no momento da decisão.</p></div>
          <div className="featureGroups">
            <article><span>COBRANÇA</span><p>Valor, taxa, prazo, valor por dia e interações financeiras.</p></article>
            <article><span>CALENDÁRIO</span><p>Mês, dia, dia da semana, fim de semana e fim do mês.</p></article>
            <article><span>EXPOSIÇÃO</span><p>Quantidade e valor total das cobranças do cliente na safra.</p></article>
            <article><span>RELACIONAMENTO</span><p>Tempo de cadastro, cliente novo e relação entre valor e renda.</p></article>
            <article><span>HISTÓRICO</span><p>Inadimplência, atraso, ticket e taxa médios acumulados.</p></article>
            <article><span>CADASTRO</span><p>Porte, segmento, região, domínio de e-mail e qualidade cadastral.</p></article>
          </div>
        </div>
        <div className="shell preprocessStrip"><div><b>NUMÉRICAS</b><span>mediana → indicadores de ausência → padronização</span></div><i>+</i><div><b>CATEGÓRICAS</b><span>moda → one-hot encoding → categorias desconhecidas ignoradas</span></div></div>
      </section>

      <section className="caseSection shell validationSection">
        <div className="caseSectionTitle"><span className="caseLabel">/ VALIDAÇÃO TEMPORAL</span><h2>Treinar no passado.<br/>Decidir no <em>futuro.</em></h2><p>O recorte cronológico reproduz o uso real e evita que informações futuras favoreçam artificialmente o modelo.</p></div>
        <div className="timeline">
          <article className="train"><span>AGO/2018 — FEV/2021</span><b>Treino</b><strong>67.686 registros</strong><small>7,12% positivos</small></article>
          <article className="calibration"><span>MAR/2021</span><b>Calibração</b><strong>2.326 registros</strong><small>6,62% positivos</small></article>
          <article className="validation"><span>ABR — JUN/2021</span><b>Validação final</b><strong>7.402 registros</strong><small>6,24% positivos</small></article>
        </div>
      </section>

      <section className="caseSection caseDark" id="resultados">
        <div className="shell">
          <div className="caseSplit">
            <div className="caseCopy"><span className="caseLabel">/ COMPARAÇÃO</span><h2>Escolha orientada por <em>evidência.</em></h2><p>Modelos lineares, árvores, ensembles e métodos de boosting foram comparados na mesma janela temporal. O HistGradientBoosting flexível entregou a melhor combinação entre discriminação, precisão na classe rara e qualidade probabilística.</p></div>
            <figure className="caseChart"><img src={`${publicBasePath}/projects/inadimplencia/model-comparison.png`} alt="Comparação de ROC AUC e PR AUC entre os modelos avaliados"/><figcaption>Resultados na validação temporal de abril a junho de 2021.</figcaption></figure>
          </div>
          <div className="modelTableWrap"><table className="modelTable"><thead><tr><th>Modelo</th><th>ROC AUC ↑</th><th>PR AUC ↑</th><th>Log loss ↓</th><th>Brier ↓</th></tr></thead><tbody>{models.map((row, index) => <tr className={index === models.length - 1 ? 'selected' : ''} key={row[0]}>{row.map((cell, cellIndex) => <td key={cell}>{cellIndex === 0 && index === models.length - 1 ? <><span>SELECIONADO</span>{cell}</> : cell}</td>)}</tr>)}</tbody></table></div>
          <div className="winningMetrics">
            <div><span>ROC AUC</span><b>0,952</b></div><div><span>PR AUC</span><b>0,697</b></div><div><span>KS</span><b>0,774</b></div><div><span>LOG LOSS</span><b>0,112</b></div><div><span>BRIER SCORE</span><b>0,031</b></div>
          </div>
        </div>
      </section>

      <section className="caseSection shell resultsNarrative">
        <div className="caseSectionTitle"><span className="caseLabel">/ ROBUSTEZ</span><h2>Performance que se mantém <em>no tempo.</em></h2></div>
        <div className="chartGrid">
          <figure className="caseChart lightChart"><img src={`${publicBasePath}/projects/inadimplencia/temporal-performance.png`} alt="ROC AUC e PR AUC mensais na validação temporal"/><figcaption>ROC AUC permanece entre 0,937 e 0,959 nos três meses.</figcaption></figure>
          <div className="insightPanel"><span>LEITURA</span><b>Não basta pontuar bem uma única amostra.</b><p>A avaliação mensal mostra que a capacidade de ordenação permaneceu forte em abril, maio e junho. Essa consistência reduz o risco de selecionar um modelo dependente de um único recorte.</p><div><strong>−52%</strong><small>de log loss frente ao baseline</small></div><div><strong>−47%</strong><small>de Brier Score frente ao baseline</small></div></div>
        </div>
      </section>

      <section className="caseSection caseDeciles">
        <div className="shell">
          <div className="caseSectionTitle compact"><span className="caseLabel">/ PRIORIZAÇÃO</span><h2>O risco se concentra onde a operação <em>precisa agir.</em></h2></div>
          <div className="chartGrid reverse"><div className="decileSummary"><span>TOP 10% DA CARTEIRA</span><strong>78%</strong><b>dos inadimplentes capturados</b><p>O primeiro decil reúne 362 dos 462 eventos positivos da validação. Nos três primeiros decis, a captura chega a 448 casos — aproximadamente 97% do total.</p><ul><li><i/>Contato preventivo no grupo de maior risco</li><li><i/>Políticas graduais por faixa de probabilidade</li><li><i/>Mais eficiência sem abordar toda a carteira</li></ul></div><figure className="caseChart"><img src={`${publicBasePath}/projects/inadimplencia/decile-risk.png`} alt="Taxa real de inadimplência por decil de risco"/><figcaption>Quanto menor o número do decil, maior a probabilidade prevista.</figcaption></figure></div>
        </div>
      </section>

      <section className="caseSection shell">
        <div className="caseSectionTitle"><span className="caseLabel">/ INTERPRETABILIDADE</span><h2>Histórico de comportamento é o sinal mais <em>forte.</em></h2></div>
        <div className="chartGrid"><figure className="caseChart lightChart"><img src={`${publicBasePath}/projects/inadimplencia/feature-importance.png`} alt="Importância por permutação das dez principais variáveis"/><figcaption>Importância calculada por permutação na validação temporal.</figcaption></figure><div className="insightPanel pale"><span>PRINCIPAIS SINAIS</span><ol><li><b>01</b><p><strong>Taxa histórica de inadimplência</strong> resume o padrão comportamental do cliente.</p></li><li><b>02</b><p><strong>Prazo do documento</strong> adiciona contexto à estrutura da cobrança atual.</p></li><li><b>03</b><p><strong>Atraso médio e exposição</strong> qualificam recorrência, intensidade e momento do risco.</p></li></ol></div></div>
      </section>

      <section className="caseSection caseDelivery" id="conclusoes">
        <div className="shell deliveryLayout">
          <div className="caseSectionTitle compact"><span className="caseLabel">/ ENTREGA FINAL</span><h2>Um score pronto para orientar a <em>ação.</em></h2><p>Após a seleção, o modelo foi treinado novamente com toda a base de desenvolvimento e aplicado às 12.275 cobranças de teste.</p></div>
          <div className="distributionCard"><span>DISTRIBUIÇÃO DAS PROBABILIDADES</span><div>{testDistribution.map(([label, value]) => <p key={label}><small>{label}</small><b>{value}</b></p>)}</div></div>
        </div>
        <div className="shell decisionGrid"><article><span>01</span><h3>Priorizar</h3><p>Ordenar a carteira por probabilidade e concentrar recursos onde o risco é maior.</p></article><article><span>02</span><h3>Intervir</h3><p>Definir ações de cobrança preventiva e condições adequadas por faixa de risco.</p></article><article><span>03</span><h3>Monitorar</h3><p>Acompanhar discriminação, calibração, drift e estabilidade ao longo das novas safras.</p></article></div>
      </section>

      <section className="caseClosing"><div className="shell"><span className="caseLabel">/ CONCLUSÃO</span><h2>Modelagem rigorosa.<br/><em>Decisão aplicável.</em></h2><p>A solução combina prevenção de vazamento, validação temporal, métricas adequadas para classe rara e explicabilidade. O resultado não é apenas um bom modelo: é uma fila de ação mensurável para o negócio.</p><a className="primary large" href="mailto:matheus.souza@poli.ufrj.br">Conversar sobre este projeto <span>↗</span></a></div></section>

      <footer className="caseFooter shell"><a className="brand" href={`${publicBasePath}/`}><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a><p>Data Science · Risco de crédito · Machine Learning</p><a href={`${publicBasePath}/#projetos`}>Ver outros projetos ↑</a></footer>
    </main>
  );
}
