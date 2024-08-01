// Background code or initialization tasks can be placed here
console.log("Background service worker initialized");
let isOpen = false;

self.addEventListener("fetch", function (event) {
	openFullPage();
	if (event.request.mode === "navigate") {
		event.respondWith(fetch(event.request).catch(() => caches.match("index.html")));
	}
});

const openFullPage = () => {
	if (isOpen) return;

	chrome.storage.local.get(["wallet", "wallets"], (items) => {
		const wallet = items.wallet || {};
		const wallets = items.wallets || [];

		const walletKeys = Object.keys(wallet);

		if (!walletKeys.length && wallets.length < 10) {
			const url = chrome.runtime.getURL("index.html");
			chrome.tabs.create({ url });
		}
	});

	isOpen = true;
};
