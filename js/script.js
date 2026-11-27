/* ---------- Wording rules from the couple (review notes, November 2026) ----------
   - Erie's name always comes first: "Erie & Christine".
   - Never "forever": use "a lifetime together" or "a journey together".
   - "Guardians of the Bride", not "Parents of the Bride".
   - Entourage: sponsors are listed ahead of the groomsmen and bridesmaids. */

/* ---------- Wedding date ----------
   December 28, 2026, 1:00 PM, Philippine time (UTC+8). */
const WEDDING = new Date("2026-12-28T13:00:00+08:00");

/* ---------- RSVP ----------
   Paste the web app URL from Google Apps Script here
   (see apps-script/Code.gs for the setup steps). */
const RSVP_URL = "https://script.google.com/macros/s/AKfycbwm_oP8T1fg1lAFfLi5TvZhkzBIlxAnEj6dRQiQ40hnDEa2nZJ_euK7m9GTAE8Xw92TQw/exec";

/* ---------- RSVP deadline ----------
   As it should read, e.g. "November 28, 2026". Leave "" to show no date. */
const RSVP_BY = "";

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
    const section = el("section", "ent__group reveal");
    if (group.title) section.append(el("h3", "label ent__title", group.title));

    if (group.pairs) {
      const grid = el("div", "ent__pairs");
      for (const [left, right] of group.pairs) grid.append(el("span", "", left), el("span", "", right));
      section.append(grid);
    } else {
      const cols = el("div", `ent__cols ent__cols--${group.columns.length}`);
      cols.style.setProperty("--cols", group.columns.length);
      for (const col of group.columns) {
        const wrap = el("div");
        // Under a group title the role is a quiet sub-heading; on its own it is the heading.
        if (col.role) wrap.append(group.title ? el("h4", "ent__role", col.role) : el("h3", "label ent__role", col.role));
        const list = el("ul");
        for (const name of col.names) list.append(el("li", "", name));
        wrap.append(list);
        cols.append(wrap);
      }
      section.append(cols);
    }
    root.append(section);
  }
}

/* Border lines, four corner flourishes and a "next" arrow on every framed page. */
function frameSections() {
  const svg = (id, cls) => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const corners = ["tl", "tr", "bl", "br"].map((c) => svg("orn-corner", `corner corner--${c}`)).join("");
  document.querySelectorAll(".panel__inner, .letter").forEach((box) => {
    box.classList.add("framed");
    box.insertAdjacentHTML("afterbegin", `<div class="frame-lines" aria-hidden="true"></div>${corners}`);
  });
  const panels = [...document.querySelectorAll(".panel")];
  panels.forEach((panel, i) => {
    const next = panels[i + 1];
    if (!next) return;
    panel.querySelector(".panel__inner").insertAdjacentHTML("beforeend",
      `<a class="cue" href="#${next.id}" aria-label="Next section">${svg("i-chev", "")}</a>`);
  });
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
      timer.className = "countdown--done reveal is-in";
      timer.replaceChildren(el("p", "script gold-text", "Just married"));
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

/* Gold dust twinkling over the couple's photo. */
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

/* The velvet backdrop dims a little as you scroll into the page. */
function dimBackdropOnScroll() {
  const veil = document.querySelector(".veil");
  let queued = false;
  const update = () => {
    queued = false;
    const progress = Math.min(window.scrollY / (window.innerHeight * 0.75), 1);
    veil.style.setProperty("--veil", (progress * 0.45).toFixed(3));
  };
  window.addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, calmMotion ? 0 : ms));

/* Fade the form away, then bring in the thank-you: a gold heart draws itself,
   the words rise in, and a little burst of gold dust and petals flies out. */
