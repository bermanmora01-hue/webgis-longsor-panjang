# WebGIS Zonasi Kerentanan Longsor — Kecamatan Panjang, Bandar Lampung

Prototipe WebGIS berbasis algoritma Maximum Entropy (MaxEnt) dan Model 3D.  
Capstone Design · Program Studi Teknik Geologi · ITERA 2026

## Tim Pengembang
- Gebi Santaria Nainggolan (123150009)
- Berman Sandy Mora (123150066)  
- Syahrani Revina Putri Latief (123150105)

**Dosen Pembimbing:** Bilal Al Farishi, B.Sc(Hons)., M.Sc

## Struktur Folder
```
webgis/
├── index.html          ← Halaman utama (single-page)
├── css/
│   └── style.css       ← Semua styling
├── js/
│   ├── data.js         ← Data penelitian (kelurahan, titik longsor, zona)
│   ├── map2d.js        ← Peta Leaflet interaktif
│   ├── map3d.js        ← Model 3D Three.js
│   ├── charts.js       ← Chart.js (donut + bar chart)
│   └── main.js         ← Kontrol utama, animasi, tooltip
├── assets/             ← Foto lapangan, logo ITERA (tambahkan manual)
├── vercel.json         ← Konfigurasi deploy Vercel
└── README.md
```

## Cara Deploy ke Vercel
1. Push folder ini ke GitHub
2. Login ke vercel.com → New Project → Import dari GitHub
3. Tidak ada build command, Output Directory: ./  (root)
4. Deploy → dapat URL publik

## Cara Menambahkan Foto
Simpan foto di folder `assets/` lalu ganti placeholder di index.html:
```html
<!-- Sebelum: -->
<div class="photo-placeholder">...</div>

<!-- Sesudah: -->
<img src="assets/foto-survei.jpg" alt="Survei lapangan" class="gallery-img"/>
```
