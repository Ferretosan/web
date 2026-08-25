window.addEventListener("DOMContentLoaded", () => {
	const loadingScreen = document.querySelector(".loadingScreen");
	const startButton = document.querySelector("#hub-button");
	const startMenu = document.querySelector("#start-menu");
	const dropdown = document.querySelector(".dropdown");
	const dropdownButton = document.querySelector(".dropbtn");
	const dropdownContent = document.querySelector(".dropdown-content");
	const heroInfoRows = document.querySelectorAll(".heroInfo");
	const heroSection = document.querySelector(".hero");
	const scrollDownIndicator = document.querySelector(".scrollDown");

	heroInfoRows.forEach((row) => {
		row.addEventListener(
			"wheel",
			(event) => {
				if (event.deltaY === 0) {
					return;
				}

				const maxScrollLeft = row.scrollWidth - row.clientWidth;
				if (maxScrollLeft <= 0) {
					return;
				}

				const scrollingRight = event.deltaY > 0;
				const canScrollRight = row.scrollLeft < maxScrollLeft;
				const canScrollLeft = row.scrollLeft > 0;

				if ((scrollingRight && !canScrollRight) || (!scrollingRight && !canScrollLeft)) {
					return;
				}

				event.preventDefault();
				row.scrollBy({ left: event.deltaY, top: 0 });
			},
			{ passive: false }
		);
	});

	if (heroSection && scrollDownIndicator) {
		const updateScrollDownIndicator = () => {
			const heroRect = heroSection.getBoundingClientRect();
			const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
			const heroIsVisible = heroRect.bottom > 0 && heroRect.top < viewportHeight;
			const heroCoversViewport = heroRect.top <= 0 && heroRect.bottom >= viewportHeight;
			const shouldShowIndicator = heroIsVisible && !heroCoversViewport;

			scrollDownIndicator.classList.toggle("scrollDown--visible", shouldShowIndicator);
		};

		window.addEventListener("scroll", updateScrollDownIndicator, { passive: true });
		window.addEventListener("resize", updateScrollDownIndicator);
		updateScrollDownIndicator();
	}

	if (loadingScreen) {
		setTimeout(() => {
			loadingScreen.classList.add("loadingScreen--hidden");
		}, 1400);
	}

	if (!startButton || !startMenu) {
		// The start menu only exists on the hub UI.
	} else {
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
	}

	if (dropdown && dropdownButton && dropdownContent) {
		const setDropdownOpen = (isOpen) => {
			dropdown.classList.toggle("dropdown--open", isOpen);
			dropdownButton.setAttribute("aria-expanded", String(isOpen));
		};

		dropdownButton.addEventListener("click", (event) => {
			event.preventDefault();
			event.stopPropagation();
			setDropdownOpen(!dropdown.classList.contains("dropdown--open"));
		});

		document.addEventListener("click", (event) => {
			if (!dropdown.contains(event.target)) {
				setDropdownOpen(false);
			}
		});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") {
				setDropdownOpen(false);
				dropdownButton.focus();
			}
		});

		dropdownContent.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", () => {
				setDropdownOpen(false);
			});
		});
	}
});
