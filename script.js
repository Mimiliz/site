// Menu mobile + rolagem suave + link ativo (scrollspy) + fechar menu ao clicar

(function () {
  const header = document.querySelector("header");
  const nav = document.querySelector("nav");
  const ul = nav?.querySelector("ul");
  const links = Array.from(document.querySelectorAll("nav a[href^='#']"));

  // --- Cria botão de menu para mobile ---
  if (nav && ul) {
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.textContent = "Menu";

    nav.insertBefore(btn, ul);

    btn.addEventListener("click", () => {
      const isOpen = ul.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      btn.textContent = isOpen ? "Fechar" : "Menu";
    });

    // Fecha menu ao clicar em um item
    links.forEach((a) => {
      a.addEventListener("click", () => {
        if (ul.classList.contains("open")) {
          ul.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
          btn.textContent = "Menu";
        }
      });
    });
  }

  // --- Scroll suave com compensação do header sticky ---
  function scrollToWithOffset(id) {
    const el = document.querySelector(id);
    if (!el) return;

    const headerH = header ? header.getBoundingClientRect().height : 0;
    const y = el.getBoundingClientRect().top + window.scrollY - headerH - 12;

    window.scrollTo({ top: y, behavior: "smooth" });
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("href");
      if (id) scrollToWithOffset(id);
      history.pushState(null, "", id);
    });
  });

  // --- Scrollspy: destaca o link da seção visível ---
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      // pega a entrada mais "visível"
      const visible = entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      const id = "#" + visible.target.id;
      links.forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === id);
      });
    },
    {
      root: null,
      threshold: [0.25, 0.4, 0.6],
      rootMargin: "-20% 0px -65% 0px",
    }
  );

  sections.forEach((sec) => observer.observe(sec));
})();