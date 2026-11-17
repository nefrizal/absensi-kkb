/* Service worker Absensi KKB — agar bisa dipasang sebagai aplikasi di HP.
 * Halaman selalu diambil dari internet (absen memang butuh online),
 * ikon & model pengenal wajah disimpan agar pembukaan berikutnya lebih cepat.
 */
const CACHE = 'absensi-kkb-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET') return; // kiriman absen (POST) tidak disentuh
  const simpan = url.includes('/face-api@') || url.includes('/jsqr@') || url.includes('/icons/');
  if (!simpan) return; // halaman, login Google, API: langsung ke internet
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit => hit ||
    fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
});
