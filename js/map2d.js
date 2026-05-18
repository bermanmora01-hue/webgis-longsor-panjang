// ============================================================
// js/map2d.js — FINAL PRODUCTION VERSION
// WebGIS Kerentanan Longsor Kecamatan Panjang, Bandar Lampung
// Capstone Design Teknik Geologi ITERA 2026
//
// Data koordinat: Diekstrak langsung dari QGIS (EPSG:4326 / WGS 84)
// Peta Kerentanan: Hasil pemodelan MaxEnt, disederhanakan untuk web
// Batas Desa: Data resmi BIG (Badan Informasi Geospasial)
// ============================================================

// ============================================================
// SECTION A: DATA GEOJSON (LANGSUNG DARI QGIS — KOORDINAT ASLI)
// ============================================================

/** GeoJSON Peta Kerentanan Longsor (hasil MaxEnt, disederhanakan 0.0008°)
 *  Field: Zona = Tinggi | Menengah | Rendah | Sangat Rendah
 *         Area = luas dalam m², Persen are = persentase wilayah
 */
function loadKmlLayer() {
  // Letakkan file KML Anda di folder assets/data.kml
  var runLayer = omnivore.kml('assets/peta-panjang.kml')
    .on('ready', function() {
        map.fitBounds(runLayer.getBounds()); // Otomatis zoom ke area koordinat KML
        runLayer.eachLayer(function(layer) {
            // Memberikan warna berdasarkan nama kelas di KML
            const gaya = layer.feature.properties.name;
            if(gaya.includes("Tinggi")) layer.setStyle({color: "#E24B4A", fillOpacity: 0.6});
            if(gaya.includes("Menengah")) layer.setStyle({color: "#EF9F27", fillOpacity: 0.5});
            
            // Popup otomatis dari data KML
            layer.bindPopup("<b>Zona:</b> " + layer.feature.properties.name);
        });
    })
    .addTo(map);
}

// ============================================================
// SECTION B: METADATA KELURAHAN (info popup & statistik)
// ============================================================
const KELURAHAN_META = {
  "PANJANG SELATAN": {
    kelas: "Menengah", color: "#EF9F27",
    prob: "0.50–0.75",
    faktor: "Jarak dari Sungai, Tutupan Lahan Permukiman",
    rekomendasi: "Kajian geoteknik sebelum membangun. Tanam vegetasi akar wangi di lereng terbuka.",
    luas_ha: 69.0,
    layerKey: "menengah"
  },
  "SRENGSEM": {
    kelas: "Sangat Rendah", color: "#888780",
    prob: "0.00–0.25",
    faktor: "Dataran Aluvial Pesisir, Morfologi Datar",
    rekomendasi: "Waspadai banjir pesisir. Jaga drainase permukaan dan vegetasi mangrove.",
    luas_ha: 680.0,
    layerKey: "sangat-rendah"
  },
  "KARANG MARITIM": {
    kelas: "Tinggi", color: "#E24B4A",
    prob: "0.75–1.00",
    faktor: "Kemiringan Lereng Curam, Dekat Sesar Lampung–Panjang",
    rekomendasi: "Hentikan IMB baru di lereng >20°. Pasang EWS dan dinding penahan tanah.",
    luas_ha: 132.0,
    layerKey: "tinggi"
  },
  "KETAPANG KUALA": {
    kelas: "Sangat Rendah", color: "#888780",
    prob: "0.00–0.25",
    faktor: "Endapan Aluvial Muda, Morfologi Datar Pesisir",
    rekomendasi: "Pantau abrasi pesisir. Pertahankan mangrove sebagai pelindung pantai.",
    luas_ha: 182.0,
    layerKey: "sangat-rendah"
  },
  "PANJANG UTARA": {
    kelas: "Tinggi", color: "#E24B4A",
    prob: "0.75–1.00",
    faktor: "Kemiringan Lereng, Batuan Tuf Formasi Tarahan, Dekat Sungai",
    rekomendasi: "Terasering lereng, drainase permukaan & bawah permukaan, vegetasi bioengineering.",
    luas_ha: 66.0,
    layerKey: "tinggi"
  },
  "PIDADA": {
    kelas: "Tinggi", color: "#E24B4A",
    prob: "0.75–1.00",
    faktor: "Kemiringan Lereng, Litologi Tuf Lapukan, Proximity Sesar",
    rekomendasi: "Prioritas EWS. Dinding penahan di kaki lereng. Jangan bangun di lereng >20°.",
    luas_ha: 163.0,
    layerKey: "tinggi"
  },
  "WAY LUNIK": {
    kelas: "Menengah", color: "#EF9F27",
    prob: "0.50–0.75",
    faktor: "Litologi Tuf Formasi Tarahan, Kelurusan Struktural",
    rekomendasi: "Batasi alih fungsi lahan bukit. Kajian geoteknik mikro sebelum konstruksi besar.",
    luas_ha: 174.0,
    layerKey: "menengah"
  },
  "KETAPANG": {
    kelas: "Rendah", color: "#378ADD",
    prob: "0.25–0.50",
    faktor: "Morfologi Landai, Jarak dari Sungai >400m",
    rekomendasi: "Jaga tutupan vegetasi. Waspadai lereng saat curah hujan >50mm/hari.",
    luas_ha: 110.0,
    layerKey: "rendah"
  }
};

