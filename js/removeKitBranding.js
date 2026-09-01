function removeKitBranding() {
  document.querySelectorAll(".formkit-powered-by-convertkit-container").forEach(el => el.remove());
}

function removePadding() {
  document.querySelectorAll('[data-style="clean"]').forEach(el => el.style.padding = 0);
}

removeKitBranding();
removePadding();

new MutationObserver(removeKitBranding).observe(document.body, { childList: true, subtree: true });
new MutationObserver(removePadding).observe(document.body, { childList: true, subtree: true });
