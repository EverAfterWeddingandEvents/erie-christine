/* ---------- Wedding date ----------
   December 28, 2026, 1:00 PM, Philippine time (UTC+8). */
const WEDDING = new Date("2026-12-28T13:00:00+08:00");

/* ---------- RSVP ----------
   Paste the web app URL from Google Apps Script here
   (see apps-script/Code.gs for the setup steps). */
const RSVP_URL = "https://script.google.com/macros/s/AKfycbwm_oP8T1fg1lAFfLi5TvZhkzBIlxAnEj6dRQiQ40hnDEa2nZJ_euK7m9GTAE8Xw92TQw/exec";

/* ---------- Entourage ----------
   Edit names here. Each group is either:
   - { title, pairs: [[left, right], ...] }   rows of two
   - { title?, columns: [{ role?, names: [...] }, ...] } */
const ENTOURAGE = [
  {
    columns: [
      { role: "Parents of the Groom", names: ["Mr. Mario Erie G. Piñero", "Mrs. Elsie M. Piñero"] },
      { role: "Guardians of the Bride", names: ["Atty. Meinardo Y. Velasco", "Mrs. Wilma S. Velasco"] },
    ],
  },
  {
    title: "Principal Sponsors",
    pairs: [
      ["Mr. Vincent Gerald P. Agnis", "Mrs. Anna Jade T. Agnis"],
      ["Mr. Merel Osorio", "Mrs. Lenie J. Osorio"],
      ["Mrs. Edna Huffman", "Engr. Artemio"],
      ["Mr. Isidro J. Malinao", "Mrs. Evangeline E. Malinao"],
      ["Mr. Nelson J. Malinao", "Mrs. Clara L. Malinao"],
      ["Mr. Antonio Ronald A. Villacrusis", "Mrs. Merlyn M. Villacrusis"],
      ["Mr. Eroll T. Jutba", "Mrs. Jenita M. Jutba"],
      ["Mr. Ursilito G. Piñero", "Mrs. Juanita O. Piñero"],
      ["Mr. Eleuterio G. Piñero", "Mrs. Maria Ana N. Piñero"],
      ["Mr. Julie G. Piñero", "Mrs. Dina A. Piñero"],
      ["Mr. Jose Voltaire G. Piñero", "Mrs. Beverly A. Piñero"],
      ["Engr. Roy B. Lerin", "Mrs. Emelie R. Lerin"],
      ["LTC. Ericson C. Bulosan, INF (GSC) PA", "Mrs. Cherry T. Bulosan"],
    ],
  },
  {
    columns: [
      { role: "Best Man", names: ["Ensign Keth Israel M. Piñero, PN"] },
      { role: "Maid of Honor", names: ["Princess Stephanie Mitch T. Agnis"] },
    ],
  },
  {
    title: "Secondary Sponsors",
    columns: [
      { role: "To Light Our Path", names: ["Nikko J. Balmoria", "Chesca Mae G. Balmoria"] },
      { role: "To Clothe Us as One", names: ["Atty. Leo Lapinig", "Mrs. Iveanne Therese Lapinig"] },
      { role: "To Bind Us Together", names: ["Mr. Keon Bryce R. Bantilan", "Mrs. Micah Cresa Mae A. Bantilan"] },
    ],
  },
  {
    columns: [
      {
        role: "Groomsmen",
        names: [
          "Emanuel Lacaya",
          "Prince Michael Vincent T. Agnis",
          "John Erie Dominic M. Piñero",
          "Jian Oiram Eire M. Piñero",
          "Prince Erie Philip M. Piñero",
          "Iñaki Zeus V. Reinante",
          "Zaar Ligayo",
        ],
      },
      {
        role: "Bridesmaids",
        names: [
          "Maria Mercedita T. Acebo",
          "Goldee Lynn Gallopin",
          "Alora Bacarat",
          "Ana Marie Mandao",
          "Princess Diane Jade T. Agnis",
          "Alexe Luce",
          "Mariel Lyra M. Piñero",
          "Kaye M. Villacrusis",
        ],
      },
    ],
  },
  {
    title: "Bearers",
    columns: [
      { role: "Bible", names: ["Ivan Vince Jude E. Malinao"] },
      { role: "Ring", names: ["Dicson A. Piñero"] },
      { role: "Coins", names: ["Ian Mark Llyod E. Malinao"] },
    ],
  },
  {
    title: "Flower Girls",
    columns: [
      {
        names: [
          "Hannah Leah M. Piñero",
          "Angel Faith",
          "Rihanna Welz V. Reinante",
          "Ana Lyka M. Piñero",
          "Kirsteen Miles M. Jutba",
        ],
      },
    ],
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function renderEntourage() {
  const root = document.getElementById("entourage-list");
  for (const group of ENTOURAGE) {
    const section = el("section", "group reveal");
    if (group.title) section.append(el("h3", "group__title gold-text", group.title));

    if (group.pairs) {
      const grid = el("div", "pairs");
      for (const [left, right] of group.pairs) grid.append(el("span", "", left), el("span", "", right));
      section.append(grid);
    } else {
      const cols = el("div", "group__cols");
      cols.setAttribute("style", `--cols:${group.columns.length}`);
      for (const col of group.columns) {
        const wrap = el("div");
        if (col.role) wrap.append(el("h4", "role", col.role));
        const list = el("ul", "people");
        for (const name of col.names) list.append(el("li", "", name));
        wrap.append(list);
        cols.append(wrap);
      }
      section.append(cols);
    }
    root.append(section);
  }
}

function startCountdown() {
  const timer = document.getElementById("timer");
  const cells = Object.fromEntries(
    [...timer.querySelectorAll("[data-unit]")].map((n) => [n.dataset.unit, n])
  );
  let handle;

  function tick() {
    const diff = WEDDING - Date.now();
    if (diff <= 0) {
      clearInterval(handle);
      timer.className = "countdown countdown--done reveal is-in";
      timer.replaceChildren(el("p", "script gold-text", "Just married"));
      timer.firstChild.style.fontSize = "clamp(2.800rem, 10vw, 4.200rem)";
      return;
    }
    const s = Math.floor(diff / 1000);
    cells.days.textContent = Math.floor(s / 86400);
    cells.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
    cells.minutes.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
    cells.seconds.textContent = String(s % 60).padStart(2, "0");
    cells.seconds.classList.remove("tick");
    void cells.seconds.offsetWidth;          // restart the little tick animation
    cells.seconds.classList.add("tick");
  }

  handle = setInterval(tick, 1000);
  tick();
}

function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((n) => n.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((n) => io.observe(n));
}

const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (min, max) => min + Math.random() * (max - min);

/* Rose petals drifting down behind the content. */
function scatterPetals() {
  if (calmMotion) return;
  const layer = document.getElementById("petals");
  const count = window.innerWidth < 600 ? 9 : 16;
  for (let i = 0; i < count; i++) {
    const petal = el("span", i % 3 === 0 ? "petal petal--wine" : "petal");
    const dur = rand(12, 22);
    petal.style.cssText =
      `left:${rand(0, 100)}%;--size:${rand(10, 22)}px;--dur:${dur}s;--delay:${-rand(0, dur)}s;--sway:${rand(25, 80)}px`;
    petal.append(el("i"));
    layer.append(petal);
  }
}

/* Gold dust twinkling around the invitation. */
function scatterSparkles() {
  if (calmMotion) return;
  const layer = document.getElementById("sparkles");
  for (let i = 0; i < 22; i++) {
    const dot = el("span", "sparkle");
    dot.style.cssText =
      `left:${rand(4, 96)}%;top:${rand(6, 94)}%;--size:${rand(3, 8)}px;--dur:${rand(2.5, 5)}s;--delay:${rand(0, 5)}s`;
    layer.append(dot);
  }
}

/* The backdrop is clear behind the invitation and dims as you scroll into the page. */
function dimBackdropOnScroll() {
  const veil = document.querySelector(".veil");
  let queued = false;
  const update = () => {
    queued = false;
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.75), 1);
    veil.style.setProperty("--veil", (progress * 0.8).toFixed(3));
  };
  window.addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

function setUpRsvp() {
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("rsvp-status");
  const guests = document.getElementById("rsvp-guests");
  const button = form.querySelector("button");

  const say = (text, isError = false) => {
    status.textContent = text;
    status.classList.toggle("is-error", isError);
  };

  // Guest count only matters when they are coming.
  form.addEventListener("change", () => {
    guests.hidden = form.elements.attending.value === "no";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!RSVP_URL) {
      say("RSVP is not connected yet. Please check back soon.", true);
      return;
    }

    const data = new URLSearchParams(new FormData(form));
    const attending = data.get("attending") === "yes";
    if (!attending) data.set("guests", "0");

    button.disabled = true;
    say("Sending your reply…");
    try {
      // A plain form post, so the browser sends it to Apps Script without a preflight.
      const response = await fetch(RSVP_URL, { method: "POST", body: data });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "");

      const thanks = el("div", "rsvp__thanks");
      thanks.append(
        el("p", "script gold-text", "Thank you"),
        el("p", "", attending
          ? "Your reply is in. We can't wait to celebrate with you."
          : "Your reply is in. You will be missed, and you are in our hearts.")
      );
      form.replaceChildren(thanks);
    } catch (error) {
      button.disabled = false;
      say(error.message || "We couldn't send your reply. Please check your connection and try again.", true);
    }
  });
}

renderEntourage();
startCountdown();
setUpRsvp();
revealOnScroll();
scatterPetals();
scatterSparkles();
dimBackdropOnScroll();
