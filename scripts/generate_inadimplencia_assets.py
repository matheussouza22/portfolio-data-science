"""Gera os gráficos publicados no estudo de caso de risco de crédito.

Os valores abaixo são os resultados agregados registrados em
``datarisk/case_tecnico.ipynb``. Nenhum dado individual de cliente é exportado.
"""

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


OUTPUT_DIR = Path(__file__).resolve().parents[1] / "public" / "projects" / "inadimplencia"
INK = "#08090B"
SURFACE = "#111319"
PAPER = "#F6F5F0"
PURPLE = "#A987FF"
MINT = "#6FFFD2"
MUTED = "#A5A6AC"
GRID = "#2A2C33"


def style_axis(axis, title: str, subtitle: str | None = None) -> None:
    axis.set_facecolor(SURFACE)
    axis.set_title(title, loc="left", color=PAPER, fontsize=16, fontweight="bold", pad=18)
    if subtitle:
        axis.text(0, 1.02, subtitle, transform=axis.transAxes, color=MUTED, fontsize=9)
    axis.tick_params(colors=MUTED, labelsize=9)
    axis.grid(axis="x", color=GRID, linewidth=0.8, alpha=0.8)
    axis.set_axisbelow(True)
    for spine in axis.spines.values():
        spine.set_visible(False)


def save(figure, filename: str) -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    figure.savefig(OUTPUT_DIR / filename, dpi=190, bbox_inches="tight", facecolor=INK)
    plt.close(figure)


def model_comparison() -> None:
    models = [
        "Baseline",
        "Regressão logística",
        "XGBoost",
        "LightGBM calibrado",
        "HGB flexível",
    ]
    roc_auc = [0.500, 0.909, 0.941, 0.944, 0.952]
    pr_auc = [0.062, 0.585, 0.663, 0.672, 0.697]
    y = np.arange(len(models))

    fig, ax = plt.subplots(figsize=(10, 5.6), facecolor=INK)
    style_axis(ax, "Comparação dos modelos", "Validação temporal · abril a junho de 2021")
    height = 0.32
    bars_roc = ax.barh(y + height / 2, roc_auc, height, color=PURPLE, label="ROC AUC")
    bars_pr = ax.barh(y - height / 2, pr_auc, height, color=MINT, label="PR AUC")
    ax.set_yticks(y, models)
    ax.set_xlim(0, 1.04)
    ax.invert_yaxis()
    ax.legend(frameon=False, labelcolor=PAPER, ncol=2, loc="lower right")
    for bars in (bars_roc, bars_pr):
        for bar in bars:
            ax.text(bar.get_width() + 0.012, bar.get_y() + bar.get_height() / 2,
                    f"{bar.get_width():.3f}", va="center", color=PAPER, fontsize=8)
    fig.tight_layout()
    save(fig, "model-comparison.png")


def decile_risk() -> None:
    deciles = np.arange(1, 11)
    rates = np.array([48.8529, 7.4324, 4.1892, 0.5405, 0.2703, 0.5405, 0.2703, 0, 0, 0.2699])
    defaulters = np.array([362, 55, 31, 4, 2, 4, 2, 0, 0, 2])

    fig, ax = plt.subplots(figsize=(10, 5.6), facecolor=INK)
    style_axis(ax, "Concentração de risco por decil", "Decil 1 reúne as cobranças com maior probabilidade prevista")
    colors = [MINT if d == 1 else PURPLE for d in deciles]
    bars = ax.bar(deciles, rates, color=colors, width=0.68)
    ax.set_xticks(deciles)
    ax.set_xlabel("Decil de risco", color=MUTED, labelpad=12)
    ax.set_ylabel("Taxa real de inadimplência (%)", color=MUTED, labelpad=12)
    ax.grid(axis="y", color=GRID, linewidth=0.8, alpha=0.8)
    ax.grid(axis="x", visible=False)
    ax.set_ylim(0, 55)
    for bar, rate, count in zip(bars, rates, defaulters):
        if rate > 0:
            ax.text(bar.get_x() + bar.get_width() / 2, rate + 1.1,
                    f"{rate:.1f}%\n{count} casos", ha="center", color=PAPER, fontsize=8)
    fig.tight_layout()
    save(fig, "decile-risk.png")


def feature_importance() -> None:
    features = [
        "Histórico de inadimplência",
        "Prazo do documento",
        "Atraso médio histórico",
        "Cobranças na safra",
        "Valor a pagar",
        "Qtd. histórica de cobranças",
        "Valor por dia de prazo",
        "Dia da semana do vencimento",
        "Valor relativo ao histórico",
        "Valor médio da safra",
    ]
    importance = [0.083282, 0.021829, 0.007016, 0.006366, 0.005939,
                  0.005503, 0.003599, 0.002668, 0.002440, 0.002317]
    y = np.arange(len(features))

    fig, ax = plt.subplots(figsize=(10, 6.2), facecolor=INK)
    style_axis(ax, "O que mais influencia a previsão", "Importância por permutação sobre ROC AUC")
    colors = [MINT] + [PURPLE] * (len(features) - 1)
    bars = ax.barh(y, importance, color=colors, height=0.62)
    ax.set_yticks(y, features)
    ax.invert_yaxis()
    ax.set_xlabel("Queda média de ROC AUC ao embaralhar a variável", color=MUTED, labelpad=12)
    for bar, value in zip(bars, importance):
        ax.text(value + 0.0012, bar.get_y() + bar.get_height() / 2,
                f"{value:.3f}", va="center", color=PAPER, fontsize=8)
    fig.tight_layout()
    save(fig, "feature-importance.png")


def temporal_performance() -> None:
    months = ["Abr/21", "Mai/21", "Jun/21"]
    roc_auc = [0.937128, 0.955957, 0.958889]
    pr_auc = [0.632795, 0.743399, 0.704664]
    x = np.arange(len(months))

    fig, ax = plt.subplots(figsize=(10, 5.4), facecolor=INK)
    style_axis(ax, "Estabilidade fora do tempo", "Desempenho mês a mês na janela final de validação")
    ax.plot(x, roc_auc, marker="o", markersize=8, linewidth=2.8, color=PURPLE, label="ROC AUC")
    ax.plot(x, pr_auc, marker="o", markersize=8, linewidth=2.8, color=MINT, label="PR AUC")
    ax.set_xticks(x, months)
    ax.set_ylim(0.55, 1.0)
    ax.grid(axis="y", color=GRID, linewidth=0.8, alpha=0.8)
    ax.grid(axis="x", visible=False)
    ax.legend(frameon=False, labelcolor=PAPER, ncol=2, loc="lower right")
    for values, color in ((roc_auc, PURPLE), (pr_auc, MINT)):
        for index, value in enumerate(values):
            ax.text(index, value + 0.018, f"{value:.3f}", ha="center", color=color, fontsize=9, fontweight="bold")
    fig.tight_layout()
    save(fig, "temporal-performance.png")


if __name__ == "__main__":
    model_comparison()
    decile_risk()
    feature_importance()
    temporal_performance()
    print(f"Gráficos salvos em {OUTPUT_DIR}")
