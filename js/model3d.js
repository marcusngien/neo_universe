/**
 * @file model3d.js
 * @project Neo Universe - NASA Space Apps Challenge
 * @si-disclosure Portions of the 3D procedural geometry and UI interaction code were assisted by SI (LLM) tools.
 */

/* ================= 3D MODELS ================= */
var T3 = { voice: true, cur: null, sel: null };
function MAT(c, o) {
  o = o || {};
  return new THREE.MeshStandardMaterial({
    color: c,
    metalness: o.m == null ? 0.5 : o.m,
    roughness: o.r == null ? 0.45 : o.r,
    side: o.ds ? THREE.DoubleSide : THREE.FrontSide,
  });
}
function part(g, name, desc, geo, col, p, r, o) {
  var m = new THREE.Mesh(geo, MAT(col, o));
  if (p) m.position.set(p[0], p[1], p[2]);
  if (r) m.rotation.set(r[0], r[1], r[2]);
  m.userData = { name: name, desc: desc };
  g.add(m);
  return m;
}
function B(w, h, d) {
  return new THREE.BoxGeometry(w, h, d);
}
function C(a, b, h, s) {
  return new THREE.CylinderGeometry(a, b, h, s || 24);
}
function DISH(r, cap) {
  return new THREE.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, cap);
}
var PI = Math.PI;
var DDESC =
  "Dishes like this point at Earth to send data home and receive commands.";
