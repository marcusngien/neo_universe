/* ================= TABS ================= */
document.querySelectorAll("#tabs button").forEach(function (b) {
  b.onclick = function () {
    document.querySelectorAll("#tabs button").forEach(function (x) {
      x.setAttribute("aria-selected", x == b);
    });
    document.querySelectorAll(".pane").forEach(function (p) {
      p.classList.toggle("on", p.id == b.getAttribute("data-p"));
    });
  };
});

/* ================= TIMELINE ================= */
var SD = D.map(function (d, i) {
  return i;
}).sort(function (a, b) {
  return D[a].from - D[b].from;
});
$("tl").innerHTML = SD.map(function (i) {
  var d = D[i];
  return (
    '<div class="slide" style="--c:' +
    COL[d.z] +
    '"><div class="pic">' +
    thumb(d) +
    '<span class="yr fx">' +
    Math.floor(d.from) +
    '</span></div><div class="tx"><h3>' +
    esc(d.n) +
    "</h3><p>" +
    esc(d.loc) +
    "<br>" +
    esc(d.period) +
    ' · <span style="color:' +
    ST[d.st][1] +
    '">' +
    ST[d.st][0] +
    '</span></p><p style="color:var(--ink)">' +
    esc(d.t.split("\n")[0]) +
    '</p><button class="btn" data-i="' +
    i +
    '">' +
    (d.photo ? "VIEW PHOTO" : "OPEN  MODEL") +
    "</button></div></div>"
  );
}).join("");
$("tl")
  .querySelectorAll("button")
  .forEach(function (b) {
    b.onclick = function () {
      openModel(+b.getAttribute("data-i"));
    };
  });
(function () {
  var tl = $("tl"),
    sl = tl.querySelectorAll(".slide");
  function act(k) {
    for (var j = 0; j < sl.length; j++) sl[j].classList.toggle("act", j == k);
    $("tlProg").style.width = ((k + 1) / sl.length) * 100 + "%";
  }
  act(0);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) act([].indexOf.call(sl, e.target));
        });
      },
      { root: tl, threshold: 0.6 },
    );
    [].forEach.call(sl, function (s) {
      io.observe(s);
    });
  }
  function go(dir) {
    var w = sl[0].offsetWidth + 18;
    tl.scrollBy({ left: dir * w, behavior: "smooth" });
  }
  $("tlPrev").onclick = function () {
    go(-1);
  };
  $("tlNext").onclick = function () {
    go(1);
  };
})();

