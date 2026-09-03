import type { Metadata } from 'next';
import styles from './regression.module.css';

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = (process.env.SITE_URL ?? 'https://portfolio-data-science-matheus.matheus-souza171492.chatgpt.site').replace(/\/$/, '');
const socialImage = `${siteUrl}/projects/regressao-linear/capa-regressao-linear.png`;

export const metadata: Metadata = {
  title: 'Regressão Linear do Zero | Matheus de Souza',
  description: 'Implementação manual de regressão linear por Gradiente Descendente, convergência, comparação com scikit-learn e análise de multicolinearidade.',
  openGraph: {
    title: 'Regressão Linear do Zero',
    description: 'Otimização, convergência e multicolinearidade no dataset Diabetes.',
    images: [{ url: socialImage, alt: 'Curva de convergência da regressão linear implementada do zero' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Regressão Linear do Zero',
    description: 'Otimização, convergência e multicolinearidade no dataset Diabetes.',
    images: [socialImage],
  },
};

const featureDefinitions = [
  ['age', 'idade'], ['sex', 'sexo'], ['bmi', 'índice de massa corporal'], ['bp', 'pressão arterial média'],
  ['s1', 'colesterol total'], ['s2', 'LDL'], ['s3', 'HDL'], ['s4', 'razão colesterol/HDL'],
  ['s5', 'log dos triglicerídeos'], ['s6', 'glicemia'],
];

const manualCode = `def predict(X, w, b):
    return X @ w + b

erro = predict(X, w, b) - y
J = (erro @ erro) / (2 * N)

dw = X.T @ erro / N
db = erro.mean()

w -= learning_rate * dw
b -= learning_rate * db`;

export default function RegressionStudy() {
  return (
    <main className={styles.study}>
      <header className={`shell ${styles.nav}`}>
        <a className="brand" href={`${publicBasePath}/`} aria-label="Voltar ao portfólio"><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a>
        <nav aria-label="Navegação do estudo"><a href="#dados">Dados</a><a href="#implementacao">Implementação</a><a href="#resultados">Resultados</a></nav>
        <a className={styles.back} href={`${publicBasePath}/#projetos`}>← Portfólio</a>
      </header>

      <section className={`shell ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <span className={styles.label}>ESTUDO DE FUNDAMENTOS · MACHINE LEARNING</span>
          <h1>Regressão Linear<br/><em>do zero.</em></h1>
          <p>Otimização, convergência e multicolinearidade investigadas a partir de uma implementação manual por Gradiente Descendente.</p>
          <div className={styles.tags}><span>Python</span><span>NumPy</span><span>Gradiente Descendente</span><span>Scikit-learn</span></div>
        </div>
        <aside className={styles.heroPanel}>
          <span>RESULTADO CENTRAL</span>
          <b>Manual ≈ scikit-learn</b>
          <strong>0,0002</strong>
          <small>diferença absoluta no MSE</small>
          <p>O mesmo problema matemático, resolvido por caminhos computacionais diferentes.</p>
        </aside>
      </section>

      <section className={`shell ${styles.summary}`} aria-label="Resumo do projeto">
        <div><b>442</b><span>observações</span></div>
        <div><b>10</b><span>features disponíveis</span></div>
        <div><b>93.246</b><span>épocas · 3 features</span></div>
        <div><b>κ ≈ 536</b><span>número de condição</span></div>
      </section>

      <section className={styles.reflection}>
        <div className={`shell ${styles.reflectionGrid}`}>
          <div><span className={styles.label}>/ POR QUE FAZER DO ZERO?</span><h2>Usar IA sem terceirizar o <em>raciocínio.</em></h2></div>
          <div className={styles.reflectionText}>
            <p>Utilizo IA todos os dias — ela já faz parte da minha rotina. Bibliotecas e LLMs facilitam muito a vida de um cientista de dados, mas isso também me trouxe uma pergunta: ao economizar alguns minutos em cada tarefa, posso estar deixando de exercitar capacidades que o Matheus do futuro ainda vai precisar?</p>
            <p>Não se trata de abandonar LLMs nem de voltar a escrever milhares de linhas “na raça”. Quando usado com sabedoria, esse ferramental nos potencializa. Minha escolha foi voltar aos fundamentos para praticar o raciocínio lógico: implementar modelos com o mínimo de abstrações e entender, de fato, o que acontece por trás de um <code>.fit()</code>.</p>
            <blockquote>Hoje escolhi revisitar a velha regressão linear — e, ao final, colocar minha implementação lado a lado com o scikit-learn.</blockquote>
          </div>
        </div>
      </section>

      <section className={`shell ${styles.section}`} id="dados">
        <div className={styles.sectionHead}><span className={styles.label}>01 · PROBLEMA E DATASET</span><h2>Um laboratório para estudar <em>otimização.</em></h2><p>O dataset Diabetes do scikit-learn reúne 442 observações, dez variáveis padronizadas e um target quantitativo de progressão da doença. Aqui ele é usado como problema didático — não como modelo clínico ou ferramenta de diagnóstico.</p></div>
        <div className={styles.dataSplit}>
          <div className={styles.featureList}>{featureDefinitions.map(([name, meaning]) => <div key={name}><b>{name}</b><span>{meaning}</span></div>)}</div>
          <aside><span>RECORTE DO EXPERIMENTO</span><b>80% treino · 20% teste</b><p>As primeiras 353 observações formam o treino; as 89 restantes, o teste. Para a comparação principal foram usadas <strong>bmi</strong>, <strong>bp</strong> e <strong>s5</strong>.</p><small>0 valores ausentes</small></aside>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={`shell ${styles.sectionHead}`}><span className={styles.label}>02 · ANÁLISE EXPLORATÓRIA</span><h2>Antes do modelo,<br/>entender a <em>geometria.</em></h2><p>Distribuições, relações com o target e correlações ajudam a antecipar o comportamento do processo de otimização.</p></div>
        <div className={`shell ${styles.chartStack}`}>
          <figure><img src={`${publicBasePath}/projects/regressao-linear/distribuicoes.png`} alt="Histogramas das três features selecionadas e do target"/><figcaption>Distribuições das variáveis usadas no primeiro experimento.</figcaption></figure>
          <figure><img src={`${publicBasePath}/projects/regressao-linear/features-target.png`} alt="Dispersões de IMC, pressão arterial e triglicerídeos contra o target"/><figcaption>As três variáveis apresentam associação positiva com o target, com diferentes níveis de dispersão.</figcaption></figure>
        </div>
      </section>

      <section className={`shell ${styles.section}`} id="implementacao">
        <div className={styles.sectionHead}><span className={styles.label}>03 · IMPLEMENTAÇÃO MANUAL</span><h2>Cada etapa escrita de forma <em>explícita.</em></h2><p>Predição, erro quadrático, derivadas, atualização de pesos e critério de parada foram implementados sem usar <code>LinearRegression</code>.</p></div>
        <div className={styles.manualGrid}>
          <ol>
            <li><b>01</b><span><strong>Predição</strong><small>ŷ = Xw + b</small></span></li>
            <li><b>02</b><span><strong>Função de custo</strong><small>J = Σ(ŷ − y)² / 2N</small></span></li>
            <li><b>03</b><span><strong>Gradientes</strong><small>∂J/∂w e ∂J/∂b</small></span></li>
            <li><b>04</b><span><strong>Atualização</strong><small>w ← w − α∇J</small></span></li>
            <li><b>05</b><span><strong>Convergência</strong><small>‖∇J‖ &lt; 10⁻⁶</small></span></li>
          </ol>
          <pre aria-label="Trecho da implementação manual"><code>{manualCode}</code></pre>
        </div>
      </section>

      <section className={`${styles.section} ${styles.mintSection}`}>
        <div className={`shell ${styles.sectionHead}`}><span className={styles.label}>04 · CONVERGÊNCIA</span><h2>O learning rate define o <em>ritmo.</em></h2><p>Com α = 0,1, o modelo de três features atingiu a tolerância em 93.246 épocas. O histórico mostra a queda rápida inicial e o refinamento progressivamente mais lento perto do mínimo.</p></div>
        <figure className={`shell ${styles.chartLight}`}><img src={`${publicBasePath}/projects/regressao-linear/convergencia.png`} alt="Comparação da convergência do Gradiente Descendente com três e dez features"/><figcaption>A distância até o ótimo revela que as dez features mantêm um erro residual muito maior após um milhão de atualizações.</figcaption></figure>
        <div className={`shell ${styles.rateGrid}`}><article><span>α muito pequeno</span><p>Atualizações seguras, porém lentas: exige muitas épocas.</p></article><article><span>α = 0,1</span><p>Valor usado no experimento para comparar os dois cenários.</p></article><article><span>α muito grande</span><p>Pode ultrapassar o mínimo e provocar oscilação ou divergência.</p></article></div>
      </section>

      <section className={`shell ${styles.section}`} id="resultados">
        <div className={styles.sectionHead}><span className={styles.label}>05 · COMPARAÇÃO COM SCIKIT-LEARN</span><h2>Dois caminhos, o mesmo <em>resultado.</em></h2><p>A proximidade dos coeficientes e das métricas confirma que a implementação manual está matematicamente correta.</p></div>
        <figure className={styles.chartDark}><img src={`${publicBasePath}/projects/regressao-linear/comparacao.png`} alt="Previsões e erros da implementação manual comparados ao scikit-learn"/><figcaption>Resultados sobre as mesmas 89 observações de teste.</figcaption></figure>
        <div className={styles.tableWrap}><table><thead><tr><th>Modelo</th><th>MSE</th><th>MAE</th><th>Intercepto</th></tr></thead><tbody><tr className={styles.selectedRow}><td><span>IMPLEMENTAÇÃO</span>Manual</td><td>3.150,4034</td><td>46,1704</td><td>152,0955</td></tr><tr><td>Scikit-learn</td><td>3.150,4035</td><td>46,1704</td><td>152,0955</td></tr></tbody></table></div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={`shell ${styles.sectionHead}`}><span className={styles.label}>06 · EXPERIMENTO COM 10 FEATURES</span><h2>Mais informação,<br/>convergência mais <em>difícil.</em></h2><p>Ao incluir todas as variáveis, o algoritmo não atingiu a mesma tolerância mesmo após 1.000.000 de épocas. O problema não está na fórmula: está na geometria do custo.</p></div>
        <div className={`shell ${styles.investigationGrid}`}>
          <figure><img src={`${publicBasePath}/projects/regressao-linear/correlacao.png`} alt="Matriz de correlação destacando a correlação de 0,90 entre s1 e s2"/><figcaption>s1 × s2 apresenta correlação de 0,897.</figcaption></figure>
          <div className={styles.findings}>
            <article><span>CORRELAÇÃO FORTE</span><b>s1 × s2 ≈ 0,90</b><p>Variáveis que carregam informação semelhante dificultam a identificação de uma direção única para os coeficientes.</p></article>
            <article><span>EFEITO COMPUTACIONAL</span><b>Vales alongados</b><p>O Gradiente Descendente avança em zigue-zague nas direções de maior curvatura e progride lentamente nas direções mais planas.</p></article>
          </div>
        </div>
      </section>

      <section className={`shell ${styles.section}`}>
        <div className={styles.sectionHead}><span className={styles.label}>07 · INVESTIGAÇÃO DA CAUSA</span><h2>A Hessiana revela o <em>condicionamento.</em></h2><p>Para a parte associada aos coeficientes, a Hessiana aproximada XᵀX/N possui autovalores em escalas muito diferentes. A razão entre o maior e o menor resulta em κ ≈ 536.</p></div>
        <div className={styles.hessianGrid}><figure className={styles.chartDark}><img src={`${publicBasePath}/projects/regressao-linear/autovalores.png`} alt="Autovalores da Hessiana aproximada e número de condição 536"/><figcaption>Autovalores calculados no conjunto de treino com as dez features.</figcaption></figure><aside><span>LEITURA</span><strong>κ ≈ 536</strong><b>Problema relativamente mal condicionado</b><p>A função de custo tem curvaturas muito diferentes conforme a direção. Um único learning rate precisa ser pequeno o bastante para a direção mais íngreme, mas isso torna lentos os movimentos nas direções mais planas.</p></aside></div>
      </section>

      <section className={styles.comparisonSection}>
        <div className={`shell ${styles.sectionHead}`}><span className={styles.label}>08 · POR QUE O SCIKIT-LEARN É MAIS EFICIENTE?</span><h2>Iterar pela superfície ou resolver o sistema <em>numericamente.</em></h2></div>
        <div className={`shell ${styles.methodCompare}`}><article><span>GRADIENTE DESCENDENTE</span><b>Aproxima iterativamente</b><p>Parte de pesos iniciais e percorre a função de custo passo a passo. É sensível ao learning rate, à escala e ao condicionamento.</p></article><div>×</div><article><span>LINEARREGRESSION</span><b>Resolve mínimos quadrados</b><p>Usa rotinas numéricas otimizadas de álgebra linear para chegar à solução sem realizar milhões de pequenas atualizações.</p></article></div>
      </section>

      <section className={styles.conclusion}>
        <div className="shell"><span className={styles.label}>09 · CONCLUSÃO</span><blockquote>“Modelos equivalentes do ponto de vista matemático podem apresentar comportamentos computacionais bastante distintos em função do método de otimização e do condicionamento dos dados.”</blockquote><p>O exercício não diminui o valor das bibliotecas — faz o oposto. Entender o caminho manual deixa mais claro por que ferramentas maduras são tão eficientes e como diagnosticar quando um treinamento não se comporta como esperado.</p><div className={styles.conclusionActions}><a href="https://github.com/matheussouza22/portfolio-data-science/blob/main/scripts/analyze_diabetes.py" target="_blank" rel="noreferrer">Ver script da análise <span>↗</span></a><a href={`${publicBasePath}/#projetos`}>Outros projetos <span>↑</span></a></div></div>
      </section>

      <footer className={`shell ${styles.footer}`}><a className="brand" href={`${publicBasePath}/`}><span className="bolt" aria-hidden="true"/><b>MATHEUS DE SOUZA</b></a><p>Machine Learning · Otimização · Fundamentos</p><a href="mailto:matheus.souza@poli.ufrj.br">Vamos conversar ↗</a></footer>
    </main>
  );
}
