(() => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 901px)").matches) {
        closeMenu();
      }
    });
  }

  const toggleFlipCard = (card) => {
    const flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(flipped));
  };

  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => toggleFlipCard(card));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleFlipCard(card);
      }
    });
  });

  const checkBtn = document.getElementById("check-crossword");
  const resetBtn = document.getElementById("reset-crossword");
  const shuffleBtn = document.getElementById("shuffle-guess");
  const feedback = document.getElementById("crossword-feedback");
  const cluesList = document.getElementById("guess-clues");
  const board = document.getElementById("crossword-board");

  const activities = {
    componentes: {
      success: "¡Correcto! Dominas los componentes básicos.",
      items: [
        {
          clue: "Cerebro del computador que ejecuta instrucciones.",
          answer: "CPU",
          maxLength: 8,
        },
        {
          clue: "Memoria volátil de trabajo rápido.",
          answer: "RAM",
          maxLength: 8,
        },
        {
          clue: "Tarjeta que conecta todos los componentes.",
          answer: "PLACABASE",
          maxLength: 20,
        },
        {
          clue: "Componente especializado en gráficos.",
          answer: "GPU",
          maxLength: 8,
        },
        {
          clue: "Unidad de estado sólido de almacenamiento rápido.",
          answer: "SSD",
          maxLength: 8,
        },
      ],
    },
    introduccion: {
      success: "¡Correcto! Dominas los conceptos básicos del sistema operativo.",
      items: [
        {
          clue: "Programa en ejecución, con memoria, registros y archivos abiertos.",
          answer: "PROCESO",
          maxLength: 12,
        },
        {
          clue: "Capa del sistema operativo más cercana al hardware.",
          answer: "KERNEL",
          maxLength: 12,
        },
        {
          clue: "Software del sistema que sabe manejar un dispositivo concreto.",
          answer: "DRIVER",
          maxLength: 12,
        },
        {
          clue: "Intérprete que espera una orden, la ejecuta y vuelve a esperar.",
          answer: "SHELL",
          maxLength: 12,
        },
        {
          clue: "Técnica que convierte un recurso físico en una versión más fácil de usar.",
          answer: "VIRTUALIZACION",
          maxLength: 16,
        },
      ],
    },
    procesos: {
      success: "¡Correcto! Dominas la gestión de procesos.",
      items: [
        {
          clue: "Estado del proceso mientras espera disco, red o entrada del usuario.",
          answer: "BLOQUEADO",
          maxLength: 12,
        },
        {
          clue: "Algoritmo que atiende procesos estrictamente en orden de llegada.",
          answer: "FCFS",
          maxLength: 8,
        },
        {
          clue: "Algoritmo que prioriza el trabajo con menor tiempo de CPU.",
          answer: "SJF",
          maxLength: 8,
        },
        {
          clue: "Variable entera con operaciones wait y signal para controlar recursos.",
          answer: "SEMAFORO",
          maxLength: 12,
        },
        {
          clue: "Bloqueo mutuo en el que cada proceso espera un recurso que otro retiene.",
          answer: "DEADLOCK",
          maxLength: 12,
        },
      ],
    },
    distribuidos: {
      success: "¡Correcto! Dominas los sistemas operativos distribuidos.",
      items: [
        {
          clue: "Capa de software que intermedia entre aplicaciones, sistemas y redes.",
          answer: "MIDDLEWARE",
          maxLength: 14,
        },
        {
          clue: "Llamada a un procedimiento en otra máquina que parece local.",
          answer: "RPC",
          maxLength: 8,
        },
        {
          clue: "Oculta la separación de nodos para percibir el sistema como uno solo.",
          answer: "TRANSPARENCIA",
          maxLength: 16,
        },
        {
          clue: "Cambio automático al servidor de respaldo cuando falla el principal.",
          answer: "FAILOVER",
          maxLength: 12,
        },
        {
          clue: "Copias de un mismo recurso en varios nodos para disponibilidad.",
          answer: "REPLICACION",
          maxLength: 14,
        },
      ],
    },
  };

  const activityKey = board?.dataset.activity || "componentes";
  const activity = activities[activityKey] || activities.componentes;

  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();

  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const clearFeedback = () => {
    if (!feedback) return;
    feedback.textContent = "";
    feedback.classList.remove("is-ok", "is-bad");
  };

  const renderGuessActivity = (items) => {
    if (!cluesList || !board) return;

    cluesList.innerHTML = "";
    board.innerHTML = "";

    items.forEach((item, index) => {
      const number = index + 1;

      const clue = document.createElement("li");
      clue.textContent = item.clue;
      cluesList.appendChild(clue);

      const label = document.createElement("label");
      label.className = "crossword-row";

      const badge = document.createElement("span");
      badge.textContent = String(number);

      const input = document.createElement("input");
      input.maxLength = item.maxLength;
      input.dataset.answer = item.answer;
      input.setAttribute("aria-label", `Respuesta ${number}`);

      label.append(badge, input);
      board.appendChild(label);
    });
  };

  if (cluesList && board) {
    renderGuessActivity(shuffle(activity.items));
  }

  if (checkBtn && feedback && board) {
    checkBtn.addEventListener("click", () => {
      const inputs = board.querySelectorAll("input");
      let correct = 0;

      inputs.forEach((input) => {
        const expected = normalize(input.dataset.answer || "");
        const given = normalize(input.value || "");
        const ok = given === expected;
        input.classList.remove("is-correct", "is-wrong");
        input.classList.add(ok ? "is-correct" : "is-wrong");
        if (ok) correct += 1;
      });

      feedback.classList.remove("is-ok", "is-bad");

      if (correct === inputs.length) {
        feedback.textContent = activity.success;
        feedback.classList.add("is-ok");
      } else {
        feedback.textContent = `Bien: ${correct} de ${inputs.length}. Revisa las pistas e inténtalo de nuevo.`;
        feedback.classList.add("is-bad");
      }
    });
  }

  if (resetBtn && feedback && board) {
    resetBtn.addEventListener("click", () => {
      board.querySelectorAll("input").forEach((input) => {
        input.value = "";
        input.classList.remove("is-correct", "is-wrong");
      });
      clearFeedback();
    });
  }

  if (shuffleBtn && cluesList && board) {
    shuffleBtn.addEventListener("click", () => {
      renderGuessActivity(shuffle(activity.items));
      clearFeedback();
    });
  }

  document.querySelectorAll(".media-frame img").forEach((img) => {
    const frame = img.closest(".media-frame");

    const markEmpty = () => {
      img.style.display = "none";
      frame?.classList.add("is-empty");
    };

    img.addEventListener("error", markEmpty);

    if (img.complete && img.naturalWidth === 0) {
      markEmpty();
    }
  });

  document.querySelectorAll("[data-video-frame]").forEach((frame) => {
    const video = frame.querySelector("video");
    const placeholder = frame.querySelector(".video-placeholder");
    if (!video || !placeholder) return;

    const markEmpty = () => {
      frame.classList.add("is-empty");
      placeholder.hidden = false;
    };

    video.addEventListener("error", markEmpty);

    const source = video.querySelector("source");
    if (source) {
      source.addEventListener("error", markEmpty);
    }
  });

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  };

  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const payload = button.dataset.copy || "";
      if (!payload) return;

      await copyText(payload);
      const previous = button.textContent;
      button.textContent = "Copiado";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = previous;
        button.classList.remove("is-copied");
      }, 1200);
    });
  });

  const rail = document.getElementById("page-toc");
  if (rail) {
    const existing = document.querySelector(".prose .toc");
    if (existing) {
      rail.appendChild(existing);
    } else {
      const headings = document.querySelectorAll(".doc-main h2");
      if (headings.length) {
        const nav = document.createElement("nav");
        nav.className = "toc";
        nav.setAttribute("aria-label", "En esta página");
        const label = document.createElement("p");
        label.textContent = "En esta página";
        const list = document.createElement("ol");
        headings.forEach((heading) => {
          if (!heading.id) {
            heading.id = heading.textContent
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "");
          }
          const item = document.createElement("li");
          const link = document.createElement("a");
          link.href = `#${heading.id}`;
          link.textContent = heading.textContent;
          item.appendChild(link);
          list.appendChild(item);
        });
        nav.append(label, list);
        rail.appendChild(nav);
      }
    }

    const tocLinks = [...rail.querySelectorAll("a")];
    const sections = tocLinks
      .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
      .filter(Boolean);

    if (tocLinks.length && sections.length && "IntersectionObserver" in window) {
      const setCurrent = (id) => {
        tocLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${id}`;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      };
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible) setCurrent(visible.target.id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.4] }
      );
      sections.forEach((section) => observer.observe(section));
    }
  }

  const catalog = [
    {
      title: "Inicio",
      hint: "Visión general del curso",
      text: "sistema operativo recursos hardware aplicaciones",
      path: "index.html",
    },
    {
      title: "Conocimientos previos",
      hint: "CPU, RAM, placa base, GPU y almacenamiento",
      text: "hardware componentes",
      path: "temas/conocimientos-previos.html",
    },
    {
      title: "Introducción a los sistemas operativos",
      hint: "Kernel, procesos, memoria y archivos",
      text: "shell drivers llamadas al sistema",
      path: "temas/introduccion.html",
    },
    {
      title: "Gestión de procesos",
      hint: "Planificación, semáforos y deadlock",
      text: "FCFS SJF sección crítica",
      path: "temas/gestion-procesos.html",
    },
    {
      title: "Sistemas operativos distribuidos",
      hint: "Redes, fallos y escalabilidad",
      text: "cliente servidor RPC transparencia failover middleware",
      path: "temas/sistemas-distribuidos.html",
    },
    {
      title: "Proyecto: Video tutorial",
      hint: "USB booteable e instalación",
      text: "disco formateado",
      path: "temas/proyecto-video.html",
    },
  ];

  const root = document.body.dataset.root || "";
  const hrefFor = (path) => {
    if (!root) return path;
    if (path.startsWith("temas/")) return path.slice("temas/".length);
    return `${root}${path}`;
  };

  const trigger = document.querySelector(".search-trigger");
  if (trigger) {
    const layer = document.createElement("div");
    layer.className = "search-layer";
    layer.hidden = true;
    layer.innerHTML = `
      <div class="search-dialog" role="dialog" aria-modal="true" aria-label="Buscar en la documentación">
        <input class="search-input" type="search" placeholder="Buscar en la documentación" aria-label="Buscar" />
        <ul class="search-results"></ul>
        <p class="search-hint"><kbd>Enter</kbd> abre · <kbd>Esc</kbd> cierra</p>
      </div>`;
    document.body.appendChild(layer);

    const input = layer.querySelector(".search-input");
    const results = layer.querySelector(".search-results");
    let active = 0;
    let current = catalog;

    const render = () => {
      results.innerHTML = "";
      if (!current.length) {
        const empty = document.createElement("li");
        empty.className = "search-empty";
        empty.textContent = "Sin resultados";
        results.appendChild(empty);
        return;
      }
      current.forEach((item, index) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        if (index === active) button.classList.add("is-active");
        const title = document.createElement("span");
        title.textContent = item.title;
        const hint = document.createElement("small");
        hint.textContent = item.hint;
        button.append(title, hint);
        button.addEventListener("click", () => {
          window.location.href = hrefFor(item.path);
        });
        li.appendChild(button);
        results.appendChild(li);
      });
    };

    const openSearch = () => {
      layer.hidden = false;
      input.value = "";
      current = catalog;
      active = 0;
      render();
      input.focus();
    };

    const closeSearch = () => {
      layer.hidden = true;
      trigger.focus();
    };

    trigger.addEventListener("click", openSearch);
    layer.addEventListener("click", (event) => {
      if (event.target === layer) closeSearch();
    });

    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      current = catalog.filter((item) =>
        `${item.title} ${item.hint} ${item.text}`.toLowerCase().includes(query)
      );
      active = 0;
      render();
    });

    document.addEventListener("keydown", (event) => {
      const command = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (command) {
        event.preventDefault();
        if (layer.hidden) openSearch();
        else closeSearch();
        return;
      }
      if (layer.hidden) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeSearch();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        active = Math.min(active + 1, current.length - 1);
        render();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      } else if (event.key === "Enter" && current[active]) {
        event.preventDefault();
        window.location.href = hrefFor(current[active].path);
      }
    });
  }
})();
