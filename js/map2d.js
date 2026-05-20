// js/map2d.js — SOLUSI FINAL: KML + GeoJSON + Fallback Poligon
// ============================================================
// Mendukung 3 metode pemuatan data peta (prioritas berurutan):
//   1. File KML lokal (assets/peta-kerentanan.kml) — TERCEPAT
//   2. File GeoJSON lokal (assets/kelurahan.geojson)
//   3. Poligon dari data.js — fallback otomatis
// ============================================================

let map, currentBasemap;
let overlayLayers = {
    'tinggi':        L.featureGroup(),
    'menengah':      L.featureGroup(),
    'rendah':        L.featureGroup(),
    'sangat-rendah': L.featureGroup(),
    'titik-longsor': L.featureGroup()
};
const basemaps = {};

// Warna per kelas — digunakan oleh semua metode
const KELAS_COLOR = {
    'tinggi':        '#E24B4A',
    'menengah':      '#EF9F27',
    'rendah':        '#378ADD',
    'sangat rendah': '#888780',
    'sangat-rendah': '#888780'
};

// ── INISIALISASI PETA ──────────────────────────────────────
function initMap2D() {
    const el = document.getElementById('map2d');
    if (!el || el._leaflet_id) return;

    const center = (typeof MAP_CENTER !== 'undefined') ? MAP_CENTER : [-5.425, 105.310];
    const zoom   = (typeof MAP_ZOOM   !== 'undefined') ? MAP_ZOOM   : 13;

    map = L.map('map2d', {
        zoomControl: true,
        attributionControl: true,
        preferCanvas: true          // lebih cepat untuk banyak polygon
    }).setView(center, zoom);

    // ── BASEMAPS ────────────────────────────────────────────
    basemaps['osm'] = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        { attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom: 19 }
    );
    basemaps['satellite'] = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles © Esri', maxZoom: 19 }
    );
    basemaps['topo'] = L.tileLayer(
        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        { attribution: '© OpenTopoMap', maxZoom: 17 }
    );

    basemaps['osm'].addTo(map);
    currentBasemap = basemaps['osm'];

    // Tambahkan semua layer group ke peta
    Object.values(overlayLayers).forEach(lg => map.addLayer(lg));

    // ── MUAT DATA (urutan prioritas) ────────────────────────
    // 1. Coba KML
    // 2. Coba GeoJSON
    // 3. Fallback data.js
    tryLoadKML()
        .catch(() => tryLoadGeoJSON())
        .catch(() => loadFromDataJS())
        .finally(() => {
            loadLandslidesPoints();
            setTimeout(() => {
                map.invalidateSize();
                fitMapBounds();
            }, 600);
        });
}

// ============================================================
// METODE 1: LOAD KML
// ============================================================
// ╔══════════════════════════════════════════════════════════╗
// ║  CARA MENGEKSPOR KML DARI QGIS:                        ║
// ║  1. Layer kerentanan → klik kanan → Export → Save As   ║
// ║  2. Format: KML, CRS: EPSG:4326 (WGS 84)               ║
// ║  3. Nama file: peta-kerentanan.kml                      ║
// ║  4. Simpan ke folder: assets/peta-kerentanan.kml        ║
// ║                                                          ║
// ║  PENTING — Field atribut yang dibutuhkan di KML:        ║
// ║  • Kolom "kelas" berisi: Tinggi / Menengah /            ║
// ║    Rendah / Sangat Rendah                               ║
// ║  • Kolom "nama" berisi nama kelurahan                   ║
// ║  • Kolom "luas_ha" berisi luas area                     ║
// ║  • Kolom "rekomendasi" berisi rekomendasi mitigasi      ║
// ╚══════════════════════════════════════════════════════════╝
function tryLoadKML() {
    return new Promise((resolve, reject) => {
        fetch('assets/peta-kerentanan.kml', { method: 'HEAD' })
            .then(res => {
                if (!res.ok) { reject('KML not found'); return; }
                return fetch('assets/peta-kerentanan.kml');
            })
            .then(res => res ? res.text() : Promise.reject('skip'))
            .then(kmlText => {
                if (!kmlText) { reject('empty'); return; }

                const parser   = new DOMParser();
                const kmlDoc   = parser.parseFromString(kmlText, 'application/xml');
                const placemarks = Array.from(kmlDoc.querySelectorAll('Placemark'));

                if (placemarks.length === 0) { reject('no placemarks'); return; }

                placemarks.forEach(pm => {
                    // ── Baca nama & data atribut dari KML ──
                    const DESA  = pm.querySelector('name');
                    const Area    = DESA ? DESA.textContent.trim() : 'Area';
                    const Zona   = getKMLData(pm, 'kelas') || detectKelasFromName(DESA);
                    const Area    = getKMLData(pm, 'luas_km2') || '–';
                    const Rekomendasi     = getKMLData(pm, 'rekomendasi') || 'Lihat rekomendasi mitigasi.';
                    const Probabilitas = getKMLData(pm, 'prob_min') || '–';

                    const kelasKey = kelas.toLowerCase().replace(/\s+/g, '-');
                    const color    = KELAS_COLOR[kelasKey] || KELAS_COLOR[kelas.toLowerCase()] || '#888780';

                    // ── Parse koordinat dari tag <coordinates> ──
                    const coordEls = pm.querySelectorAll('coordinates');
                    coordEls.forEach(coordEl => {
                        const raw = coordEl.textContent.trim();
                        const latlngs = raw.split(/\s+/)
                            .filter(s => s.includes(','))
                            .map(s => {
                                const parts = s.split(',');
                                const lon = parseFloat(parts[0]);
                                const lat = parseFloat(parts[1]);
                                if (isNaN(lon) || isNaN(lat)) return null;
                                return [lat, lon]; // Leaflet: [lat, lon]
                            })
                            .filter(p => p !== null);

                        if (latlngs.length < 3) return;

                        const poly = L.polygon(latlngs, {
                            color: color, weight: 2.5, opacity: 1,
                            fillColor: color, fillOpacity: 0.4
                        });

                        poly.bindPopup(buildPopupHTML(DESA, Zona, Probabilitas, Area, Rekomendasi, color), { maxWidth: 290 });
                        poly.on('mouseover', function () { this.setStyle({ fillOpacity: 0.65, weight: 3.5 }); });
                        poly.on('mouseout',  function () { this.setStyle({ fillOpacity: 0.40, weight: 2.5 }); });

                        const layerKey = kelasKey.startsWith('sangat') ? 'sangat-rendah' : kelasKey;
                        if (overlayLayers[layerKey]) {
                            overlayLayers[layerKey].addLayer(poly);
                        } else {
                            overlayLayers['rendah'].addLayer(poly); // fallback
                        }
                    });
                });

                console.log('✅ KML loaded:', placemarks.length, 'placemarks');
                resolve('kml');
            })
            .catch(err => reject(err));
    });
}