// ============================================================
// SECTION C: TITIK LONGSOR HISTORIS (34 titik survei lapangan)
// ============================================================
const TITIK_LONGSOR = [
  { id: 1, lat: -5.456573, lng: 105.320714, info: "Titik 1" },
  { id: 2, lat: -5.456690, lng: 105.321779, info: "Titik 2" },
  { id: 3, lat: -5.456545, lng: 105.321698, info: "Titik 3" },
  { id: 4, lat: -5.493917, lng: 105.335287, info: "Titik 4" },
  { id: 5, lat: -5.462127, lng: 105.321475, info: "Titik 5" },
  { id: 6, lat: -5.480614, lng: 105.328428, info: "Titik 6" },
  { id: 7, lat: -5.482054, lng: 105.325991, info: "Titik 7" },
  { id: 8, lat: -5.464749, lng: 105.323544, info: "Titik 8" },
  { id: 9, lat: -5.466169, lng: 105.323933, info: "Titik 9" },
  { id: 10, lat: -5.483426, lng: 105.331228, info: "Titik 10" },
  { id: 11, lat: -5.482553, lng: 105.322534, info: "Titik 11" },
  { id: 12, lat: -5.486454, lng: 105.334858, info: "Titik 12" },
  { id: 13, lat: -5.488652, lng: 105.336909, info: "Titik 13" },
  { id: 14, lat: -5.478880, lng: 105.323055, info: "Titik 14" },
  { id: 15, lat: -5.460036, lng: 105.323379, info: "Titik 15" },
  { id: 16, lat: -5.465702, lng: 105.318905, info: "Titik 16" },
  { id: 17, lat: -5.478301, lng: 105.323606, info: "Titik 17" },
  { id: 18, lat: -5.482141, lng: 105.331606, info: "Titik 18" },
  { id: 19, lat: -5.469741, lng: 105.327374, info: "Titik 19" },
  { id: 20, lat: -5.463647, lng: 105.320971, info: "Titik 20" },
  { id: 21, lat: -5.461894, lng: 105.316880, info: "Titik 21" },
  { id: 22, lat: -5.462306, lng: 105.325818, info: "Titik 22" },
  { id: 23, lat: -5.486813, lng: 105.325009, info: "Titik 23" },
  { id: 24, lat: -5.482524, lng: 105.326045, info: "Titik 24" },
  { id: 25, lat: -5.466955, lng: 105.326344, info: "Titik 25" },
  { id: 26, lat: -5.483754, lng: 105.327057, info: "Titik 26" },
  { id: 27, lat: -5.466533, lng: 105.320151, info: "Titik 27" },
  { id: 28, lat: -5.470238, lng: 105.327402, info: "Titik 28" },
  { id: 29, lat: -5.457355, lng: 105.313466, info: "Titik 29" },
  { id: 30, lat: -5.447480, lng: 105.306690, info: "Titik 30" },
  { id: 31, lat: -5.485807, lng: 105.327004, info: "Titik 31" },
  { id: 32, lat: -5.442281, lng: 105.300946, info: "Titik 32" },
  { id: 33, lat: -5.475752, lng: 105.318594, info: "Titik 33" },
  { id: 34, lat: -5.474936, lng: 105.322132, info: "Titik 34" }
];

