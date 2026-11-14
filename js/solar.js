/* ================= SOLAR SYSTEM ================= */
var NS = "http://www.w3.org/2000/svg",
  svg = $("sys"),
  CX = 500,
  CY = 340,
  paused = false,
  hov = false,
  TT = 0;
function E(n, a, p) {
  var e = document.createElementNS(NS, n);
  for (var k in a) e.setAttribute(k, a[k]);
  if (p) p.appendChild(e);
  return e;
}
var PL = [
  { n: "Mercury", r: 55, s: 5, c: "#b9b2a8", per: 12 },
  { n: "Venus", r: 88, s: 9, c: "#e8c27a", per: 20 },
  { n: "Earth", r: 125, s: 10, c: "#4aa3ff", per: 32, zone: "earth" },
  { n: "Mars", r: 165, s: 8, c: "#ff6a4a", per: 48, zone: "mars" },
  { n: "Jupiter", r: 215, s: 20, c: "#d8a77a", per: 84 },
  { n: "Saturn", r: 258, s: 16, c: "#e6cf93", per: 124, ring: 1 },
  { n: "Uranus", r: 292, s: 11, c: "#8fe6ea", per: 170 },
  { n: "Neptune", r: 322, s: 11, c: "#5e7bff", per: 220 },
];
var defs = E("defs", {}, svg);
var f = E(
  "filter",
  { id: "gl", x: "-100%", y: "-100%", width: "300%", height: "300%" },
  defs,
);
E("feGaussianBlur", { stdDeviation: "4", result: "b" }, f);
var fm = E("feMerge", {}, f);
E("feMergeNode", { in: "b" }, fm);
E("feMergeNode", { in: "SourceGraphic" }, fm);
var rg = E("radialGradient", { id: "sunG" }, defs);
E("stop", { offset: "0", "stop-color": "#fff6b0" }, rg);
E("stop", { offset: "1", "stop-color": "#ff9a1f" }, rg);

PL.forEach(function (p) {
  E(
    "circle",
    {
      cx: CX,
      cy: CY,
      r: p.r,
      fill: "none",
      stroke: "rgba(140,160,255,.18)",
      "stroke-width": "1",
    },
    svg,
  );
});
E(
  "circle",
  {
    cx: CX,
    cy: CY,
    r: 46,
    fill: "#ff9a1f",
    opacity: ".25",
    filter: "url(#gl)",
  },
  svg,
);
E("circle", { cx: CX, cy: CY, r: 28, fill: "url(#sunG)" }, svg);

function pin(par, x, y, n, col) {
  var g = E("g", { transform: "translate(" + x + "," + y + ")" }, par);
  E("polygon", { points: "-5,-11 5,-11 0,0", fill: col }, g);
  E(
    "circle",
    { cy: -16, r: 8, fill: col, stroke: "#fff", "stroke-width": "1" },
    g,
  );
  E(
    "text",
    {
      y: -13,
      "text-anchor": "middle",
      "font-size": "9",
      "font-weight": "700",
      fill: "#05060f",
      "font-family": "Orbitron",
    },
    g,
  ).textContent = n;
  return g;
}
function hoverOn(g) {
  g.addEventListener("pointerenter", function () {
    hov = true;
  });
  g.addEventListener("pointerleave", function () {
    hov = false;
  });
}
function makeClickable(g, fn, label) {
  g.setAttribute("data-hit", "1");
  g.setAttribute("tabindex", "0");
  g.setAttribute("role", "button");
  g.setAttribute("aria-label", label);
  g.style.cursor = "pointer";
  g.addEventListener("click", function (e) {
    e.stopPropagation();
    fn();
  });
  g.addEventListener("keydown", function (e) {
    if (e.key == "Enter" || e.key == " ") {
      e.preventDefault();
      fn();
    }
  });
  hoverOn(g);
}

/* the edge of the system: interstellar space */
var ring = E("g", {}, svg);
E(
  "circle",
  {
    cx: CX,
    cy: CY,
    r: 336,
    fill: "none",
    stroke: "#9aa6ff",
    "stroke-width": "2.5",
    "stroke-dasharray": "3 9",
    filter: "url(#gl)",
  },
  ring,
);
E(
  "circle",
  {
    cx: CX,
    cy: CY,
    r: 336,
    fill: "none",
    stroke: "transparent",
    "stroke-width": "26",
  },
  ring,
);
var lab = E("g", {}, ring);
E(
  "circle",
  {
    cx: 34,
    cy: 48,
    r: 10,
    fill: "none",
    stroke: "#9aa6ff",
    "stroke-width": "2",
    class: "pulse",
  },
  lab,
);
pin(lab, 34, 58, zoneItems("deep").length, "#9aa6ff");
E(
  "text",
  {
    x: 54,
    y: 48,
    fill: "#cfd6ff",
    "font-size": "13",
    "font-family": "Orbitron",
    "font-weight": "700",
  },
  lab,
).textContent = "DEEP SPACE";;
E(
  "text",
  { x: 54, y: 65, fill: "#97a0c8", "font-size": "11" },
  lab,
).textContent = "click the ring or the dark space outside";
makeClickable(
  ring,
  function () {
    openZone("deep");
  },
   "Deep space, " + zoneItems("deep").length + " explorers",
);
svg.addEventListener("click", function (e) {
  if (e.target.closest && e.target.closest("[data-hit]")) return;
  var pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  var q = pt.matrixTransform(svg.getScreenCTM().inverse());
  if (Math.hypot(q.x - CX, q.y - CY) > 336) openZone("deep");
});

