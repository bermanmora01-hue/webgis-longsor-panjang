# PANDUAN LENGKAP PENGISIAN WEBSITE
## WebGIS Zonasi Kerentanan Longsor — Kec. Panjang, Bandar Lampung
### Capstone Design · Teknik Geologi ITERA · 2026

---

## DAFTAR ISI
1. [Struktur Folder](#struktur-folder)
2. [Foto yang Dibutuhkan](#foto-yang-dibutuhkan)
3. [Koordinat Kelurahan & Titik Longsor](#koordinat)
4. [Link Download Peta PDF](#download-pdf)
5. [Deploy ke GitHub + Vercel](#deploy)
6. [Model 3D Nyata dari QGIS](#model-3d)
7. [Checklist Final](#checklist)

---

## 1. STRUKTUR FOLDER

```
webgis/
├── index.html          ← Jangan ubah kecuali mengikuti panduan
├── css/style.css       ← Styling (jangan ubah)
├── js/
│   ├── data.js         ← ⭐ ISI INI: koordinat & data penelitian
│   ├── map2d.js        ← Peta Leaflet (jangan ubah)
│   ├── map3d.js        ← Model 3D (jangan ubah)
│   ├── charts.js       ← Grafik (jangan ubah)
│   └── main.js         ← Kontrol utama (jangan ubah)
├── assets/             ← ⭐ SIMPAN SEMUA FOTO DI SINI
├── vercel.json         ← Konfigurasi deploy (jangan ubah)
├── README.md
└── PANDUAN.md          ← File ini
```

---

## 2. FOTO YANG DIBUTUHKAN

### A. Foto Hero Background (Opsional — sangat direkomendasikan)
| File | Konten | Ukuran |
|------|--------|--------|
| `assets/foto-aerial-panjang.jpg` | Foto udara/drone Kec. Panjang dari atas, atau screenshot Google Earth Pro yang menampilkan kawasan perbukitan | ≥1920×1080px |

**Cara memasang:**
Buka `index.html`, cari `id="hero-section"`, tambahkan style:
```html
<!-- Sebelum: -->
<section id="beranda" class="hero" id="hero-section">

<!-- Sesudah: -->
<section id="beranda" class="hero" id="hero-section"
  style="background-image:url('assets/foto-aerial-panjang.jpg');background-size:cover;background-position:center">
```

---

### B. Foto Lokasi Penelitian (Section "Tentang Proyek")
| File | Konten | Ukuran |
|------|--------|--------|
| `assets/foto-lokasi.jpg` | Foto panorama perbukitan Kec. Panjang, atau screenshot peta lokasi dari QGIS | 600×400px ke atas |

**Cara memasang:**
Cari komentar `FOTO LOKASI PENELITIAN` di index.html, ganti div dengan:
```html
<img src="assets/foto-lokasi.jpg"
     alt="Lokasi penelitian Kecamatan Panjang, Bandar Lampung"
     class="rounded-img"
     style="width:100%;max-height:320px;object-fit:cover"/>
```

---

### C. Galeri Foto Lapangan (Section "Metode & Data" — 6 foto)
| File | Konten | Ukuran |
|------|--------|--------|
| `assets/foto-survei-gps.jpg` | Tim survei memegang GPS di lokasi longsor | 400×300px |
| `assets/foto-lereng.jpg` | Kondisi lereng perbukitan, tampak kemiringan | 400×300px |
| `assets/foto-batuan.jpg` | Singkapan batuan tuf/breksi di lapangan | 400×300px |
| `assets/foto-sungai.jpg` | Kondisi sungai dan erosi kaki lereng | 400×300px |
| `assets/foto-pengolahan.jpg` | Layar komputer saat pengolahan QGIS/MaxEnt | 400×300px |
| `assets/foto-diskusi.jpg` | Bimbingan dengan dosen pembimbing | 400×300px |

**Cara memasang setiap foto (contoh foto 1):**
Cari `id="photo-gps"` di index.html, ganti seluruh div dengan:
```html
<img src="assets/foto-survei-gps.jpg"
     alt="Pengambilan koordinat GPS di lokasi longsor"
     class="gallery-img" loading="lazy"/>
```
Ulangi untuk `photo-lereng`, `photo-batuan`, `photo-sungai`, `photo-pengolahan`, `photo-diskusi`.

---

### D. Logo ITERA (Section "Tim Pengembang")
| File | Konten | Ukuran |
|------|--------|--------|
| `assets/logo-itera.png` | Logo resmi ITERA (PNG transparan) | Tinggi ≥140px |

**Cara memasang:**
Cari komentar `LOGO ITERA` di index.html, ganti div dengan:
```html
<img src="assets/logo-itera.png"
     alt="Institut Teknologi Sumatera"
     style="height:70px;width:auto"/>
```

---

### E. Foto Tim (Section "Tim Pengembang" — 3 foto)
| File | Konten | Ukuran |
|------|--------|--------|
| `assets/foto-gebi.jpg` | Foto Gebi Santaria Nainggolan | 200×200px, crop wajah |
| `assets/foto-berman.jpg` | Foto Berman Sandy Mora | 200×200px, crop wajah |
| `assets/foto-syahrani.jpg` | Foto Syahrani Revina Putri Latief | 200×200px, crop wajah |

**Cara memasang (contoh Gebi):**
Cari komentar `FOTO ANGGOTA 1 — Gebi` di index.html, ganti div avatar dengan:
```html
<img src="assets/foto-gebi.jpg"
     alt="Gebi Santaria Nainggolan"
     class="team-photo" loading="lazy"/>
```
Ulangi untuk Berman dan Syahrani.

**Tips crop foto bulat:**
- Gunakan remove.bg atau canva.com untuk crop otomatis
- Pastikan wajah di tengah frame
- Kompres menggunakan squoosh.app hingga <100KB

---

## 3. KOORDINAT KELURAHAN & TITIK LONGSOR

### A. Koordinat Polygon Kelurahan
Buka file `js/data.js`. Cari setiap kelurahan (contoh: `id: "pidada"`).
Ganti array `coordinates` dengan koordinat nyata dari QGIS.

**Cara mendapatkan dari QGIS:**
1. Layer shapefile kelurahan → klik kanan → Export → Save As
2. Format: **GeoJSON**, CRS: **EPSG:4326** (WGS 84)
3. Buka file .geojson yang diekspor (gunakan Notepad/VSCode)
4. Salin bagian `"coordinates": [[[lon,lat],[lon,lat],...]]`
5. Tempel ke setiap kelurahan di `data.js`

**Format:**
```javascript
coordinates: [
  [105.295, -5.408],  // [longitude, latitude] — dari QGIS
  [105.310, -5.408],
  // ... dst
  [105.295, -5.408]   // titik terakhir = titik pertama
]
```

### B. Koordinat Titik Longsor (34 titik)
Di `js/data.js`, cari array `LANDSLIDE_POINTS`.
Ganti setiap `lon` dan `lat` dengan koordinat nyata.

**Cara mendapatkan dari QGIS:**
1. Layer titik longsor → klik kanan → Attribute Table
2. Jika dalam UTM Zone 48S: Processing → Reproject → EPSG:4326
3. Buka Field Calculator → tambah kolom X (lon) dan Y (lat)
4. Salin ke data.js

---

## 4. LINK DOWNLOAD PETA PDF

Buka `index.html`, cari komentar `PANDUAN MENGISI LINK DOWNLOAD PETA`.
Di sana ada 3 tombol download. Ganti `href="#"` setiap tombol.

**Cara upload ke Google Drive:**
1. Upload file PDF peta ke Google Drive
2. Klik kanan file → Share → "Anyone with link" → Copy link
3. Link asli: `https://drive.google.com/file/d/FILE_ID/view`
4. Ubah jadi link download: `https://drive.google.com/uc?export=download&id=FILE_ID`
5. Tempel sebagai `href` di tombol yang sesuai

**Contoh:**
```html
<!-- Sebelum: -->
<a href="#" onclick="alert(...)">

<!-- Sesudah: -->
<a href="https://drive.google.com/uc?export=download&id=1abc2def3ghi"
   download="peta-kerentanan-panjang.pdf">
```

---

## 5. DEPLOY KE GITHUB + VERCEL

### GitHub
1. Buat repository baru di github.com (nama: `webgis-longsor-panjang`)
2. Upload seluruh isi folder `webgis/` (bukan folder-nya, isinya)
3. Pastikan `index.html` ada di root repository

### Vercel
1. Buka vercel.com → Login dengan GitHub
2. New Project → Import repository `webgis-longsor-panjang`
3. Build Command: **kosongkan**
4. Output Directory: **`./`** (titik slash)
5. Deploy → tunggu 30–60 detik
6. URL publik tersedia: `webgis-longsor-panjang.vercel.app`

### Update setelah perubahan
Setiap kali Anda edit file dan commit di GitHub, Vercel otomatis re-deploy.

---

## 6. MODEL 3D NYATA DARI QGIS (Tingkat Lanjut)

### Menggunakan QGIS2threejs Plugin
1. Install plugin: Plugins → Manage → cari "QGIS2threejs"
2. Buka plugin → pilih layer DEM DEMNAS sebagai terrain
3. Tambahkan layer raster kerentanan MaxEnt sebagai texture
4. Export → pilih format **GLB/GLTF**
5. Simpan hasil sebagai: `assets/model-panjang.glb`

### Integrasi ke website
Di `js/map3d.js`, cari fungsi `loadRealModel()`.
Hapus `generateTerrain()` dan aktifkan GLTFLoader:
```javascript
// Tambahkan di awal file (setelah Three.js CDN):
// <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>

function loadRealModel() {
    const loader = new THREE.GLTFLoader();
    loader.load('assets/model-panjang.glb',
        function(gltf) {
            terrain = gltf.scene;
            scene.add(terrain);
        },
        function(xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
        function(error) { console.error('Error loading model:', error); }
    );
}
```

---

## 7. CHECKLIST FINAL SEBELUM PRESENTASI

- [ ] Koordinat polygon 8 kelurahan sudah diisi dengan data nyata QGIS
- [ ] 34 titik koordinat longsor sudah diisi dengan data nyata
- [ ] Link download peta PDF sudah diisi
- [ ] Foto lokasi/lapangan sudah diupload (minimal galeri 6 foto)
- [ ] Logo ITERA sudah dipasang
- [ ] Foto 3 anggota tim sudah dipasang
- [ ] Website sudah bisa dibuka dari HP (test di mobile)
- [ ] Tombol navigasi Mitigasi dan Tim dapat dijangkau dengan scroll
- [ ] QR Code dibuat dari URL Vercel dan disisipkan di poster/laporan
- [ ] URL website dicantumkan di laporan Bab IV sub-bab IV.6

