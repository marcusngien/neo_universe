/* ================= PROGRESS / BADGES ================= */
var P = { seen: {}, quiz: 0, quizDone: false, badges: {} };
try {
  var sv = JSON.parse(localStorage.getItem("ghostP") || "null");
  if (sv) P = sv;
} catch (e) {}
function save() {
  try {
    localStorage.setItem("ghostP", JSON.stringify(P));
  } catch (e) {}
}
function zc(z) {
  return D.filter(function (d) { return d.z == z; }).length;
}

var BADGES = [
  {
    k: "moon",
    ic: "🌑",
    n: "Moon Walker",
    d: "Open all " + zc("moon") + " Moon explorers",
    c: "var(--moon)",
  },
  {
    k: "mars",
    ic: "🔴",
    n: "Mars Explorer",
    d: "Open all " + zc("mars") + " Mars explorers",
    c: "var(--mars)",
  },
  {
    k: "deep",
    ic: "🛰️",
    n: "Deep Voyager",
    d: "Open all " + zc("deep") + " deep-space explorers",
    c: "var(--deep)",
  },
  {
    k: "quiz",
    ic: "🧠",
    n: "Quiz Master",
    d: "Score 7/10 or more in the quiz",
    c: "var(--pink)",
  },
  {
    k: "all",
    ic: "🏆",
    n: "Ghost Explorer",
    d: "Earn every other badge",
    c: "var(--cyan)",
  },

];
function toast(m) {
  var t = $("toast");
  t.textContent = m;
  t.classList.add("show");
  setTimeout(function () {
    t.classList.remove("show");
  }, 3200);
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
  ["moon", "mars", "deep"].forEach(function (z) {
    var all = D.filter(function (d) {
      return d.z == z;
    });
    if (
      all.every(function (d) {
        return P.seen[d.id];
      })
    )
      award(z);
  });
  if (P.quizDone && P.quiz >= 7) award("quiz");
  if (
    ["moon", "mars", "deep", "quiz"].every(function (k) {
      return P.badges[k];
    })
  )
    award("all");
  renderBadges();
}
function renderBadges() {
  $("badges").innerHTML = BADGES.map(function (b) {
    var got = P.badges[b.k],
      extra = "";
    if (!got && b.k.length > 3 && b.k != "quiz") {
      var z = D.filter(function (d) {
        return d.z == b.k;
      });
      extra =
        " (" +
        z.filter(function (d) {
          return P.seen[d.id];
        }).length +
        "/" +
        z.length +
        ")";
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
