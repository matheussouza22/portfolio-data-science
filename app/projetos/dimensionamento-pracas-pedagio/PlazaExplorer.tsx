'use client';

import { useMemo, useState } from 'react';
import styles from './plazas.module.css';

type Hour = {
  hour: number; demand: number; autoDemand: number; manualDemand: number;
  autoBooths: number; manualBooths: number; totalBooths: number; robustBooths: number;
  autoWait: number; manualWait: number; autoRho: number; manualRho: number;
  autoP0: number; manualP0: number; autoLq: number; manualLq: number;
  autoL: number; manualL: number; autoW: number; manualW: number;
};

type Unit = {
  id: string; plaza: string; direction: string; lot: string;
  coverage: { days: number; hoursPerDay: number };
  summary: {
    dailyDemand: number; peakDemand: number; peakHour: number; basePhysical: number;
    robustPhysical: number; peakScheduled: number; autoShare: number;
    dynamicBoothHours: number; fixedBoothHours: number; operatingReduction: number;
  };
  hourly: Hour[];
};

const integer = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });

function LineChart({ data }: { data: Hour[] }) {
  const width = 920, height = 300, padX = 34, padY = 24;
  const max = Math.max(...data.map(d => d.demand), 1);
  const point = (hour: number, value: number) => {
    const x = padX + (hour / 23) * (width - padX * 2);
    const y = height - padY - (value / max) * (height - padY * 2);
    return [x, y];
  };
  const total = data.map(d => point(d.hour, d.demand).join(',')).join(' ');
  const auto = data.map(d => point(d.hour, d.autoDemand).join(',')).join(' ');
  const manual = data.map(d => point(d.hour, d.manualDemand).join(',')).join(' ');
  return <figure className={styles.chartCard}>
    <div className={styles.chartHeading}><div><span>DEMANDA MÉDIA HORÁRIA</span><b>Veículos por hora</b></div><div className={styles.legend}><i className={styles.totalDot}/>Total <i className={styles.autoDot}/>TAG <i className={styles.manualDot}/>Manual</div></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Demanda horária total, automática e manual">
      {[0, .25, .5, .75, 1].map(v => <line key={v} x1={padX} x2={width-padX} y1={height-padY-v*(height-padY*2)} y2={height-padY-v*(height-padY*2)} className={styles.gridLine}/>) }
      <polyline points={total} className={`${styles.chartLine} ${styles.totalLine}`}/>
      <polyline points={auto} className={`${styles.chartLine} ${styles.autoLine}`}/>
      <polyline points={manual} className={`${styles.chartLine} ${styles.manualLine}`}/>
      {[0, 6, 12, 18, 23].map(h => <text key={h} x={point(h,0)[0]} y={height-4} textAnchor="middle">{String(h).padStart(2,'0')}h</text>)}
    </svg>
  </figure>;
}

function BoothChart({ data }: { data: Hour[] }) {
  const max = Math.max(...data.map(d => d.robustBooths), 1);
  return <figure className={`${styles.chartCard} ${styles.boothCard}`}>
    <div className={styles.chartHeading}><div><span>ESCALA OPERACIONAL</span><b>Cabines por faixa horária</b></div><div className={styles.legend}><i className={styles.autoDot}/>TAG <i className={styles.manualDot}/>Manual <i className={styles.robustDot}/>Reserva</div></div>
    <div className={styles.boothBars} aria-label="Cabines recomendadas por hora">
      {data.map(d => <div className={styles.boothColumn} key={d.hour} title={`${String(d.hour).padStart(2,'0')}h · ${d.totalBooths} base · ${d.robustBooths} robustas`}>
        <div className={styles.reserve} style={{height:`${(d.robustBooths/max)*100}%`}}/>
        <div className={styles.stack} style={{height:`${(d.totalBooths/max)*100}%`}}><i style={{height:`${d.totalBooths ? d.manualBooths/d.totalBooths*100 : 0}%`}}/><b/></div>
        {d.hour % 3 === 0 ? <small>{String(d.hour).padStart(2,'0')}</small> : null}
      </div>)}
    </div>
  </figure>;
}

