/**

 * @file quiz.js

 * @project Neo Universe - NASA Space Apps Challenge

 * @si-disclosure all human written

 */

var Q = [
  {
    q: "How long does an astronaut need to unfold the Lunar Rover from the lander?",
    o: ["About 7 minutes", "About 7 hours", "About 30 seconds", "About 2 hours"],
    k: "Without the Rover, astronauts could only walk about 3 to 3.5 km from the lander, limited by their oxygen supplies.",
  },
  {
    q: "How many corner-cube mirrors are in the Apollo 11 laser reflector?",
    o: ["100", "10", "300", "1,000"],
    k: "Apollo 15 left the biggest array, with 300 mirrors. The Soviet Lunokhod rovers carried reflectors too.",
  },
  {
    q: "How fast is the Moon drifting away from Earth?",
    o: [
      "About 3.8 cm a year",
      "About 3.8 m a year",
      "About 38 km a year",
      "It is not drifting",
    ],
    k: "Earth's tides pull on the Moon and slowly enlarge its orbit while slowing Earth's spin.",
  },
  {
    q: "What powered the Apollo 16 ALSEP science station?",
    o: [
      "A plutonium generator of about 70 watts",
      "Solar panels",
      "A diesel engine",
      "Rechargeable phone batteries",
    ],
    k: "That is less than a 75-watt light bulb. NASA switched off all ALSEP stations on September 30, 1977.",
  },
  {
    q: "Opportunity was planned to work for 90 Martian days. How long did it really last?",
    o: [
      "More than 14 years",
      "About 1 year",
      "About 3 years",
      "Exactly 90 days",
    ],
    k: "Its last message was translated by the team as: “My battery is low and it's getting dark.”",
  },
  {
    q: "How many marsquakes did InSight record?",
    o: ["1,319", "13", "About 100,000", "None"],
    k: "Seismic waves work like an ultrasound for a planet. They showed that Mars has a liquid core.",
  },
  {
    q: "How many flights did Ingenuity make, when 5 were planned?",
    o: ["72", "12", "25", "300"],
    k: "It scouted ahead for the Perseverance rover and flew about 17 km in total.",
  },
  {
    q: "What did Ingenuity carry from the Wright brothers' 1903 airplane?",
    o: ["A tiny piece of fabric", "A propeller", "A bolt", "A photograph"],
    k: "It linked the first flight on Earth with the first flight on Mars.",
  },
  {
    q: "Which is the only spacecraft to have visited Uranus and Neptune?",
    o: ["Voyager 2", "Voyager 1", "Pioneer 10", "Ingenuity"],
    k: "Voyager 2 revealed Uranus's rings and moons and Neptune's dark storms up close.",
  },
  {
    q: "What was Pioneer 10 the first to do?",
    o: [
      "Cross the asteroid belt",
      "Land on Mars",
      "Orbit the Moon",
      "Visit Neptune",
    ],
    k: "It also carries a plaque with a map to Earth, designed by Carl Sagan, Frank Drake and Linda Salzman Sagan.",
  },
];

var LETTERS = ["A. ", "B. ", "C. ", "D. ", "E. ", "F. "];
var order = Q.map(function (_, i) { return i; });
var qi = 0,
  qs = 0,
  answered = false,
  current = null,
  missed = [];

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)),
      t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function afterRender() {
  var z = document.getElementById("qz"),
    h = document.getElementById("qq");
  if (z && z.getBoundingClientRect().top < 0) z.scrollIntoView({ block: "start" });
  if (h) h.focus({ preventScroll: true });
}

function quizRender() {
  var z = document.getElementById("qz");
  if (!z) return;
  answered = false;
  current = null;

  if (qi >= order.length) {
    quizResult(z);
    return;
  }

  var N = order.length,
    q = Q[order[qi]],
    opts = shuffle(
      q.o.map(function (t, i) {
        return { t: t, ok: i === 0 };
      })
    );
  current = { q: q, opts: opts };

  z.innerHTML =
    '<div class="qtop"><div class="qn">QUESTION ' + (qi + 1) + " / " + N +
    '</div><div class="qscore" id="qsc">SCORE ' + qs + "</div></div>" +
    '<div class="qbar" role="progressbar" aria-label="Quiz progress" aria-valuemin="0" aria-valuemax="' + N +
    '" aria-valuenow="' + qi + '"><i id="qfill" style="width:' + (qi / N) * 100 + '%"></i></div>' +
    '<h3 id="qq" tabindex="-1">' + esc(q.q) + "</h3>" +
    '<div class="opts" role="group" aria-labelledby="qq">' +
    opts
      .map(function (o, i) {
        return (
          '<button class="opt" data-i="' + i + '">' +
          '<span class="ol" aria-hidden="true">' + LETTERS[i] + "</span>" +
          '<span class="ot">' + esc(o.t) + "</span></button>"
        );
      })
      .join("") +
    "</div>" +
    '<p class="qhint">Tip: press <kbd>1</kbd>–<kbd>' + opts.length + "</kbd> to answer.</p>" +
    '<div id="qf" aria-live="polite"></div>';

  z.querySelectorAll(".opt").forEach(function (b) {
    b.onclick = function () {
      pick(+b.getAttribute("data-i"));
    };
  });
  afterRender();
}

