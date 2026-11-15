/**

 * @file games.js

 * @project Neo Universe - NASA Space Apps Challenge

 * @si-disclosure all si written

*/
(function () {
  "use strict";


  function el(id) {
    return document.getElementById(id);
  }
  function h(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
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
  function each(list, fn) {
    Array.prototype.forEach.call(list, fn);
  }


  var ICO = {
    Rover: "🤖",
    Lander: "🛬",
    "Mirror array": "🪞",
    "Science station": "📡",
    Helicopter: "🚁",
    "Interstellar probe": "🛰️",
    "Deep-space probe": "🛰️",
    Orbiter: "🛰️",
    "Asteroid probe": "☄️",
    "Space telescope": "🔭",
  };
  var ZONES = [
    ["moon", "🌑", "THE MOON"],
    ["mars", "🔴", "MARS"],
    ["deep", "🛰️", "DEEP SPACE"],
  ];

  var TWIN = {
    "viking-1": "viking-2",
    "viking-2": "viking-1",
    "voyager-1": "voyager-2",
    "voyager-2": "voyager-1",
    opportunity: "spirit",
    spirit: "opportunity",
    "pioneer-10": "pioneer-11",
    "pioneer-11": "pioneer-10",
  };
  var MAXCLUE = 5;

  function pic(d) {
    return (
      '<span class="gpic" style="--c:' +
      COL[d.z] +
      '"><span class="gico" aria-hidden="true">' +
      (ICO[d.s] || "🚀") +
      "</span>" +
      (typeof thumb === "function" ? thumb(d) : "") +
      "</span>"
    );
  }

  var voiceOn = false;
  function speak(txt) {
    if (!voiceOn || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(txt);
    u.rate = 0.95;
    speechSynthesis.speak(u);
  }
  el("gVoice").onclick = function () {
    if (!("speechSynthesis" in window)) {
      if (typeof toast === "function")
        toast("Read aloud is not supported in this browser");
      return;
    }
    voiceOn = !voiceOn;
    this.textContent = "🔊 READ ALOUD: " + (voiceOn ? "ON" : "OFF");
    this.setAttribute("aria-pressed", voiceOn ? "true" : "false");
    if (voiceOn) speak("Read aloud is on.");
    else speechSynthesis.cancel();
  };

  function getBest(key) {
    if (typeof P === "undefined" || !P.games || P.games[key] == null)
      return null;
    return P.games[key];
  }
  function setBest(key, val, lowerIsBetter) {
    if (typeof P === "undefined") return false;
    P.games = P.games || {};
    var old = P.games[key],
      isNew = old == null || (lowerIsBetter ? val < old : val > old);
    if (isNew) {
      P.games[key] = val;
      if (typeof save === "function") save();
      if (old != null && typeof toast === "function")
        toast("🎮 New personal best!");
    }
    return isNew;
  }

  var tabs = document.querySelectorAll("#gtabs button");
  function openTab(id) {
    each(tabs, function (x) {
      x.setAttribute("aria-selected", x.getAttribute("data-p") == id);
    });
    each(document.querySelectorAll(".pane"), function (p) {
      p.classList.toggle("on", p.id == id);
    });
    stopRush();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  each(tabs, function (b) {
    b.onclick = function () {
      openTab(b.getAttribute("data-p"));
    };
  });
  var HASH = { "#memory": "g1", "#sorter": "g2", "#who": "g3" };


  var MM = { n: 6, cards: [], first: null, lock: false, moves: 0, found: 0, tok: 0 };

  function mmMenu() {
    MM.tok++;
    var lv = [
      [4, "EASY", "4 pairs"],
      [6, "MEDIUM", "6 pairs"],
      [8, "HARD", "8 pairs"],
    ];
    el("mm").innerHTML =
      '<h3 class="gh">Match each picture to its name</h3>' +
      '<p class="gp">Flip two cards. If the picture and the name belong together, they stay open. Can you find every pair?</p>' +
      '<div class="glevels">' +
      lv
        .map(function (l) {
          var b = getBest("mm" + l[0]);
          return (
            '<button class="gbig" data-n="' +
            l[0] +
            '"><b>' +
            l[1] +
            "</b><small>" +
            l[2] +
            (b != null ? " · best " + b + " moves" : "") +
            "</small></button>"
          );
        })
        .join("") +
      "</div>";
    each(el("mm").querySelectorAll(".gbig"), function (b) {
      b.onclick = function () {
        mmStart(+b.getAttribute("data-n"));
      };
    });
  }

  function mmStart(n) {
    MM.n = n;
    MM.first = null;
    MM.lock = false;
    MM.moves = 0;
    MM.found = 0;
    MM.tok++;
    var cards = [];
    shuffle(D)
      .slice(0, n)
      .forEach(function (d) {
        cards.push({ d: d, kind: "pic", up: false, done: false });
        cards.push({ d: d, kind: "name", up: false, done: false });
      });
    MM.cards = shuffle(cards);
    mmDraw();
  }

  function mmFront(c) {
    if (c.kind == "pic") return pic(c.d);
    return (
      '<span class="mm-name"><b>' +
      h(c.d.n) +
      "</b><small>" +
      h(c.d.s) +
      " · " +
      h(ZN[c.d.z]) +
      "</small></span>"
    );
  }

  function mmDraw() {
    el("mm").innerHTML =
      '<div class="gbar"><span class="gstat">MOVES <b id="mmMv">0</b></span>' +
      '<span class="gstat">PAIRS <b id="mmPr">0</b> / ' +
      MM.n +
      '</span><span class="gtools2"><button class="btn alt" id="mmRe">RESTART</button>' +
      '<button class="btn alt" id="mmLv">LEVELS</button></span></div>' +
      '<div class="mm-grid" id="mmGrid">' +
      MM.cards
        .map(function (c, k) {
          return (
            '<button class="mm-card" data-k="' +
            k +
            '" aria-label="Card ' +
            (k + 1) +
            ', face down"><span class="mm-in">' +
            '<span class="mm-face mm-back" aria-hidden="true"><span>🚀</span></span>' +
            '<span class="mm-face mm-front" aria-hidden="true" style="--c:' +
            COL[c.d.z] +
            '">' +
            mmFront(c) +
            "</span></span></button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="gfb" id="mmFb" aria-live="polite">Tap a card to start!</div>';
    each(el("mmGrid").children, function (b) {
      b.onclick = function () {
        mmFlip(+b.getAttribute("data-k"));
      };
    });
    el("mmRe").onclick = function () {
      mmStart(MM.n);
    };
    el("mmLv").onclick = mmMenu;
  }

  function mmPaint(k) {
    var c = MM.cards[k],
      b = el("mmGrid").children[k],
      open = c.up || c.done;
    b.classList.toggle("up", !!c.up);
    b.classList.toggle("done", !!c.done);
    b.setAttribute(
      "aria-label",
      open
        ? (c.kind == "pic" ? "Picture of " : "Name card: ") + c.d.n
        : "Card " + (k + 1) + ", face down",
    );
    b.querySelector(".mm-front").setAttribute(
      "aria-hidden",
      open ? "false" : "true",
    );
  }

  function mmFlip(k) {
    var c = MM.cards[k];
    if (MM.lock || c.up) return;
    c.up = true;
    mmPaint(k);
    speak(c.d.n);
    if (MM.first == null) {
      MM.first = k;
      return;
    }
    var ak = MM.first,
      a = MM.cards[ak],
      tok = MM.tok;
    MM.first = null;
    MM.moves++;
    el("mmMv").textContent = MM.moves;
    var fb = el("mmFb");
    if (a.d.id == c.d.id) {
      a.done = c.done = true;
      mmPaint(ak);
      mmPaint(k);
      MM.found++;
      el("mmPr").textContent = MM.found;
      var n0 = c.d.nums && c.d.nums[0];
      fb.className = "gfb ok";
      fb.innerHTML =
        '<b class="k">✔ MATCH!</b><b>' +
        h(c.d.n) +
        "</b>" +
        (n0 ? " · <b>" + h(n0[0]) + "</b> " + h(n0[1]) : "");
      if (n0) speak(c.d.n + ". " + n0[0] + " " + n0[1]);
      if (MM.found == MM.n)
        setTimeout(function () {
          if (tok == MM.tok) mmWin();
        }, 1100);
    } else {
      MM.lock = true;
      fb.className = "gfb";
      fb.textContent = "Not a pair. Look carefully and try again!";
      setTimeout(function () {
        if (tok != MM.tok) return;
        a.up = c.up = false;
        mmPaint(ak);
        mmPaint(k);
        MM.lock = false;
      }, 950);
    }
  }

  function mmWin() {
    var n = MM.n,
      m = MM.moves,
      stars = m <= n * 1.6 ? 3 : m <= n * 2.6 ? 2 : 1,
      isNew = setBest("mm" + n, m, true),
      b = getBest("mm" + n);
    el("mm").innerHTML =
      '<div class="gwin"><div class="stars" role="img" aria-label="' +
      stars +
      ' out of 3 stars">' +
      "★★★".slice(0, stars) +
      '<span class="off">' +
      "★★★".slice(stars) +
      "</span></div><h3>You found all " +
      n +
      " pairs!</h3><p>" +
      m +
      " moves" +
      (b != null ? " · best " + b + (isNew ? " (new!)" : "") : "") +
      '</p><div class="grow"><button class="btn pk" id="mmAg">PLAY AGAIN</button>' +
      '<button class="btn alt" id="mmLv2">LEVELS</button></div></div>';
    el("mmAg").onclick = function () {
      mmStart(n);
    };
    el("mmLv2").onclick = mmMenu;
    el("mmAg").focus();
    speak("Well done! You found all the pairs.");
  }


  var PS = {
    mode: "relaxed",
    queue: [],
    cur: null,
    asked: 0,
    total: 10,
    right: 0,
    score: 0,
    streak: 0,
    maxStreak: 0,
    left: 45,
    timer: null,
    locked: false,
    tok: 0,
  };

  function stopRush() {
    if (PS.timer) {
      clearInterval(PS.timer);
      PS.timer = null;
    }
    PS.tok++;
  }

  function psMenu() {
    stopRush();
    var br = getBest("sort_relaxed"),
      bu = getBest("sort_rush");
    el("ps").innerHTML =
      '<h3 class="gh">Where did it work?</h3>' +
      '<p class="gp">You will see an explorer. Is it from the Moon, from Mars, or from deep space? Pick the right place and build a streak!</p>' +
      '<div class="glevels">' +
      '<button class="gbig" data-m="relaxed"><b>RELAXED</b><small>10 questions, no timer' +
      (br != null ? " · best " + br : "") +
      "</small></button>" +
      '<button class="gbig" data-m="rush" style="--c:var(--pink)"><b>RUSH</b><small>As many as you can in 45 seconds' +
      (bu != null ? " · best " + bu : "") +
      "</small></button></div>";
    each(el("ps").querySelectorAll(".gbig"), function (b) {
      b.onclick = function () {
        psStart(b.getAttribute("data-m"));
      };
    });
  }

  function psStart(mode) {
    stopRush();
    PS.mode = mode;
    PS.queue = shuffle(D);
    PS.asked = 0;
    PS.right = 0;
    PS.score = 0;
    PS.streak = 0;
    PS.maxStreak = 0;
    PS.left = 45;
    PS.locked = false;
    el("ps").innerHTML =
      '<div class="gbar" id="psStats"></div><div id="psQ"></div>' +
      '<div class="zbtns" id="psBtns">' +
      ZONES.map(function (z) {
        return (
          '<button class="zbtn" data-z="' +
          z[0] +
          '" style="--c:var(--' +
          z[0] +
          ')"><span class="zi" aria-hidden="true">' +
          z[1] +
          "</span><b>" +
          z[2] +
          "</b></button>"
        );
      }).join("") +
      '</div><div class="gfb" id="psFb" aria-live="polite"></div>' +
      '<p class="ghint">Deep space means asteroids, dwarf planets, and the far-away space past the planets.</p>' +
      '<div class="grow left"><button class="btn alt" id="psMn">MENU</button></div>';
    each(el("psBtns").children, function (b) {
      b.onclick = function () {
        psAnswer(b.getAttribute("data-z"));
      };
    });
    el("psMn").onclick = psMenu;
    if (mode == "rush") PS.timer = setInterval(psTick, 1000);
    psNext();
  }

  function psStats() {
    var first =
      PS.mode == "rush"
        ? 'TIME <b>' + PS.left + "</b>"
        : "QUESTION <b>" +
          Math.min(PS.asked + 1, PS.total) +
          "</b> / " +
          PS.total;
    el("psStats").innerHTML =
      '<span class="gstat">' +
      first +
      '</span><span class="gstat">SCORE <b>' +
      PS.score +
      '</b></span><span class="gstat">STREAK <b>' +
      PS.streak +
      "</b></span>";
  }

  function psTick() {
    PS.left--;
    psStats();
    if (PS.left <= 0) psEnd();
  }

  function psNext() {
    if (PS.mode == "relaxed" && PS.asked >= PS.total) return psEnd();
    if (!PS.queue.length) PS.queue = shuffle(D);
    PS.cur = PS.queue.pop();
    PS.locked = false;
    el("psQ").innerHTML =
      '<div class="gq">' +
      pic(PS.cur) +
      "<h3>Where did <b>" +
      h(PS.cur.n) +
      "</b> work?</h3></div>";
    var fb = el("psFb");
    fb.className = "gfb";
    fb.textContent = "Pick a place!";
    each(el("psBtns").children, function (b) {
      b.disabled = false;
      b.className = "zbtn";
    });
    psStats();
    speak("Where did " + PS.cur.n + " work?");
  }

  function psAnswer(z) {
    if (PS.locked) return;
    PS.locked = true;
    var d = PS.cur,
      ok = z == d.z,
      relaxed = PS.mode == "relaxed",
      tok = PS.tok;
    PS.asked++;
    if (ok) {
      PS.right++;
      PS.streak++;
      PS.maxStreak = Math.max(PS.maxStreak, PS.streak);
      PS.score += 10 + Math.min(PS.streak - 1, 5) * 2;
    } else PS.streak = 0;
    each(el("psBtns").children, function (b) {
      var bz = b.getAttribute("data-z");
      b.disabled = true;
      if (bz == d.z) b.classList.add("good");
      else if (bz == z) b.classList.add("bad");
    });
    psStats();
    var fb = el("psFb");
    fb.className = "gfb " + (ok ? "ok" : "no");
    fb.innerHTML =
      '<b class="k">' +
      (ok ? "✔ CORRECT!" : "✘ NOT QUITE") +
      "</b><b>" +
      h(d.n) +
      "</b> · " +
      h(d.loc) +
      (relaxed
        ? '<div class="grow left"><button class="btn" id="psNx">' +
          (PS.asked >= PS.total ? "SEE RESULT ▸" : "NEXT ▸") +
          "</button></div>"
        : "");
    speak(ok ? "Correct! " + d.n : "Not quite. " + d.n + " is from " + d.loc);
    if (relaxed) {
      el("psNx").onclick = psNext;
      el("psNx").focus();
    } else {
      setTimeout(
        function () {
          if (tok == PS.tok) psNext();
        },
        ok ? 650 : 1200,
      );
    }
  }

  function psEnd() {
    stopRush();
    var key = "sort_" + PS.mode,
      isNew = setBest(key, PS.score, false),
      b = getBest(key),
      mode = PS.mode;
    el("ps").innerHTML =
      '<div class="gwin"><h3>' +
      (mode == "rush" ? "Time's up!" : "Round complete!") +
      '</h3><div class="big">' +
      PS.score +
      " <small>points</small></div><p>" +
      PS.right +
      " of " +
      PS.asked +
      " sorted correctly · longest streak " +
      PS.maxStreak +
      "</p>" +
      (b != null
        ? "<p>Best: " + b + (isNew ? " (new!)" : "") + "</p>"
        : "") +
      '<div class="grow"><button class="btn pk" id="psAg">PLAY AGAIN</button>' +
      '<button class="btn alt" id="psMn2">MENU</button></div></div>';
    el("psAg").onclick = function () {
      psStart(mode);
    };
    el("psMn2").onclick = psMenu;
    el("psAg").focus();
  }

  var WA = {
    n: 5,
    i: 0,
    score: 0,
    list: [],
    cur: null,
    shown: 1,
    opts: [],
    dead: {},
    over: false,
  };

  function waClues(d) {
    var first = String(d.t || "").split("\n")[0];
    return [
      ["TYPE AND PLACE", d.s + " · " + ZN[d.z]],
      ["MY POWER", d.power],
      ["HOW I MOVE", d.move],
      ["MY WORKING YEARS", d.period],
      ["HOW MY STORY STARTS", "“" + first + "”"],
    ];
  }

  function waMenu() {
    var b = getBest("who");
    el("wa").innerHTML =
      '<h3 class="gh">Guess the explorer from its clues</h3>' +
      '<p class="gp">You get one clue at a time. The fewer clues you need, the more points you earn: 5 points for one clue, down to 1 point for all five. A wrong guess gives you the next clue for free, but costs you a point.</p>' +
      '<div class="grow left"><button class="btn pk" id="waGo">START · ' +
      WA.n +
      " ROUNDS</button></div>" +
      (b != null
        ? '<p class="gp" style="margin-top:14px">Best score: ' +
          b +
          " / " +
          WA.n * MAXCLUE +
          "</p>"
        : "");
    el("waGo").onclick = waStart;
  }

  function waStart() {
    WA.list = shuffle(D).slice(0, WA.n);
    WA.i = 0;
    WA.score = 0;
    waRound();
  }

  function waRound() {
    var d = (WA.cur = WA.list[WA.i]);
    WA.shown = 1;
    WA.dead = {};
    WA.over = false;
    var pool = D.filter(function (x) {
        return x.id != d.id && x.id != TWIN[d.id];
      }),
      same = shuffle(
        pool.filter(function (x) {
          return x.z == d.z;
        }),
      ).slice(0, 2),
      rest = shuffle(
        pool.filter(function (x) {
          return x.z != d.z;
        }),
      ).slice(0, 3 - same.length);
    WA.opts = shuffle([d].concat(same, rest));
    el("wa").innerHTML =
      '<div class="gbar" id="waStats"></div>' +
      '<div class="wa-clues" id="waClues" aria-live="polite"></div>' +
      '<div class="grow left" style="margin-top:0"><button class="btn alt" id="waMore"></button></div>' +
      '<h3 class="gh wa-q">Who am I?</h3><div class="wa-opts" id="waOpts">' +
      WA.opts
        .map(function (o, k) {
          return '<button class="gopt" data-k="' + k + '">' + h(o.n) + "</button>";
        })
        .join("") +
      '</div><div id="waFb" aria-live="polite"></div>';
    each(el("waOpts").children, function (b) {
      b.onclick = function () {
        waGuess(+b.getAttribute("data-k"));
      };
    });
    el("waMore").onclick = function () {
      if (WA.over || WA.shown >= MAXCLUE) return;
      WA.shown++;
      waPaint();
    };
    waPaint();
  }

  function waPaint() {
    var cl = waClues(WA.cur);
    el("waStats").innerHTML =
      '<span class="gstat">ROUND <b>' +
      (WA.i + 1) +
      "</b> / " +
      WA.n +
      '</span><span class="gstat">SCORE <b>' +
      WA.score +
      '</b></span><span class="gstat">WORTH <b>' +
      (MAXCLUE + 1 - WA.shown) +
      "</b> PTS</span>";
    el("waClues").innerHTML = cl
      .slice(0, WA.shown)
      .map(function (c, k) {
        return (
          '<div class="wa-clue' +
          (k == WA.shown - 1 ? " new" : "") +
          '"><small>CLUE ' +
          (k + 1) +
          " · " +
          h(c[0]) +
          "</small>" +
          h(c[1]) +
          "</div>"
        );
      })
      .join("");
    var more = el("waMore");
    more.disabled = WA.over || WA.shown >= cl.length;
    more.textContent =
      WA.shown >= cl.length
        ? "ALL CLUES SHOWN"
        : "REVEAL NEXT CLUE (−1 point)";
  }

  function waGuess(k) {
    if (WA.over || WA.dead[k]) return;
    var o = WA.opts[k],
      btn = el("waOpts").children[k];
    if (o.id == WA.cur.id) {
      var pts = MAXCLUE + 1 - WA.shown;
      WA.score += pts;
      WA.over = true;
      btn.classList.add("good");
      waDone(true, pts);
    } else {
      WA.dead[k] = true;
      btn.classList.add("bad");
      btn.disabled = true;
      if (WA.shown < MAXCLUE) {
        WA.shown++;
        waPaint();
        el("waFb").innerHTML =
          '<div class="gfb no">Not quite. Here is another clue!</div>';
      } else {
        WA.over = true;
        waDone(false, 0);
      }
    }
  }

  function waDone(ok, pts) {
    var d = WA.cur,
      last = WA.i + 1 >= WA.n;
    each(el("waOpts").children, function (b, k) {
      b.disabled = true;
      if (WA.opts[k].id == d.id) b.classList.add("good");
    });
    waPaint();
    el("waFb").innerHTML =
      '<div class="gfb ' +
      (ok ? "ok" : "no") +
      '"><b class="k">' +
      (ok
        ? "✔ YES! +" + pts + " POINT" + (pts == 1 ? "" : "S")
        : "✘ IT WAS…") +
      '</b><div class="wa-reveal">' +
      pic(d) +
      "<div><b>" +
      h(d.n) +
      "</b> · " +
      h(d.loc) +
      "<br>" +
      h(d.f) +
      '</div></div><div class="grow left"><button class="btn" id="waNx">' +
      (last ? "SEE RESULT ▸" : "NEXT ROUND ▸") +
      "</button></div></div>";
    speak((ok ? "Yes! " : "It was ") + d.n);
    el("waNx").onclick = function () {
      WA.i++;
      if (WA.i >= WA.n) waEnd();
      else waRound();
    };
    el("waNx").focus();
  }

  function waEnd() {
    var max = WA.n * MAXCLUE,
      sc = WA.score,
      rank =
        sc >= max * 0.8
          ? "MISSION COMMANDER"
          : sc >= max * 0.5
            ? "FLIGHT ENGINEER"
            : sc >= max * 0.25
              ? "SPACE CADET"
              : "ROOKIE",
      isNew = setBest("who", sc, false),
      b = getBest("who");
    el("wa").innerHTML =
      '<div class="gwin"><h3>' +
      rank +
      '</h3><div class="big">' +
      sc +
      " <small>/ " +
      max +
      "</small></div>" +
      (b != null
        ? "<p>Best: " + b + (isNew ? " (new!)" : "") + "</p>"
        : "") +
      '<div class="grow"><button class="btn pk" id="waAg">PLAY AGAIN</button>' +
      '<button class="btn alt" id="waMn">MENU</button></div></div>';
    el("waAg").onclick = waStart;
    el("waMn").onclick = waMenu;
    el("waAg").focus();
    speak("Round complete. You are a " + rank);
  }


  mmMenu();
  psMenu();
  waMenu();
  if (HASH[location.hash]) openTab(HASH[location.hash]);
})();