// Helper: ambil nilai dari <SimpleData name="..."> di KML
function getKMLData(placemark, fieldName) {
    // Format 1: <SimpleData name="fieldName">
    const sd = placemark.querySelector(`SimpleData[name="${fieldName}"]`);
    if (sd) return sd.textContent.trim();

    // Format 2: <Data name="fieldName"><value>
    const d = placemark.querySelector(`Data[name="${fieldName}"] value`);
    if (d) return d.textContent.trim();

    return null;
}

// Deteksi kelas dari nama kelurahan jika atribut tidak tersedia
function detectKelasFromName(nama) {
    const n = nama.toLowerCase();
    if (n.includes('pidada') || n.includes('panjang utara') || n.includes('karang maritim')) return 'Tinggi';
    if (n.includes('panjang selatan') || n.includes('way lunik')) return 'Menengah';
    if (n.includes('ketapang') && !n.includes('kuala')) return 'Rendah';
    return 'Sangat Rendah';
}

// ============================================================
// METODE 2: LOAD GeoJSON
// ============================================================
// ╔══════════════════════════════════════════════════════════╗
// ║  CARA MENGEKSPOR GeoJSON DARI QGIS:                    ║
// ║  1. Layer kerentanan → klik kanan → Export → Save As   ║
// ║  2. Format: GeoJSON, CRS: EPSG:4326 (WGS 84)           ║
// ║  3. Nama file: kelurahan.geojson                        ║
// ║  4. Simpan ke folder: assets/kelurahan.geojson          ║
// ╚══════════════════════════════════════════════════════════╝
function tryLoadGeoJSON() {
    return new Promise((resolve, reject) => {
        fetch('assets/kelurahan.geojson', { method: 'HEAD' })
            .then(res => {
                if (!res.ok) { reject('GeoJSON not found'); return; }
                return fetch('assets/kelurahan.geojson');
            })
            .then(res => res ? res.json() : Promise.reject('skip'))
            .then(geoData => {
                L.geoJSON(geoData, {
                    style: feature => {
                        const kelas = (feature.properties.kelas || '').toLowerCase().replace(/\s+/g, '-');
                        const color = KELAS_COLOR[kelas] || '#888780';
                        return { color, weight: 2.5, fillColor: color, fillOpacity: 0.4 };
                    },
                    onEachFeature: (feature, layer) => {
                        const p     = feature.properties;
                        const kelas = p.kelas || 'Tidak diketahui';
                        const color = KELAS_COLOR[kelas.toLowerCase().replace(/\s+/g,'-')] || '#888780';

                        layer.bindPopup(
                            buildPopupHTML(p.nama || p.KELURAHAN || 'Area', kelas,
                                p.prob_min || '–', p.prob_max || '–',
                                p.luas_ha  || '–', p.rekomendasi || '–', color),
                            { maxWidth: 290 }
                        );
                        layer.on('mouseover', function () { this.setStyle({ fillOpacity: 0.65, weight: 3.5 }); });
                        layer.on('mouseout',  function () { this.setStyle({ fillOpacity: 0.40, weight: 2.5 }); });

                        const kelasKey = kelas.toLowerCase().replace(/\s+/g, '-');
                        const lgKey    = kelasKey.startsWith('sangat') ? 'sangat-rendah' : kelasKey;
                        if (overlayLayers[lgKey]) overlayLayers[lgKey].addLayer(layer);
                    }
                });
                console.log('✅ GeoJSON loaded');
                resolve('geojson');
            })
            .catch(err => reject(err));
    });
}