// ============================================================
// SECTION D: ZONA CONFIG
// ============================================================
const ZONA_CONFIG = {
  "Tinggi":        { color:"#E24B4A", fillOpacity:0.55, weight:1.5, key:"tinggi" },
  "Menengah":      { color:"#EF9F27", fillOpacity:0.50, weight:1.5, key:"menengah" },
  "Rendah":        { color:"#378ADD", fillOpacity:0.45, weight:1.5, key:"rendah" },
  "Sangat Rendah": { color:"#888780", fillOpacity:0.38, weight:1.0, key:"sangat-rendah" }
};

// ============================================================
// SECTION E: MAP STATE
// ============================================================
let map;
let basemaps = {};
let currentBasemap = null;
const overlayLayers = {
  "tinggi":        L.featureGroup(),
  "menengah":      L.featureGroup(),
  "rendah":        L.featureGroup(),
  "sangat-rendah": L.featureGroup(),
  "desa":          L.featureGroup(),
  "titik-longsor": L.featureGroup()
};

// ============================================================
// SECTION F: INIT MAP
// ============================================================
<section id="peta-interaktif">
    <div class="container">
        <h2>Visualisasi My Maps - Kerentanan Longsor</h2>
        <div class="map-wrapper">
            <iframe src="https://www.google.com/maps/d/embed?mid=1JwHPm1nkN6elNdfyQErde96W-hovndY&ehbc=2E312F" width="640" height="480"></iframe>" width="100%" height="600" style="border:none;"></iframe>
        </div>
    </div>
</section> // prevent double init

  // Centre of Kecamatan Panjang (from real GeoJSON bounds)
  map = L.map('map2d', {
    center: [-5.430, 105.318],
    zoom: 13,
    zoomControl: true,
    attributionControl: true
  });

  // ---- Basemaps ----
  basemaps['osm'] = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>', maxZoom:19 }
  );
  basemaps['satellite'] = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { attribution: 'Tiles © Esri — Esri, DeLorme, USGS', maxZoom:19 }
  );
  basemaps['topo'] = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    { attribution: '© OpenTopoMap (CC-BY-SA)', maxZoom:17 }
  );
  basemaps['osm'].addTo(map);
  currentBasemap = basemaps['osm'];

  // ---- Add all overlay groups ----
  Object.values(overlayLayers).forEach(lg => map.addLayer(lg));

  // ---- Load data ----
  loadKerentananLayer();
  loadDesaLayer();
  loadTitikLongsor();

  // ---- Fit bounds after short delay ----
  setTimeout(() => {
    map.invalidateSize();
    fitMapBounds();
  }, 500);
}