var MODELS = {
 
  oppy: function (g) {
    part(
      g,
      "Warm electronics box",
      "Keeps the computer and batteries warm through freezing Martian nights.",
      B(1.6, 0.5, 1.1),
      0xd9b44a,
      [0, 1, 0],
    );
    part(
      g,
      "Solar panels",
      "Make the power. Dust on them slowly reduces it, and a planet-wide dust storm in 2018 blocked the Sun.",
      B(1.9, 0.05, 1.4),
      0x1a2d66,
      [0, 1.3, 0],
    );
    [-0.85, 0, 0.85].forEach(function (x) {
      [0.85, -0.85].forEach(function (z) {
        part(
          g,
          "Wheel",
          "Six wheels, each with its own motor. Four can also steer.",
          C(0.32, 0.32, 0.25, 20),
          0x555a66,
          [x, 0.32, z],
          [PI / 2, 0, 0],
        );
      });
    });
    [0.7, -0.7].forEach(function (z) {
      part(
        g,
        "Rocker-bogie suspension",
        "Lets the rover roll over rocks while keeping all six wheels on the ground.",
        B(1.9, 0.07, 0.07),
        0xcccccc,
        [0, 0.65, z],
      );
    });
    part(
      g,
      "Camera mast",
      "A tall mast gives the cameras a human-height view.",
      C(0.04, 0.04, 0.9, 8),
      0xdddddd,
      [0.6, 1.75, 0.3],
    );
    part(
      g,
      "Pancam cameras",
      "Colour stereo cameras that photograph the landscape and sky.",
      B(0.5, 0.2, 0.15),
      0x222633,
      [0.6, 2.25, 0.3],
    );
    part(
      g,
      "Robotic arm",
      "Holds a microscope camera and a rock-grinding tool to study rocks up close.",
      B(0.07, 0.07, 1.1),
      0x44c28a,
      [1.05, 0.75, -0.25],
      [0, 0.3, 0],
    );
    part(
      g,
      "High-gain antenna",
      "A flat dish that sends data to Earth directly.",
      C(0.22, 0.22, 0.04, 20),
      0xf2f2f2,
      [-0.6, 1.4, 0.4],
    );
  },
  insight: function (g) {
    part(
      g,
      "Lander deck",
      "The flat top of the lander. It holds the computer, radio and robotic arm.",
      C(1.3, 1.3, 0.18, 24),
      0xe6e6ee,
      [0, 1.1, 0],
    );
    part(
      g,
      "Solar panel",
      "A round panel that makes power. Dust slowly covered both panels until InSight went quiet in December 2022.",
      C(1.5, 1.5, 0.05, 40),
      0x1a2d66,
      [-2.3, 1.3, 0],
      [0, 0, 0.1],
    );
    part(
      g,
      "Solar panel",
      "A round panel that makes power. Dust slowly covered both panels until InSight went quiet in December 2022.",
      C(1.5, 1.5, 0.05, 40),
      0x1a2d66,
      [2.3, 1.3, 0],
      [0, 0, -0.1],
    );
    [0, 1, 2].forEach(function (i) {
      var a = i * 2.09;
      part(
        g,
        "Landing legs",
        "Three legs that absorbed the shock of landing.",
        C(0.05, 0.05, 1.2, 8),
        0xcccccc,
        [Math.cos(a) * 0.9, 0.55, Math.sin(a) * 0.9],
        [Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4],
      );
    });
    part(
      g,
      "Seismometer (SEIS)",
      "Placed directly on the ground, it listened to marsquakes. It recorded 1,319 of them.",
      DISH(0.55, 1.57),
      0xd9a066,
      [0, 0, 2.2],
    );
    part(
      g,
      "Robotic arm",
      "Lifted the seismometer off the deck and set it gently on the ground.",
      B(0.07, 0.07, 1.9),
      0x44c28a,
      [0, 1.0, 1.1],
      [0.5, 0, 0],
    );
    part(
      g,
      "Antenna",
      "Sends data to Earth and to relay satellites.",
      C(0.2, 0.2, 0.04, 20),
      0xf2f2f2,
      [0, 1.25, -0.5],
    );
  },
  heli: function (g) {
    part(
      g,
      "Fuselage",
      "A box about the size of a softball holds the computer, battery and heaters. Total weight is just 1.8 kg.",
      B(0.6, 0.5, 0.5),
      0xd9b44a,
      [0, 1, 0],
    );
    part(
      g,
      "Counter-rotating rotors",
      "Two carbon-fibre rotors spin in opposite directions at about 2,400 rpm to bite into Mars's thin air.",
      B(3.2, 0.03, 0.18),
      0x222633,
      [0, 2.0, 0],
    ).userData.spin = 1;
    part(
      g,
      "Counter-rotating rotors",
      "Two carbon-fibre rotors spin in opposite directions at about 2,400 rpm to bite into Mars's thin air.",
      B(3.2, 0.03, 0.18),
      0x222633,
      [0, 2.2, 0],
      [0, 1.57, 0],
    ).userData.spin = 1;
    part(
      g,
      "Mast",
      "Holds the rotors and the solar panel above the body.",
      C(0.04, 0.04, 0.8, 8),
      0xdddddd,
      [0, 1.55, 0],
    );
    part(
      g,
      "Solar panel",
      "Charges the battery during the day.",
      B(1, 0.04, 0.8),
      0x1a2d66,
      [0, 2.45, 0],
    );
    [
      [0.35, 0.3],
      [-0.35, 0.3],
      [0.35, -0.3],
      [-0.35, -0.3],
    ].forEach(function (p) {
      part(
        g,
        "Landing legs",
        "Four carbon-fibre legs that fold and absorb the landing.",
        C(0.025, 0.025, 1, 8),
        0xcccccc,
        [p[0] * 1.2, 0.5, p[1] * 1.2],
        [p[1] * 0.8, 0, -p[0] * 0.8],
      );
    });
    part(
      g,
      "Cameras",
      "A navigation camera looks down to track the ground and a colour camera takes pictures.",
      B(0.25, 0.2, 0.2),
      0x222633,
      [0, 0.78, 0.28],
    );
  },
  voyager: function (g) {
    part(
      g,
      "Ten-sided bus",
      "The central body. Its ten sides hold the electronics, computers and tape recorder.",
      C(0.85, 0.85, 0.55, 10),
      0xd9b44a,
      [0, 1.2, 0],
    );
    part(
      g,
      "High-gain antenna",
      "A 3.7-metre dish pointed at Earth. It keeps sending data across billions of kilometres.",
      DISH(1.55, 0.85),
      0xf2f2f2,
      [0, 1.85, 0],
      [PI, 0, 0],
      { ds: 1 },
    );
    part(
      g,
      "Plutonium generators (RTGs)",
      "Three generators turn the heat of decaying plutonium into electricity. Power drops about 4 watts a year.",
      C(0.17, 0.17, 1.3, 12),
      0x8a8f9c,
      [2.2, 1.2, 0],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Generator boom",
      "A long arm that holds the hot generators away from the instruments.",
      C(0.04, 0.04, 2.2, 8),
      0xdddddd,
      [1.3, 1.2, 0],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Magnetometer boom",
      "A 13-metre boom keeps the magnetometer far from the spacecraft's own magnetic noise.",
      C(0.025, 0.025, 4.5, 8),
      0xdddddd,
      [0, 1.2, -2.5],
      [PI / 2, 0, 0],
    );
    part(
      g,
      "Science boom and scan platform",
      "Carries the cameras and other instruments that look at planets.",
      B(0.5, 0.35, 0.35),
      0x44c28a,
      [-1.4, 0.95, 0.3],
    );
    part(
      g,
      "Boom to science platform",
      "Holds the scan platform.",
      C(0.04, 0.04, 1.6, 8),
      0xdddddd,
      [-0.9, 1.0, 0.1],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Golden Record",
      "A gold-plated disc carrying sounds and images from Earth, for anyone who finds it.",
      C(0.4, 0.4, 0.03, 32),
      0xe6b800,
      [0, 0.95, 0.55],
      [PI / 2, 0, 0],
      { m: 0.9, r: 0.2 },
    );
  },
  pioneer: function (g) {
    part(
      g,
      "Dish antenna",
      "A 2.7-metre dish that pointed at Earth for 30 years.",
      DISH(1.6, 0.7),
      0xf2f2f2,
      [0, 1.55, 0],
      [PI, 0, 0],
      { ds: 1 },
    );
    part(
      g,
      "Feed horn",
      "Collects and sends the radio signal at the dish's centre.",
      C(0.05, 0.12, 0.8, 12),
      0xdddddd,
      [0, 2.0, 0],
    );
    part(
      g,
      "Equipment compartment",
      "A hexagonal box holding the electronics and instruments.",
      C(0.65, 0.65, 0.5, 6),
      0xd9b44a,
      [0, 1.0, 0],
    );
    part(
      g,
      "Plutonium generators (RTGs)",
      "Four generators on two booms turned heat from plutonium into electricity.",
      C(0.15, 0.15, 0.9, 12),
      0x8a8f9c,
      [1.9, 1.0, 0],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Plutonium generators (RTGs)",
      "Four generators on two booms turned heat from plutonium into electricity.",
      C(0.15, 0.15, 0.9, 12),
      0x8a8f9c,
      [-1.9, 1.0, 0],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Generator booms",
      "Keep the warm generators away from the instruments.",
      C(0.03, 0.03, 4, 8),
      0xdddddd,
      [0, 1.0, 0],
      [0, 0, PI / 2],
    );
    part(
      g,
      "Magnetometer boom",
      "Holds the magnetometer far from the spacecraft's own magnetism.",
      C(0.02, 0.02, 3.2, 8),
      0xdddddd,
      [0, 1.0, -1.9],
      [PI / 2, 0, 0],
    );
    part(
      g,
      "Pioneer plaque",
      "A metal plaque showing a man, a woman and a map to Earth drawn with pulsars.",
      B(0.55, 0.35, 0.02),
      0xe6b800,
      [0.45, 0.95, 0.7],
      null,
      { m: 0.9, r: 0.2 },
    );
  },
};

