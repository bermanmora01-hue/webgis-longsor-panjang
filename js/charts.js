// js/charts.js — VERSI FINAL FIX
// Perbaikan: ID canvas disamakan dengan index.html (donutChart, barChart)

function initCharts() {

    // ── DONUT CHART: Distribusi Luas Kerentanan ─────────────
    const ctxDonut = document.getElementById('donutChart');
    if (ctxDonut && typeof ZONE_DATA !== 'undefined') {
        new Chart(ctxDonut, {
            type: 'doughnut',
            data: {
                labels: ZONE_DATA.map(d => d.label + ' (' + d.pct + '%)'),
                datasets: [{
                    data: ZONE_DATA.map(d => d.luas),
                    backgroundColor: ZONE_DATA.map(d => d.color),
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const d = ZONE_DATA[ctx.dataIndex];
                                return [' Luas: ' + d.luas + ' km²', ' Persentase: ' + d.pct + '%', ' Prob. MaxEnt: ' + d.prob];
                            }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // ── BAR CHART: Kontribusi Parameter MaxEnt ─────────────
    const ctxBar = document.getElementById('barChart');
    if (ctxBar && typeof PARAM_DATA !== 'undefined') {
        const labels = PARAM_DATA.labels;
        const contrib = PARAM_DATA.percent_contribution;
        const perm    = PARAM_DATA.permutation_importance;

        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Percent Contribution (%)',
                        data: contrib,
                        backgroundColor: [
                            '#E24B4A','#E24B4A','#EF9F27',
                            '#EF9F27','#888780','#888780'
                        ],
                        borderRadius: 4,
                        barThickness: 16,  // lebih tipis agar tidak terlalu panjang
                        maxBarThickness: 20
                    },
                    {
                        label: 'Permutation Importance (%)',
                        data: perm,
                        backgroundColor: 'rgba(29,158,117,0.45)',
                        borderRadius: 4,
                        barThickness: 16,
                        maxBarThickness: 20
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,  // penting: ikuti tinggi container CSS
                layout: { padding: { top: 4, bottom: 4 } },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { usePointStyle: true, font: { size: 11 }, padding: 12 }
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ' ' + ctx.dataset.label + ': ' + ctx.raw + '%'
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true, max: 50,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { callback: val => val + '%', font: { size: 10 } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    }
                }
            }
        });
    }
}
