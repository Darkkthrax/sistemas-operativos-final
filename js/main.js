(() => {
  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    const icon = document.querySelector('link[rel="icon"]');
    if (icon) {
      const file = theme === "dark" ? "logo-dark.png" : "logo-light.png";
      icon.href = icon.href.replace(/logo-(?:light|dark)\.png/, file);
    }
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute(
        "aria-label",
        dark ? "Activar modo claro" : "Activar modo oscuro"
      );
    }
  };

  if (!document.body.classList.contains("doom")) {
    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      const current =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "dark"
          : "light";
      applyTheme(current);
      themeToggle.addEventListener("click", () => {
        const next =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        try {
          localStorage.setItem("theme", next);
        } catch (error) {
          /* preference stays for this visit */
        }
        applyTheme(next);
      });
    }
  }

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

  const flow = document.getElementById("workflow-game");

  if (flow) {
    const bank = document.getElementById("workflow-bank");
    const line = document.getElementById("workflow-line");
    const lineZone = line.closest(".flow-zone");
    const bankZone = bank.closest(".flow-zone");
    const empty = document.getElementById("workflow-empty");
    const count = document.getElementById("workflow-count");
    const flowFeedback = document.getElementById("workflow-feedback");
    const flowStatus = document.getElementById("workflow-status");
    const flowCheck = document.getElementById("workflow-check");
    const flowReset = document.getElementById("workflow-reset");

    const steps = [
      {
        id: "pedir",
        who: "usuario",
        whoLabel: "Usuario",
        title: "Pide abrir el juego",
        detail:
          "Doble clic en el icono, o el nombre del ejecutable escrito en la terminal. La persona no reparte memoria ni habla con el disco.",
        topic: "Hardware, software, usuario y aplicaciones",
      },
      {
        id: "shell",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "El shell traduce esa orden",
        detail:
          "El intérprete, gráfico o de texto, analiza la acción y prepara la petición. Un icono y un comando son la misma orden vista de dos maneras.",
        topic: "Consola y shell",
      },
      {
        id: "trap",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "La llamada entra al núcleo",
        detail:
          "Crear un proceso es privilegiado. Un trap pasa a modo kernel y el núcleo toma el control.",
        topic: "Núcleo, drivers y llamadas al sistema",
      },
      {
        id: "archivo",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "El sistema de archivos abre el ejecutable",
        detail:
          "Busca el nombre en el directorio y revisa los permisos. Si la cuenta no puede leerlo, el arranque se detiene ahí.",
        topic: "Archivos y directorios",
      },
      {
        id: "disco",
        who: "hardware",
        whoLabel: "Hardware",
        title: "El disco entrega el programa",
        detail:
          "El manejador pide los bloques al controlador. Quien lanzó la orden queda bloqueado hasta que una interrupción avisa que la lectura terminó.",
        topic: "Dispositivos de entrada y salida",
      },
      {
        id: "memoria",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "Se arma el espacio de direcciones",
        detail:
          "El código, el heap y la pila quedan en direcciones virtuales. La MMU las traduce a RAM física, aparte de los demás procesos.",
        topic: "Memoria",
      },
      {
        id: "proceso",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "Nace un proceso en estado listo",
        detail:
          "El archivo pasa a ser un proceso: registros, contador de programa y archivos abiertos. Entra a la cola en estado listo.",
        topic: "Procesos y planificación",
      },
      {
        id: "aislamiento",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "Queda aislado del resto del equipo",
        detail:
          "Queda en modo usuario y con memoria propia. Puede usar los recursos, pero no pisar a otros programas ni escribir el disco por su cuenta.",
        topic: "Concepto y propósito",
      },
      {
        id: "cpu",
        who: "sistema",
        whoLabel: "Sistema operativo",
        title: "El planificador le da la CPU",
        detail:
          "Pasa de listo a en ejecución. Un temporizador puede quitársela para que el navegador, la música o una descarga también avancen.",
        topic: "Administración de recursos",
      },
      {
        id: "frame",
        who: "hardware",
        whoLabel: "Hardware",
        title: "CPU y GPU sacan el primer fotograma",
        detail:
          "La CPU ejecuta instrucciones y la GPU dibuja la ventana. Ahí se juntan la ejecución, la interfaz y los dispositivos.",
        topic: "Funciones principales",
      },
    ];

    const moveLabel = {
      up: "Subir",
      down: "Bajar",
      take: "Colocar en la secuencia",
      back: "Devolver a las piezas",
    };

    const moveGlyph = {
      up: "↑",
      down: "↓",
      take: "→",
      back: "←",
    };

    const makeMove = (action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.move = action;
      button.setAttribute("aria-label", moveLabel[action]);
      button.textContent = moveGlyph[action];
      return button;
    };

    const makeCard = (step) => {
      const card = document.createElement("li");
      card.className = "flow-card";
      card.dataset.id = step.id;
      card.tabIndex = 0;
      card.setAttribute("aria-label", `${step.whoLabel}. ${step.title}`);

      const grip = document.createElement("span");
      grip.className = "flow-grip";
      grip.setAttribute("aria-hidden", "true");

      const main = document.createElement("div");
      main.className = "flow-card-main";

      const kicker = document.createElement("div");
      kicker.className = "flow-kicker";

      const index = document.createElement("span");
      index.className = "flow-index";
      index.hidden = true;

      const who = document.createElement("p");
      who.className = "flow-who";
      who.textContent = step.whoLabel;

      const title = document.createElement("p");
      title.className = "flow-title";
      title.textContent = step.title;

      const detail = document.createElement("p");
      detail.className = "flow-detail";
      detail.textContent = step.detail;

      const topic = document.createElement("p");
      topic.className = "flow-topic";
      topic.textContent = step.topic;

      kicker.append(index, who);
      main.append(kicker, title, detail, topic);

      const moves = document.createElement("div");
      moves.className = "flow-moves";
      moves.append(makeMove("up"), makeMove("down"), makeMove("take"), makeMove("back"));

      card.append(grip, main, moves);
      card.dataset.who = step.who;
      return card;
    };

    const clearFlowFeedback = () => {
      flowFeedback.textContent = "";
      flowFeedback.classList.remove("is-ok", "is-bad");
    };

    const sync = () => {
      const paint = (list, inLine) => {
        [...list.querySelectorAll(":scope > .flow-card")].forEach((card, index) => {
          card.classList.remove("is-correct", "is-wrong");
          const indexEl = card.querySelector(".flow-index");
          indexEl.hidden = !inLine;
          indexEl.textContent = inLine ? String(index + 1).padStart(2, "0") : "";
          card.querySelector('[data-move="take"]').hidden = inLine;
          card.querySelector('[data-move="back"]').hidden = !inLine;
          card.querySelector('[data-move="up"]').hidden = !inLine || index === 0;
          card.querySelector('[data-move="down"]').hidden =
            !inLine || index === list.querySelectorAll(":scope > .flow-card").length - 1;
        });
      };

      paint(bank, false);
      paint(line, true);
      const placed = line.querySelectorAll(":scope > .flow-card").length;
      const pending = Boolean(line.querySelector(":scope > .flow-slot"));
      empty.hidden = placed > 0 || pending;
      count.textContent = `${placed + (pending ? 1 : 0)}/${steps.length}`;
    };

    const announce = (card) => {
      const title = card.querySelector(".flow-title").textContent;
      const inLine = card.parentElement === line;
      if (!inLine) {
        flowStatus.textContent = `${title} volvió a las piezas.`;
        return;
      }
      const index = [...line.querySelectorAll(":scope > .flow-card")].indexOf(card);
      flowStatus.textContent = `${title} quedó en el paso ${index + 1}.`;
    };

    const placeCards = () => {
      bank.replaceChildren();
      line.replaceChildren();
      shuffle(steps).forEach((step) => bank.appendChild(makeCard(step)));
      sync();
      clearFlowFeedback();
      flowStatus.textContent = "";
    };

    const moveCard = (card, action) => {
      if (action === "take") line.appendChild(card);
      if (action === "back") bank.appendChild(card);
      if (action === "up" && card.previousElementSibling) {
        card.parentElement.insertBefore(card, card.previousElementSibling);
      }
      if (action === "down" && card.nextElementSibling) {
        card.parentElement.insertBefore(card.nextElementSibling, card);
      }
      sync();
      clearFlowFeedback();
      announce(card);
      card.focus();
    };

    let drag = null;

    const clearHover = () => {
      lineZone.classList.remove("is-over");
      bankZone.classList.remove("is-over");
    };

    const liftCard = (event) => {
      const rect = drag.card.getBoundingClientRect();
      const slot = document.createElement("li");
      slot.className = "flow-slot";
      slot.style.height = `${rect.height}px`;
      drag.slot = slot;
      drag.card.before(slot);
      drag.offsetX = event.clientX - rect.left;
      drag.offsetY = event.clientY - rect.top;
      drag.card.style.width = `${rect.width}px`;
      drag.card.style.left = `${rect.left}px`;
      drag.card.style.top = `${rect.top}px`;
      drag.card.classList.add("is-lifted");
      document.body.appendChild(drag.card);
      document.body.classList.add("is-dragging-flow");
      drag.active = true;
      sync();
    };

    const moveSlot = (event) => {
      drag.card.style.pointerEvents = "none";
      const target = document.elementFromPoint(event.clientX, event.clientY);
      drag.card.style.pointerEvents = "";
      if (!target || target === drag.slot || drag.slot.contains(target)) return;

      const zone = target.closest(".flow-zone");
      if (!zone || !flow.contains(zone)) {
        clearHover();
        return;
      }

      const list = zone.querySelector(".flow-list");
      lineZone.classList.toggle("is-over", zone === lineZone);
      bankZone.classList.toggle("is-over", zone === bankZone);

      const over = target.closest(".flow-card");
      if (over && over !== drag.card && list.contains(over)) {
        const rect = over.getBoundingClientRect();
        const after = event.clientY > rect.top + rect.height / 2;
        if (after) over.after(drag.slot);
        else over.before(drag.slot);
        return;
      }

      list.appendChild(drag.slot);
    };

    const dropCard = () => {
      drag.slot.replaceWith(drag.card);
      drag.card.classList.remove("is-lifted");
      drag.card.style.width = "";
      drag.card.style.left = "";
      drag.card.style.top = "";
      document.body.classList.remove("is-dragging-flow");
      clearHover();
      sync();
      clearFlowFeedback();
      announce(drag.card);
    };

    flow.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const card = event.target.closest(".flow-card");
      if (!card || !flow.contains(card) || event.target.closest("button")) return;
      if (event.pointerType === "touch" && !event.target.closest(".flow-grip")) return;
      event.preventDefault();
      drag = {
        card,
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        active: false,
      };
    });

    window.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active && Math.hypot(dx, dy) < 6) return;
      if (!drag.active) liftCard(event);
      drag.card.style.left = `${event.clientX - drag.offsetX}px`;
      drag.card.style.top = `${event.clientY - drag.offsetY}px`;
      moveSlot(event);
      const edge = 80;
      if (event.clientY < edge) window.scrollBy(0, -14);
      else if (event.clientY > window.innerHeight - edge) window.scrollBy(0, 14);
    });

    const finishDrag = (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      if (drag.active) dropCard();
      drag = null;
    };

    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);

    flow.addEventListener("click", (event) => {
      const button = event.target.closest("[data-move]");
      if (!button || !flow.contains(button)) return;
      moveCard(button.closest(".flow-card"), button.dataset.move);
    });

    flow.addEventListener("keydown", (event) => {
      const card = event.target.closest(".flow-card");
      if (!card || !flow.contains(card)) return;
      const keys = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowRight: "take",
        ArrowLeft: "back",
      };
      const action = keys[event.key];
      if (!action) return;
      if (action === "take" && card.parentElement !== bank) return;
      if (action === "back" && card.parentElement !== line) return;
      if ((action === "up" || action === "down") && card.parentElement !== line) return;
      event.preventDefault();
      moveCard(card, action);
    });

    flowCheck.addEventListener("click", () => {
      const placed = [...line.querySelectorAll(":scope > .flow-card")];
      let exact = 0;
      let firstBad = -1;

      placed.forEach((card, index) => {
        const ok = card.dataset.id === steps[index].id;
        card.classList.remove("is-correct", "is-wrong");
        card.classList.add(ok ? "is-correct" : "is-wrong");
        if (ok) exact += 1;
        else if (firstBad === -1) firstBad = index;
      });

      flowFeedback.classList.remove("is-ok", "is-bad");

      if (placed.length === steps.length && exact === steps.length) {
        flowFeedback.textContent =
          "Correcto. La persona lo pide, el sistema lo traduce, lo busca, lo carga y lo aísla, y el hardware dibuja el primer fotograma.";
        flowFeedback.classList.add("is-ok");
        flowStatus.textContent = flowFeedback.textContent;
        return;
      }

      flowFeedback.classList.add("is-bad");

      if (placed.length === 0) {
        flowFeedback.textContent = "La secuencia está vacía. Coloca las diez piezas en orden.";
      } else if (firstBad === -1) {
        flowFeedback.textContent = `Las ${placed.length} piezas van en orden. Faltan ${steps.length - placed.length}.`;
      } else if (placed.length < steps.length) {
        flowFeedback.textContent = `${exact} en su sitio. Revisa desde el paso ${firstBad + 1}. Faltan ${steps.length - placed.length}.`;
      } else {
        flowFeedback.textContent = `${exact} de ${steps.length} en su sitio. Revisa desde el paso ${firstBad + 1}.`;
      }

      flowStatus.textContent = flowFeedback.textContent;
    });

    flowReset.addEventListener("click", placeCards);
    placeCards();
  }

  const arenaRoot = document.getElementById("scheduler-arena");

  if (arenaRoot) {
    const tbody = document.getElementById("arena-tbody");
    const choices = document.getElementById("arena-choices");
    const results = document.getElementById("arena-results");
    const feedback = document.getElementById("arena-feedback");
    const nextBtn = document.getElementById("arena-next");
    const roundEl = document.getElementById("arena-round");
    const scoreEl = document.getElementById("arena-score");
    const processColors = ["#047857", "#0f766e", "#b45309", "#7c3aed", "#be123c"];

    let round = 0;
    let correct = 0;
    let answered = 0;
    let processes = [];
    let locked = false;

    const randInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const avgWaiting = (gantt) =>
      gantt.reduce((sum, slot) => sum + slot.waiting, 0) / gantt.length;

    const avgTurnaround = (gantt) =>
      gantt.reduce((sum, slot) => sum + (slot.end - slot.arrival), 0) /
      gantt.length;

    const scheduleFCFS = (list) => {
      const ordered = [...list].sort(
        (a, b) => a.arrival - b.arrival || a.id - b.id
      );
      let time = 0;
      return ordered.map((proc) => {
        if (time < proc.arrival) time = proc.arrival;
        const start = time;
        const end = start + proc.burst;
        time = end;
        return {
          id: proc.id,
          name: proc.name,
          arrival: proc.arrival,
          start,
          end,
          waiting: start - proc.arrival,
        };
      });
    };

    const scheduleSJF = (list) => {
      const remaining = [...list];
      const gantt = [];
      let time = 0;

      while (remaining.length) {
        const ready = remaining.filter((proc) => proc.arrival <= time);
        if (!ready.length) {
          time = Math.min(...remaining.map((proc) => proc.arrival));
          continue;
        }

        ready.sort(
          (a, b) => a.burst - b.burst || a.arrival - b.arrival || a.id - b.id
        );
        const proc = ready[0];
        remaining.splice(remaining.indexOf(proc), 1);
        const start = time;
        const end = start + proc.burst;
        gantt.push({
          id: proc.id,
          name: proc.name,
          arrival: proc.arrival,
          start,
          end,
          waiting: start - proc.arrival,
        });
        time = end;
      }

      return gantt;
    };

    const makeProcesses = () => {
      const count = randInt(4, 5);
      const mode = randInt(0, 3);
      const list = [];

      for (let i = 0; i < count; i += 1) {
        let arrival = 0;
        let burst = randInt(1, 9);

        if (mode === 0) {
          arrival = 0;
        } else if (mode === 1) {
          arrival = i === 0 ? 0 : randInt(0, 6);
          if (i === 0) burst = randInt(6, 10);
          else burst = randInt(1, 4);
        } else if (mode === 2) {
          arrival = i * randInt(1, 3);
          burst = randInt(2, 7);
        } else {
          arrival = randInt(0, 5);
          burst = randInt(1, 8);
        }

        list.push({
          id: i + 1,
          name: `P${i + 1}`,
          arrival,
          burst,
        });
      }

      if (list.every((proc) => proc.burst === list[0].burst)) {
        list[list.length - 1].burst = Math.max(1, list[0].burst - 2);
      }

      return list;
    };

    const winnerOf = (fcfsAvg, sjfAvg) => {
      const delta = Math.abs(fcfsAvg - sjfAvg);
      if (delta < 0.001) return "TIE";
      return fcfsAvg < sjfAvg ? "FCFS" : "SJF";
    };

    const renderTable = () => {
      tbody.innerHTML = "";
      [...processes]
        .sort((a, b) => a.id - b.id)
        .forEach((proc) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <th scope="row">${proc.name}</th>
            <td>${proc.arrival}</td>
            <td>${proc.burst}</td>
          `;
          tbody.appendChild(row);
        });
    };

    const ganttHtml = (title, gantt, avgWait, avgTurn) => {
      const total = Math.max(...gantt.map((slot) => slot.end), 1);
      const segments = [];
      let cursor = 0;

      gantt.forEach((slot) => {
        if (slot.start > cursor) {
          const idle = slot.start - cursor;
          segments.push(
            `<span class="arena-gantt-idle" style="flex:${idle}" title="CPU idle ${cursor}–${slot.start}"></span>`
          );
        }
        const color = processColors[(slot.id - 1) % processColors.length];
        const span = slot.end - slot.start;
        segments.push(
          `<span class="arena-gantt-block" style="flex:${span};background:${color}" title="${slot.name}: ${slot.start}–${slot.end}">${slot.name}</span>`
        );
        cursor = slot.end;
      });

      const order = gantt.map((slot) => slot.name).join(" → ");

      return `
        <article class="arena-panel">
          <h3>${title}</h3>
          <p class="arena-order">Orden: ${order}</p>
          <div class="arena-gantt" aria-hidden="true">${segments.join("")}</div>
          <p class="arena-metrics">
            Espera promedio: <strong>${avgWait.toFixed(2)}</strong>
            · Retorno promedio: <strong>${avgTurn.toFixed(2)}</strong>
            · Fin: <strong>${total}</strong>
          </p>
        </article>
      `;
    };

    const setChoiceEnabled = (enabled) => {
      choices.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.disabled = !enabled;
        btn.classList.toggle("is-selected", false);
      });
    };

    const startRound = () => {
      round += 1;
      locked = false;
      processes = makeProcesses();
      renderTable();
      results.hidden = true;
      results.innerHTML = "";
      feedback.textContent = "";
      feedback.classList.remove("is-ok", "is-bad");
      nextBtn.hidden = true;
      setChoiceEnabled(true);
      roundEl.textContent = `Ronda ${round}`;
      scoreEl.textContent = `Aciertos: ${correct} / ${answered}`;
    };

    const reveal = (choice) => {
      if (locked) return;
      locked = true;

      const fcfs = scheduleFCFS(processes);
      const sjf = scheduleSJF(processes);
      const fcfsWait = avgWaiting(fcfs);
      const sjfWait = avgWaiting(sjf);
      const fcfsTurn = avgTurnaround(fcfs);
      const sjfTurn = avgTurnaround(sjf);
      const winner = winnerOf(fcfsWait, sjfWait);
      const ok = choice === winner;

      answered += 1;
      if (ok) correct += 1;

      choices.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.disabled = true;
        btn.classList.toggle("is-selected", btn.dataset.choice === choice);
      });

      results.hidden = false;
      results.innerHTML = `
        ${ganttHtml("FCFS", fcfs, fcfsWait, fcfsTurn)}
        ${ganttHtml("SJF", sjf, sjfWait, sjfTurn)}
      `;

      const label =
        winner === "TIE"
          ? "empate"
          : winner === "FCFS"
            ? "FCFS"
            : "SJF";

      feedback.classList.remove("is-ok", "is-bad");
      if (ok) {
        feedback.textContent =
          winner === "TIE"
            ? "Correcto: ambos dejan la misma espera promedio."
            : `Correcto: ${label} gana con menor espera promedio.`;
        feedback.classList.add("is-ok");
      } else {
        feedback.textContent =
          winner === "TIE"
            ? "Casi: en esta ronda FCFS y SJF empatan."
            : `No esta vez: ${label} deja menor espera promedio.`;
        feedback.classList.add("is-bad");
      }

      scoreEl.textContent = `Aciertos: ${correct} / ${answered}`;
      nextBtn.hidden = false;
      nextBtn.focus();
    };

    choices.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-choice]");
      if (!btn || !choices.contains(btn) || locked) return;
      reveal(btn.dataset.choice);
    });

    nextBtn.addEventListener("click", startRound);
    startRound();
  }

  const detectiveRoot = document.getElementById("transparency-detective");

  if (detectiveRoot) {
    const storyEl = document.getElementById("detective-story");
    const choices = document.getElementById("detective-choices");
    const explainEl = document.getElementById("detective-explain");
    const feedback = document.getElementById("detective-feedback");
    const nextBtn = document.getElementById("detective-next");
    const roundEl = document.getElementById("detective-round");
    const scoreEl = document.getElementById("detective-score");

    const labels = {
      acceso: "acceso",
      ubicacion: "ubicación",
      migracion: "migración",
      replicacion: "replicación",
      concurrencia: "concurrencia",
      fallos: "fallos",
    };

    const cases = [
      {
        type: "acceso",
        story:
          "Abres un archivo con la misma llamada de siempre. No sabes si el dato está en tu disco o en un servidor de la red: la API se ve idéntica.",
        why: "Se oculta si el recurso es local o remoto; la forma de acceder no cambia.",
      },
      {
        type: "acceso",
        story:
          "Un programa llama a una función y recibe el resultado. Por detrás fue un RPC a otra máquina, pero el código se escribió como si fuera local.",
        why: "La diferencia entre operación local y remota queda escondida detrás de la misma interfaz.",
      },
      {
        type: "acceso",
        story:
          "Guardas un documento en la carpeta compartida de la universidad. El explorador de archivos se comporta igual que con una carpeta de tu laptop.",
        why: "El usuario no distingue el acceso local del remoto al usar el recurso.",
      },
      {
        type: "ubicacion",
        story:
          "Escribes docs.empresa.edu y el sistema te lleva al servidor correcto. No necesitas la dirección IP ni saber en qué edificio está la máquina.",
        why: "Se oculta en qué nodo físico está el recurso; basta el nombre lógico.",
      },
      {
        type: "ubicacion",
        story:
          "El servicio de nombres traduce “impresora-lab” a la máquina del laboratorio 3. Tú solo usaste el nombre, nunca la dirección.",
        why: "La ubicación queda detrás de un nombre; no hace falta conocer el nodo.",
      },
      {
        type: "ubicacion",
        story:
          "Una app móvil pide “api.tienda.com”. El DNS responde con la IP del centro de datos actual y el usuario no ve esa elección.",
        why: "Se esconde dónde está el servidor; solo importa el nombre del servicio.",
      },
      {
        type: "migracion",
        story:
          "Por mantenimiento, la base de datos se muda del servidor A al B. Las apps siguen usando el mismo nombre y nadie cambia su configuración.",
        why: "El recurso se movió de nodo, pero eso queda oculto para quien lo usa.",
      },
      {
        type: "migracion",
        story:
          "Un contenedor de video se reubica a otro host con más capacidad. Los espectadores siguen el mismo enlace y no notan el traslado.",
        why: "Se oculta que el recurso cambió de máquina mientras el servicio continúa.",
      },
      {
        type: "migracion",
        story:
          "El administrador mueve el repositorio Git a un rack nuevo. Los clones y pushes siguen con la misma URL de siempre.",
        why: "La migración del servicio no obliga a cambiar cómo lo referencian los usuarios.",
      },
      {
        type: "replicacion",
        story:
          "Descargas una actualización y el sistema elige una de tres copias en distintos nodos. Tú crees que hay un solo archivo.",
        why: "Se oculta que existen varias réplicas del mismo recurso.",
      },
      {
        type: "replicacion",
        story:
          "Una página web responde igual desde Europa o América porque hay espejos del contenido. El navegador no muestra “copia 2 de 4”.",
        why: "Las múltiples copias se presentan como un único recurso.",
      },
      {
        type: "replicacion",
        story:
          "Escribes en “mi-cuenta” y el sistema propaga el cambio a varias réplicas. La app solo habla de una cuenta, no de tres bases.",
        why: "La existencia de copias queda oculta detrás de una sola imagen del recurso.",
      },
      {
        type: "concurrencia",
        story:
          "Dos compañeros editan la misma hoja en la nube. Cada uno ve un documento coherente; el sistema coordina los cambios por detrás.",
        why: "Se oculta que otros usuarios también están usando el mismo recurso a la vez.",
      },
      {
        type: "concurrencia",
        story:
          "Reservas el último asiento en una sala. Otros intentaban lo mismo al mismo tiempo, pero la interfaz te trata como si fueras el único cliente.",
        why: "La competencia concurrente por el recurso queda escondida al usuario.",
      },
      {
        type: "concurrencia",
        story:
          "Imprimes un PDF y la cola acepta tu trabajo sin mostrarte que hay cinco trabajos más en otros laboratorios compartiendo la misma impresora lógica.",
        why: "Se oculta el uso simultáneo del recurso por parte de otros procesos o personas.",
      },
      {
        type: "fallos",
        story:
          "El servidor principal se cae y, en segundos, el respaldo toma el control. La app móvil solo notó un instante de espera, no un error fatal.",
        why: "Se oculta que un componente falló y otro lo sustituyó (failover).",
      },
      {
        type: "fallos",
        story:
          "Un nodo del clúster deja de responder. El balanceador deja de enviarle tráfico y las peticiones siguen completándose en los nodos vivos.",
        why: "El fallo de un nodo se esconde; el servicio sigue aparente e íntegro.",
      },
      {
        type: "fallos",
        story:
          "Durante una compra, un servidor se reinicia. La transacción se reintenta en otra instancia y el cliente termina viendo “pago exitoso”.",
        why: "Se oculta la interrupción y la recuperación frente al usuario final.",
      },
    ];

    let round = 0;
    let correct = 0;
    let answered = 0;
    let locked = false;
    let current = null;
    let bag = [];

    const shuffle = (items) => {
      const copy = [...items];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const drawCase = () => {
      if (!bag.length) bag = shuffle(cases);
      const next = bag.pop();
      if (current && next.story === current.story && bag.length) {
        const alt = bag.pop();
        bag.push(next);
        return alt;
      }
      return next;
    };

    const setChoiceEnabled = (enabled) => {
      choices.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.disabled = !enabled;
        btn.classList.remove("is-selected", "is-correct", "is-wrong");
      });
    };

    const startRound = () => {
      round += 1;
      locked = false;
      current = drawCase();
      storyEl.textContent = current.story;
      explainEl.hidden = true;
      explainEl.textContent = "";
      feedback.textContent = "";
      feedback.classList.remove("is-ok", "is-bad");
      nextBtn.hidden = true;
      setChoiceEnabled(true);
      roundEl.textContent = `Ronda ${round}`;
      scoreEl.textContent = `Aciertos: ${correct} / ${answered}`;
    };

    const reveal = (choice) => {
      if (locked || !current) return;
      locked = true;

      const ok = choice === current.type;
      answered += 1;
      if (ok) correct += 1;

      choices.querySelectorAll("[data-choice]").forEach((btn) => {
        btn.disabled = true;
        const selected = btn.dataset.choice === choice;
        const isAnswer = btn.dataset.choice === current.type;
        btn.classList.toggle("is-selected", selected);
        btn.classList.toggle("is-correct", isAnswer);
        btn.classList.toggle("is-wrong", selected && !ok);
      });

      explainEl.hidden = false;
      explainEl.textContent = current.why;

      feedback.classList.remove("is-ok", "is-bad");
      if (ok) {
        feedback.textContent = `Correcto: transparencia de ${labels[current.type]}.`;
        feedback.classList.add("is-ok");
      } else {
        feedback.textContent = `No esta vez: era transparencia de ${labels[current.type]}.`;
        feedback.classList.add("is-bad");
      }

      scoreEl.textContent = `Aciertos: ${correct} / ${answered}`;
      nextBtn.hidden = false;
      nextBtn.focus();
    };

    choices.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-choice]");
      if (!btn || !choices.contains(btn) || locked) return;
      reveal(btn.dataset.choice);
    });

    nextBtn.addEventListener("click", startRound);
    startRound();
  }

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

    if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      markEmpty();
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
      text: "hardware componentes caché buffer MT/s unidades GHz GB SSD NVMe",
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
      text: "FCFS SJF Scheduler Arena sección crítica",
      path: "temas/gestion-procesos.html",
    },
    {
      title: "Sistemas operativos distribuidos",
      hint: "Redes, fallos y escalabilidad",
      text: "cliente servidor RPC transparencia failover middleware Transparency Detective",
      path: "temas/sistemas-distribuidos.html",
    },
    {
      title: "Glosario",
      hint: "Hardware, software, redes y seguridad",
      text: "CPU RAM kernel proceso semáforo deadlock RPC socket permisos ACL autenticación",
      path: "temas/glosario.html",
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

  const form = document.querySelector(".page-search");
  const input = document.querySelector(".page-search-input");
  if (form && input) {
    const panel = document.createElement("div");
    panel.className = "search-panel";
    panel.hidden = true;
    panel.innerHTML = `<ul class="search-results"></ul>`;
    form.appendChild(panel);

    const results = panel.querySelector(".search-results");
    const secretPage = {
      title: "IDKFA",
      hint: "Nivel secreto",
      path: "temas/idkfa.html",
      secret: true,
    };
    let active = 0;
    let current = catalog;
    let cheatTimer = 0;
    let cheatArmed = false;

    const isCheat = (value) => value.trim().toUpperCase() === "IDKFA";

    const goTo = (path) => {
      window.location.href = hrefFor(path);
    };

    const matches = (query) =>
      catalog.filter((item) =>
        `${item.title} ${item.hint} ${item.text}`.toLowerCase().includes(query)
      );

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
        if (item.secret) button.classList.add("is-secret");
        const title = document.createElement("span");
        title.textContent = item.title;
        const hintText = document.createElement("small");
        hintText.textContent = item.hint;
        button.append(title, hintText);
        button.addEventListener("click", () => {
          window.clearTimeout(cheatTimer);
          goTo(item.path);
        });
        li.appendChild(button);
        results.appendChild(li);
      });
    };

    const openPanel = () => {
      panel.hidden = false;
    };

    const closePanel = () => {
      window.clearTimeout(cheatTimer);
      cheatArmed = false;
      form.classList.remove("is-cheat");
      panel.hidden = true;
    };

    input.addEventListener("focus", () => {
      if (!isCheat(input.value)) {
        const query = input.value.trim().toLowerCase();
        current = query ? matches(query) : catalog;
        active = 0;
        render();
      }
      openPanel();
    });

    input.addEventListener("input", () => {
      if (isCheat(input.value)) {
        current = [secretPage];
        active = 0;
        form.classList.add("is-cheat");
        render();
        openPanel();
        if (!cheatArmed) {
          cheatArmed = true;
          window.clearTimeout(cheatTimer);
          cheatTimer = window.setTimeout(() => goTo(secretPage.path), 560);
        }
        return;
      }

      window.clearTimeout(cheatTimer);
      cheatArmed = false;
      form.classList.remove("is-cheat");
      const query = input.value.trim().toLowerCase();
      current = query ? matches(query) : catalog;
      active = 0;
      render();
      openPanel();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (isCheat(input.value)) {
        window.clearTimeout(cheatTimer);
        goTo(secretPage.path);
        return;
      }
      if (current[active]) goTo(current[active].path);
    });

    document.addEventListener("click", (event) => {
      if (!form.contains(event.target)) closePanel();
    });

    document.addEventListener("keydown", (event) => {
      const command = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (command) {
        event.preventDefault();
        input.focus();
        input.select();
        return;
      }
      if (panel.hidden || document.activeElement !== input) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
        input.blur();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        active = Math.min(active + 1, Math.max(current.length - 1, 0));
        render();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      } else if (event.key === "Enter" && isCheat(input.value)) {
        event.preventDefault();
        window.clearTimeout(cheatTimer);
        goTo(secretPage.path);
      } else if (event.key === "Enter" && current[active]) {
        event.preventDefault();
        goTo(current[active].path);
      }
    });
  }
})();
