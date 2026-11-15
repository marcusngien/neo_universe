var MISSION =
  "The mission never changed: go farther, and send what you learn back home.";

var STORY = [
  {
    y: "1958",
    g: "Chapter 1",
    t: "The Birth of A Dream",
    c: "var(--cyan)",
    img: "story1.png",
    video: "chapter1.mp4",
    h: [],
    x: "Imagine standing beneath a sky filled with stars. Beyond the clouds, beyond the Moon, and beyond the planets, an enormous universe waits to be explored. In the autumn of 1958, out of the urgency of the Cold War and the boundless reach of human curiosity, the United States established the National Aeronautics and Space Administration (NASA). Born from the National Advisory Committee for Aeronautics (NACA), NASA began as a daring collective dream to push technology past Earth's atmosphere and decode the mysteries of the universe. While human astronauts captured the world's imagination, it was a fleet of robotic explorers—constructed from titanium, solar panels, and digital nerves—that truly pushed humanity's footprint into the deep cosmos, creating an unbroken legacy of planetary discovery. Little did the world know that these machines would travel where humans could not, face environments no human could survive, and send back discoveries that would change our understanding of the universe.",
  },
  {
    y: "1969",
    g: "Chapter 2",
    t: "The Footprints That Never Fade",
    c: "var(--moon)",
    img: "story2.png",
    video: "chapter2.mp4",
    h: ["lunar-rover", "alsep", "laser-reflector"],
    x: "Before robotic explorers travelled across distant planets, humanity had already reached the Moon. During the Apollo 15, 16, and 17 missions, astronauts used the electric Apollo Lunar Roving Vehicle (LRV) to travel far beyond walking distance and collect valuable rock samples. But when they returned home, they left behind scientific laboratories that kept working. In 1972, Apollo 16 astronauts deployed the Apollo Lunar Surface Experiments Package (ALSEP) in the Descartes Highlands, transmitting data about lunar earthquakes, solar wind, and subsurface heat for more than five years. Alongside it, the Apollo Laser Reflector Arrays placed during Apollo 11, 14, and 15 required no electricity at all—even today, scientists on Earth bounce laser pulses off them to measure the distance to the Moon with remarkable precision.",
  },
  {
    y: "1972",
    g: "Chapter 3",
    t: "The First Pathfinder",
    c: "var(--deep)",
    img: "story3.png",
    video: "chapter3.mp4",
    h: ["pioneer-10"],
    x: "The grand narrative of robotic exploration began with Pioneer 10, an early scout launched atop an Atlas-Centaur rocket to brave the unknown outer reaches of our solar system. Launched in 1972, it became the first spacecraft to navigate the treacherous, debris-strewn Asteroid Belt and survive, proving that the outer planets were reachable. It went on to capture the first breathtaking close-up images of Jupiter, mapping its intense radiation belts and turbulent atmosphere. Attached to its frame was a gold-anodized aluminum plaque depicting a man, a woman, and a map of our location in the galaxy—a tiny cosmic postcard sent out into the dark as Pioneer 10 became the first human object to cross the orbit of Neptune and sail out toward the stars.",
  },
  {
    y: "1977",
    g: "Chapter 4",
    t: "Voices Beyond the Stars",
    c: "var(--deep)",
    img: "story4.png",
    video: "chapter4.mp4",
    h: ["voyager-1", "voyager-2"],
    x: "Building on the path cleared by Pioneer, NASA launched twin probes in 1977—Voyager 1 and Voyager 2—designed to take advantage of a rare planetary alignment. Voyager 1 executed precise gravity assists past Jupiter's swirling storms and Saturn's delicate rings, pushing upward into interstellar space. Carrying the famous Golden Record—a time capsule of Earth's languages, sounds, and music—it crossed the heliopause in 2012 and drifts today as the farthest human-made object from Earth. Meanwhile, Voyager 2 embarked on an unprecedented Grand Tour, becoming the only spacecraft in history to visit all four giant planets: Jupiter, Saturn, Uranus, and Neptune, discovering active nitrogen geysers on Triton before following its sibling into the interstellar frontier.",
  },
  {
    y: "2004",
    g: "Chapter 5",
    t: "The Little Rover That Would Not Give Up",
    c: "var(--mars)",
    img: "story5.png",
    video: "chapter5.mp4",
    h: ["opportunity"],
    x: "From the distant outer planets, NASA turned its focus to our neighboring rust-colored world, Mars, to discover whether it had once supported liquid water. In 2004, the golf-cart-sized rover Opportunity bounced onto the Martian plain of Meridiani Planum with a 90-day warranty. Assisted by lucky gusts of Martian wind that periodically swept dust off its solar arrays, Opportunity roved the red planet for nearly 15 years, driving more than 28 miles across harsh terrain. It discovered hematite spherules nicknamed 'blueberries' and analyzed ancient lakebed rocks, proving beyond doubt that liquid water once flowed on Mars, before a catastrophic global dust storm in 2018 finally cut off its power forever.",
  },
  {
    y: "2018",
    g: "Chapter 6",
    t: "Listening to the Heart of Mars",
    c: "var(--mars)",
    img: "story6.png",
    video: "chapter6.mp4",
    h: ["insight"],
    x: "Not every explorer needs wheels to make a discovery. Where Opportunity explored the surface horizontally, InSight arrived on Mars in 2018 as a stationary lander designed to study what lies beneath. It placed an ultra-sensitive seismometer directly onto the ground to detect internal vibrations and listen for marsquakes, alongside a heat probe nicknamed the 'Mole'. During its quiet, patient mission, InSight recorded 1,319 marsquakes and detected vibrations from meteorite impacts, helping scientists measure the thickness of Mars' crust and the size of its liquid core—revealing secrets hidden deep beneath the Martian surface.",
  },
  {
    y: "2021",
    g: "Chapter 7",
    t: "Wings Over Another World",
    c: "var(--mars)",
    img: "story7.png",
    video: "chapter7.mp4",
    h: ["ingenuity"],
    x: "Attached to the belly of the Perseverance rover, the tiny 4-pound Ingenuity Helicopter arrived on Mars as a high-risk technological demonstration. Flying in the thin Martian atmosphere—less than 1% the density of Earth's air—was thought by many to be nearly impossible. Yet on April 19, 2021, Ingenuity lifted into the sky, achieving humanity's first powered, controlled flight on another planet. Designed to fly just five times, the resilient little rotorcraft completed 72 flights over three years, acting as an aerial scout for the rover, capturing high-altitude images, and opening a whole new aerial dimension for future planetary exploration.",
  },
  {
    y: "2026",
    g: "Chapter 8",
    t: "The Symphony Never Ends",
    c: "var(--violet)",
    img: "story8.png",
    video: "chapter8.mp4",
    h: [],
    x: "The journey through the archive comes to an end, leaving one question: what happens to an explorer when its mission is over? From Pioneer 10 and the Voyager probes to the silent rovers and forgotten lunar instruments, each explorer left behind a piece of humanity's journey into space. They were made of metal, wires, and scientific instruments, with no voices of their own. Yet, through the discoveries they sent back to Earth, they told stories that humanity will never forget. Their missions may have ended, but their legacy lives on—a symphony of courage, curiosity, and discovery that never truly ends.",
  },
];

