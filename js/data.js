// js/data.js — VERSI FINAL DENGAN PANDUAN KOORDINAT MANUAL
// ============================================================
// WebGIS Zonasi Kerentanan Longsor — Kec. Panjang, Bandar Lampung
// Capstone Design · Teknik Geologi ITERA · 2026
// ============================================================

// ╔══════════════════════════════════════════════════════════╗
// ║  PANDUAN MENGISI KOORDINAT KELURAHAN (POLYGON)          ║
// ║                                                          ║
// ║  Cara mendapatkan koordinat nyata dari QGIS:            ║
// ║  1. Buka layer shapefile kelurahan di QGIS              ║
// ║  2. Klik kanan layer → Export → Save Features As        ║
// ║  3. Format: GeoJSON, CRS: EPSG:4326 (WGS 84)           ║
// ║  4. Buka file .geojson, copy array "coordinates"        ║
// ║  5. Setiap polygon = array [[lon,lat],[lon,lat],...]    ║
// ║                                                          ║
// ║  Format koordinat: [longitude, latitude]                ║
// ║  Longitude Kec. Panjang: ~105.28 – 105.38               ║
// ║  Latitude Kec. Panjang:  ~-5.39 – -5.47                 ║
// ║                                                          ║
// ║  Cara cepat dari Google Maps:                           ║
// ║  Klik kanan titik sudut kelurahan → "What's here?"      ║
// ║  Format: lat, lon (TUKAR urutannya jadi lon, lat)       ║
// ╚══════════════════════════════════════════════════════════╝

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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN PIDADA
    // Format: [longitude, latitude] — ambil dari QGIS atau Google Maps
    // Contoh titik sudut: [105.295, -5.408] = lon 105.295°, lat -5.408°
    coordinates: [
      [105.295, -5.408], // ← TITIK 1: sudut barat laut Pidada
      [105.310, -5.408], // ← TITIK 2: sudut timur laut Pidada
      [105.312, -5.418], // ← TITIK 3: lanjut searah jarum jam
      [105.308, -5.425], // ← TITIK 4:
      [105.297, -5.423], // ← TITIK 5:
      [105.290, -5.416], // ← TITIK 6:
      [105.295, -5.408]  // ← TITIK TERAKHIR: sama dengan titik 1 (menutup polygon)
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN PANJANG UTARA
    coordinates: [
      [105.310, -5.408], // ← TITIK 1
      [105.328, -5.405], // ← TITIK 2
      [105.332, -5.416], // ← TITIK 3
      [105.325, -5.426], // ← TITIK 4
      [105.312, -5.425], // ← TITIK 5
      [105.310, -5.408]  // ← TITIK TERAKHIR (tutup polygon)
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN KARANG MARITIM
    coordinates: [
      [105.328, -5.405], // ← TITIK 1
      [105.348, -5.402], // ← TITIK 2
      [105.352, -5.414], // ← TITIK 3
      [105.345, -5.423], // ← TITIK 4
      [105.332, -5.416], // ← TITIK 5
      [105.328, -5.405]  // ← TITIK TERAKHIR
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN PANJANG SELATAN
    coordinates: [
      [105.290, -5.423], // ← TITIK 1
      [105.308, -5.425], // ← TITIK 2
      [105.312, -5.435], // ← TITIK 3
      [105.305, -5.445], // ← TITIK 4
      [105.290, -5.440], // ← TITIK 5
      [105.285, -5.430], // ← TITIK 6
      [105.290, -5.423]  // ← TITIK TERAKHIR
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN WAY LUNIK
    coordinates: [
      [105.268, -5.430], // ← TITIK 1
      [105.285, -5.425], // ← TITIK 2
      [105.290, -5.440], // ← TITIK 3
      [105.285, -5.452], // ← TITIK 4
      [105.270, -5.450], // ← TITIK 5
      [105.262, -5.440], // ← TITIK 6
      [105.268, -5.430]  // ← TITIK TERAKHIR
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN KETAPANG
    coordinates: [
      [105.312, -5.435], // ← TITIK 1
      [105.345, -5.430], // ← TITIK 2
      [105.352, -5.445], // ← TITIK 3
      [105.340, -5.460], // ← TITIK 4
      [105.320, -5.458], // ← TITIK 5
      [105.312, -5.435]  // ← TITIK TERAKHIR
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN SRENGSEM
    coordinates: [
      [105.250, -5.445], // ← TITIK 1
      [105.270, -5.440], // ← TITIK 2
      [105.285, -5.452], // ← TITIK 3
      [105.280, -5.470], // ← TITIK 4
      [105.260, -5.472], // ← TITIK 5
      [105.248, -5.458], // ← TITIK 6
      [105.250, -5.445]  // ← TITIK TERAKHIR
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
    // ▼ GANTI KOORDINAT DI BAWAH INI DENGAN KOORDINAT NYATA KELURAHAN KETAPANG KUALA
    coordinates: [
      [105.340, -5.460], // ← TITIK 1
      [105.368, -5.455], // ← TITIK 2
      [105.375, -5.470], // ← TITIK 3
      [105.360, -5.480], // ← TITIK 4
      [105.340, -5.478], // ← TITIK 5
      [105.340, -5.460]  // ← TITIK TERAKHIR
    ]
  }
];

// ============================================================
// TITIK KEJADIAN LONGSOR (34 titik)
// ============================================================
// ╔══════════════════════════════════════════════════════════╗
// ║  PANDUAN MENGISI KOORDINAT TITIK LONGSOR               ║
// ║                                                          ║
// ║  Format setiap titik:                                    ║
// ║  { lon: 105.XXX, lat: -5.XXX, type: "train", id: N }   ║
// ║                                                          ║
// ║  type: "train" = data latih (75% = 26 titik)            ║
// ║  type: "test"  = data uji  (25% =  8 titik)             ║
// ║                                                          ║
// ║  Koordinat dari QGIS:                                    ║
// ║  Layer titik longsor → Attribute Table                   ║
// ║  Kolom X (longitude) dan Y (latitude)                    ║
// ║  Jika dalam UTM Zone 48S: Convert dulu ke WGS84         ║
// ║  QGIS: Processing → Reproject Layer → EPSG:4326         ║
// ╚══════════════════════════════════════════════════════════╝
const LANDSLIDE_POINTS = [
  // ─── DATA TRAINING (75%) — 26 titik ─────────────────────
  // ▼ GANTI lon dan lat setiap titik dengan koordinat nyata dari QGIS
  { lon: 105.318, lat: -5.414, type: "train", id: 1  }, // ← GANTI koordinat nyata titik 1
  { lon: 105.316, lat: -5.431, type: "train", id: 2  }, // ← GANTI
  { lon: 105.314, lat: -5.411, type: "train", id: 3  }, // ← GANTI
  { lon: 105.308, lat: -5.406, type: "train", id: 4  }, // ← GANTI
  { lon: 105.316, lat: -5.407, type: "train", id: 5  }, // ← GANTI
  { lon: 105.312, lat: -5.407, type: "train", id: 6  }, // ← GANTI
  { lon: 105.314, lat: -5.404, type: "train", id: 7  }, // ← GANTI
  { lon: 105.316, lat: -5.431, type: "train", id: 8  }, // ← GANTI
  { lon: 105.312, lat: -5.401, type: "train", id: 9  }, // ← GANTI
  { lon: 105.308, lat: -5.406, type: "train", id: 10 }, // ← GANTI
  { lon: 105.304, lat: -5.402, type: "train", id: 11 }, // ← GANTI
  { lon: 105.318, lat: -5.412, type: "train", id: 12 }, // ← GANTI
  { lon: 105.326, lat: -5.431, type: "train", id: 13 }, // ← GANTI
  { lon: 105.318, lat: -5.428, type: "train", id: 14 }, // ← GANTI
  { lon: 105.308, lat: -5.406, type: "train", id: 15 }, // ← GANTI
  { lon: 105.308, lat: -5.406, type: "train", id: 16 }, // ← GANTI
  { lon: 105.310, lat: -5.411, type: "train", id: 17 }, // ← GANTI
  { lon: 105.316, lat: -5.431, type: "train", id: 18 }, // ← GANTI
  { lon: 105.328, lat: -5.434, type: "train", id: 19 }, // ← GANTI
  { lon: 105.318, lat: -5.430, type: "train", id: 20 }, // ← GANTI
  { lon: 105.304, lat: -5.402, type: "train", id: 21 }, // ← GANTI
  { lon: 105.315, lat: -5.413, type: "train", id: 22 }, // ← GANTI
  { lon: 105.312, lat: -5.422, type: "train", id: 23 }, // ← GANTI
  { lon: 105.322, lat: -5.426, type: "train", id: 24 }, // ← GANTI
  { lon: 105.317, lat: -5.427, type: "train", id: 25 }, // ← GANTI
  { lon: 105.315, lat: -5.420, type: "train", id: 26 }, // ← GANTI
  // ─── DATA TEST (25%) — 8 titik ───────────────────────────
  { lon: 105.326, lat: -5.431, type: "test", id: 27 }, // ← GANTI
  { lon: 105.288, lat: -5.385, type: "test", id: 28 }, // ← GANTI
  { lon: 105.322, lat: -5.426, type: "test", id: 29 }, // ← GANTI
  { lon: 105.326, lat: -5.431, type: "test", id: 30 }, // ← GANTI
  { lon: 105.316, lat: -5.431, type: "test", id: 31 }, // ← GANTI
  { lon: 105.310, lat: -5.412, type: "test", id: 32 }, // ← GANTI
  { lon: 105.328, lat: -5.434, type: "test", id: 33 }, // ← GANTI
  { lon: 105.328, lat: -5.434, type: "test", id: 34 }  // ← GANTI
];

// ============================================================
// DATA KONTRIBUSI PARAMETER MaxEnt
// ============================================================
const PARAM_DATA = {
  labels: ["Kemiringan Lereng", "Jarak dari Sungai", "Jarak dari Kelurusan",
           "Jarak dari Sesar", "Litologi", "Tutupan Lahan"],
  percent_contribution: [42.3, 31.9, 19.1, 6.8, 0, 0],
  permutation_importance: [23.8, 16.8, 11.7, 33.3, 10.2, 4.2]
};

// ============================================================
// DATA ZONA KERENTANAN (donut chart & tabel)
// ============================================================
const ZONE_DATA = [
  { label: "Sangat Rendah", color: "#888780", pct: 46.76, luas: 6.17, prob: "0.00–0.25" },
  { label: "Rendah",        color: "#378ADD", pct: 26.74, luas: 3.53, prob: "0.25–0.50" },
  { label: "Menengah",      color: "#EF9F27", pct: 16.60, luas: 2.19, prob: "0.50–0.75" },
  { label: "Tinggi",        color: "#E24B4A", pct:  9.90, luas: 1.31, prob: "0.75–1.00" }
];

// ============================================================
// DATA INFO PANEL 3D
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

// ============================================================
// KONFIGURASI PETA — PUSAT & ZOOM AWAL
// ============================================================
// ▼ Sesuaikan koordinat pusat jika perlu
// Titik tengah Kecamatan Panjang (Bandar Lampung)
const MAP_CENTER = [-5.425, 105.310]; // [latitude, longitude]
const MAP_ZOOM   = 13;
