/* ============================================================
 * Service Worker - 离线缓存
 * 评茶员考核系统 PWA
 * ============================================================ */

var CACHE_NAME = 'tea-exam-v4';
var ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './js/radar.js',
  './manifest.json'
];

/* 安装：预缓存核心资源 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function() {
        /* 部分资源缺失不阻断安装 */
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

/* 激活：清理旧缓存 */
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

/* 拦截请求：缓存优先，网络回退 */
self.addEventListener('fetch', function(event) {
  var req = event.request;
  /* 只处理 GET 请求 */
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) return cached;
      return fetch(req).then(function(resp) {
        /* 缓存同源静态资源 */
        if (resp && resp.status === 200 && resp.type === 'basic') {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(req, clone).catch(function() {});
          });
        }
        return resp;
      }).catch(function() {
        /* 离线回退：返回首页 */
        return caches.match('./index.html');
      });
    })
  );
});