/* ---- text to speech ---- */
function say(txt) {
  if (!("speechSynthesis" in window)) {
    toast("Text to speech is not supported in this browser");
    return;
  }
  speechSynthesis.cancel();
  var u = new SpeechSynthesisUtterance(txt);
  u.rate = 0.98;
  u.pitch = 0.9;
  speechSynthesis.speak(u);
}
function hush() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

/* ---- part highlight / selection ---- */
function highlight(name) {
  T3.obj.traverse(function (m) {
    if (m.isMesh && m.userData.name) {
      var on = m.userData.name == name;
      if (m.userData.hot)
        m.material.emissive.setHex(on ? 0xff3df2 : 0x0090b0);
      else m.material.emissive.setHex(on ? 0x00b4d8 : 0);
    }
  });
  document.querySelectorAll("#chips .chip").forEach(function (c) {
    c.classList.toggle("on", c.getAttribute("data-n") == name);
  });
}
function selectPart(name, desc, talk) {
  highlight(name);
  $("partbox").innerHTML =
    "<b>" + esc(name) + "</b><div>" + esc(desc) + "</div>";
  if (talk && T3.voice) say(name + ". " + desc);
}

/* ---- modal open / close ---- */
function closeModel() {
  $("modal").classList.remove("on");
  document.body.style.overflow = "";
  hush();
  T3.tok = (T3.tok || 0) + 1;
  cancelAnimationFrame(T3.raf);
  if (T3.r) {
    T3.r.dispose();
    if (T3.r.domElement.parentNode)
      T3.r.domElement.parentNode.removeChild(T3.r.domElement);
    T3.r = null;
  }
}
$("mclose").onclick = closeModel;
$("modal").addEventListener("click", function (e) {
  if (e.target == $("modal")) closeModel();
});
$("stop").onclick = hush;
$("vtog").onclick = function () {
  T3.voice = !T3.voice;
  this.textContent = "PART VOICE: " + (T3.voice ? "ON" : "OFF");
  if (!T3.voice) hush();
};

