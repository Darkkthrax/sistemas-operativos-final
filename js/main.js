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
      if (window.matchMedia("(min-width: 761px)").matches) {
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
        input.style.borderColor = ok ? "#2f7d4a" : "#a33b5c";
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
        input.style.borderColor = "";
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
})();
