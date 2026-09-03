"""Rebuild the Diabetes regression study and portfolio figures.

The regression trained by gradient descent is implemented directly with NumPy.
Scikit-learn is used only to load the public dataset and as the comparison model.
"""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_diabetes
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/projects/regressao-linear"
OUTPUT.mkdir(parents=True, exist_ok=True)

INK = "#08090b"
PANEL = "#14161b"
PAPER = "#f6f5f0"
PURPLE = "#a987ff"
MINT = "#6fffd2"
MUTED = "#9b9ca3"


def configure_plot() -> None:
    plt.rcParams.update(
        {
            "figure.facecolor": INK,
            "axes.facecolor": PANEL,
            "axes.edgecolor": "#34363d",
            "axes.labelcolor": PAPER,
            "axes.titlecolor": PAPER,
            "xtick.color": MUTED,
            "ytick.color": MUTED,
            "text.color": PAPER,
            "font.family": "DejaVu Sans",
            "font.size": 10,
        }
    )


def gradient_descent(
    x: np.ndarray,
    y: np.ndarray,
    learning_rate: float = 0.1,
    tolerance: float = 1e-6,
    max_epochs: int = 1_000_000,
    sample_every: int = 100,
) -> tuple[np.ndarray, float, int, float, np.ndarray, np.ndarray]:
    """Fit ordinary least squares using only the gradient equations."""
    n = len(x)
    weights = np.zeros(x.shape[1], dtype=float)
    intercept = 0.0
    epochs: list[int] = []
    costs: list[float] = []

    for epoch in range(max_epochs):
        prediction = x @ weights + intercept
        error = prediction - y
        cost = float((error @ error) / (2 * n))
        gradient_w = x.T @ error / n
        gradient_b = float(error.mean())
        gradient_norm = float(np.sqrt(gradient_w @ gradient_w + gradient_b**2))

        if epoch % sample_every == 0 or gradient_norm < tolerance:
            epochs.append(epoch)
            costs.append(cost)
        if gradient_norm < tolerance:
            break

        weights -= learning_rate * gradient_w
        intercept -= learning_rate * gradient_b

    return weights, intercept, epoch, gradient_norm, np.asarray(epochs), np.asarray(costs)


