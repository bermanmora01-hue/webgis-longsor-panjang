// js/data.js
// ============================================================
// DATA PENELITIAN — WebGIS Kerentanan Longsor Kec. Panjang
// Capstone Design Teknik Geologi ITERA 2026
// ============================================================
// KETERANGAN: File ini berisi data GeoJSON kelurahan dan titik longsor.
// Koordinat kelurahan di bawah adalah REPRESENTATIF (mendekati nyata).
// Untuk akurasi penuh, GANTI dengan GeoJSON hasil ekspor QGIS Anda:
//   1. Buka QGIS → Layer kerentanan longsor
//   2. Klik kanan layer → Export → Save Features As
//   3. Format: GeoJSON, CRS: EPSG:4326 (WGS 84)
//   4. Simpan sebagai data/kelurahan-kerentanan.geojson
//   5. Load via: fetch('data/kelurahan-kerentanan.geojson').then(r=>r.json())
// ============================================================

const KELURAHAN_DATA = [
  {
    id: "pidada",
    nama: "Kelurahan Pidada",
    kelas: "Tinggi",
    prob_min: 0.78,
    prob_max: 0.95,
    prob_avg: 0.86,
    luas_ha: 48.2,
    faktor_dominan: "Kemiringan Lereng (42.3%), Jarak dari Sungai (31.9%)",
    rekomendasi: "Hentikan IMB baru, pasang EWS, bangun dinding penahan tanah di kaki lereng",
    color: "#E24B4A",
    coordinates: [
      // KETERANGAN: Polygon representatif Kelurahan Pidada
      // Ganti dengan koordinat GeoJSON nyata dari QGIS
      [105.295, -5.408], [105.310, -5.408], [105.312, -5.418],
      [105.308, -5.425], [105.297, -5.423], [105.290, -5.416],
      [105.295, -5.408]
    ]
  },
  {
    id: "panjang-utara",
    nama: "Kelurahan Panjang Utara",
    kelas: "Tinggi",
    prob_min: 0.75,
    prob_max: 0.92,
    prob_avg: 0.83,
    luas_ha: 52.7,
    faktor_dominan: "Kemiringan Lereng, Sesar Lampung-Panjang",
    rekomendasi: "Terasering lereng, vegetasi bioengineering, pembatasan alih fungsi lahan",
    color: "#E24B4A",
    coordinates: [
      [105.310, -5.408], [105.328, -5.405], [105.332, -5.416],
      [105.325, -5.426], [105.312, -5.425], [105.310, -5.408]
    ]
  },
  {
    id: "karang-maritim",
    nama: "Kelurahan Karang Maritim",
    kelas: "Tinggi",
    prob_min: 0.76,
    prob_max: 0.90,
    prob_avg: 0.82,
    luas_ha: 44.3,
    faktor_dominan: "Kemiringan Lereng, Jarak dari Kelurusan",
    rekomendasi: "Drainase lereng permukaan dan bawah permukaan, pantau retakan tanah",
    color: "#E24B4A",
    coordinates: [
      [105.328, -5.405], [105.348, -5.402], [105.352, -5.414],
      [105.345, -5.423], [105.332, -5.416], [105.328, -5.405]
    ]
  },
  {
    id: "panjang-selatan",
    nama: "Kelurahan Panjang Selatan",
    kelas: "Menengah",
    prob_min: 0.52,
    prob_max: 0.74,
    prob_avg: 0.63,
    luas_ha: 68.9,
    faktor_dominan: "Jarak dari Sungai, Tutupan Lahan",
    rekomendasi: "Kajian geoteknik mikro sebelum membangun, tanam vegetasi akar wangi",
    color: "#EF9F27",
    coordinates: [
      [105.290, -5.423], [105.308, -5.425], [105.312, -5.435],
      [105.305, -5.445], [105.290, -5.440], [105.285, -5.430],
      [105.290, -5.423]
    ]
  },
  {
    id: "way-lunik",
    nama: "Kelurahan Way Lunik",
    kelas: "Menengah",
    prob_min: 0.50,
    prob_max: 0.73,
    prob_avg: 0.61,
    luas_ha: 71.4,
    faktor_dominan: "Litologi Tuf Formasi Tarahan, Kemiringan Lereng",
    rekomendasi: "Pembatasan alih fungsi lahan bukit, pemantauan visual berkala",
    color: "#EF9F27",
    coordinates: [
      [105.268, -5.430], [105.285, -5.425], [105.290, -5.440],
      [105.285, -5.452], [105.270, -5.450], [105.262, -5.440],
      [105.268, -5.430]
    ]
  },
  {
    id: "ketapang",
    nama: "Kelurahan Ketapang",
    kelas: "Rendah",
    prob_min: 0.26,
    prob_max: 0.49,
    prob_avg: 0.38,
    luas_ha: 89.5,
    faktor_dominan: "Morfologi Landai, Jarak dari Sungai",
    rekomendasi: "Jaga tutupan vegetasi, waspada saat curah hujan >50mm/hari",
    color: "#378ADD",
    coordinates: [
      [105.312, -5.435], [105.345, -5.430], [105.352, -5.445],
      [105.340, -5.460], [105.320, -5.458], [105.312, -5.435]
    ]
  },
  {
    id: "srengsem",
    nama: "Kelurahan Srengsem",
    kelas: "Sangat Rendah",
    prob_min: 0.02,
    prob_max: 0.24,
    prob_avg: 0.12,
    luas_ha: 134.8,
    faktor_dominan: "Dataran Aluvial Pesisir, Morfologi Datar",
    rekomendasi: "Potensi banjir lebih signifikan, pantau drainase permukaan",
    color: "#888780",
    coordinates: [
      [105.250, -5.445], [105.270, -5.440], [105.285, -5.452],
      [105.280, -5.470], [105.260, -5.472], [105.248, -5.458],
      [105.250, -5.445]
    ]
  },
  {
    id: "ketapang-kuala",
    nama: "Kelurahan Ketapang Kuala",
    kelas: "Sangat Rendah",
    prob_min: 0.01,
    prob_max: 0.22,
    prob_avg: 0.10,
    luas_ha: 118.6,
    faktor_dominan: "Dataran Pantai, Endapan Aluvial Muda",
    rekomendasi: "Pantau abrasi pesisir, pertahankan vegetasi mangrove",
    color: "#888780",
    coordinates: [
      [105.340, -5.460], [105.368, -5.455], [105.375, -5.470],
      [105.360, -5.480], [105.340, -5.478], [105.340, -5.460]
    ]
  }
];

