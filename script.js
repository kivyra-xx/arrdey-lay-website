const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

const heroSlides = Array.from(document.querySelectorAll(".hero-slide"));

if (heroSlides.length > 0) {
  heroSlides.forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
    }, { once: true });
  });

  const waitForSlide = (image) => {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  };

  Promise.all(heroSlides.map(waitForSlide)).then(() => {
    const availableSlides = heroSlides.filter((image) => image.naturalWidth > 0);
    if (availableSlides.length === 0) return;

    let activeSlide = -1;
    const showRandomSlide = () => {
      const choices = availableSlides
        .map((image, index) => ({ image, index }))
        .filter(({ index }) => index !== activeSlide);
      const next = choices[Math.floor(Math.random() * choices.length)];

      if (!next) return;
      if (activeSlide !== -1) {
        availableSlides[activeSlide].classList.remove("is-active");
      }
      next.image.classList.add("is-active");
      activeSlide = next.index;
    };

    showRandomSlide();
    if (availableSlides.length > 1) {
      window.setInterval(showRandomSlide, 10_000);
    }
  });
}

document.querySelectorAll(".release-artwork img, .artist-artwork img").forEach((image) => {
  const showFallback = () => {
    const artwork = image.parentElement;
    if (!artwork) return;

    image.hidden = true;
    artwork.classList.add("image-unavailable");
    artwork.setAttribute("role", "img");
    artwork.setAttribute("aria-label", image.alt);
  };

  image.addEventListener("error", showFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";

    if (link.hash === "#booking") {
      bookingPinned = true;
      setBookingOpen(true);
    }
  });
});

const bookingDisclosure = document.getElementById("booking");
const bookingSummary = bookingDisclosure.querySelector("summary");
let bookingPinned = false;

const setBookingOpen = (isOpen) => {
  bookingDisclosure.open = isOpen;
  bookingSummary.setAttribute(
    "aria-label",
    `${isOpen ? "Hide" : "Show"} bookings and collaborations`,
  );
};

bookingSummary.addEventListener("click", (event) => {
  event.preventDefault();
  bookingPinned = !bookingPinned;
  setBookingOpen(bookingPinned);
});

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  bookingDisclosure.addEventListener("mouseenter", () => {
    if (!bookingPinned) setBookingOpen(true);
  });

  bookingDisclosure.addEventListener("mouseleave", () => {
    if (!bookingPinned) setBookingOpen(false);
  });
}