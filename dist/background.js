// Background code or initialization tasks can be placed here
console.log("Background service worker initialized");
self.addEventListener("fetch", function (event) {
	console.log({ event });
	if (event.request.mode === "navigate") {
		console.log({ request: event.request });

		event.respondWith(fetch(event.request).catch(() => caches.match("index.html")));
	}
});