// ============================================================
// TITIK KEJADIAN LONGSOR (34 titik dari survei lapangan + BNPB)
// KETERANGAN: Koordinat berikut adalah titik nyata hasil survei.
// Format: [longitude, latitude] (WGS 84 / EPSG:4326)
// Konversi dari UTM Zone 48S yang ada di laporan
// ============================================================
const LANDSLIDE_POINTS = [
  // Data training (75%) — 26 titik
  { lon: 105.318, lat: -5.414, type: "train", id: 1 },
  { lon: 105.316, lat: -5.431, type: "train", id: 2 },
  { lon: 105.314, lat: -5.411, type: "train", id: 3 },
  { lon: 105.308, lat: -5.406, type: "train", id: 4 },
  { lon: 105.316, lat: -5.407, type: "train", id: 5 },
  { lon: 105.312, lat: -5.407, type: "train", id: 6 },
  { lon: 105.314, lat: -5.404, type: "train", id: 7 },
  { lon: 105.316, lat: -5.431, type: "train", id: 8 },
  { lon: 105.312, lat: -5.401, type: "train", id: 9 },
  { lon: 105.308, lat: -5.406, type: "train", id: 10 },
  { lon: 105.304, lat: -5.402, type: "train", id: 11 },
  { lon: 105.318, lat: -5.412, type: "train", id: 12 },
  { lon: 105.326, lat: -5.431, type: "train", id: 13 },
  { lon: 105.318, lat: -5.428, type: "train", id: 14 },
  { lon: 105.308, lat: -5.406, type: "train", id: 15 },
  { lon: 105.308, lat: -5.406, type: "train", id: 16 },
  { lon: 105.310, lat: -5.411, type: "train", id: 17 },
  { lon: 105.316, lat: -5.431, type: "train", id: 18 },
  { lon: 105.328, lat: -5.434, type: "train", id: 19 },
  { lon: 105.318, lat: -5.430, type: "train", id: 20 },
  { lon: 105.304, lat: -5.402, type: "train", id: 21 },
  { lon: 105.315, lat: -5.413, type: "train", id: 22 },
  { lon: 105.312, lat: -5.422, type: "train", id: 23 },
  { lon: 105.322, lat: -5.426, type: "train", id: 24 },
  { lon: 105.317, lat: -5.427, type: "train", id: 25 },
  { lon: 105.315, lat: -5.420, type: "train", id: 26 },
  // Data test (25%) — 8 titik
  { lon: 105.326, lat: -5.431, type: "test", id: 27 },
  { lon: 105.288, lat: -5.385, type: "test", id: 28 },
  { lon: 105.322, lat: -5.426, type: "test", id: 29 },
  { lon: 105.326, lat: -5.431, type: "test", id: 30 },
  { lon: 105.316, lat: -5.431, type: "test", id: 31 },
  { lon: 105.310, lat: -5.412, type: "test", id: 32 },
  { lon: 105.328, lat: -5.434, type: "test", id: 33 },
  { lon: 105.328, lat: -5.434, type: "test", id: 34 }
];

