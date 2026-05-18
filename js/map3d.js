// js/map3d.js — VERSI FINAL FIX
// Perbaikan: Three.js r128 compat, touch controls, resize handler, raycaster safe

let scene, camera, renderer, terrain;
let originalColors = [];
let camRadius = 180, camTheta = Math.PI / 4, camPhi = Math.PI / 3;
let targetCenter;
let isDragging = false, isAutoRotate = true, isHighlight = false;
let prevMouse = { x: 0, y: 0 };
let prevTouch = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let animFrameId = null;

function init3D() {
    const canvas = document.getElementById('canvas3d');
    const container = document.querySelector('.viewer3d-main');
    if (!canvas || !container) return;

    // Pastikan tidak double-init
    if (renderer) { renderer.dispose(); }

    targetCenter = new THREE.Vector3(0, 10, 0);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a2332);
    scene.fog = new THREE.FogExp2(0x1a2332, 0.004);

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Camera
    camera = new THREE.PerspectiveCamera(
        45, container.clientWidth / container.clientHeight, 0.5, 2000
    );
    updateCameraPosition();

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(-60, 120, 60);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xaaccff, 0.3);
    fill.position.set(60, 40, -60);
    scene.add(fill);

    // Terrain
    generateTerrain();

    // Controls
    setupControls(container);

    window.addEventListener('resize', resize3D);

    if (animFrameId) cancelAnimationFrame(animFrameId);
    animate3D();
}

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
    const pos = geo.attributes.position.array;
    const cols = [];
    const c = new THREE.Color();
    originalColors = [];

    for (let i = 0; i < pos.length; i += 3) {
        const x = pos[i], z = pos[i + 2];
        let h = 0;

        // Morfologi: pesisir barat datar, perbukitan timur-laut
        if (x > -15) {
            h = (x + 15) * 0.38 + Math.sin(x * 0.09 + 0.5) * 9 + Math.cos(z * 0.11) * 7
              + Math.sin(x * 0.22) * 4 + Math.cos(z * 0.18 + x * 0.05) * 3;
        }
        // Lembah sungai Way Lunik
        if (Math.abs(z - 18) < 12 && x > -5) h -= 6 * Math.exp(-Math.abs(z - 18) / 8);
        if (h < 0) h = 0;
        pos[i + 1] = h;

        // Warna zona kerentanan berdasarkan elevasi + posisi
        let zoneClass;
        if (h > 28 && Math.abs(z) > 8) {
            c.setHex(0xE24B4A); zoneClass = 'tinggi';
        } else if (h > 14) {
            c.setHex(0xEF9F27); zoneClass = 'menengah';
        } else if (h > 3) {
            c.setHex(0x378ADD); zoneClass = 'rendah';
        } else {
            c.setHex(0x888780); zoneClass = 'sangat_rendah';
        }

        cols.push(c.r, c.g, c.b);
        originalColors.push(c.r, c.g, c.b, zoneClass);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();

    const mat = new THREE.MeshLambertMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        flatShading: true
    });

    if (terrain) { scene.remove(terrain); terrain.geometry.dispose(); terrain.material.dispose(); }
    terrain = new THREE.Mesh(geo, mat);
    scene.add(terrain);

    // Alas (base)
    const baseGeo = new THREE.BoxGeometry(160, 8, 160);
    baseGeo.translate(0, -4, 0);
    scene.add(new THREE.Mesh(baseGeo, new THREE.MeshBasicMaterial({ color: 0x0d1520 })));
}

function setupControls(container) {
    // Mouse
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        isAutoRotate = false;
        updateButtonState('btn-rotate', false);
        prevMouse = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    });
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        camTheta -= dx * 0.008;
        camPhi = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, camPhi - dy * 0.008));
        updateCameraPosition();
        prevMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Scroll zoom
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        camRadius = Math.max(40, Math.min(350, camRadius + e.deltaY * 0.08));
        updateCameraPosition();
    }, { passive: false });

    // Touch controls
    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            isAutoRotate = false;
            updateButtonState('btn-rotate', false);
        }
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && prevTouch) {
            const dx = e.touches[0].clientX - prevTouch.x;
            const dy = e.touches[0].clientY - prevTouch.y;
            camTheta -= dx * 0.01;
            camPhi = Math.max(0.05, Math.min(Math.PI / 2 - 0.05, camPhi - dy * 0.01));
            updateCameraPosition();
            prevTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (prevTouch && prevTouch.pinchDist) {
                camRadius = Math.max(40, Math.min(350, camRadius - (dist - prevTouch.pinchDist) * 0.5));
                updateCameraPosition();
            }
            prevTouch = { pinchDist: dist };
        }
    }, { passive: true });
    container.addEventListener('touchend', () => { prevTouch = null; });

    // Double click for zone info
    container.addEventListener('dblclick', (e) => {
        if (!terrain) return;
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObject(terrain);
        if (hits.length > 0) {
            const vi = hits[0].face.a;
            const zoneClass = originalColors[vi * 4 + 3];
            showInfo3D(zoneClass);
        }
    });
}

