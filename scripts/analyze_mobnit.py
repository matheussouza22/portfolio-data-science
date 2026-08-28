"""Analisa a janela MobNit e gera os gráficos do estudo de transportes.

Uso:
    python scripts/analyze_mobnit.py --source-dir /caminho/para/MobNit

As saídas são apenas agregadas; nenhum registro individual é publicado.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


INK = "#08090B"
SURFACE = "#111319"
PAPER = "#F6F5F0"
PURPLE = "#A987FF"
MINT = "#6FFFD2"
MUTED = "#A5A6AC"
GRID = "#2A2C33"


def style_axis(axis, title: str, subtitle: str | None = None) -> None:
    axis.set_facecolor(SURFACE)
    axis.set_title(title, loc="left", color=PAPER, fontsize=16, fontweight="bold", pad=20)
    if subtitle:
        axis.text(0, 1.02, subtitle, transform=axis.transAxes, color=MUTED, fontsize=9)
    axis.tick_params(colors=MUTED, labelsize=9)
    axis.grid(axis="y", color=GRID, linewidth=0.8, alpha=0.85)
    axis.set_axisbelow(True)
    for spine in axis.spines.values():
        spine.set_visible(False)


def save(figure, output_dir: Path, filename: str) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    figure.savefig(output_dir / filename, dpi=190, bbox_inches="tight", facecolor=INK)
    plt.close(figure)


def load_data(source_dir: Path) -> tuple[pd.DataFrame, pd.DataFrame]:
    demand = pd.read_csv(
        source_dir / "dados_mobnit_por_hora_consolidado_06052025_08052025.csv",
        low_memory=False,
    )
    integrations = pd.read_csv(
        source_dir / "integracoes_mobnit_06052025_08052025.csv",
        encoding="utf-8-sig",
    )
    demand["data"] = pd.to_datetime(demand["data"])
    integrations["data"] = pd.to_datetime(integrations["data"])
    return demand, integrations


def demand_by_day(demand: pd.DataFrame, output_dir: Path) -> None:
    daily = demand.groupby("data")["passageiros_estimados_hora"].sum()
    fig, ax = plt.subplots(figsize=(10, 5.4), facecolor=INK)
    style_axis(ax, "Demanda estimada por dia", "Janela de 6 a 8 de maio de 2025")
    bars = ax.bar(daily.index.strftime("%d/%m"), daily.values / 1000, color=[PURPLE, PURPLE, MINT], width=0.58)
    ax.set_ylabel("Passageiros estimados (mil)", color=MUTED, labelpad=12)
    ax.set_ylim(0, max(daily.values / 1000) * 1.18)
    for bar, value in zip(bars, daily.values):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 4, f"{value/1000:.1f} mil", ha="center", color=PAPER, fontsize=10, fontweight="bold")
    fig.tight_layout()
    save(fig, output_dir, "demanda-diaria.png")


def hourly_profile(demand: pd.DataFrame, output_dir: Path) -> None:
    hourly = demand.groupby("hora")["passageiros_estimados_hora"].sum().reindex([f"{h:02d}:00" for h in range(24)])
    x = np.arange(24)
    fig, ax = plt.subplots(figsize=(11, 5.4), facecolor=INK)
    style_axis(ax, "Perfil horário da demanda", "Soma dos três dias · picos de 07h e 17h")
    ax.fill_between(x, hourly.values / 1000, color=PURPLE, alpha=0.22)
    ax.plot(x, hourly.values / 1000, color=PURPLE, linewidth=2.8, marker="o", markersize=4)
    for hour in [7, 17]:
        ax.scatter(hour, hourly.iloc[hour] / 1000, color=MINT, s=80, zorder=3)
        ax.text(hour, hourly.iloc[hour] / 1000 + 3.2, f"{hour:02d}h · {hourly.iloc[hour]/1000:.1f} mil", ha="center", color=MINT, fontsize=9, fontweight="bold")
    ax.set_xticks(x[::2], [f"{h:02d}h" for h in x[::2]])
    ax.set_ylabel("Passageiros estimados (mil)", color=MUTED, labelpad=12)
    fig.tight_layout()
    save(fig, output_dir, "perfil-horario.png")


def modal_split(demand: pd.DataFrame, output_dir: Path) -> None:
    modal = demand.groupby("modalidade")["passageiros_estimados_hora"].sum().sort_values(ascending=False)
    colors = [MINT, PURPLE, "#D7D4CD"]
    fig, ax = plt.subplots(figsize=(8.5, 5.8), facecolor=INK)
    ax.set_facecolor(SURFACE)
    ax.set_title("Composição por modalidade", loc="left", color=PAPER, fontsize=16, fontweight="bold", pad=20)
    ax.text(0, 1.02, "Participação na demanda estimada", transform=ax.transAxes, color=MUTED, fontsize=9)
    wedges, _ = ax.pie(modal.values, colors=colors, startangle=90, counterclock=False, wedgeprops={"width": 0.34, "edgecolor": INK, "linewidth": 2})
    total = modal.sum()
    ax.text(0, 0.06, f"{total/1000:.0f} mil", color=PAPER, fontsize=22, fontweight="bold", ha="center")
    ax.text(0, -0.1, "passageiros", color=MUTED, fontsize=9, ha="center")
    labels = [f"{label} · {value/total:.1%}" for label, value in modal.items()]
    ax.legend(wedges, labels, frameon=False, labelcolor=PAPER, loc="center left", bbox_to_anchor=(0.88, 0.5), fontsize=9)
    fig.tight_layout()
    save(fig, output_dir, "modalidades.png")


def top_lines(demand: pd.DataFrame, output_dir: Path) -> None:
    lines = demand.groupby("linha")["passageiros_estimados_hora"].sum().nlargest(10).sort_values()
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=INK)
    style_axis(ax, "Linhas com maior demanda estimada", "Top 10 na janela analisada")
    colors = [PURPLE] * 8 + [MINT, MINT]
    bars = ax.barh(lines.index.astype(str), lines.values / 1000, color=colors)
    ax.set_xlabel("Passageiros estimados (mil)", color=MUTED, labelpad=12)
    ax.grid(axis="x", color=GRID, linewidth=0.8, alpha=0.85)
    ax.grid(axis="y", visible=False)
    for bar, value in zip(bars, lines.values):
        ax.text(bar.get_width() + 0.8, bar.get_y() + bar.get_height() / 2, f"{value/1000:.1f}", va="center", color=PAPER, fontsize=8)
    fig.tight_layout()
    save(fig, output_dir, "top-linhas.png")


def integration_rates(integrations: pd.DataFrame, output_dir: Path) -> None:
    company = integrations.groupby("empresa").agg(integracoes=("numPassIntMes", "sum"), passageiros=("passMes", "sum"))
    company["taxa"] = company["integracoes"] / company["passageiros"]
    company = company.sort_values("taxa")
    fig, ax = plt.subplots(figsize=(10, 6), facecolor=INK)
    style_axis(ax, "Taxa observada de integração por empresa", "Arquivo de integrações disponível apenas para 6 de maio de 2025")
    colors = [PURPLE] * (len(company) - 1) + [MINT]
    bars = ax.barh(company.index, company["taxa"] * 100, color=colors)
    ax.set_xlabel("Integrações / passageiros (%)", color=MUTED, labelpad=12)
    ax.grid(axis="x", color=GRID, linewidth=0.8, alpha=0.85)
    ax.grid(axis="y", visible=False)
    for bar, value in zip(bars, company["taxa"]):
        ax.text(bar.get_width() + 0.35, bar.get_y() + bar.get_height() / 2, f"{value:.1%}", va="center", color=PAPER, fontsize=8)
    fig.tight_layout()
    save(fig, output_dir, "integracao-empresas.png")


def build_summary(demand: pd.DataFrame, integrations: pd.DataFrame) -> dict:
    daily = demand.groupby("data")["passageiros_estimados_hora"].sum()
    hourly = demand.groupby("hora")["passageiros_estimados_hora"].sum()
    modal = demand.groupby("modalidade")["passageiros_estimados_hora"].sum()
    shift = demand.groupby("turnoDia")["passageiros_estimados_hora"].sum()
    total_integrations = integrations["numPassIntMes"].sum()
    integration_passengers = integrations["passMes"].sum()
    return {
        "period_start": demand["data"].min().strftime("%Y-%m-%d"),
        "period_end": demand["data"].max().strftime("%Y-%m-%d"),
        "rows": int(len(demand)),
        "estimated_passengers": float(demand["passageiros_estimados_hora"].sum()),
        "average_daily_passengers": float(daily.mean()),
        "daily_growth": float(daily.iloc[-1] / daily.iloc[0] - 1),
        "lines": int(demand["linha"].nunique()),
        "vehicles": int(demand["veiculo"].nunique()),
        "companies": int(demand["empresa"].nunique()),
        "peak_hour": str(hourly.idxmax()),
        "peak_hour_passengers": float(hourly.max()),
        "morning_share": float(shift.get("Manhã", 0) / shift.sum()),
        "electronic_card_share": float(modal.get("Cartão Eletrônico", 0) / modal.sum()),
        "integration_rows": int(len(integrations)),
        "integration_date": integrations["data"].min().strftime("%Y-%m-%d"),
        "integration_rate": float(total_integrations / integration_passengers),
        "integrations": int(total_integrations),
        "integration_passengers": int(integration_passengers),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, default=Path("public/projects/mobnit"))
    args = parser.parse_args()
    demand, integrations = load_data(args.source_dir)
    demand_by_day(demand, args.output_dir)
    hourly_profile(demand, args.output_dir)
    modal_split(demand, args.output_dir)
    top_lines(demand, args.output_dir)
    integration_rates(integrations, args.output_dir)
    summary = build_summary(demand, integrations)
    (args.output_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