/* ---- detailed GLB models (loaded on demand) ---- */
var HOT = {
  opportunity: [
    ["Wheel", "Six wheels, each with its own motor. Four can also steer.", [0.55, 0.12, 0.6]],
    ["Wheel", "Six wheels, each with its own motor. Four can also steer.", [-0.55, 0.12, -0.6]],
    ["Rocker-bogie suspension", "Lets the rover roll over rocks while keeping all six wheels on the ground.", [0.4, 0.38, 0]],
    ["Warm electronics box", "Keeps the computer and batteries warm through freezing Martian nights.", [0, 0.8, -0.1]],
    ["Solar panels", "Make the power. Dust on them slowly reduces it, and a planet-wide dust storm in 2018 blocked the Sun.", [0.9, 0.68, -0.1]],
    ["Camera mast", "A tall mast gives the cameras a human-height view.", [0, 1.4, 0.4]],
    ["Pancam cameras", "Colour stereo cameras that photograph the landscape and sky.", [0, 1.55, 0.4]],
    ["High-gain antenna", "A flat dish that sends data to Earth directly.", [0.75, 0.85, -0.25]],
  ],

  near: [
    ["Solar panels", "Four panels that made power from sunlight.", [2.0, 0.75, 0]],
    ["Solar panels", "Four panels that made power from sunlight.", [-2.0, 0.75, 0]],
    ["Spacecraft body", "The main box that holds the computer, the radio and the instruments.", [0.8, -0.4, 0]],
    ["Instruments", "Cameras and spectrometers that studied Eros. One of them kept working after NEAR landed.", [0, -1.3, 0]],
    ["Antenna", "Sends data to Earth.", [0, 1.4, 0]],
  ],


  insight: [
    ["Solar panel", "A round panel that makes power. Dust slowly covered both panels until InSight went quiet in December 2022.", [2.0, 0.42, -0.5]],
    ["Solar panel", "A round panel that makes power. Dust slowly covered both panels until InSight went quiet in December 2022.", [-2.0, 0.42, -0.5]],
    ["Lander deck", "The flat top of the lander. It holds the computer, radio and robotic arm.", [0, 0.5, 0]],
    ["Landing legs", "Three legs that absorbed the shock of landing.", [0, -0.3, -1.2]],
    ["Robotic arm", "Lifted the seismometer off the deck and set it gently on the ground.", [-0.45, 1.2, 1.35]],
    ["Arm camera", "A camera on the arm that looked at the ground around the lander.", [-0.48, 1.2, 1.15]],
    ["Seismometer (SEIS)", "Placed directly on the ground, it listened to marsquakes. It recorded 1,319 of them.", [-1.15, -0.4, 2.35]],
  ],
  ingenuity: [
    ["Counter-rotating rotors", "Two carbon-fibre rotors spin in opposite directions at about 2,400 rpm to bite into Mars's thin air.", [0.25, 0.43, 0.5]],
    ["Counter-rotating rotors", "Two carbon-fibre rotors spin in opposite directions at about 2,400 rpm to bite into Mars's thin air.", [0.45, 0.33, 0.3]],
    ["Solar panel", "Charges the battery during the day.", [0, 0.52, 0]],
    ["Fuselage", "A box about the size of a softball holds the computer, battery and heaters. Total weight is just 1.8 kg.", [0.08, 0.23, 0.08]],
    ["Landing legs", "Four carbon-fibre legs that fold and absorb the landing.", [0.2, 0.12, 0.2]],
    ["Cameras", "A navigation camera looks down to track the ground and a colour camera takes pictures.", [0.04, 0.125, 0]],
  ],
  pioneer10: [
    ["Dish antenna", "A 2.7-metre dish that pointed at Earth for 30 years.", [0, 1.3, -0.3]],
    ["Equipment compartment", "A hexagonal box holding the electronics and instruments.", [-0.35, 0.3, 0.1]],
    ["Plutonium generators (RTGs)", "Four generators on two booms turned heat from plutonium into electricity.", [2.0, 1.2, 0.6]],
    ["Plutonium generators (RTGs)", "Four generators on two booms turned heat from plutonium into electricity.", [-2.0, 1.2, 0.6]],
    ["Magnetometer boom", "Holds the magnetometer far from the spacecraft's own magnetism.", [0, -4, 0.2]],
    ["Pioneer plaque", "A metal plaque showing a man, a woman and a map to Earth drawn with pulsars.", [0.39, -0.17, 0.65]],
  ],
    lm: [
    ["Footpads", "Wide round pads that stop the legs from sinking into the soft dust.", [2.9, 0.3, 0]],
    ["Landing legs", "Four legs with crushable parts inside, so the landing stayed gentle.", [2.4, 0.9, 0]],
    ["Descent engine", "A throttleable engine that slowed the lander for a soft touchdown.", [0, 0.5, 0]],
    ["Descent stage", "The bottom half. It held the landing engine and fuel, and it stays on the Moon as a launch pad.", [0.9, 1.4, 0.9]],
    ["Ascent stage", "The top half carried the astronauts back to orbit. It left the Moon, but the descent stage below stayed.", [0, 3.2, 0]],
    ["Thruster quads", "Small steering rockets that turned and positioned the lander in space.", [-1.4, 3.4, 1.3]],
    ["Steerable antenna", "Pointed at Earth to send voice and data home.", [0, 4.9, 0]],
  ],
  viking: [
    ["High-gain antenna", "A dish on a mast that points at Earth. It sent pictures and data home and received commands.", [-2.65, 8.0, 0.2]],
    ["Meteorology boom", "A boom with sensors for temperature, wind speed and wind direction. It made Viking the first weather station on Mars.", [-0.6, 5.7, -4.8]],
    ["Cameras", "Two cameras on top took the first close-up colour pictures from the surface of Mars, including wide panoramas.", [-1.2, 5.1, 2.77]],
    ["Soil sampler arm", "A long arm that reached out, scooped up Martian soil and dropped it into the lander's experiments.", [7.4, 3.6, -0.46]],
    ["Collector head", "The scoop at the end of the arm. It dug small trenches and picked up soil and rock samples.", [10.4, 2.5, -0.74]],
    ["Lander body", "The main box. It holds the computer, radio, and the biology and chemistry experiments that searched for signs of life.", [0, 4.7, 0.2]],
    ["Landing legs", "Three legs with shock absorbers that cushioned the landing on rocky ground.", [-4.3, 1.4, 2.2]],
    ["Footpads", "Wide round pads that kept the legs from sinking into the dust.", [5.56, 0.5, 3.29]],
    ["Footpads", "Wide round pads that kept the legs from sinking into the dust.", [-5.1, 0.5, 3.34]],
  ],
    dawn: [
    ["Solar arrays", "Two giant panels, about 20 metres tip to tip. The Sun is dim at Ceres, so Dawn needed a lot of them.", [6.0, 0, 0]],
    ["Solar arrays", "Two giant panels, about 20 metres tip to tip. The Sun is dim at Ceres, so Dawn needed a lot of them.", [-6.0, 0, 0]],
    ["Spacecraft body", "A light box that holds the computer, the xenon fuel tank and the instruments.", [0, 0.2, 0]],
    ["Ion engines", "Engines that push out xenon gas as an ion beam with a faint blue glow. Gentle, but they can run for years.", [0, -1.0, 0]],
    ["High-gain antenna", "A dish that sends data home and receives commands.", [0, 1.05, 0.3]],
  ],
    viking: [
    ["Landing legs", "Three legs that absorbed the shock of the rocket-assisted landing.", [-5.0, 1.0, 3.3]],
    ["Landing legs", "Three legs that absorbed the shock of the rocket-assisted landing.", [5.5, 1.0, 3.2]],
    ["Landing legs", "Three legs that absorbed the shock of the rocket-assisted landing.", [0, 1.0, -6.2]],
    ["Lander body", "A six-sided box that holds the computers, batteries and the science labs.", [0.5, 4.0, 0.5]],
    ["High-gain antenna", "A dish that sends data straight to Earth.", [-2.7, 8.6, 0.3]],
    ["Soil sampler arm", "A long arm that scooped up soil for the life-detecting experiments.", [10, 2.7, -0.7]],
    ["Weather boom", "Holds sensors that measured wind, temperature and air pressure.", [-0.9, 8.0, -6.9]],
    ["Plutonium generators (RTGs)", "Two small generators turn heat from plutonium into electricity, so Viking did not need sunlight.", [-2.6, 4.0, -3.8]],
    ["Plutonium generators (RTGs)", "Two small generators turn heat from plutonium into electricity, so Viking did not need sunlight.", [2.4, 4.0, 4.5]],
  ],
    kepler: [
    ["Telescope tube", "Holds the mirror and the light sensors, and shades them from stray light.", [0.9, 0.2, 0]],
    ["Sun shade", "Keeps sunlight out of the telescope so it can see faint stars.", [0, 2.2, 0]],
    ["Spacecraft bus", "The base holds the computers, radio and batteries.", [-0.8, -1.8, 0]],
    ["Solar arrays", "Panels that made power from sunlight.", [1.2, -2.05, -0.75]],
    ["Solar arrays", "Panels that made power from sunlight.", [-1.1, -2.1, 0.5]],
  ],
  voyager: [
    [
      "High-gain antenna",
      "The 3.7-metre dish points at Earth. It sends data home and receives commands across billions of kilometres.",
      [1.2, 0.12, 0],
    ],
    [
      "Ten-sided bus",
      "The central body. Its ten sides hold the electronics and computers.",
      [0.95, -0.48, 0.3],
    ],
    [
      "Magnetometer boom",
      "A boom about 13 metres long keeps the magnetometers far from the spacecraft's own magnetic noise.",
      [0, 3.4, 7.1],
    ],
    [
      "Plutonium generators (RTGs)",
      "Three generators on this boom turn the heat of decaying plutonium into electricity. Power drops about 4 watts a year.",
      [0, -0.8, -3.3],
    ],
    [
      "Science boom and scan platform",
      "Carries the cameras and other instruments that looked at the planets.",
      [0, -1.25, 3.7],
    ],
    [
      "Plasma-wave antennas",
      "Two long antennas in a V shape that listen to radio and plasma waves.",
      [1.9, -2.2, 1.9],
    ],
    [
      "Plasma-wave antennas",
      "Two long antennas in a V shape that listen to radio and plasma waves.",
      [-1.9, -2.2, 1.9],
    ],
 ],
};
function loadScript(u, ok, bad) {
  var e = document.createElement("script");
  e.src = u;
  e.onload = ok;
  e.onerror = bad;
  document.head.appendChild(e);
}
function needGLB(key, cb) {
  function step2() {
    if (window.GLB && GLB[key]) return cb(true);
    loadScript(
      "models/" + key + "-data.js",
      function () {
        cb(!!(window.GLB && GLB[key]));
      },
      function () {
        cb(false);
      },
    );
  }
  if (THREE.GLTFLoader) step2();
  else
    loadScript(
      "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js",
      step2,
      function () {
        cb(false);
      },
    );
}
function parseGLB(key, cb) {
  try {
    var bin = atob(GLB[key]),
      n = bin.length,
      u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    new THREE.GLTFLoader().parse(
      u.buffer,
      "",
      function (g) {
        cb(g.scene);
      },
      function () {
        cb(null);
      },
    );
  } catch (e) {
    cb(null);
  }
}
function useGLB(scene, obj, key) {
  scene.traverse(function (m) {
    m.userData = {};
  });
  scene.traverse(function (m) {
    if (m.isMesh) {
      var ms = Array.isArray(m.material) ? m.material : [m.material];
      ms.forEach(function (x) {
        x.side = THREE.DoubleSide;
        if (x.metalness != null) x.metalness = Math.min(x.metalness, 0.35);
        if (x.roughness != null) x.roughness = Math.max(x.roughness, 0.55);
        x.needsUpdate = true;
      });
      m.frustumCulled = false;
      if (m.material && m.material.name == "clear") {
        m.material.visible = false;
        m.material.depthWrite = false;
      }
    }
  });
  obj.add(scene);
  var len = new THREE.Box3()
      .setFromObject(scene)
      .getSize(new THREE.Vector3())
      .length(),
    R = len * 0.022;
  if (!isFinite(R) || R <= 0) R = 0.5;
  (HOT[key] || []).forEach(function (h) {
    var m = new THREE.Mesh(
      new THREE.SphereGeometry(R, 20, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00e5ff,
        emissive: 0x0090b0,
        transparent: true,
        opacity: 0.9,
        depthTest: false,
      }),
    );
    var off = key == "voyager" ? [-0.0027, 1.2817, 0] : [0, 0, 0];
    m.position.set(h[2][0] + off[0], h[2][1] + off[1], h[2][2] + off[2]);
    m.renderOrder = 10;
    m.userData = { name: h[0], desc: h[1], hot: 1 };
    obj.add(m);
    T3.hots.push(m);
  });
}

