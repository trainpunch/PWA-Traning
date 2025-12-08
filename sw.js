// Service Worker for Train Punch
const CACHE_NAME = 'train-punch-cache-v51';

const ASSETS = [
  './',
  './index.html',
  './session.html',
  './analysis.html',
  './history.html',
  './settings.html',
  './shop.html',
  './blog.html',
  './about.html',     // アプリ説明
  './privacy.html',   // プライバシーポリシー
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './posts.json',     // 旧方式のファイル。残しておいても害はないのでそのままでもOK

  // ▼ 新しいUI用画像アセット ▼
  './images/bg-gears.jpg',
  './images/btn-plate.png',
  './images/frame-panel.png',
  './images/logo-trainpunch.png',
  './images/icon-glove-32.png',
  './images/icon-glove-192.png',
  './images/icon-glove-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      return (
        cached ||
        fetch(req).catch(() => {
          if (req.mode === 'navigate') {
            // オフライン時はとりあえず session.html を返す
            return caches.match('./session.html') || caches.match('./index.html');
          }
        })
      );
    })
  );
});