var moonG = null;
PL.forEach(function (p) {
  var g = E("g", {}, svg);
  p.g = g;
  p.a0 = Math.random() * 6.28;
  var on = !!p.zone,
    bd = E("g", { opacity: on ? "1" : ".5" }, g);
  if (p.ring)
    E(
      "ellipse",
      {
        rx: p.s * 1.9,
        ry: p.s * 0.55,
        fill: "none",
        stroke: "#cdbb86",
        "stroke-width": "2",
        transform: "rotate(-20)",
      },
      bd,
    );
  var at = { r: p.s, fill: p.c };
  if (on) at.filter = "url(#gl)";
  E("circle", at, bd);
  E(
    "text",
    {
      y: p.s + 14,
      "text-anchor": "middle",
      "font-size": "11",
      fill: on ? "#fff" : "#97a0c8",
      "font-family": "Orbitron",
    },
    g,
  ).textContent = p.n;
  if (on) {
    E(
      "circle",
      {
        r: p.s + 3,
        fill: "none",
        stroke: p.c,
        "stroke-width": "2",
        class: "pulse",
      },
      g,
    );
        pin(g, 0, -p.s - 3, zoneItems(p.zone == "earth" ? "moon" : p.zone).length, p.c);
    var hit = E(
      "circle",
      { r: Math.max(p.s + 6, 16), fill: "transparent" },
      g,
    );
    makeClickable(
      g,
      function () {
        openZone(p.zone);
      },
            p.n + ", " + zoneItems(p.zone == "earth" ? "moon" : p.zone).length + " explorers",
    );
    if (p.zone == "earth") {
      E(
        "circle",
        {
          r: 22,
          fill: "none",
          stroke: "rgba(207,211,220,.35)",
          "stroke-dasharray": "2 4",
        },
        g,
      );
      moonG = E("g", {}, g);
      E("circle", { r: 4.5, fill: "#dfe3ec", filter: "url(#gl)" }, moonG);
      E(
        "circle",
        {
          r: 7,
          fill: "none",
          stroke: "#dfe3ec",
          "stroke-width": "1.5",
          class: "pulse",
        },
        moonG,
      );
            pin(moonG, 0, -5, zoneItems("moon").length, "#dfe3ec");
      E("circle", { r: 11, fill: "transparent" }, moonG);
      makeClickable(
        moonG,
        function () {
          openZone("moon");
        },
        "The Moon, " + zoneItems("moon").length + " explorers",
      );
    }
  } else {
    E("title", {}, g).textContent = p.n + " (no hardware in this collection)";
  }
});
var last = 0;
function tick(t) {
  var dt = Math.min((t - last) / 1000, 0.1);
  last = t;
  if (!paused && !hov) TT += dt;
  PL.forEach(function (p) {
    var a = p.a0 + (TT * 6.283) / p.per;
    p.g.setAttribute(
      "transform",
      "translate(" +
        (CX + p.r * Math.cos(a)) +
        "," +
        (CY + p.r * Math.sin(a)) +
        ")",
    );
  });
  if (moonG)
    moonG.setAttribute(
      "transform",
      "translate(" +
        22 * Math.cos(TT * 1.1) +
        "," +
        22 * Math.sin(TT * 1.1) +
        ")",
    );
  requestAnimationFrame(tick);
}
if (matchMedia("(prefers-reduced-motion:reduce)").matches) {
  paused = true;
  $("pauseBtn").textContent = "RESUME ORBITS";
}
requestAnimationFrame(tick);
$("pauseBtn").onclick = function () {
  paused = !paused;
  this.textContent = paused ? "RESUME ORBITS" : "PAUSE ORBITS";
};

/* zone panel: just the info we have, then click a name for the 3D model */
function itemBtn(d) {
  return (
    '<button class="item" style="--c:' +
    COL[d.z] +
    '" data-id="' +
    d.id +
    '"><span class="th">' +
    thumb(d) +
    "</span><span><b>" +
    esc(d.n) +
    "</b><small>" +
    esc(d.s) +
    " · " +
    esc(d.period) +
    '<br><span style="color:' +
    ST[d.st][1] +
    '">' +
    ST[d.st][0] +
    "</span> · signal " +
    esc(d.delay) +
    '</small></span><span class="open">' +
    (d.photo ? "VIEW PHOTO ▸" : "VIEW 3D ▸") +
    "</span></button>"
  );
}
function zoneItems(z) {
  return D.filter(function (d) {
    return d.z == z;
  });
}
var ZI = {
  moon: [
    "The Moon",
    "Landers, rovers and science stations left on the lunar surface, from the 1960s and the Apollo years.",
  ],
  mars: [
    "Mars",
    "Rovers, landers and a helicopter that worked on the Red Planet, from the 1970s to today.",
  ],
  deep: [
    "Deep space",
    "Probes and telescopes that travelled past the planets: asteroids, dwarf planets, and out toward the stars.",
  ],
};
function openZone(z) {
  var h;
  if (z == "earth") {
    h =
      '<h3>Earth</h3><p class="note">Hardware at Earth and at its Moon.</p><h4>ORBITING EARTH</h4><p class="empty">No explorer in this collection orbits Earth yet.</p><h4>ON THE MOON</h4>' +
      zoneItems("moon").map(itemBtn).join("");
  } else {
    h =
      "<h3>" +
      ZI[z][0] +
      '</h3><p class="note">' +
      ZI[z][1] +
      "</p>" +
      zoneItems(z).map(itemBtn).join("");
  }
  var sp = $("sp");
  sp.innerHTML = h;
  sp.querySelectorAll(".item").forEach(function (b) {
    b.onclick = function () {
      openModel(idOf(b.getAttribute("data-id")));
    };
  });
  if (innerWidth < 820)
    sp.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
function idOf(id) {
  for (var i = 0; i < D.length; i++) if (D[i].id == id) return i;
  return 0;
}
