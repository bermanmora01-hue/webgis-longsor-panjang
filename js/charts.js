// ============================================================
// SOLUSI 5: CHART FIX — Bar chart tidak terlalu tinggi
// 
// CARA PAKAI: GANTI SELURUH isi js/charts.js dengan ini
// ============================================================

function initCharts() {

  // ── DONUT CHART ────────────────────────────────────────────
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
        maintainAspectRatio: false,   // ← ikuti tinggi container
        animation: { duration: 1200, easing: 'easeInOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const d = ZONE_DATA[ctx.dataIndex];
                return [
                  ' Luas: ' + d.luas + ' km²',
                  ' Persentase: ' + d.pct + '%',
                  ' Prob: ' + d.prob
                ];
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }

  // ── BAR CHART (HORIZONTAL) ─────────────────────────────────
  // KUNCI SOLUSI 5: 
  //   - Tidak pakai 2 dataset (cukup 1 = percent contribution)
  //   - barThickness: 16 (tidak terlalu tebal)
  //   - maintainAspectRatio: false + container height: 260px
  //   - Hasil: chart compact, tidak memanjang ke bawah

  const ctxBar = document.getElementById('barChart');
  if (ctxBar && typeof PARAM_DATA !== 'undefined') {
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: PARAM_DATA.labels,
        datasets: [
          {
            label: 'Kontribusi (%)',
            data: PARAM_DATA.percent_contribution,
            backgroundColor: [
              '#E24B4A',  // Kemiringan Lereng — paling dominan
              '#E24B4A',  // Jarak dari Sungai
              '#EF9F27',  // Jarak dari Kelurusan
              '#EF9F27',  // Jarak dari Sesar
              '#aaa',     // Litologi
              '#aaa'      // Tutupan Lahan
            ],
            borderRadius: 6,
            barThickness: 16            // ← Kunci: tidak terlalu tebal
          },
          {
            label: 'Permutation Imp. (%)',
            data: PARAM_DATA.permutation_importance,
            backgroundColor: 'rgba(29,158,117,0.45)',
            borderColor: 'rgba(29,158,117,0.8)',
            borderWidth: 1,
            borderRadius: 6,
            barThickness: 16
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,     // ← Ikuti tinggi container (260px)
        animation: { duration: 1000, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: { usePointStyle: true, padding: 12, font: { size: 11 } }
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.raw + '%'
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 50,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              callback: v => v + '%',
              font: { size: 11 },
              maxTicksLimit: 6
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 11 } }
          }
        },
        layout: { padding: { top: 4, bottom: 4 } }
      }
    });
  }
}