function pick(i) {
  if (answered || !current) return;
  answered = true;

  var z = document.getElementById("qz"),
    opts = current.opts,
    o = opts[i],
    btns = z.querySelectorAll(".opt"),
    right = "",
    N = order.length,
    last = qi === N - 1;

  btns.forEach(function (x, k) {
    x.disabled = true;
    if (opts[k].ok) {
      x.classList.add("good");
      right = opts[k].t;
    }
  });

  if (o.ok) {
    qs++;
  } else {
    btns[i].classList.add("bad");
    missed.push({ idx: order[qi], q: current.q.q, a: right });
  }

  var scoreEl = document.getElementById("qsc");
  var fillEl = document.getElementById("qfill");
  if (scoreEl) scoreEl.textContent = "SCORE " + qs;
  if (fillEl) fillEl.style.width = ((qi + 1) / N) * 100 + "%";

  var bar = z.querySelector(".qbar");
  if (bar) bar.setAttribute("aria-valuenow", qi + 1);

  var feedbackEl = document.getElementById("qf");
  if (feedbackEl) {
    /* 彻底删除了 or press Enter，并加入了 margin-top: 28px 拉开按钮与框的间距 */
    feedbackEl.innerHTML =
      '<div class="dyk ' + (o.ok ? "ok" : "no") + '">' +
      '<div class="st">' + (o.ok ? "✔ CORRECT" : "✘ NOT QUITE") + "</div>" +
      (o.ok ? "" : '<div class="ans">Correct Answer: <b>' + esc(right) + "</b></div>") +
      "<b>DID YOU KNOW?</b> " + esc(current.q.k) + "</div>" +
      '<div class="qact" style="margin-top: 28px !important;">' +
      '<button class="btn" id="qnx">' +
      (last ? "SEE RESULT ▸" : "NEXT QUESTION ▸") +
      '</button>' +
      '</div>';
  }

  var nx = document.getElementById("qnx");
  if (nx) {
    nx.onclick = function () {
      qi++;
      quizRender();
    };
    nx.focus();
  }
}

function quizResult(z) {
  var N = order.length,
    pct = Math.round((qs / N) * 100);

  if (typeof P !== "undefined") {
    P.quiz = Math.max(P.quiz || 0, qs);
    P.quizDone = true;
    if (typeof save === "function") save();
    if (typeof check === "function") check();
  }

  var bestScore = (typeof P !== "undefined" && P.quiz) ? P.quiz : qs;

  var review = missed.length
    ? '<details class="qrev" open><summary>Review ' + missed.length + " missed question(s)</summary><ul>" +
      missed
        .map(function (m) {
          return "<li><b>" + esc(m.q) + "</b><span>Correct: " + esc(m.a) + "</span></li>";
        })
        .join("") +
      "</ul></details>"
    : '<p class="qperfect">🎉 Perfect run — no mistakes!</p>';

  z.innerHTML =
    '<div class="qn">RESULT</div><h3 id="qq" tabindex="-1">You scored ' + qs + " / " + N + " (" + pct + "%)</h3>" +
    '<div class="qbar" role="progressbar" aria-valuemin="0" aria-valuemax="' + N + '" aria-valuenow="' + qs +
    '"><i style="width:' + pct + '%"></i></div>' +
    '<p class="qbest">Best Score: ' + bestScore + ' / ' + Q.length + '</p>' +
    "<p>" +
    (qs >= 7
      ? "🎖️ <b>Quiz Master</b> badge unlocked! Great job exploring space history."
      : "Reach 7 or more correct answers to earn the Quiz Master badge.") +
    "</p>" + review +
    '<div class="qact" style="gap:12px; display:flex; justify-content:center; flex-wrap:wrap; margin-top:28px !important;">' +
      (missed.length > 0 ? '<button class="btn alt" id="qremissed">RETRY MISSED ONLY (' + missed.length + ')</button>' : '') +
      '<button class="btn" id="qre">TRY ALL AGAIN</button>' +
    '</div>';

  var qre = document.getElementById("qre");
  if (qre) {
    qre.onclick = function () {
      qi = 0;
      qs = 0;
      missed = [];
      order = shuffle(Q.map(function (_, i) { return i; }));
      quizRender();
    };
  }

  var qremissed = document.getElementById("qremissed");
  if (qremissed) {
    qremissed.onclick = function () {
      order = missed.map(function (m) { return m.idx; });
      qi = 0;
      qs = 0;
      missed = [];
      quizRender();
    };
  }

  afterRender();
}

document.addEventListener("keydown", function (e) {
  if (e.ctrlKey || e.metaKey || e.altKey || !current || !document.getElementById("qz")) return;
  var t = e.target;
  if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;

  if (!answered) {
    var n = parseInt(e.key, 10) - 1;
    if (isNaN(n)) n = "abcdef".indexOf(e.key.toLowerCase());
    if (n >= 0 && n < current.opts.length) {
      e.preventDefault();
      pick(n);
    }
  } else if (e.key === "Enter" && !(t && t.tagName === "BUTTON")) {
    var nx = document.getElementById("qnx");
    if (nx) {
      e.preventDefault();
      nx.click();
    }
  }
});

quizRender();
