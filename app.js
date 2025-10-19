const root = document.documentElement;
const cursorOrb = document.querySelector(".cursor-orb");
const parallaxLayer = document.querySelector(".background-parallax");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

if (!prefersReducedMotion) {
  root.style.setProperty("--parallax-x", "0vmin");
  root.style.setProperty("--parallax-y", "0vmin");
}

const updateParallax = (x = 0, y = 0) => {
  if (!parallaxLayer || prefersReducedMotion) {
    return;
  }
  root.style.setProperty("--parallax-x", `${x}vmin`);
  root.style.setProperty("--parallax-y", `${y}vmin`);
};

(() => {
  const navPills = document.querySelectorAll(".nav-pill");
  const currentPage = document.body.dataset.page || "";

  navPills.forEach((pill) => {
    const target = pill.dataset.page || "";
    pill.classList.toggle("is-active", target === currentPage);
  });
})();

(() => {
  const interactiveButtons = document.querySelectorAll(".btn-primary, .btn-outline, .btn-text");

  interactiveButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      ripple.className = "ripple";

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const hasPointer = event.clientX !== 0 || event.clientY !== 0;
      const x = hasPointer ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2;
      const y = hasPointer ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });
})();

(() => {
  if (!supportsFinePointer || !cursorOrb) {
    return;
  }

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let currentX = pointerX;
  let currentY = pointerY;
  let orbVisible = false;

  const renderOrb = () => {
    currentX += (pointerX - currentX) * 0.18;
    currentY += (pointerY - currentY) * 0.18;

    cursorOrb.style.left = `${currentX}px`;
    cursorOrb.style.top = `${currentY}px`;
    cursorOrb.style.setProperty("--scale", orbVisible ? 0.85 : 0.45);
    cursorOrb.style.opacity = orbVisible ? "0.48" : "0";

    requestAnimationFrame(renderOrb);
  };

  renderOrb();

  window.addEventListener("pointermove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    orbVisible = true;

    if (!prefersReducedMotion) {
      const xp = pointerX / window.innerWidth;
      const yp = pointerY / window.innerHeight;
      updateParallax((xp - 0.5) * 12, (yp - 0.5) * 12);
    }
  });

  window.addEventListener("pointerleave", () => {
    orbVisible = false;
    updateParallax(0, 0);
  });
})();

(() => {
  // Scroll-triggered reveal + progress indicators
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  const progressElements = document.querySelectorAll(".bar-track[data-progress], .radial-progress[data-progress]");

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });

    progressElements.forEach((element) => {
      const targetValue = Number(element.dataset.progress || 0);

      if (element.classList.contains("bar-track")) {
        if (!element.style.getPropertyValue("--target-width") && Number.isFinite(targetValue)) {
          element.style.setProperty("--target-width", `${targetValue}%`);
        }
        element.classList.add("is-active");
      } else if (element.classList.contains("radial-progress") && Number.isFinite(targetValue)) {
        element.style.setProperty("--progress", targetValue);
      }
    });

    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target;
        target.classList.add("is-visible");
        observer.unobserve(target);
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
  );

  revealElements.forEach((element) => {
    const delay = element.dataset.revealDelay;

    if (delay) {
      element.style.setProperty("--reveal-delay", delay);
    }
    revealObserver.observe(element);
  });

  const progressObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const targetValue = Number(element.dataset.progress || 0);

        if (element.classList.contains("radial-progress") && Number.isFinite(targetValue)) {
          element.style.setProperty("--progress", targetValue);
          element.classList.add("is-active");
        } else if (element.classList.contains("bar-track")) {
          element.classList.add("is-active");
        }

        observer.unobserve(element);
      });
    },
    { threshold: 0.45, rootMargin: "0px 0px -10% 0px" }
  );

  progressElements.forEach((element) => {
    const targetValue = Number(element.dataset.progress || 0);

    if (element.classList.contains("bar-track")) {
      if (!element.style.getPropertyValue("--target-width") && Number.isFinite(targetValue)) {
        element.style.setProperty("--target-width", `${targetValue}%`);
      }

      element.classList.add("progress-init");
      progressObserver.observe(element);
    } else if (element.classList.contains("radial-progress") && Number.isFinite(targetValue)) {
      element.style.setProperty("--progress", 0);
      progressObserver.observe(element);
    }
  });
})();
