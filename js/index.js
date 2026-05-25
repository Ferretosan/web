window.addEventListener("DOMContentLoaded", () => {
	const loadingScreen = document.querySelector(".loadingScreen");

	if (!loadingScreen) {
		return;
	}

	setTimeout(() => {
		loadingScreen.classList.add("loadingScreen--hidden");
	}, 1400);
});