// ============================================================
// SECTION G: LOAD KERENTANAN LAYER (dari GeoJSON asli QGIS)
// ============================================================
function loadKerentananLayer() {
  L.geoJSON(GEOJSON_KERENTANAN, {
    style: function(feature) {
      const zona = feature.properties.Zona;
      const cfg  = ZONA_CONFIG[zona] || { color:'#aaa', fillOpacity:0.3, weight:1 };
      return {
        color:       cfg.color,
        weight:      cfg.weight,
        opacity:     0.9,
        fillColor:   cfg.color,
        fillOpacity: cfg.fillOpacity
      };
    },
    onEachFeature: function(feature, layer) {
      const zona = feature.properties.Zona;
      const cfg  = ZONA_CONFIG[zona] || { color:'#aaa', key:'rendah' };
      const area = (feature.properties.Area / 1e6).toFixed(3);
      const pct  = feature.properties['Persen are'] || 0;

      const zoneLabels = {
        "Tinggi":        "⚠ Perlu tindakan segera",
        "Menengah":      "⚡ Perlu kewaspadaan",
        "Rendah":        "ℹ Relatif aman, tetap waspada",
        "Sangat Rendah": "✅ Risiko longsor rendah"
      };

      layer.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:240px;font-size:13px">
          <div style="background:${cfg.color};color:white;padding:8px 12px;margin:-1px -1px 10px;border-radius:4px 4px 0 0;font-weight:700;font-size:14px">
            Zona Kerentanan ${zona}
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="color:#666;padding:3px 0;width:45%">Luas Area</td>
                <td style="font-weight:600">${area} km² (${pct}%)</td></tr>
            <tr><td style="color:#666;padding:3px 0">Probabilitas</td>
                <td><code style="background:#f5f5f5;padding:1px 5px;border-radius:3px">
                  ${{ "Tinggi":"0.75–1.00","Menengah":"0.50–0.75","Rendah":"0.25–0.50","Sangat Rendah":"0.00–0.25" }[zona] || "—"}
                </code></td></tr>
          </table>
          <div style="margin-top:8px;padding:7px 9px;background:#f9f9f6;border-left:3px solid ${cfg.color};border-radius:0 4px 4px 0;font-size:12px;color:#555">
            ${zoneLabels[zona] || ""}
          </div>
          <div style="margin-top:8px;text-align:right">
            <a href="#mitigasi" style="color:${cfg.color};font-size:12px;font-weight:600">Lihat Rekomendasi Mitigasi →</a>
          </div>
        </div>
      `, { maxWidth: 300 });

      layer.on('mouseover', function() {
        this.setStyle({ fillOpacity: Math.min((ZONA_CONFIG[zona]?.fillOpacity||0.4)+0.25, 0.85), weight: 2.5 });
        this.bringToFront();
      });
      layer.on('mouseout', function() {
        this.setStyle({ fillOpacity: ZONA_CONFIG[zona]?.fillOpacity||0.4, weight: ZONA_CONFIG[zona]?.weight||1.5 });
      });

      // Add to correct overlay group
      const key = cfg.key;
      if (overlayLayers[key]) {
        overlayLayers[key].addLayer(layer);
      }
    }
  }); // note: do NOT .addTo(map) — already added via featureGroup
}

// ============================================================
// SECTION H: LOAD DESA LAYER (batas kelurahan dari BIG)
// ============================================================
function loadDesaLayer() {
  L.geoJSON(GEOJSON_DESA, {
    style: {
      color: '#2C2C2A',
      weight: 2,
      opacity: 0.8,
      fill: false,
      dashArray: '5,3'
    },
    onEachFeature: function(feature, layer) {
      const p    = feature.properties;
      const nama = p.DESA || p.DESA_KELUR || 'Kelurahan';
      const meta = KELURAHAN_META[nama.toUpperCase()] || KELURAHAN_META[nama] || null;
      const kelasBadge = meta
        ? `<span style="background:${meta.color};color:white;padding:2px 8px;border-radius:6px;font-weight:700;font-size:12px">${meta.kelas}</span>`
        : '—';

      // Label marker di tengah polygon
      try {
        const latlngs = layer.getBounds().getCenter();
        const label = L.marker(latlngs, {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:rgba(255,255,255,0.88);padding:2px 6px;border-radius:4px;font-size:11px;font-weight:700;color:#2C2C2A;white-space:nowrap;border:1px solid #ccc;box-shadow:0 1px 4px rgba(0,0,0,0.15)">${nama}</div>`,
            iconAnchor: [0, 0]
          })
        });
        overlayLayers['desa'].addLayer(label);
      } catch(e) {}

      layer.bindPopup(`
        <div style="font-family:'Inter',sans-serif;min-width:250px;font-size:13px">
          <h4 style="margin:0 0 10px;font-size:15px;border-bottom:1px solid #eee;padding-bottom:6px">
            📍 ${nama}
          </h4>
          <p style="margin:0 0 6px"><b>Kelas Kerentanan:</b> ${kelasBadge}</p>
          ${meta ? `<p style="margin:0 0 4px"><b>Probabilitas MaxEnt:</b> <code>${meta.prob}</code></p>` : ''}
          <table style="width:100%;font-size:12px;margin:6px 0;border-collapse:collapse">
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="color:#666;padding:3px 0">Jumlah Penduduk</td>
              <td style="font-weight:600">${(p.JUMLAH_PEN||0).toLocaleString('id-ID')} jiwa</td>
            </tr>
            <tr style="border-bottom:1px solid #f0f0f0">
              <td style="color:#666;padding:3px 0">Jumlah KK</td>
              <td style="font-weight:600">${(p.JUMLAH_KK||0).toLocaleString('id-ID')} KK</td>
            </tr>
            <tr>
              <td style="color:#666;padding:3px 0">Luas Wilayah</td>
              <td style="font-weight:600">${p.LUAS_WILAY || '—'} km²</td>
            </tr>
          </table>
          ${meta ? `
          <div style="background:#f9f9f6;padding:7px 9px;border-left:3px solid ${meta.color};border-radius:0 4px 4px 0;font-size:12px;margin-top:8px">
            <b>Faktor Dominan:</b><br>${meta.faktor}<br><br>
            <b>Rekomendasi:</b><br>${meta.rekomendasi}
          </div>` : ''}
          <div style="margin-top:8px;font-size:11px;color:#999">Sumber: BIG/TASWIL 2023 · MaxEnt 2026</div>
        </div>
      `, { maxWidth: 320 });

      overlayLayers['desa'].addLayer(layer);
    }
  });
}

