/**
 * @file ai.js
 * @project Neo Universe - NASA Space Apps Challenge
 * @si-disclosure Portions of this code were generated/assisted using Super Intelligence (SI) / Large Language Model (LLM) tools.
 * @ai-runtime This script integrates an LLM chatbot (Neo AI) powered by Puter.js (https://js.puter.com/v2/) to answer user questions based on site data.
 */
(function () {
  "use strict";

  /* ---------- settings you can edit ---------- */
  var NAME = "NEO AI";
  var GREETING =
    "Hi! I'm Neo AI 🛰️ Ask me anything about the nine machines we left in space: what they did, where they are now, and whether they're still talking to Earth.";
  var SUGGESTIONS = [
    "Which explorers are still working?",
    "Tell me about Ingenuity",
    "Compare Voyager 1 and Voyager 2",
    "Which one went the farthest?",
  ];
  var HINT = "Ask me about the explorers!";
  var MAX_TURNS = 8; // how many past messages to send along

  /* ---------- build the knowledge from data.js ---------- */
  var STATUS = {
    sleep: "Dormant (silent, but the machine is still there)",
    end: "Mission complete (no longer working)",
    live: "Still working",
  };

  function buildData() {
    var list = window.D;
    if (!Array.isArray(list)) return "(No explorer data was loaded.)";
    return list
      .map(function (d, i) {
        var nums = (d.nums || [])
          .map(function (n) { return n[0] + " (" + n[1] + ")"; })
          .join("; ");
        return (
          (i + 1) + ". " + d.n + " [" + d.s + "]\n" +
          "   Where: " + d.loc + "\n" +
          "   Active: " + d.period + "\n" +
          "   Status: " + (STATUS[d.st] || d.st) + "\n" +
          "   Signal delay: " + d.delay + "\n" +
          "   Power: " + d.power + "\n" +
          "   Movement: " + d.move + "\n" +
          "   Key numbers: " + nums + "\n" +
          "   Did you know: " + d.f
        );
      })
      .join("\n\n");
  }

  function systemPrompt() {
    return (
      "You are Neo AI, a friendly space guide on a school website called Neo Universe. " +
      "The site is about nine NASA machines left behind in space: 3 on the Moon, 3 on Mars and 3 in deep space. " +
      "Today's date is " + new Date().toDateString() + ".\n\n" +
      "RULES\n" +
      "- Use the SITE DATA below as your main source. If the answer is there, use its facts and numbers.\n" +
      "- If the question is about something not in the data, you may add well-known space facts, but say 'this isn't on the site' first, and say you're not sure if you aren't.\n" +
      "- Answer in 2 to 5 short sentences unless the person asks for more. Use simple words a student can follow.\n" +
      "- Reply in the same language the person writes in.\n" +
      "- Stay on space and this website's topics; politely steer other questions back.\n\n" +
      "SITE DATA\n" + buildData()
    );
  }

  /* ---------- styles ---------- */
  var css =
    /* the button: big, filled, glowing */
    "#neoAiBtn{position:fixed;z-index:60;left:calc(18px + env(safe-area-inset-left,0px));bottom:calc(18px + env(safe-area-inset-bottom,0px));" +
    "display:flex;align-items:center;gap:10px;padding:14px 22px 14px 16px;border:0;border-radius:999px;" +
    "background:linear-gradient(90deg,#3de0ff,#8c64ff);color:#050818;font:900 15px Orbitron,sans-serif;letter-spacing:.06em;cursor:pointer;" +
    "box-shadow:0 0 0 0 rgba(61,224,255,.6),0 6px 28px rgba(140,100,255,.55);animation:neoAiPulse 2.4s ease-out infinite}" +
    "#neoAiBtn .ico{font-size:24px;line-height:1}" +
    "#neoAiBtn:hover{transform:translateY(-2px);filter:brightness(1.1)}" +
    "@keyframes neoAiPulse{0%{box-shadow:0 0 0 0 rgba(61,224,255,.6),0 6px 28px rgba(140,100,255,.55)}" +
    "70%,100%{box-shadow:0 0 0 18px rgba(61,224,255,0),0 6px 28px rgba(140,100,255,.55)}}" +
    "#neoAiBtn.open{animation:none}" +
    /* the little speech bubble above the button */
    "#neoAiHint{position:fixed;z-index:60;left:calc(24px + env(safe-area-inset-left,0px));bottom:calc(82px + env(safe-area-inset-bottom,0px));" +
    "max-width:220px;padding:10px 14px;border:1px solid #3de0ff;border-radius:14px 14px 14px 4px;background:#0b1030;color:#eaf0ff;" +
    "font:15px 'Source Serif 4',Georgia,serif;box-shadow:0 0 22px rgba(61,224,255,.35);opacity:0;pointer-events:none;transform:translateY(6px);transition:opacity .3s,transform .3s}" +
    "#neoAiHint.on{opacity:1;transform:none}" +
    /* the panel */
    "#neoAi{position:fixed;z-index:61;left:calc(18px + env(safe-area-inset-left,0px));bottom:calc(84px + env(safe-area-inset-bottom,0px));" +
    "width:min(400px,calc(100vw - 36px));height:min(560px,calc(100dvh - 130px));display:none;flex-direction:column;" +
    "border:1px solid #8c64ff;border-radius:16px;background:#0b1030;color:#eaf0ff;box-shadow:0 0 40px rgba(140,100,255,.4);overflow:hidden;" +
    "font-family:'Source Serif 4',Georgia,serif}" +
    "#neoAi.on{display:flex}" +
    "#neoAi .h{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.15);" +
    "background:linear-gradient(90deg,rgba(61,224,255,.18),rgba(140,100,255,.18));font:700 14px Orbitron,sans-serif;letter-spacing:.08em}" +
    "#neoAi .x{border:0;background:none;color:#eaf0ff;font-size:18px;cursor:pointer;padding:2px 6px}" +
    "#neoAi .m{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    "#neoAi .b{max-width:88%;padding:10px 13px;border-radius:12px;font-size:15px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}" +
    "#neoAi .b.ai{align-self:flex-start;background:rgba(140,100,255,.2);border:1px solid rgba(140,100,255,.45)}" +
    "#neoAi .b.me{align-self:flex-end;background:rgba(61,224,255,.16);border:1px solid rgba(61,224,255,.45)}" +
    "#neoAi .b.err{align-self:flex-start;background:rgba(255,107,107,.15);border:1px solid rgba(255,107,107,.5);color:#ffb4b4}" +
    "#neoAi .s{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}" +
    "#neoAi .s button{border:1px solid rgba(255,255,255,.25);border-radius:999px;background:transparent;color:#eaf0ff;" +
    "font:13px 'Source Serif 4',Georgia,serif;padding:6px 11px;cursor:pointer;text-align:left}" +
    "#neoAi .s button:hover{border-color:#3de0ff;color:#3de0ff}" +
    "#neoAi form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.15)}" +
    "#neoAi input{flex:1;min-width:0;padding:10px 12px;border:1px solid rgba(255,255,255,.25);border-radius:8px;" +
    "background:rgba(255,255,255,.06);color:#eaf0ff;font:16px 'Source Serif 4',Georgia,serif}" +
    "#neoAi form button{border:0;border-radius:8px;padding:0 14px;background:linear-gradient(90deg,#3de0ff,#8c64ff);color:#050818;" +
    "font:700 12px Orbitron,sans-serif;cursor:pointer}" +
    "#neoAi form button:disabled,#neoAi input:disabled{opacity:.55;cursor:wait}" +
    "#neoAi :focus-visible,#neoAiBtn:focus-visible{outline:2px solid #fff;outline-offset:2px}" +
    "@media (prefers-reduced-motion:reduce){#neoAiBtn{animation:none}#neoAiHint{transition:none}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- markup ---------- */
  var btn = document.createElement("button");
  btn.id = "neoAiBtn";
  btn.type = "button";
  btn.innerHTML = '<span class="ico" aria-hidden="true">🛰️</span><span>ASK NEO AI</span>';
  btn.setAttribute("aria-label", "Open Neo AI chat");

  var hint = document.createElement("div");
  hint.id = "neoAiHint";
  hint.textContent = HINT;
  hint.setAttribute("aria-hidden", "true");

  var box = document.createElement("div");
  box.id = "neoAi";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Neo AI chat");
  box.innerHTML =
    '<div class="h"><span>' + NAME + '</span><button class="x" type="button" aria-label="Close">✕</button></div>' +
    '<div class="m" aria-live="polite"></div>' +
    '<div class="s"></div>' +
    '<form><input type="text" placeholder="Ask about any explorer…" autocomplete="off" aria-label="Your question" />' +
    '<button type="submit">SEND</button></form>';

  document.body.appendChild(hint);
  document.body.appendChild(btn);
  document.body.appendChild(box);

  var msgs = box.querySelector(".m");
  var sugs = box.querySelector(".s");
  var form = box.querySelector("form");
  var input = box.querySelector("input");
  var send = form.querySelector("button");
  var history = [];
  var busy = false;

  /* ---------- helpers ---------- */
  function add(text, cls) {
    var d = document.createElement("div");
    d.className = "b " + cls;
    d.textContent = text; // textContent, so the AI's reply can never inject HTML
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }

  function setBusy(v) {
    busy = v;
    input.disabled = v;
    send.disabled = v;
  }

  // Puter must be signed in; this is called straight from the click so the popup isn't blocked
  function ensurePuter() {
    if (!window.puter) return Promise.reject(new Error("Puter not loaded"));
    if (puter.auth.isSignedIn()) return Promise.resolve();
    return puter.auth.signIn();
  }

  function replyText(r) {
    if (typeof r === "string") return r;
    var c = r && r.message && r.message.content;
    if (typeof c === "string") return c;
    if (Array.isArray(c))
      return c.map(function (p) { return (p && p.text) || ""; }).join("");
    return String(r);
  }

  /* ---------- ask ---------- */
  function ask(q) {
    q = (q || "").trim();
    if (!q || busy) return;
    sugs.style.display = "none";
    add(q, "me");
    input.value = "";
    setBusy(true);

    var typing = add("…", "ai");

    ensurePuter()
      .then(function () {
        history.push({ role: "user", content: q });
        var messages = [{ role: "system", content: systemPrompt() }].concat(history.slice(-MAX_TURNS));
        return puter.ai.chat(messages);
      })
      .then(function (r) {
        var t = replyText(r).trim() || "I couldn't come up with an answer. Try asking in another way.";
        typing.textContent = t;
        history.push({ role: "assistant", content: t });
      })
      .catch(function (e) {
        console.error(e);
        history.pop(); // drop the question that failed
        typing.className = "b err";
        typing.textContent =
          "Neo AI couldn't answer. Make sure you are signed in to Puter (a sign-in window opens the first time), then try again.";
      })
      .then(function () {
        setBusy(false);
        msgs.scrollTop = msgs.scrollHeight;
        input.focus();
      });
  }

  /* ---------- wire up ---------- */
  add(GREETING, "ai");
  SUGGESTIONS.forEach(function (s) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = s;
    b.onclick = function () { ask(s); };
    sugs.appendChild(b);
  });

  form.onsubmit = function (e) {
    e.preventDefault();
    ask(input.value);
  };

  function hideHint() { hint.classList.remove("on"); }

  function toggle(open) {
    box.classList.toggle("on", open);
    btn.classList.toggle("open", open);
    hideHint();
    if (open) setTimeout(function () { input.focus(); }, 50);
  }
  btn.onclick = function () { toggle(!box.classList.contains("on")); };
  box.querySelector(".x").onclick = function () { toggle(false); };
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggle(false);
  });

  /* the speech bubble: shows once per visit, then goes away */
  var seen = false;
  try { seen = sessionStorage.getItem("neoAiHint") === "1"; } catch (e) {}
  if (!seen) {
    setTimeout(function () {
      if (box.classList.contains("on")) return;
      hint.classList.add("on");
      try { sessionStorage.setItem("neoAiHint", "1"); } catch (e) {}
      setTimeout(hideHint, 8000);
    }, 1500);
  }
})();