// ============================================================
// DATA KONTRIBUSI PARAMETER MaxEnt
// ============================================================
const PARAM_DATA = {
  labels: [
    "Kemiringan Lereng", "Jarak dari Sungai", "Jarak dari Kelurusan",
    "Jarak dari Sesar", "Litologi", "Tutupan Lahan"
  ],
  percent_contribution: [42.3, 31.9, 19.1, 6.8, 0, 0],
  permutation_importance: [23.8, 16.8, 11.7, 33.3, 10.2, 4.2]
};

// ============================================================
// DATA ZONA KERENTANAN (untuk donut chart & tabel)
// ============================================================
const ZONE_DATA = [
  { label: "Sangat Rendah", color: "#888780", pct: 46.76, luas: 6.17, prob: "0.00–0.25" },
  { label: "Rendah",        color: "#378ADD", pct: 26.74, luas: 3.53, prob: "0.25–0.50" },
  { label: "Menengah",      color: "#EF9F27", pct: 16.60, luas: 2.19, prob: "0.50–0.75" },
  { label: "Tinggi",        color: "#E24B4A", pct:  9.90, luas: 1.31, prob: "0.75–1.00" }
];

// ============================================================
// DATA 3D KELURAHAN UNTUK INFO PANEL
// ============================================================
const KELURAHAN_3D_INFO = {
  tinggi: {
    zone: "Zona Kerentanan Tinggi",
    color: "#E24B4A",
    areas: "Pidada · Panjang Utara · Karang Maritim",
    prob: "Probabilitas MaxEnt: 0.75–1.00",
    factors: "Kemiringan lereng curam, batuan tuf lapukan (Formasi Tarahan), dekat Sesar Lampung-Panjang",
    action: "⚠ Jangan bangun baru, pasang EWS, konsultasi ahli geologi"
  },
  menengah: {
    zone: "Zona Kerentanan Menengah",
    color: "#EF9F27",
    areas: "Panjang Selatan · Way Lunik",
    prob: "Probabilitas MaxEnt: 0.50–0.75",
    factors: "Litologi tuf, erosi sungai menengah, tutupan lahan campuran",
    action: "🔍 Kajian geoteknik sebelum membangun, tanam vegetasi akar wangi"
  },
  rendah: {
    zone: "Zona Kerentanan Rendah",
    color: "#378ADD",
    areas: "Ketapang",
    prob: "Probabilitas MaxEnt: 0.25–0.50",
    factors: "Morfologi lebih landai, tutupan vegetasi cukup baik",
    action: "ℹ Waspada hujan ekstrem, jaga tutupan vegetasi"
  },
  sangat_rendah: {
    zone: "Zona Kerentanan Sangat Rendah",
    color: "#888780",
    areas: "Srengsem · Ketapang Kuala",
    prob: "Probabilitas MaxEnt: 0.00–0.25",
    factors: "Dataran aluvial pesisir, morfologi datar, endapan muda",
    action: "✅ Relatif aman dari longsor, waspadai banjir pesisir"
  }
};
