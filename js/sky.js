/**

 * @file auth.js

 * @project Neo Universe - NASA Space Apps Challenge

 * @si-disclosure all SI written

 */


/* ================= STARFIELD + SHOOTING STARS ================= */
(function () {
  var c = $("sky"),
    x = c.getContext("2d"),
    W,
    H,
    stars = [],
    shots = [],
    mx = 0,
    my = 0,
    still = matchMedia("(prefers-reduced-motion:reduce)").matches;
  function rs() {
    W = c.width = innerWidth;
    H = c.height = innerHeight;
    stars = [];
    for (var i = 0; i < Math.min(260, (W * H) / 6000); i++)
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        t: Math.random() * 6,
        l: Math.random() * 0.8 + 0.2,
        h:
          Math.random() < 0.2
            ? "#ff9ff6"
            : Math.random() < 0.4
              ? "#8ff3ff"
              : "#fff",
      });
  }
  addEventListener("resize", rs);
  rs();
  addEventListener("pointermove", function (e) {
    mx = e.clientX / W - 0.5;
    my = e.clientY / H - 0.5;
  });
  function shoot() {
    var a = Math.PI * (0.15 + Math.random() * 0.15);
    shots.push({
      x: Math.random() * W * 0.9,
      y: Math.random() * H * 0.4,
      vx: Math.cos(a) * (9 + Math.random() * 6),
      vy: Math.sin(a) * (9 + Math.random() * 6),
      life: 1,
      col: Math.random() < 0.5 ? "0,229,255" : "255,61,242",
    });
  }
  var nxt = 0;
  function loop(t) {
    x.clearRect(0, 0, W, H);
    stars.forEach(function (s) {
      var a = 0.4 + 0.6 * Math.abs(Math.sin((t / 900) * s.l + s.t));
      x.globalAlpha = still ? 0.7 : a;
      x.fillStyle = s.h;
      x.beginPath();
      x.arc(s.x - mx * 20 * s.l, s.y - my * 20 * s.l, s.r, 0, 6.3);
      x.fill();
    });
    x.globalAlpha = 1;
    if (!still) {
      if (t > nxt) {
        shoot();
        nxt = t + 1200 + Math.random() * 2600;
      }
      shots = shots.filter(function (s) {
        return s.life > 0;
      });
      shots.forEach(function (s) {
        var tx = s.x - s.vx * 9,
          ty = s.y - s.vy * 9,
          g = x.createLinearGradient(s.x, s.y, tx, ty);
        g.addColorStop(0, "rgba(" + s.col + "," + s.life + ")");
        g.addColorStop(1, "rgba(" + s.col + ",0)");
        x.strokeStyle = g;
        x.lineWidth = 2;
        x.shadowColor = "rgb(" + s.col + ")";
        x.shadowBlur = 12;
        x.beginPath();
        x.moveTo(s.x, s.y);
        x.lineTo(tx, ty);
        x.stroke();
        x.shadowBlur = 0;
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.014;
      });
      requestAnimationFrame(loop);
    }
  }
  if (still) {
    loop(0);
  } else requestAnimationFrame(loop);
})();