function updateCameraPosition() {
    if (!camera || !targetCenter) return;
    camera.position.set(
        targetCenter.x + camRadius * Math.sin(camPhi) * Math.sin(camTheta),
        targetCenter.y + camRadius * Math.cos(camPhi),
        targetCenter.z + camRadius * Math.sin(camPhi) * Math.cos(camTheta)
    );
    camera.lookAt(targetCenter);
    updateCompass();
    updateMinimap();
}

function animate3D() {
    animFrameId = requestAnimationFrame(animate3D);
    if (isAutoRotate) {
        camTheta -= 0.0015;
        updateCameraPosition();
    }
    if (renderer && scene && camera) renderer.render(scene, camera);
}

// ── KONTROL UI (global functions, dipanggil dari HTML) ──────

function toggleAutoRotate() {
    isAutoRotate = !isAutoRotate;
    updateButtonState('btn-rotate', isAutoRotate);
}
function resetCamera3d() {
    camRadius = 180; camTheta = Math.PI / 4; camPhi = Math.PI / 3;
    isAutoRotate = true;
    updateButtonState('btn-rotate', true);
    updateCameraPosition();
}
function topView3d() {
    camPhi = 0.08;
    updateCameraPosition();
}
function sideView3d() {
    camPhi = Math.PI / 2 - 0.08;
    updateCameraPosition();
}
function zoomIn3d() {
    camRadius = Math.max(40, camRadius - 25);
    updateCameraPosition();
}
function zoomOut3d() {
    camRadius = Math.min(350, camRadius + 25);
    updateCameraPosition();
}

function toggleHighlight() {
    if (!terrain) return;
    isHighlight = !isHighlight;
    updateButtonState('btn-highlight', isHighlight);
    const cols = terrain.geometry.attributes.color.array;
    for (let i = 0; i < cols.length / 3; i++) {
        const r = originalColors[i * 4];
        const g = originalColors[i * 4 + 1];
        const b = originalColors[i * 4 + 2];
        const zone = originalColors[i * 4 + 3];
        const factor = (isHighlight && zone !== 'tinggi') ? 0.18 : 1;
        cols[i * 3]     = r * factor;
        cols[i * 3 + 1] = g * factor;
        cols[i * 3 + 2] = b * factor;
    }
    terrain.geometry.attributes.color.needsUpdate = true;
}

function updateCompass() {
    const compass = document.getElementById('compass3d');
    if (compass) {
        const deg = (camTheta * 180 / Math.PI) % 360;
        compass.style.transform = `rotate(${deg}deg)`;
    }
}

function updateMinimap() {
    const canvas = document.getElementById('minimap3d');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111d2c';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, W - 30, H - 30);

    const cx = W / 2, cy = H / 2;
    const r = (camRadius / 350) * 48;
    const px = cx + r * Math.sin(camTheta);
    const py = cy + r * Math.cos(camTheta);

    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = 'rgba(29,158,117,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#1D9E75';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('U', cx, 12);
}

function showInfo3D(zoneClass) {
    if (typeof KELURAHAN_3D_INFO === 'undefined') return;
    const data = KELURAHAN_3D_INFO[zoneClass];
    if (!data) return;
    const panel = document.getElementById('info3d');
    const zoneEl = document.getElementById('info3d-zone');
    const bodyEl = document.getElementById('info3d-body');
    if (!panel || !zoneEl || !bodyEl) return;
    zoneEl.textContent = data.zone;
    zoneEl.style.color = data.color;
    bodyEl.innerHTML = `
        <div style="margin-bottom:6px"><b>Area:</b> ${data.areas}</div>
        <div style="color:#aaa;margin-bottom:8px;font-size:11px">${data.prob}</div>
        <div style="margin-bottom:6px"><b>Faktor Dominan:</b><br>${data.factors}</div>
        <div style="color:${data.color};font-weight:600">${data.action}</div>
    `;
    panel.style.display = 'block';
}

function updateButtonState(id, isActive) {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle('active', isActive);
}

function resize3D() {
    const container = document.querySelector('.viewer3d-main');
    if (!camera || !renderer || !container) return;
    const w = container.clientWidth, h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi hanya saat viewer-3d visible
    const btn3d = document.getElementById('btn-3d');
    if (btn3d) {
        btn3d.addEventListener('click', () => {
            if (!scene) setTimeout(() => init3D(), 150);
        });
    }
    // Jika langsung di-set visible, init
    const v3 = document.getElementById('viewer-3d');
    if (v3 && v3.style.display !== 'none') {
        setTimeout(() => init3D(), 200);
    }
});