async function showThanks(form, attending) {
  const startHeight = form.offsetHeight;
  form.classList.add("is-leaving");
  await pause(450);

  const thanks = el("div", "rsvp__thanks");
  thanks.innerHTML =
    '<svg class="rsvp__heart" viewBox="0 0 64 58" aria-hidden="true">' +
    '<path d="M32 54C12 40 4 29 4 18A13 13 0 0 1 32 12A13 13 0 0 1 60 18C60 29 52 40 32 54Z" pathLength="1"/></svg>';
  thanks.append(
    el("p", "script gold-text", "Thank you"),
    el("p", "rsvp__note", attending
      ? "Your reply is in. We can't wait to celebrate with you."
      : "Your reply is in. You will be missed, and you are in our hearts.")
  );

  if (!calmMotion) {
    const burst = el("div", "rsvp__burst");
    for (let i = 0; i < 26; i++) {
      const bit = el("span", i % 3 === 0 ? "bit bit--petal" : "bit");
      const angle = rand(0, Math.PI * 2);
      const reach = rand(70, 200);
      bit.style.cssText =
        `--x:${(Math.cos(angle) * reach).toFixed(0)}px;--y:${(Math.sin(angle) * reach - 30).toFixed(0)}px;` +
        `--size:${rand(4, 10).toFixed(1)}px;--delay:${rand(0, 0.25).toFixed(2)}s;--spin:${rand(-240, 240).toFixed(0)}deg`;
      burst.append(bit);
    }
    thanks.prepend(burst);
  }

  form.replaceChildren(thanks);
  form.classList.remove("is-sending", "is-leaving");
  form.classList.add("is-done");

  // Ease the card from the form's height down to the message's height.
  const endHeight = form.offsetHeight;
  form.style.height = `${startHeight}px`;
  void form.offsetHeight;
  form.style.height = `${endHeight}px`;
  form.addEventListener("transitionend", () => { form.style.height = ""; }, { once: true });
  form.scrollIntoView({ behavior: calmMotion ? "auto" : "smooth", block: "center" });
}

function setUpRsvp() {
  const form = document.getElementById("rsvp-form");
  const status = document.getElementById("rsvp-status");
  const guests = document.getElementById("rsvp-guests");
  const button = form.querySelector("button");

  if (RSVP_BY) {
    document.getElementById("rsvp-by").textContent = RSVP_BY;
    document.getElementById("rsvp-by-wrap").hidden = false;
  }

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
    form.classList.add("is-sending");
    say("Sending your reply…");
    try {
      // A plain form post, so the browser sends it to Apps Script without a preflight.
      const response = await fetch(RSVP_URL, { method: "POST", body: data });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || "");

      await showThanks(form, attending);
    } catch (error) {
      button.disabled = false;
      form.classList.remove("is-sending");
      say(error.message || "We couldn't send your reply. Please check your connection and try again.", true);
    }
  });
}

/* Nav bar: clear over the hero photo, a solid bar once you scroll,
   and the link of the section you are reading is underlined. */
function setUpNav() {
  const nav = document.getElementById("nav");
  const links = [...nav.querySelectorAll(".nav__links a")];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
  let queued = false;
  const update = () => {
    queued = false;
    nav.classList.toggle("is-solid", window.scrollY > 16);
    const line = window.innerHeight * 0.4;
    let current = -1;
    sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= line) current = i; });
    links.forEach((a, i) => {
      if (i === current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  };
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
}

/* Menu: on phones and tablets the three lines open a full-screen list of sections. */
function setUpMenu() {
  const button = document.getElementById("menuBtn");
  const panel = document.getElementById("menu");
  const isOpen = () => document.body.classList.contains("menu-open");
  const set = (open) => {
    document.body.classList.toggle("menu-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    panel.inert = !open;
  };
  button.addEventListener("click", () => set(!isOpen()));
  panel.addEventListener("click", (event) => { if (event.target.closest("a")) set(false); });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) { set(false); button.focus(); }
  });
  // wide screens show the links in the bar instead, so close the menu if the window grows
  window.matchMedia("(min-width: 1000px)").addEventListener("change", (event) => { if (event.matches) set(false); });
}

/* Our story: the later chapters fold away behind a "Continue reading" button. */
function setUpStory() {
  const more = document.getElementById("storyMore");
  const toggle = document.getElementById("storyToggle");
  const set = (open) => {
    more.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("span").textContent = open ? "Show less" : "Continue reading";
  };
  toggle.hidden = false;
  set(false);
  toggle.addEventListener("click", () => {
    const open = more.hidden;
    set(open);
    // back to the top of the story when it folds away
    if (!open) document.getElementById("story").scrollIntoView({ behavior: calmMotion ? "auto" : "smooth" });
  });
}

function scatterStars() {
  const layer = document.getElementById("stars");
  for (let i = 0; i < 34; i++) {
    const star = el("span");
    star.style.cssText = `left:${rand(0, 100).toFixed(1)}%;top:${rand(0, 80).toFixed(1)}%;--t:${rand(2.4, 6).toFixed(1)}s;--dl:${(-rand(0, 5)).toFixed(1)}s`;
    layer.append(star);
  }
}

renderEntourage();
frameSections();
setUpNav();
setUpMenu();
setUpStory();
scatterStars();
startCountdown();
setUpRsvp();
revealOnScroll();
scatterPetals();
scatterSparkles();
dimBackdropOnScroll();
