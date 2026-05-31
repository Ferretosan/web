window.addEventListener("DOMContentLoaded", () => {
	const loadingScreen = document.querySelector(".loadingScreen");
	const startButton = document.querySelector("#hub-button");
	const startMenu = document.querySelector("#start-menu");

	if (!loadingScreen) {
		return;
	}

	setTimeout(() => {
		loadingScreen.classList.add("loadingScreen--hidden");
	}, 1400);

	if (!startButton || !startMenu) {
		return;
	}

	const setStartMenuOpen = (isOpen) => {
		startMenu.classList.toggle("startMenuContent--open", isOpen);
		startMenu.setAttribute("aria-hidden", String(!isOpen));
		startButton.setAttribute("aria-expanded", String(isOpen));
	};

	startButton.addEventListener("click", (event) => {
		event.preventDefault();
		setStartMenuOpen(!startMenu.classList.contains("startMenuContent--open"));
	});

	document.addEventListener("click", (event) => {
		if (startMenu.classList.contains("startMenuContent--open") && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
			setStartMenuOpen(false);
		}
	});
});
