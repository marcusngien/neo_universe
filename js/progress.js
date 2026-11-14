/* ================= PROGRESS / BADGES ================= */
var P = {
  seen: {},
  quiz: 0,
  quizDone: false,
  badges: {},
  games: {},
  chapters: {},
};
try {
  var sv = JSON.parse(localStorage.getItem("ghostP") || "null");
  if (sv) P = sv;
} catch (e) {}
/* old saves may not have the newer fields */
P.seen = P.seen || {};
P.badges = P.badges || {};
P.games = P.games || {};
P.chapters = P.chapters || {};

function save() {
  try {
    localStorage.setItem("ghostP", JSON.stringify(P));
  } catch (e) {}
}

/* ---------- small helpers ---------- */
function cnt(o) {
  return Object.keys(o || {}).length;
}
function zc(z) {
  return D.filter(function (d) {
    return d.z == z;
  }).length;
}
function zoneSeen(z) {
  return D.filter(function (d) {
    return d.z == z && P.seen[d.id];
  }).length;
}
function gamesPlayed() {
  var g = P.games || {};
  return [
    g.mm4 != null || g.mm6 != null || g.mm8 != null,
    g.sort_relaxed != null || g.sort_rush != null,
    g.who != null,
  ].filter(Boolean).length;
}
function zoneBadge(k, ic, n, label, c) {
  return {
    k: k,
    ic: ic,
    n: n,
    c: c,
    d: "Open all " + zc(k) + " " + label + " explorers",
    ok: function () {
      return zc(k) > 0 && zoneSeen(k) >= zc(k);
    },
    p: function () {
      return [zoneSeen(k), zc(k)];
    },
  };
}

/* ---------- the badges ----------
   k  = id        ic = icon     n = name      d = how to earn it     c = colour
   ok = true when earned       p = progress [done, total] shown while locked */
var BADGES = [
  zoneBadge("moon", "🌑", "Moon Walker", "Moon", "var(--moon)"),
  zoneBadge("mars", "🔴", "Mars Explorer", "Mars", "var(--mars)"),
  zoneBadge("deep", "🛰️", "Deep Voyager", "deep-space", "var(--deep)"),
  {
    k: "curious",
    ic: "🔭",
    n: "Curious Explorer",
    d: "Open 10 different explorers",
    c: "var(--cyan)",
    ok: function () {
      return cnt(P.seen) >= 10;
    },
    p: function () {
      return [Math.min(cnt(P.seen), 10), 10];
    },
  },
  {
    k: "story",
    ic: "📖",
    n: "Story Keeper",
    d: "Read all 7 chapters of Ghost Explorers",
    c: "var(--violet)",
    ok: function () {
      return cnt(P.chapters) >= 7;
    },
    p: function () {
      return [Math.min(cnt(P.chapters), 7), 7];
    },
  },
  {
    k: "quiz",
    ic: "🧠",
    n: "Quiz Master",
    d: "Score 7/10 or more in the quiz",
    c: "var(--pink)",
    ok: function () {
      return P.quizDone && P.quiz >= 7;
    },
  },
  {
    k: "perfect",
    ic: "💯",
    n: "Perfect Score",
    d: "Get 10/10 in the quiz",
    c: "var(--ok)",
    ok: function () {
      return P.quizDone && P.quiz >= 10;
    },
  },
  {
    k: "games",
    ic: "🎮",
    n: "Game Master",
    d: "Play all 3 mini-games",
    c: "var(--pink)",
    ok: function () {
      return gamesPlayed() >= 3;
    },
    p: function () {
      return [gamesPlayed(), 3];
    },
  },
  {
    k: "memory",
    ic: "🧩",
    n: "Memory Master",
    d: "Finish Memory Match on HARD",
    c: "var(--sleep)",
    ok: function () {
      return P.games.mm8 != null;
    },
  },
  {
    k: "sorter",
    ic: "🚀",
    n: "Sharp Sorter",
    d: "Get every answer right in Place Sorter (Relaxed)",
    c: "var(--mars)",
    ok: function () {
      return !!P.games.sortPerfect;
    },
  },
  {
    k: "who",
    ic: "🕵️",
    n: "Mission Commander",
    d: "Score 20 or more in Who Am I?",
    c: "var(--deep)",
    ok: function () {
      return P.games.who != null && P.games.who >= 20;
    },
  },
  {
    k: "all",
    ic: "🏆",
    n: "Ghost Explorer",
    d: "Earn every other badge",
    c: "var(--cyan)",
    p: function () {
      var o = BADGES.filter(function (x) {
        return x.k != "all";
      });
      return [
        o.filter(function (x) {
          return P.badges[x.k];
        }).length,
        o.length,
      ];
    },
  },
];

/* ---------- toast (several badges in a row wait their turn) ---------- */
var toastQ = [],
  toastBusy = false;
function nextToast() {
  var t = $("toast");
  if (!t || !toastQ.length) {
    if (!t) toastQ = [];
    toastBusy = false;
    return;
  }
  toastBusy = true;
  t.textContent = toastQ.shift();
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
    setTimeout(nextToast, 600);
  }, 3200);
}
function toast(m) {
  toastQ.push(m);
  if (!toastBusy) nextToast();
}

function award(k) {
  if (P.badges[k]) return;
  P.badges[k] = 1;
  var b = BADGES.filter(function (x) {
    return x.k == k;
  })[0];
  toast("🏅 Badge unlocked: " + b.n);
  save();
}

function check() {
  BADGES.forEach(function (b) {
    if (b.k != "all" && !P.badges[b.k] && b.ok && b.ok()) award(b.k);
  });
  if (
    BADGES.every(function (b) {
      return b.k == "all" || P.badges[b.k];
    })
  )
    award("all");
  renderBadges();
}

function renderBadges() {
  var box = $("badges");
  if (!box) return; /* pages without a badge wall (quiz, games, story) */
  box.innerHTML = BADGES.map(function (b) {
    var got = P.badges[b.k],
      extra = "";
    if (!got && b.p) {
      var p = b.p();
      extra = " (" + p[0] + "/" + p[1] + ")";
    }
    return (
      '<div class="bd' +
      (got ? " got" : "") +
      '" style="--c:' +
      b.c +
      '"><div class="ic">' +
      b.ic +
      "</div><b>" +
      b.n +
      "</b><small>" +
      b.d +
      extra +
      "</small></div>"
    );
  }).join("");
}