// ============================================================
// SECTION I: LOAD TITIK LONGSOR
// ============================================================
function loadTitikLongsor() {
  LANDSLIDE_POINTS.forEach(pt => {
    const isTrain = pt.type === 'train';
    const marker  = L.circleMarker([pt.lat, pt.lon], {
      radius:      isTrain ? 5 : 7,
      fillColor:   isTrain ? '#7F77DD' : '#FF4444',
      color:       '#FFFFFF',
      weight:      1.5,
      opacity:     1,
      fillOpacity: 0.9
    });
    marker.bindPopup(`
      <div style="font-family:'Inter',sans-serif;font-size:13px;min-width:190px">
        <b style="display:block;margin-bottom:6px;font-size:14px">📍 Titik Longsor #${pt.id}</b>
        <table style="border-collapse:collapse;width:100%;font-size:12px">
          <tr><td style="color:#666;padding:2px 0">Jenis Data</td>
              <td><b>${isTrain ? 'Training (75%)' : 'Test/Validasi (25%)'}</b></td></tr>
          <tr><td style="color:#666;padding:2px 0">Latitude</td><td>${pt.lat.toFixed(5)}°</td></tr>
          <tr><td style="color:#666;padding:2px 0">Longitude</td><td>${pt.lon.toFixed(5)}°</td></tr>
        </table>
        <div style="margin-top:8px;padding:5px 8px;background:#f0f0f0;border-radius:4px;font-size:11px;color:#555">
          Data hasil survei lapangan &amp; BNPB, digunakan sebagai input pemodelan MaxEnt
        </div>
      </div>
    `);
    marker.bindTooltip(`Longsor #${pt.id}`, { permanent:false, direction:'top' });
    overlayLayers['titik-longsor'].addLayer(marker);
  });
}

// ============================================================
// SECTION J: CONTROLS
// ============================================================
function changeBasemap(value) {
  if (!map) return;
  if (currentBasemap) map.removeLayer(currentBasemap);
  currentBasemap = basemaps[value];
  if (currentBasemap) map.addLayer(currentBasemap);
  currentBasemap.bringToBack();
}

function toggleLayer(layerKey, isChecked) {
  if (!map || !overlayLayers[layerKey]) return;
  if (isChecked) map.addLayer(overlayLayers[layerKey]);
  else           map.removeLayer(overlayLayers[layerKey]);
}

function fitMapBounds() {
  if (!map) return;
  const allBounds = L.latLngBounds();
  ['tinggi','menengah','rendah','sangat-rendah','desa'].forEach(key => {
    const lg = overlayLayers[key];
    if (lg && map.hasLayer(lg)) {
      try {
        const b = lg.getBounds();
        if (b && b.isValid()) allBounds.extend(b);
      } catch(e) {}
    }
  });
  if (allBounds.isValid()) {
    map.fitBounds(allBounds, { padding:[40,40], maxZoom:14 });
  } else {
    map.setView([-5.430, 105.318], 13);
  }
}

// ============================================================
// SECTION K: INIT ON DOM READY
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
  const el = document.getElementById('map2d');
  if (el) initMap2D();
});
