(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  $$(".js-year").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const cookieBar = $("#cookieBar");
  const cookieBtn = $("#cookieAccept");
  if (cookieBar && cookieBtn) {
    const cookieKey = "sopracciglieria-cookie";
    if (!localStorage.getItem(cookieKey)) {
      cookieBar.hidden = false;
      cookieBar.classList.add("is-visible");
    }
    cookieBtn.addEventListener("click", () => {
      localStorage.setItem(cookieKey, "1");
      cookieBar.classList.remove("is-visible");
      cookieBar.hidden = true;
    });
  }

  window.addEventListener("load", () => {
    const preloader = $("#preloader");
    if (!preloader) return;
    setTimeout(() => preloader.classList.add("is-hidden"), 400);
  });

  const nav = $("#nav");
  const toggle = $("#navToggle");
  const setNavOpen = (open) => {
    nav?.classList.toggle("is-open", open);
    toggle?.classList.toggle("is-open", open);
    toggle?.setAttribute("aria-expanded", String(open));
    toggle?.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
    document.body.classList.toggle("nav-locked", open);
  };
  if (nav && toggle) {
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      setNavOpen(!nav.classList.contains("is-open"));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setNavOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 1101px)").matches) setNavOpen(false);
    });
  }

  const slides = $$(".hero-slide");
  const dotsWrap = $("#heroDots");
  let slideIndex = 0;
  let slideTimer;

  const goSlide = (index) => {
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === slideIndex));
    $$("button", dotsWrap).forEach((d, i) => d.classList.toggle("is-active", i === slideIndex));
  };

  if (slides.length && dotsWrap) {
    slides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Vai alla slide ${i + 1}`);
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        goSlide(i);
        restartSlider();
      });
      dotsWrap.appendChild(btn);
    });
    const restartSlider = () => {
      clearInterval(slideTimer);
      slideTimer = setInterval(() => goSlide(slideIndex + 1), 6500);
    };
    restartSlider();
  }

  const quotes = $$("#testimonials .testimonial");
  const qDots = $("#testimonialDots");
  let qIndex = 0;
  if (quotes.length && qDots) {
    quotes.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", `Testimonianza ${i + 1}`);
      if (i === 0) btn.classList.add("is-active");
      btn.addEventListener("click", () => showQuote(i));
      qDots.appendChild(btn);
    });
    const showQuote = (index) => {
      qIndex = index;
      quotes.forEach((q, i) => q.classList.toggle("is-active", i === index));
      $$("button", qDots).forEach((d, i) => d.classList.toggle("is-active", i === index));
    };
    setInterval(() => showQuote((qIndex + 1) % quotes.length), 7000);
  }

  $$(".faq-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".faq-tabs button").forEach((b) => b.classList.toggle("is-active", b === btn));
      $$(".faq-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.panel === tab));
    });
  });

  $$(".accordion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".accordion-item");
      const panel = btn.closest(".faq-panel") || document;
      const opening = !btn.classList.contains("is-open");
      $$(".accordion-btn", panel).forEach((b) => b.classList.remove("is-open"));
      $$(".accordion-body", panel).forEach((b) => b.classList.remove("is-open"));
      if (opening && item) {
        btn.classList.add("is-open");
        const body = item.querySelector(".accordion-body");
        if (body) body.classList.add("is-open");
      }
    });
  });

  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const closeLb = () => lightbox?.classList.remove("is-open");

  $$("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = link.querySelector("img")?.alt || "";
      lightbox.classList.add("is-open");
    });
  });
  $("#lightboxClose")?.addEventListener("click", closeLb);
  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });

  const toTop = $("#toTop");
  const onScroll = () => {
    toTop?.classList.toggle("is-visible", window.scrollY > 500);
    const sections = $$("main section[id]");
    const fromTop = window.scrollY + 140;
    let current = "";
    sections.forEach((sec) => {
      if (sec.offsetTop <= fromTop) current = sec.id;
    });
    $$(".nav a").forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === `#${current}`);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const handleForm = (form, note) => {
    if (!form || !note) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.className = "form-note";
      if (!form.checkValidity()) {
        note.classList.add("err");
        note.textContent = "Controlla i campi obbligatori e riprova.";
        form.reportValidity();
        return;
      }
      note.classList.add("ok");
      note.textContent = "Richiesta inviata. Ti ricontatto entro 24 ore.";
      form.reset();
    });
  };
  handleForm($("#bookingForm"), $("#formNote"));
  handleForm($("#contactForm"), $("#contactNote"));

  const reveal = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("is-in"));
  }
})();
