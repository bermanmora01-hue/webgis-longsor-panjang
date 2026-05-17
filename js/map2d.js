// js/map2d.js — VERSI FINAL FIX
// Perbaikan: layer key normalisasi, bounds valid check, popup styling

let map;
let basemaps = {};
let currentBasemap;
let overlayLayers = {
    'tinggi': L.featureGroup(),
    'menengah': L.featureGroup(),
    'rendah': L.featureGroup(),
    'sangat-rendah': L.featureGroup(),
    'titik-longsor': L.featureGroup()
};

function initMap2D() {
    if (document.getElementById('map2d')._leaflet_id) return; // Prevent double init

    map = L.map('map2d', { zoomControl: true, attributionControl: true })
            .setView([-5.425, 105.310], 13);

    basemaps['osm'] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 19
    });
    basemaps['satellite'] = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 19
    });
    basemaps['topo'] = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 17
    });

    basemaps['osm'].addTo(map);
    currentBasemap = basemaps['osm'];

    Object.values(overlayLayers).forEach(layer => map.addLayer(layer));

    loadDataToMap();

    setTimeout(() => {
        map.invalidateSize();
        fitMapBounds();
    }, 600);
}

function normalizeKey(kelas) {
    return kelas.toLowerCase()
        .replace(/\s+/g, '-')
        .replace('sangat-rendah', 'sangat-rendah')
        .replace('rendah', 'rendah')
        .replace('menengah', 'menengah')
        .replace('tinggi', 'tinggi');
}

function loadDataToMap() {
    if (typeof KELURAHAN_DATA === 'undefined') return;

    KELURAHAN_DATA.forEach(kel => {
        const latlngs = kel.coordinates.map(coord => [coord[1], coord[0]]);

        const polygon = L.polygon(latlngs, {
            color: kel.color,
            weight: 2.5,
            opacity: 1,
            fillColor: kel.color,
            fillOpacity: 0.4
        });

        polygon.bindPopup(`
            <div style="font-family:'Inter',sans-serif;min-width:230px;font-size:13px">
                <h4 style="margin:0 0 8px;font-family:'Nunito',sans-serif;font-size:15px;border-bottom:2px solid ${kel.color};padding-bottom:6px">
                    ${kel.nama}
                </h4>
                <p style="margin:0 0 5px">
                    <b>Kelas:</b>
                    <span style="background:${kel.color};color:white;padding:2px 8px;border-radius:6px;font-weight:700;font-size:12px">
                        ${kel.kelas}
                    </span>
                </p>
                <p style="margin:0 0 4px"><b>Probabilitas MaxEnt:</b> ${kel.prob_min} – ${kel.prob_max}</p>
                <p style="margin:0 0 4px"><b>Luas Area:</b> ${kel.luas_ha} Ha</p>
                <p style="margin:0 0 6px"><b>Faktor Dominan:</b><br>${kel.faktor_dominan}</p>
                <p style="margin:0;background:#f9f9f6;padding:6px 8px;border-radius:6px;border-left:3px solid ${kel.color};font-size:12px;color:#555">
                    💡 ${kel.rekomendasi}
                </p>
            </div>
        `, { maxWidth: 280 });

        polygon.on('mouseover', function() { this.setStyle({ fillOpacity: 0.65, weight: 3 }); });
        polygon.on('mouseout', function() { this.setStyle({ fillOpacity: 0.4, weight: 2.5 }); });

        const key = normalizeKey(kel.kelas);
        if (overlayLayers[key]) {
            overlayLayers[key].addLayer(polygon);
        }
    });

    if (typeof LANDSLIDE_POINTS !== 'undefined') {
        LANDSLIDE_POINTS.forEach(pt => {
            const marker = L.circleMarker([pt.lat, pt.lon], {
                radius: pt.type === 'test' ? 7 : 5,
                fillColor: pt.type === 'test' ? '#FF6B6B' : '#7F77DD',
                color: '#FFFFFF',
                weight: 1.5,
                opacity: 1,
                fillOpacity: 0.9
            });
            marker.bindPopup(`
                <div style="font-family:'Inter',sans-serif;font-size:13px">
                    <b style="display:block;margin-bottom:5px">📍 Titik Longsor Historis</b>
                    <div>ID: <b>${pt.id}</b></div>
                    <div>Jenis Data: <b>${pt.type === 'train' ? 'Training (75%)' : 'Test/Validasi (25%)'}</b></div>
                    <div>Koordinat: ${pt.lat.toFixed(5)}°, ${pt.lon.toFixed(5)}°</div>
                </div>
            `);
            overlayLayers['titik-longsor'].addLayer(marker);
        });
    }
}

function changeBasemap(value) {
    if (currentBasemap) map.removeLayer(currentBasemap);
    currentBasemap = basemaps[value];
    if (currentBasemap) map.addLayer(currentBasemap);
}

function toggleLayer(layerKey, isChecked) {
    if (!overlayLayers[layerKey]) return;
    if (isChecked) map.addLayer(overlayLayers[layerKey]);
    else map.removeLayer(overlayLayers[layerKey]);
}

function fitMapBounds() {
    const allBounds = L.latLngBounds();
    ['tinggi','menengah','rendah','sangat-rendah'].forEach(key => {
        const lg = overlayLayers[key];
        if (lg && map.hasLayer(lg)) {
            try {
                const b = lg.getBounds();
                if (b.isValid()) allBounds.extend(b);
            } catch(e) {}
        }
    });
    if (allBounds.isValid()) {
        map.fitBounds(allBounds, { padding: [40, 40], maxZoom: 14 });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('map2d');
    if (el) initMap2D();
});