/* ---- open the modal for explorer number i ---- */
function openModel(i) {
  var d = D[i];
  T3.cur = d;
  P.seen[d.id] = 1;
  save();
  var mb = $("mbox");
  mb.style.setProperty("--c", COL[d.z]);
  $("mtitle").textContent = d.n;
  $("mstory").textContent = d.t;
  $("partbox").innerHTML =
    "<b>Click a part</b><div>Tap any piece of the model to see its name and what it does.</div>";
  $("speak").onclick = function () {
    say(d.t.replace(/\n+/g, " "));
  };
  $("modal").classList.add("on");
  document.body.style.overflow = "hidden";
  $("modal").scrollTop = 0;
  cancelAnimationFrame(T3.raf);
  if (T3.r) {
    T3.r.dispose();
    if (T3.r.domElement.parentNode)
      T3.r.domElement.parentNode.removeChild(T3.r.domElement);
  }

  var oldph = $("cv").querySelector(".phimg");
  if (oldph) oldph.remove();
  $("cv").querySelector(".cvh").textContent = d.photo
    ? "Photo"
    : "Drag to rotate · click a part";
  if (d.photo) {
    $("cv").insertAdjacentHTML(
      "afterbegin",
      '<img class="phimg" src="' +
        isrc(d.photo) +
        '" alt="' +
        esc(d.n) +
        '">',
    );
    $("chips").innerHTML = "";
    $("partbox").innerHTML =
      "<b>" +
      esc(d.n) +
      "</b><div>Press the pink button to hear its story.</div>";
    check();
    return;
  }

  if (!window.THREE) {
    $("cv").insertAdjacentHTML(
      "afterbegin",
      '<div class="vmsg">3D needs an internet connection to load Three.js.</div>',
    );
    check();
    return;
  }
  var cv = $("cv"),
    w = cv.clientWidth || 600,
    h = cv.clientHeight || 420;
  var r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  r.setSize(w, h, false);
  cv.insertBefore(r.domElement, cv.firstChild);
  T3.r = r;
  var sc = new THREE.Scene(),
    cam = new THREE.PerspectiveCamera(40, w / h, 0.1, 200);
  sc.add(new THREE.AmbientLight(0xffffff, 0.65));
  var dl = new THREE.DirectionalLight(0xffffff, 0.9);
  dl.position.set(4, 7, 5);
  sc.add(dl);
  sc.add(new THREE.HemisphereLight(0xdfe8ff, 0x303060, 0.9));
  r.outputEncoding = THREE.sRGBEncoding;
  var p1 = new THREE.PointLight(0x00e5ff, 0.8, 40);
  p1.position.set(-5, 3, 3);
  sc.add(p1);
  var p2 = new THREE.PointLight(0xff3df2, 0.7, 40);
  p2.position.set(5, 2, -4);
  sc.add(p2);
  var pivot = new THREE.Group(),
    obj = new THREE.Group(),
    L = 10,
    tok = (T3.tok = (T3.tok || 0) + 1);
  sc.add(pivot);
  T3.sc = sc;
  T3.cam = cam;
  T3.pivot = pivot;
  T3.obj = obj;
  T3.spin = [];
  T3.hots = [];
  function ready() {
    var box = new THREE.Box3().setFromObject(obj),
      size = box.getSize(new THREE.Vector3()),
      ctr = box.getCenter(new THREE.Vector3());
    obj.position.sub(ctr);
    pivot.add(obj);
    if (d.z != "deep") {
      var gr = new THREE.Mesh(
        new THREE.CylinderGeometry(
          Math.max(size.x, size.z) * 0.8,
          Math.max(size.x, size.z) * 0.8,
          0.05,
          48,
        ),
        new THREE.MeshStandardMaterial({
          color: d.z == "mars" ? 0x8a4a32 : 0x6d7080,
          roughness: 1,
          metalness: 0,
        }),
      );
      gr.position.y = box.min.y - ctr.y - 0.03;
      pivot.add(gr);
    }
    L = size.length();
    if (!isFinite(L) || L <= 0) L = 20;
    cam.position.set(0, L * 0.35, L * 1.15);
    cam.far = Math.max(200, L * 20);
    cam.updateProjectionMatrix();
    cam.lookAt(0, 0, 0);
    console.log(
      "[3D]",
      d.id,
      "size",
      size.x.toFixed(1),
      size.y.toFixed(1),
      size.z.toFixed(1),
      "L",
      L.toFixed(1),
    );
    obj.traverse(function (m) {
      if (m.userData && m.userData.spin) T3.spin.push(m);
    });
    var seen = {},
      names = [];
    obj.traverse(function (m) {
      if (m.isMesh && m.userData.name && !seen[m.userData.name]) {
        seen[m.userData.name] = m.userData.desc;
        names.push(m.userData.name);
      }
    });
    $("chips").innerHTML = names
      .map(function (n) {
        return (
          '<button class="chip" data-n="' +
          esc(n) +
          '">' +
          esc(n) +
          "</button>"
        );
      })
      .join("");
    $("chips")
      .querySelectorAll(".chip")
      .forEach(function (c) {
        c.onclick = function () {
          var n = c.getAttribute("data-n");
          selectPart(n, seen[n], true);
        };
      });
  }
  if (d.glb) {
    $("partbox").innerHTML = "<b>Loading detailed model…</b>";
    needGLB(d.glb, function (ok) {
      if (tok != T3.tok) return;
      if (!ok) {
        MODELS[d.model](obj);
        ready();
        $("partbox").innerHTML =
          "<b>Simple model</b><div>The detailed model file (models/" +
          d.glb +
          "-data.js) was not found, so the simple version is shown.</div>";
        return;
      }
      parseGLB(d.glb, function (scene) {
        if (tok != T3.tok) return;
        if (!scene) {
          MODELS[d.model](obj);
          ready();
          $("partbox").innerHTML =
            "<b>Simple model</b><div>The detailed model could not be read, so the simple version is shown.</div>";
          return;
        }
        useGLB(scene, obj, d.glb);
        ready();
        $("partbox").innerHTML =
          "<b>Click a glowing dot</b><div>Each dot marks a part. Tap one to see its name and job.</div>";
      });
    });
    } else if (MODELS[d.model]) {
    MODELS[d.model](obj);
    ready();
  } else {
    cv.insertAdjacentHTML(
      "beforeend",
      '<div class="vmsg" style="position:absolute;left:10px;top:10px;z-index:3">3D model coming soon</div>',
    );
    $("partbox").innerHTML =
      "<b>3D model coming soon</b><div>Press the pink button to hear its story.</div>";
  }
  
  /* interaction */
  var el = r.domElement,
    drag = null,
    ray = new THREE.Raycaster(),
    ms = new THREE.Vector2();
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", function (e) {
    drag = {
      x: e.clientX,
      y: e.clientY,
      ry: pivot.rotation.y,
      rx: pivot.rotation.x,
      moved: false,
    };
    T3.dragging = true;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x,
      dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    pivot.rotation.y = drag.ry + dx * 0.01;
    pivot.rotation.x = Math.max(-0.9, Math.min(0.9, drag.rx + dy * 0.006));
  });
  el.addEventListener("pointerup", function (e) {
    var dr = drag;
    drag = null;
    T3.dragging = false;
    if (!dr || dr.moved) return;
    var rc = el.getBoundingClientRect();
    ms.x = ((e.clientX - rc.left) / rc.width) * 2 - 1;
    ms.y = -((e.clientY - rc.top) / rc.height) * 2 + 1;
    ray.setFromCamera(ms, cam);
    var hits = ray.intersectObjects(obj.children, true).filter(function (h) {
      return h.object.userData && h.object.userData.name;
    });
    if (hits.length) {
      var u = hits[0].object.userData;
      selectPart(u.name, u.desc, true);
    }
  });
  el.addEventListener(
    "wheel",
    function (e) {
      e.preventDefault();
      var k = 1 + e.deltaY * 0.001;
      cam.position.multiplyScalar(k);
      var l = cam.position.length();
      if (l < L * 0.5) cam.position.setLength(L * 0.5);
      if (l > L * 3) cam.position.setLength(L * 3);
    },
    { passive: false },
  );
  function loop() {
    T3.raf = requestAnimationFrame(loop);
    try {
      if (!T3.dragging) pivot.rotation.y += 0.004;
      T3.spin.forEach(function (m) {
        m.rotation.y += 0.6;
      });
      var hs = 1 + 0.18 * Math.sin(Date.now() / 300);
      T3.hots.forEach(function (h) {
        h.scale.setScalar(hs);
      });
      r.render(sc, cam);
    } catch (e) {
      cancelAnimationFrame(T3.raf);
      console.error(e);
      cv.insertAdjacentHTML(
        "beforeend",
        '<div class="vmsg" style="position:absolute;left:10px;top:10px;z-index:3">3D error: ' +
          esc(e.message || e) +
          "</div>",
      );
    }
  }
  loop();
  check();
}
addEventListener("resize", function () {
  if (T3.r && $("modal").classList.contains("on")) {
    var cv = $("cv"),
      w = cv.clientWidth,
      h = cv.clientHeight;
    T3.r.setSize(w, h, false);
    T3.cam.aspect = w / h;
    T3.cam.updateProjectionMatrix();
  }
});
