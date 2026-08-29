#!/usr/bin/env python3
"""Consolida o estudo de filas das praças em um artefato compacto para o site.

O script parte das tabelas auditáveis já produzidas pelo estudo original. Ele não
estima um suposto déficit físico (a base não contém inventário de cabines): calcula
necessidade teórica por hora, capacidade física de referência e uma reserva robusta.
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from math import factorial
from pathlib import Path

import numpy as np
import pandas as pd


DEFAULT_SOURCE = Path("/Users/matheussouza/Documents/Artigos/RDT2026/FILAS/resultados_todas_pracas")
DEFAULT_OUTPUT = Path(__file__).resolve().parents[1] / "app/projetos/dimensionamento-pracas-pedagio/analysis.json"


def clean_number(value: float | int | np.number, digits: int = 1) -> float | int:
    number = float(value)
    rounded = round(number, digits)
    return int(rounded) if rounded.is_integer() else rounded


def slug(value: str) -> str:
    plain = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", plain).strip("-")


def read_record_count(source: Path) -> int:
    summary = source / "resumo_dimensionamento.txt"
    if not summary.exists():
        return 0
    match = re.search(r"Registros processados:\s*([\d,.]+)", summary.read_text(encoding="utf-8"))
    return int(re.sub(r"\D", "", match.group(1))) if match else 0


def scenario(detail: pd.DataFrame, demand: str, service: str) -> pd.DataFrame:
    subset = detail[
        detail["CENARIO_DEMANDA"].eq(demand)
        & detail["CENARIO_SERVICO"].eq(service)
    ].copy()
    value_columns = [
        "DEMANDA_BASE", "LAMBDA", "MU", "CABINES_NECESSARIAS_HORA", "RHO",
        "P_ESPERA_REFERENCIA", "LQ", "WQ_SEG", "W_SEG", "L",
    ]
    wide = subset.pivot_table(
        index=["LOTE", "PRACA", "SENTIDO", "HORA"],
        columns="CLASSE_ATENDIMENTO",
        values=value_columns,
        aggfunc="first",
    )
    wide.columns = [f"{metric}__{klass}" for metric, klass in wide.columns]
    return wide.reset_index()


def p0_erlang(lambda_hour: float, mu_hour: float, booths: int) -> float:
    """Probabilidade de sistema vazio na referência M/M/c do Allen–Cunneen."""
    if lambda_hour <= 0:
        return 1.0
    if mu_hour <= 0 or booths <= 0:
        return 0.0
    offered = lambda_hour / mu_hour
    rho = lambda_hour / (booths * mu_hour)
    if rho >= 1:
        return 0.0
    base = sum((offered**n) / factorial(n) for n in range(booths))
    tail = (offered**booths) / (factorial(booths) * (1 - rho))
    return 1 / (base + tail)


def build(source: Path) -> dict:
    detail = pd.read_csv(source / "03_dimensionamento_por_hora.csv")
    coverage = pd.read_csv(source / "02_cobertura_dos_dados.csv")

    base = scenario(detail, "ATUAL", "BASE")
    robust = scenario(detail, "AUMENTO_20", "LENTO_20")
    robust = robust.rename(
        columns={
            c: c.replace("CABINES_NECESSARIAS_HORA", "ROBUST_CABINES")
            for c in robust.columns
            if c.startswith("CABINES_NECESSARIAS_HORA")
        }
    )
    robust = robust[[
        "LOTE", "PRACA", "SENTIDO", "HORA",
        "ROBUST_CABINES__AUTOMATICO_TAG", "ROBUST_CABINES__MANUAL_PAGAMENTO",
    ]]
    merged = base.merge(robust, on=["LOTE", "PRACA", "SENTIDO", "HORA"], how="left")
    merged = merged.merge(coverage, on=["LOTE", "PRACA", "SENTIDO"], how="left")

    units: list[dict] = []
    for (lot, plaza, direction), group in merged.groupby(["LOTE", "PRACA", "SENTIDO"], sort=True):
        group = group.sort_values("HORA")
        auto_demand = group["DEMANDA_BASE__AUTOMATICO_TAG"].fillna(0)
        manual_demand = group["DEMANDA_BASE__MANUAL_PAGAMENTO"].fillna(0)
        total_demand = auto_demand + manual_demand
        auto_booths = group["CABINES_NECESSARIAS_HORA__AUTOMATICO_TAG"].fillna(0)
        manual_booths = group["CABINES_NECESSARIAS_HORA__MANUAL_PAGAMENTO"].fillna(0)
        robust_auto = group["ROBUST_CABINES__AUTOMATICO_TAG"].fillna(0)
        robust_manual = group["ROBUST_CABINES__MANUAL_PAGAMENTO"].fillna(0)

        peak_pos = int(total_demand.to_numpy().argmax())
        peak_row = group.iloc[peak_pos]
        base_physical = int(auto_booths.max() + manual_booths.max())
        robust_physical = int(robust_auto.max() + robust_manual.max())
        booth_hours_dynamic = int((auto_booths + manual_booths).sum())
        booth_hours_fixed = base_physical * len(group)
        share_auto = auto_demand.sum() / total_demand.sum() if total_demand.sum() else 0

        hourly = []
        for idx, row in group.reset_index(drop=True).iterrows():
            auto_c = int(auto_booths.iloc[idx])
            manual_c = int(manual_booths.iloc[idx])
            hourly.append({
                "hour": int(row["HORA"]),
                "demand": clean_number(total_demand.iloc[idx]),
                "autoDemand": clean_number(auto_demand.iloc[idx]),
                "manualDemand": clean_number(manual_demand.iloc[idx]),
                "autoBooths": auto_c,
                "manualBooths": manual_c,
                "totalBooths": int(auto_booths.iloc[idx] + manual_booths.iloc[idx]),
                "robustBooths": int(robust_auto.iloc[idx] + robust_manual.iloc[idx]),
                "autoWait": clean_number(row.get("WQ_SEG__AUTOMATICO_TAG", 0), 2),
                "manualWait": clean_number(row.get("WQ_SEG__MANUAL_PAGAMENTO", 0), 2),
                "autoRho": clean_number(100 * row.get("RHO__AUTOMATICO_TAG", 0), 1),
                "manualRho": clean_number(100 * row.get("RHO__MANUAL_PAGAMENTO", 0), 1),
                "autoP0": clean_number(100 * p0_erlang(row.get("LAMBDA__AUTOMATICO_TAG", 0), row.get("MU__AUTOMATICO_TAG", 0), auto_c), 2),
                "manualP0": clean_number(100 * p0_erlang(row.get("LAMBDA__MANUAL_PAGAMENTO", 0), row.get("MU__MANUAL_PAGAMENTO", 0), manual_c), 2),
                "autoLq": clean_number(row.get("LQ__AUTOMATICO_TAG", 0), 2),
                "manualLq": clean_number(row.get("LQ__MANUAL_PAGAMENTO", 0), 2),
                "autoL": clean_number(row.get("L__AUTOMATICO_TAG", 0), 2),
                "manualL": clean_number(row.get("L__MANUAL_PAGAMENTO", 0), 2),
                "autoW": clean_number(row.get("W_SEG__AUTOMATICO_TAG", 0), 2),
                "manualW": clean_number(row.get("W_SEG__MANUAL_PAGAMENTO", 0), 2),
            })

        units.append({
            "id": slug(f"{lot}-{plaza}-{direction}"),
            "plaza": str(plaza),
            "direction": str(direction),
            "lot": str(lot),
            "coverage": {
                "days": int(peak_row["DATAS_OBSERVADAS"]),
                "hoursPerDay": clean_number(peak_row["COBERTURA_MEDIA_HORAS_DIA"], 1),
            },
            "summary": {
                "dailyDemand": clean_number(total_demand.sum(), 0),
                "peakDemand": clean_number(total_demand.max(), 0),
                "peakHour": int(peak_row["HORA"]),
                "basePhysical": base_physical,
                "robustPhysical": robust_physical,
                "peakScheduled": int((auto_booths + manual_booths).max()),
                "autoShare": clean_number(share_auto * 100, 1),
                "dynamicBoothHours": booth_hours_dynamic,
                "fixedBoothHours": booth_hours_fixed,
                "operatingReduction": clean_number(100 * (1 - booth_hours_dynamic / booth_hours_fixed), 1) if booth_hours_fixed else 0,
            },
            "hourly": hourly,
        })

    all_hours = merged.copy()
    all_hours["TOTAL_DEMAND"] = (
        all_hours["DEMANDA_BASE__AUTOMATICO_TAG"].fillna(0)
        + all_hours["DEMANDA_BASE__MANUAL_PAGAMENTO"].fillna(0)
    )
    network_profile = (
        all_hours.groupby("HORA", as_index=False)["TOTAL_DEMAND"].sum().sort_values("HORA")
    )
    base_total = sum(u["summary"]["basePhysical"] for u in units)
    robust_total = sum(u["summary"]["robustPhysical"] for u in units)
    dynamic_hours = sum(u["summary"]["dynamicBoothHours"] for u in units)
    fixed_hours = sum(u["summary"]["fixedBoothHours"] for u in units)
    low_coverage = sum(u["coverage"]["hoursPerDay"] < 20 for u in units)
    top_capacity = sorted(units, key=lambda u: (-u["summary"]["basePhysical"], -u["summary"]["peakDemand"]))[:10]
    top_demand = sorted(units, key=lambda u: -u["summary"]["peakDemand"])[:10]

    macro = {
        "records": read_record_count(source),
        "plazas": len({u["plaza"] for u in units}),
        "namedDirections": len({(u["plaza"], u["direction"]) for u in units}),
        "operationalUnits": len(units),
        "lots": len({u["lot"] for u in units}),
        "duplicatedNames": len(units) - len({(u["plaza"], u["direction"]) for u in units}),
        "basePhysicalTotal": base_total,
        "robustPhysicalTotal": robust_total,
        "robustIncrease": clean_number(100 * (robust_total / base_total - 1), 1),
        "dynamicBoothHours": dynamic_hours,
        "fixedBoothHours": fixed_hours,
        "operatingReduction": clean_number(100 * (1 - dynamic_hours / fixed_hours), 1),
        "lowCoverageUnits": low_coverage,
        "networkPeakHour": int(network_profile.loc[network_profile["TOTAL_DEMAND"].idxmax(), "HORA"]),
        "networkPeakDemand": clean_number(network_profile["TOTAL_DEMAND"].max(), 0),
        "networkProfile": [clean_number(v, 0) for v in network_profile["TOTAL_DEMAND"]],
        "topCapacity": [{
            "id": u["id"], "plaza": u["plaza"], "direction": u["direction"], "lot": u["lot"],
            "booths": u["summary"]["basePhysical"], "robust": u["summary"]["robustPhysical"],
        } for u in top_capacity],
        "topDemand": [{
            "id": u["id"], "plaza": u["plaza"], "direction": u["direction"], "lot": u["lot"],
            "peakDemand": u["summary"]["peakDemand"], "hour": u["summary"]["peakHour"],
        } for u in top_demand],
    }
    return {
        "generatedFrom": str(source),
        "method": {
            "queue": "M/G/c · aproximação Allen–Cunneen com Erlang C",
            "base": "demanda média horária de 2025, serviço-base, utilização máxima de 85%",
            "robust": "+20% de demanda e +20% no tempo de atendimento",
            "sla": "espera média máxima de 10 s em TAG e 30 s em pagamento manual",
        },
        "macro": macro,
        "units": units,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    payload = build(args.source)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(payload, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(payload['units'])} unidades gravadas em {args.output}")


if __name__ == "__main__":
    main()