/* ================= COMPARE ================= */
(function () {
  var a = $("ca"),
    b = $("cb"),
    opts = D.map(function (d, i) {
      return '<option value="' + i + '">' + esc(d.n) + "</option>";
    }).join("");
  a.innerHTML = b.innerHTML = opts;
  a.value = 0;
  b.value = 3;
  function r() {
    var x = D[a.value],
      y = D[b.value],
      mx = Math.max(yrsActive(x), yrsActive(y));
    function life(d) {
      var v = yrsActive(d);
      return (
        v.toFixed(1) +
        " years" +
        (d.to === null ? " (and counting)" : "") +
        '<div class="lifebar" style="width:' +
        Math.max(3, (v / mx) * 100) +
        '%"></div>'
      );
    }
    var rows = [
      [
        "Where",
        function (d) {
          return esc(d.loc);
        },
      ],
      [
        "Status",
        function (d) {
          return (
            '<span style="color:' +
            ST[d.st][1] +
            '">' +
            ST[d.st][0] +
            "</span>"
          );
        },
      ],
      [
        "Working years",
        function (d) {
          return esc(d.period);
        },
      ],
      ["Time active", life],
      [
        "Power",
        function (d) {
          return esc(d.power);
        },
      ],
      [
        "Movement",
        function (d) {
          return esc(d.move);
        },
      ],
      [
        "Signal delay",
        function (d) {
          return esc(d.delay);
        },
      ],
      [
        "Headline number",
        function (d) {
          return "<b>" + esc(d.nums[0][0]) + "</b> " + esc(d.nums[0][1]);
        },
      ],
    ];
    $("cmp").innerHTML =
      '<table class="cmp"><thead><tr><th></th><th>' +
      esc(x.n) +
      "</th><th>" +
      esc(y.n) +
      "</th></tr></thead><tbody>" +
      rows
        .map(function (q) {
          return (
            "<tr><th>" +
            q[0].toUpperCase() +
            "</th><td>" +
            q[1](x) +
            "</td><td>" +
            q[1](y) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table>";
  }
  a.onchange = b.onchange = r;
  r();
})();

/* ================= 3D LAB + VIDEOS ================= */
$("lab").innerHTML = D.map(function (d, i) {
  // 自动过滤：只有配置了 3D 模型 (glb 或 model) 且不是纯照片 (photo) 的设备才显示
  if ((!d.glb && !d.model) || d.photo) return "";

  return (
    '<button class="card" style="--c:' +
    COL[d.z] +
    '" data-i="' +
    i +
    '"><div class="pic">' +
    thumb(d) +
    '</div><div class="tx"><b>' +
    esc(d.n) +
    "</b><small>" +
    ZN[d.z] +
    " · " +
    esc(d.s) +
    "</small></div></button>"
  );
}).join("");

$("lab")
  .querySelectorAll(".card")
  .forEach(function (b) {
    b.onclick = function () {
      openModel(+b.getAttribute("data-i"));
    };
  });

var VIDLINKS = {
  "lunar-rover": "https://youtube.com/shorts/O55oFI4azwU?si=H5tj0hPgujp2kQx0 ",
  "laser-reflector": "https://youtube.com/shorts/DdBoKOCnU4I?si=GJC-Zlf9BJw8to9q",
  "alsep": "https://youtu.be/V_EWCVqNFSk?si=wATreAbVyca73DB1",
  "opportunity": "https://youtu.be/1Ll-VHYxWXU?si=H16xMKufizvAhGy4",
  "insight": "http://youtu.be/JJZ6UlH_TfQ?si=Q4Z7SjxxaO_InYfK",
  "ingenuity": "https://youtube.com/shorts/kA2QkUp6DEA?si=m51h7xE6prqMJUoI",
  "voyager-1": "https://youtu.be/4H_hFyMOfrc?si=my5A6s3F2cE94ai5",
  "voyager-2": "https://youtu.be/LOvQsmbG7zA?si=5u4z9Nfpteh63-oH",
  "pioneer-10": "https://youtube.com/shorts/hAPim9kYLj0?si=oPBmMD97WMjuDkhA",
  "apollo-lm": "https://youtu.be/lix0jKenssw?si=rNoLsynd_Szo0Ex5",
  "surveyor": "https://youtu.be/4BmJNx4e8_Y?si=DKqUlZXAj7XYy2JP",
  "sojourner": "https://youtube.com/shorts/2ZSWkddEYfY?si=8WjS5HOeCve1AG87",
  "spirit": "https://youtube.com/shorts/nY8J_WM290Y?si=lNwWKvrT80iQ7WTG",
  "viking-1": "https://youtu.be/L83NvsxrK74?si=j6XpSCp0PxWgCfQ_",
  "viking-2": "https://youtu.be/ytGEJAEXdcs?si=jfYHYvhL8gw6Wpfr",
  "phoenix": "https://youtu.be/p31kJNvEu5k",
  "dawn": "https://youtu.be/VdUIFBMalQo?si=j8CeU9LZulFpTPQk",
  "near": "https://youtu.be/ndC0mNL4D40?si=4M4teVlxpMxaICUb",
  "kepler": "https://youtu.be/srunrHV0HBk?si=_-wYxBD4f1pQDaX0",
  "pioneer-11": "https://youtu.be/cyDJi-XVjZE?si=xAyAO9MUzji9nZSB"
};
D.forEach(function (d) {
  d.link = VIDLINKS[d.id] || "";
});

$("vids").innerHTML = D.map(function (d) {
  var has = !!d.link;
  return (
    '<a class="card' + (has ? "" : " soon") + '" href="' +
    esc(d.link || "#") + '"' +
    (has
      ? ' target="_blank" rel="noopener"'
      : ' aria-disabled="true" tabindex="-1"') +
    ' style="--c:' +
    COL[d.z] +
    ';display:block;text-decoration:none;color:inherit"' +
    ' aria-label="' + (has ? "Watch video of " : "Video coming soon: ") +
    esc(d.n) +
    '">' +
    '<div class="pic">' +
    thumb(d) +
    '<span class="vid" aria-hidden="true"' +
    (has ? "" : ' style="font:700 14px Orbitron;letter-spacing:2px"') +
    ">" + (has ? "▶" : "COMING SOON") + "</span></div>" +
    '<div class="tx"><b>' +
    esc(d.n) +
    "</b><small>" +
    ZN[d.z] +
    " · " +
    esc(d.s) +
    "</small></div></a>"
  );
}).join("");
$("vids").querySelectorAll(".soon").forEach(function (a) {
  a.onclick = function (e) {
    e.preventDefault();
  };
});
