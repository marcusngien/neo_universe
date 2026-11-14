/* ================= STORY MODE ================= */
var MISSION =
  "The mission never changed: go farther, and send what you learn back home.";
var STORY = [
  {
    y: "1969",
    g: "Generation 1",
    t: "The first signal",
    c: "var(--moon)",
    img: "story1.jpg",
    video: "story1.mp4",
    h: ["laser-reflector"],
    x: "NASA was created in 1958. In July 1969 Apollo 11 astronauts set a panel of 100 mirrors on the Moon. They could not stay, so they left something that could answer Earth's light for them.",
  },
  {
    y: "1972",
    g: "Generation 2",
    t: "The listeners",
    c: "var(--moon)",
    img: "story2.jpg",
    video: "story2.mp4",
    h: ["lunar-rover", "alsep"],
    x: "Apollo 16 crews drove the Rover across the Descartes Highlands and set up a science station to listen to the Moon. It was built to last about a year. It kept sending data until NASA switched it off in 1977.",
  },
  {
    y: "1977",
    g: "Generation 3",
    t: "Messages for strangers",
    c: "var(--deep)",
    img: "story3.jpg",
    video: "story3.mp4",
    h: ["pioneer-10", "voyager-1", "voyager-2"],
    x: "Pioneer 10 carried a plaque with a map to Earth. The Voyagers carried a Golden Record. The people who built them knew they would never meet whoever found them. They wrote anyway.",
  },
  {
    y: "2004",
    g: "Generation 4",
    t: "One more day",
    c: "var(--mars)",
    img: "story4.jpg",
    video: "story4.mp4",
    h: ["opportunity"],
    x: "A new team landed Opportunity on Mars with a 90-day plan. They kept it working for more than fourteen years, passing the job from one engineer to the next. After the 2018 dust storm they kept listening until 2019.",
  },
  {
    y: "2018",
    g: "Generation 5",
    t: "Listening again",
    c: "var(--mars)",
    img: "story5.jpg",
    video: "story5.mp4",
    h: ["insight", "alsep"],
    x: "Almost half a century after Apollo's seismometer listened to the Moon, InSight put one on Mars and heard 1,319 marsquakes. Different people, a different planet, the same idea: listen, and learn what is inside.",
  },
  {
    y: "2021",
    g: "Generation 6",
    t: "From 1903 to Mars",
    c: "var(--mars)",
    img: "story6.jpg",
    video: "story6.mp4",
    h: ["ingenuity"],
    x: "Ingenuity carried a tiny piece of fabric from the Wright brothers' 1903 airplane. It was meant to fly 5 times. It flew 72, scouting ahead for the rover behind it.",
  },
  {
    y: "2026",
    g: "Generation 7",
    t: "Still talking",
    c: "var(--cyan)",
    img: "story7.jpg",
    video: "story7.mp4",
    h: ["voyager-1", "laser-reflector"],
    x: "Voyager 1 is still sending data from interstellar space, and engineers keep finding power to spare. The Apollo mirrors still answer lasers. The next chapter belongs to whoever carries the mission on. That could be you.",
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
        '<video src="' +
        isrc(s.video) +
        '" poster="' +
        isrc(s.img) +
        '" controls playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;display:block;"></video>' +
        "<span>" +
        esc(s.y) +
        "</span>";
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