// ============================================================
// METODE 3: FALLBACK — data dari data.js
// ============================================================
function loadFromDataJS() {
    return new Promise((resolve) => {
        if (typeof KELURAHAN_DATA === 'undefined') { resolve(); return; }

        KELURAHAN_DATA.forEach(kel => {
            const latlngs = kel.coordinates.map(c => [c[1], c[0]]);
            const poly = L.polygon(latlngs, {
                color: kel.color, weight: 2.5, opacity: 1,
                fillColor: kel.color, fillOpacity: 0.4
            });
            poly.bindPopup(
                buildPopupHTML(kel.nama, kel.kelas, kel.prob_min, kel.prob_max,
                    kel.luas_ha, kel.rekomendasi, kel.color),
                { maxWidth: 290 }
            );
            poly.on('mouseover', function () { this.setStyle({ fillOpacity: 0.65, weight: 3.5 }); });
            poly.on('mouseout',  function () { this.setStyle({ fillOpacity: 0.40, weight: 2.5 }); });

            const key = kel.kelas.toLowerCase().replace(/\s+/g, '-');
            const lgKey = key.startsWith('sangat') ? 'sangat-rendah' : key;
            if (overlayLayers[lgKey]) overlayLayers[lgKey].addLayer(poly);
        });

        console.log('✅ Fallback data.js loaded');
        resolve('datajs');
    });
}

// ── POPUP HTML BUILDER ─────────────────────────────────────
function buildPopupHTML(nama, kelas, probMin, probMax, luas, rek, color) {
    return `
        <div style="font-family:'Inter',sans-serif;min-width:240px;font-size:13px">
            <h4 style="margin:0 0 8px;font-family:'Nunito',sans-serif;font-size:15px;
                border-bottom:2px solid ${color};padding-bottom:6px">${nama}</h4>
            <p style="margin:0 0 5px"><b>Kelas:</b>
                <span style="background:${color};color:white;padding:2px 8px;
                    border-radius:6px;font-weight:700;font-size:12px">${kelas}</span>
            </p>
            <p style="margin:0 0 4px"><b>Probabilitas MaxEnt:</b> ${probMin}–${probMax}</p>
            <p style="margin:0 0 6px"><b>Luas:</b> ${luas} Ha</p>
            <div style="background:#f9f9f6;padding:8px;border-radius:6px;
                border-left:3px solid ${color};font-size:12px;color:#555">
                💡 ${rek}
            </div>
        </div>`;
}

// ── TITIK LONGSOR ──────────────────────────────────────────
function loadLandslidesPoints() {
    if (typeof LANDSLIDE_POINTS === 'undefined') return;
    LANDSLIDE_POINTS.forEach(pt => {
        const m = L.circleMarker([pt.lat, pt.lon], {
            radius: pt.type === 'test' ? 7 : 5,
            fillColor: pt.type === 'test' ? '#FF6B6B' : '#7F77DD',
            color: '#fff', weight: 1.5, opacity: 1, fillOpacity: 0.9
        });
        m.bindPopup(`
            <div style="font-family:'Inter',sans-serif;font-size:13px">
                <b style="display:block;margin-bottom:5px">📍 Titik Longsor Historis</b>
                <div>ID: <b>${pt.id}</b></div>
                <div>Jenis: <b>${pt.type === 'train' ? 'Training (75%)' : 'Test/Validasi (25%)'}</b></div>
                <div>Koordinat: ${pt.lat.toFixed(5)}°, ${pt.lon.toFixed(5)}°</div>
            </div>`);
        overlayLayers['titik-longsor'].addLayer(m);
    });
}

// ── KONTROL UI ──────────────────────────────────────────────
function changeBasemap(value) {
    if (currentBasemap) map.removeLayer(currentBasemap);
    currentBasemap = basemaps[value];
    if (currentBasemap) map.addLayer(currentBasemap);
}

function toggleLayer(layerKey, isChecked) {
    if (!overlayLayers[layerKey]) return;
    isChecked ? map.addLayer(overlayLayers[layerKey]) : map.removeLayer(overlayLayers[layerKey]);
}

function fitMapBounds() {
    const all = L.latLngBounds();
    ['tinggi','menengah','rendah','sangat-rendah'].forEach(k => {
        if (overlayLayers[k] && map.hasLayer(overlayLayers[k])) {
            try {
                const b = overlayLayers[k].getBounds();
                if (b.isValid()) all.extend(b);
            } catch (e) {}
        }
    });
    if (all.isValid()) map.fitBounds(all, { padding: [40, 40], maxZoom: 14 });
    else map.setView(
        (typeof MAP_CENTER !== 'undefined') ? MAP_CENTER : [-5.425, 105.310],
        (typeof MAP_ZOOM !== 'undefined') ? MAP_ZOOM : 13
    );
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('map2d')) initMap2D();
});