def save_figure(fig: plt.Figure, filename: str) -> None:
    fig.savefig(OUTPUT / filename, dpi=180, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close(fig)


def main() -> None:
    configure_plot()
    dataset = load_diabetes()
    x_all = dataset.data
    y_all = dataset.target
    names = list(dataset.feature_names)
    split = int(len(x_all) * 0.8)

    selected_names = ["bmi", "bp", "s5"]
    selected_indices = [names.index(name) for name in selected_names]
    x_selected = x_all[:, selected_indices]
    x_train, x_test = x_selected[:split], x_selected[split:]
    y_train, y_test = y_all[:split], y_all[split:]

    manual_w, manual_b, manual_epochs, manual_grad, epochs_3, costs_3 = gradient_descent(
        x_train, y_train
    )
    manual_prediction = x_test @ manual_w + manual_b

    benchmark = LinearRegression().fit(x_train, y_train)
    benchmark_prediction = benchmark.predict(x_test)

    x_train_all = x_all[:split]
    all_w, all_b, all_epochs, all_grad, epochs_10, costs_10 = gradient_descent(
        x_train_all, y_train
    )
    all_prediction = x_all[split:] @ all_w + all_b

    hessian = x_train_all.T @ x_train_all / len(x_train_all)
    eigenvalues = np.linalg.eigvalsh(hessian)
    condition_number = float(eigenvalues.max() / eigenvalues.min())
    correlation = np.corrcoef(x_train_all, rowvar=False)
    s1_s2_correlation = float(correlation[names.index("s1"), names.index("s2")])

    # Distributions for the three-variable experiment and target.
    fig, axes = plt.subplots(2, 2, figsize=(12, 8))
    fig.subplots_adjust(hspace=0.35, wspace=0.24)
    series = [(x_all[:, i], n) for i, n in zip(selected_indices, selected_names)] + [(y_all, "target")]
    labels = {"bmi": "IMC padronizado", "bp": "Pressão arterial", "s5": "Triglicerídeos (log)", "target": "Progressão da doença"}
    for ax, (values, name) in zip(axes.flat, series):
        ax.hist(values, bins=22, color=PURPLE if name != "target" else MINT, alpha=0.92, edgecolor=INK)
        ax.set_title(labels[name], loc="left", fontweight="bold")
        ax.grid(axis="y", color="white", alpha=0.07)
    fig.suptitle("Distribuições do experimento com 3 features", fontsize=18, fontweight="bold", x=0.07, ha="left")
    save_figure(fig, "distribuicoes.png")

    # Relationship between each selected feature and the target.
    fig, axes = plt.subplots(1, 3, figsize=(14, 4.6), sharey=True)
    for ax, idx, name in zip(axes, selected_indices, selected_names):
        values = x_all[:, idx]
        ax.scatter(values, y_all, s=17, alpha=0.55, color=PURPLE, edgecolors="none")
        slope, intercept = np.polyfit(values, y_all, 1)
        line_x = np.linspace(values.min(), values.max(), 100)
        ax.plot(line_x, slope * line_x + intercept, color=MINT, linewidth=2.4)
        ax.set_xlabel(labels[name])
        ax.grid(color="white", alpha=0.07)
    axes[0].set_ylabel("Target")
    fig.suptitle("Relação das features com o target", fontsize=18, fontweight="bold", x=0.07, ha="left")
    save_figure(fig, "features-target.png")

    # Correlation matrix for all ten features.
    fig, ax = plt.subplots(figsize=(9, 8))
    image = ax.imshow(correlation, cmap="coolwarm", vmin=-1, vmax=1)
    ax.set_xticks(range(len(names)), names, rotation=45, ha="right")
    ax.set_yticks(range(len(names)), names)
    for i in range(len(names)):
        for j in range(len(names)):
            value = correlation[i, j]
            ax.text(j, i, f"{value:.2f}", ha="center", va="center", fontsize=7, color="white" if abs(value) > 0.45 else "#c7c8cc")
    ax.add_patch(plt.Rectangle((4.5, 3.5), 1, 1, fill=False, edgecolor=MINT, linewidth=3))
    fig.colorbar(image, ax=ax, shrink=0.78, label="Correlação de Pearson")
    ax.set_title("Correlação entre as 10 features", loc="left", fontsize=18, fontweight="bold", pad=18)
    save_figure(fig, "correlacao.png")

    # Cost histories: same learning rate, very different convergence behavior.
    optimum_3 = LinearRegression().fit(x_train, y_train).predict(x_train)
    optimum_10_model = LinearRegression().fit(x_train_all, y_train)
    optimum_10 = optimum_10_model.predict(x_train_all)
    cost_min_3 = float(np.mean((optimum_3 - y_train) ** 2) / 2)
    cost_min_10 = float(np.mean((optimum_10 - y_train) ** 2) / 2)
    gap_3 = np.maximum(costs_3 - cost_min_3, 1e-12)
    gap_10 = np.maximum(costs_10 - cost_min_10, 1e-12)

    fig, axes = plt.subplots(1, 2, figsize=(14, 5.8))
    axes[0].plot(epochs_3 + 1, costs_3, color=MINT, linewidth=2.4, label="3 features")
    axes[0].plot(epochs_10 + 1, costs_10, color=PURPLE, linewidth=2.1, label="10 features")
    axes[0].set_xscale("log")
    axes[0].set_xlabel("Épocas (escala log)")
    axes[0].set_ylabel("Custo J(w, b)")
    axes[0].set_title("Custo observado", loc="left", fontweight="bold")
    axes[0].grid(color="white", alpha=0.08)
    axes[0].legend(frameon=False, labelcolor=PAPER)

    axes[1].plot(epochs_3 + 1, gap_3, color=MINT, linewidth=2.4, label="3 features")
    axes[1].plot(epochs_10 + 1, gap_10, color=PURPLE, linewidth=2.1, label="10 features")
    axes[1].set_xscale("log")
    axes[1].set_yscale("log")
    axes[1].set_xlabel("Épocas (escala log)")
    axes[1].set_ylabel("Custo - custo mínimo")
    axes[1].set_title("Distância até o ótimo", loc="left", fontweight="bold")
    axes[1].grid(color="white", alpha=0.08)
    axes[1].text(0.98, 0.07, "learning rate = 0,1", transform=axes[1].transAxes, ha="right", color=MUTED)
    fig.suptitle("Convergência do Gradiente Descendente", fontsize=20, fontweight="bold", x=0.07, ha="left")
    save_figure(fig, "convergencia.png")

    # Manual versus scikit-learn: predictions and metrics.
    manual_mse = float(mean_squared_error(y_test, manual_prediction))
    manual_mae = float(mean_absolute_error(y_test, manual_prediction))
    sklearn_mse = float(mean_squared_error(y_test, benchmark_prediction))
    sklearn_mae = float(mean_absolute_error(y_test, benchmark_prediction))

    assert abs(manual_mse - sklearn_mse) < 1e-3
    assert abs(manual_mae - sklearn_mae) < 1e-3
    assert 535 < condition_number < 537
    assert 0.89 < s1_s2_correlation < 0.91

    fig, axes = plt.subplots(1, 2, figsize=(13, 5.6))
    axes[0].scatter(y_test, manual_prediction, s=30, alpha=0.72, color=MINT, label="Manual")
    axes[0].scatter(y_test, benchmark_prediction, s=12, alpha=0.9, color=PURPLE, label="scikit-learn")
    limits = [min(y_test.min(), manual_prediction.min()) - 8, max(y_test.max(), manual_prediction.max()) + 8]
    axes[0].plot(limits, limits, color="white", alpha=0.35, linestyle="--")
    axes[0].set(xlabel="Valor observado", ylabel="Valor previsto", xlim=limits, ylim=limits)
    axes[0].set_title("Previsões no conjunto de teste", loc="left", fontweight="bold")
    axes[0].grid(color="white", alpha=0.07)
    axes[0].legend(frameon=False, labelcolor=PAPER)

    metric_labels = ["MSE", "MAE"]
    x_positions = np.arange(2)
    width = 0.34
    axes[1].bar(x_positions - width / 2, [manual_mse, manual_mae], width, color=MINT, label="Manual")
    axes[1].bar(x_positions + width / 2, [sklearn_mse, sklearn_mae], width, color=PURPLE, label="scikit-learn")
    axes[1].set_xticks(x_positions, metric_labels)
    axes[1].set_title("Erros praticamente idênticos", loc="left", fontweight="bold")
    axes[1].set_yscale("log")
    axes[1].grid(axis="y", color="white", alpha=0.07)
    axes[1].legend(frameon=False, labelcolor=PAPER)
    for idx, value in enumerate([manual_mse, manual_mae]):
        axes[1].text(idx - width / 2, value * 1.08, f"{value:.2f}", ha="center", color=MINT, fontsize=9)
    for idx, value in enumerate([sklearn_mse, sklearn_mae]):
        axes[1].text(idx + width / 2, value * 1.08, f"{value:.2f}", ha="center", color=PURPLE, fontsize=9)
    fig.suptitle("Implementação manual × biblioteca", fontsize=20, fontweight="bold", x=0.07, ha="left")
    save_figure(fig, "comparacao.png")

    # Hessian spectrum illustrates the poorly conditioned geometry.
    fig, ax = plt.subplots(figsize=(11, 5.8))
    order = np.arange(1, len(eigenvalues) + 1)
    ax.bar(order, eigenvalues, color=[PURPLE] * 9 + [MINT])
    ax.set_yscale("log")
    ax.set_xticks(order)
    ax.set_xlabel("Autovalor ordenado")
    ax.set_ylabel("Magnitude (escala log)")
    ax.set_title("Espectro da Hessiana aproximada XᵀX / N", loc="left", fontsize=18, fontweight="bold")
    ax.grid(axis="y", color="white", alpha=0.08)
    ax.text(0.96, 0.88, f"κ ≈ {condition_number:.0f}", transform=ax.transAxes, ha="right", color=MINT, fontsize=24, fontweight="bold", bbox={"facecolor": INK, "edgecolor": "none", "pad": 6, "alpha": 0.9})
    save_figure(fig, "autovalores.png")

    # Wide card cover derived from the actual three-feature cost history.
    fig, ax = plt.subplots(figsize=(12, 6.8))
    ax.plot(epochs_3 + 1, costs_3, color=MINT, linewidth=3)
    ax.fill_between(epochs_3 + 1, costs_3, costs_3.max(), color=PURPLE, alpha=0.14)
    ax.set_xscale("log")
    ax.grid(color="white", alpha=0.08)
    ax.set_xlabel("ÉPOCAS · ESCALA LOG")
    ax.set_ylabel("FUNÇÃO DE CUSTO")
    ax.set_title("REGRESSÃO LINEAR DO ZERO", loc="left", fontsize=22, fontweight="bold", pad=18)
    ax.text(0.99, 0.92, "GRADIENT DESCENT", transform=ax.transAxes, ha="right", color=PURPLE, fontweight="bold")
    save_figure(fig, "capa-regressao-linear.png")

    results = {
        "dataset": {"samples": len(x_all), "features": len(names), "train": split, "test": len(x_all) - split},
        "selected_features": selected_names,
        "learning_rate": 0.1,
        "manual": {
            "epochs": manual_epochs,
            "gradient_norm": manual_grad,
            "weights": manual_w.tolist(),
            "intercept": manual_b,
            "mse": manual_mse,
            "mae": manual_mae,
        },
        "sklearn": {
            "weights": benchmark.coef_.tolist(),
            "intercept": float(benchmark.intercept_),
            "mse": sklearn_mse,
            "mae": sklearn_mae,
        },
        "all_features_gradient_descent": {
            "epochs": all_epochs,
            "gradient_norm": all_grad,
            "mse": float(mean_squared_error(y_test, all_prediction)),
            "mae": float(mean_absolute_error(y_test, all_prediction)),
        },
        "s1_s2_correlation": s1_s2_correlation,
        "hessian_eigenvalues": eigenvalues.tolist(),
        "condition_number": condition_number,
    }
    (OUTPUT / "analysis.json").write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")

    print(json.dumps(results, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