(function () {
  var k = 0;

  function show(i) {
    k = Math.max(0, Math.min(STORY.length - 1, i));
    var s = STORY[k];
    $("stg").style.setProperty("--c", s.c);

    if (s.video) {
      $("stpic").innerHTML =
        '<video src="videos/' +
        s.video +
        '" poster="' +
        isrc(s.img) +
        '" autoplay controls playsinline preload="auto"></video>' +
        "<span>" +
        esc(s.y) +
        "</span>";

      var vid = $("stpic").querySelector("video");
      if (vid) {
        var playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            vid.muted = true;
            vid.play().catch(function () {});
          });
        }
      }
    } else {
      $("stpic").innerHTML =
        '<img src="' +
        isrc(s.img) +
        '" alt="" onerror="this.remove()"><span>' +
        esc(s.y) +
        "</span>";
    }

    $("stgen").textContent =
      s.g.toUpperCase() + "  ·  " + (k + 1) + " / " + STORY.length;
    $("sttitle").textContent = s.t;
    $("sttext").textContent = s.x;
    $("stmis").textContent = MISSION;
    $("stprog").style.width = ((k + 1) / STORY.length) * 100 + "%";

    if (s.h && s.h.length) {
      $("stlinks").style.display = "";
      $("stlinks").innerHTML = s.h
        .map(function (id) {
          return (
            '<button class="chip" data-id="' +
            id +
            '">' +
            esc(D[idOf(id)].n) +
            "</button>"
          );
        })
        .join("");
      $("stlinks")
        .querySelectorAll(".chip")
        .forEach(function (c) {
          c.onclick = function () {
            openModel(idOf(c.getAttribute("data-id")));
          };
        });
    } else {
      $("stlinks").innerHTML = "";
      $("stlinks").style.display = "none";
    }
  }

  function pauseCurrentVideo() {
    var vid = $("stpic").querySelector("video");
    if (vid && !vid.paused) vid.pause();
  }

  $("stPrev").onclick = function () {
    pauseCurrentVideo();
    show(k - 1);
  };
  $("stNext").onclick = function () {
    pauseCurrentVideo();
    show(k + 1);
  };
  $("stsay").onclick = function () {
    pauseCurrentVideo();
    say(STORY[k].t + ". " + STORY[k].x + " " + MISSION);
  };

  show(0);
})();