function QueueMetrics({ peak }: { peak: Hour }) {
  const rows = [
    ['P₀', 'Sistema vazio', `${peak.autoP0}%`, `${peak.manualP0}%`],
    ['L', 'Veículos no sistema', peak.autoL, peak.manualL],
    ['Lq', 'Veículos aguardando', peak.autoLq, peak.manualLq],
    ['W', 'Tempo total', `${peak.autoW}s`, `${peak.manualW}s`],
    ['Wq', 'Tempo na fila', `${peak.autoWait}s`, `${peak.manualWait}s`],
  ];
  return <div className={styles.queueResult}>
    <div className={styles.queueResultCopy}><span>TEORIA DE FILAS · HORA DE PICO</span><h3>O que acontece antes e durante o atendimento.</h3><p>Os dois canais são modelados separadamente. P₀ vem da referência M/M/c; os demais indicadores recebem o ajuste de variabilidade do modelo M/G/c.</p></div>
    <div className={styles.queueTable} role="table" aria-label="Indicadores de filas na hora de pico">
      <div className={styles.queueTableHead} role="row"><span>Indicador</span><span>TAG</span><span>Manual</span></div>
      {rows.map(([symbol,label,auto,manual]) => <div className={styles.queueTableRow} role="row" key={symbol as string}><span><b>{symbol}</b><small>{label}</small></span><strong>{auto}</strong><strong>{manual}</strong></div>)}
    </div>
  </div>;
}

export default function PlazaExplorer({ units }: { units: Unit[] }) {
  const plazas = useMemo(() => [...new Set(units.map(u => u.plaza))].sort((a,b) => a.localeCompare(b,'pt-BR')), [units]);
  const [plaza, setPlaza] = useState('BARUERI');
  const options = useMemo(() => units.filter(u => u.plaza === plaza), [units, plaza]);
  const [unitId, setUnitId] = useState(() => units.find(u => u.plaza === 'BARUERI')?.id ?? units[0].id);
  const selected = units.find(u => u.id === unitId) ?? options[0] ?? units[0];
  const duplicatedDirection = options.filter(u => u.direction === selected.direction).length > 1;
  const peak = selected.hourly.find(h => h.hour === selected.summary.peakHour) ?? selected.hourly[0];

  function changePlaza(next: string) {
    setPlaza(next);
    setUnitId(units.find(u => u.plaza === next)?.id ?? units[0].id);
  }

  return <div className={styles.explorer}>
    <div className={styles.filters}>
      <label><span>01 · SELECIONE A PRAÇA</span><select value={plaza} onChange={e => changePlaza(e.target.value)}>{plazas.map(item => <option key={item}>{item}</option>)}</select></label>
      <label><span>02 · SELECIONE O SENTIDO</span><select value={selected.id} onChange={e => setUnitId(e.target.value)}>{options.map(item => <option key={item.id} value={item.id}>{item.direction}{options.filter(o => o.direction === item.direction).length > 1 ? ` · ${item.lot}` : ''}</option>)}</select></label>
      <div className={styles.selectionMeta}><span>RECORTE ATIVO</span><b>{selected.plaza} · {selected.direction}</b><small>{selected.lot}{duplicatedDirection ? ' · nome repetido em mais de um lote' : ''}</small></div>
    </div>

    <div className={styles.selectedMetrics}>
      <article><span>PICO MÉDIO</span><b>{integer.format(selected.summary.peakDemand)}</b><small>veíc./h às {String(selected.summary.peakHour).padStart(2,'0')}h</small></article>
      <article><span>CAPACIDADE-BASE</span><b>{selected.summary.basePhysical}</b><small>cabines físicas de referência</small></article>
      <article><span>CENÁRIO ROBUSTO</span><b>{selected.summary.robustPhysical}</b><small>+20% demanda e serviço mais lento</small></article>
      <article><span>GANHO OPERACIONAL</span><b>{selected.summary.operatingReduction}%</b><small>menos cabine-horas com escala dinâmica</small></article>
    </div>
    <div className={styles.charts}><LineChart data={selected.hourly}/><BoothChart data={selected.hourly}/></div>
    <div className={styles.serviceStrip}>
      <article><span>COMPOSIÇÃO</span><b>{selected.summary.autoShare}%</b><small>da demanda em passagem automática</small></article>
      <article><span>ESPERA NO PICO · TAG</span><b>{peak.autoWait}s</b><small>{peak.autoRho}% de utilização modelada</small></article>
      <article><span>ESPERA NO PICO · MANUAL</span><b>{peak.manualWait}s</b><small>{peak.manualRho}% de utilização modelada</small></article>
      <article><span>ESCALA DO DIA</span><b>{selected.summary.dynamicBoothHours}</b><small>cabine-horas ativas na programação-base</small></article>
    </div>
    <QueueMetrics peak={peak}/>
    <div className={styles.coverageNote}><span>COBERTURA</span><p><b>{selected.coverage.days} dias observados</b> · {selected.coverage.hoursPerDay} horas/dia em média. As recomendações são necessidades teóricas; a base não contém o inventário físico atual da praça.</p></div>
  </div>;
}
