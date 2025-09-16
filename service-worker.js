// サービスワーカーがインストールされたときにキャッシュを準備
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-cache-v1').then((cache) => {
      return cache.addAll(['/share-target/', '/share-target/index.html']);
    })
  );
});

// 共有されたデータを受け取る
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname.endsWith('/share-target/') && url.searchParams.has('title')) {
    // URLのパラメータをそのままindex.htmlに渡す
    event.respondWith(
      caches.match('/share-target/index.html').then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  } else {
    // その他のリクエストは通常通り処理
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});