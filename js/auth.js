/**
 * @file auth.js
 * @project Neo Universe - NASA Space Apps Challenge
 * @si-disclosure all human written
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAiHAHmzCDvLDJXO2yxwKL15erbAnQNQsw",
  authDomain: "neo-universe-29373.firebaseapp.com",
  projectId: "neo-universe-29373",
  storageBucket: "neo-universe-29373.firebasestorage.app",
  messagingSenderId: "121577208500",
  appId: "1:121577208500:web:a917a3ae01c9dea5a935e1",
  measurementId: "G-Y73R83211K",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $a = (id) => document.getElementById(id);
let user = null;
let mode = "login"; 


const ERR = {
  "auth/invalid-credential": "Wrong email or password.",
  "auth/invalid-email": "That email address does not look right.",
  "auth/email-already-in-use": "That email already has an account. Try logging in.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many tries. Wait a moment and try again.",
  "auth/popup-closed-by-user": "The Google window was closed before finishing.",
  "auth/network-request-failed": "Network problem. Check your connection.",
  "auth/operation-not-allowed": "This sign-in method is not enabled in the Firebase console.",
  "auth/unauthorized-domain": "This website's domain is not in Firebase > Authentication > Settings > Authorized domains.",
};
function say(msg, ok) {
  const m = $a("amsg");
  m.textContent = msg || "";
  m.style.color = ok ? "var(--ok)" : "var(--off)";
}
function fail(e) {
  console.error(e);
  say(ERR[e.code] || "Something went wrong: " + (e.code || e.message));
}


function mergeProgress(a, b) {
  const out = { seen: {}, quiz: 0, quizDone: false, badges: {} };
  [a, b].forEach((p) => {
    if (!p) return;
    Object.keys(p.seen || {}).forEach((k) => (out.seen[k] = 1));
    Object.keys(p.badges || {}).forEach((k) => (out.badges[k] = 1));
    out.quiz = Math.max(out.quiz, p.quiz || 0);
    out.quizDone = out.quizDone || !!p.quizDone;
  });
  return out;
}


let saveTimer = null;
window.cloudSave = function () {
  if (!user) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          progress: window.P,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch (e) {
      console.error("Cloud save failed", e);
    }
  }, 800);
};

async function loadCloudProgress() {
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    const cloud = snap.exists() ? snap.data().progress : null;
    window.P = mergeProgress(window.P, cloud);
    try {
      localStorage.setItem("ghostP", JSON.stringify(window.P));
    } catch (e) {}
    window.check(); 
    window.cloudSave();
  } catch (e) {
    console.error("Cloud load failed", e);
    say("Logged in, but progress could not be loaded. Check your Firestore rules.");
  }
}

function resetLocalProgress() {
  window.P = { seen: {}, quiz: 0, quizDone: false, badges: {} };
  try {
    localStorage.removeItem("ghostP");
  } catch (e) {}
  window.renderBadges();
}


function openAuth() {
  $a("authModal").classList.add("on");
  document.body.style.overflow = "hidden";
}
function closeAuth() {
  $a("authModal").classList.remove("on");
  document.body.style.overflow = "";
  say("");
}
function setMode(m) {
  mode = m;
  $a("tabLogin").setAttribute("aria-selected", m === "login");
  $a("tabSignup").setAttribute("aria-selected", m === "signup");
  $a("aname").style.display = m === "signup" ? "block" : "none";
  $a("asubmit").textContent = m === "signup" ? "CREATE ACCOUNT" : "LOG IN";
  $a("apass").autocomplete = m === "signup" ? "new-password" : "current-password";
  say("");
}
function render() {
  const out = $a("aout"),
    inn = $a("ain"),
    btn = $a("authBtn");
  if (user) {
    out.style.display = "none";
    inn.style.display = "block";
    const label = user.displayName || user.email || "Explorer";
    $a("ahello").textContent = "Signed in as " + label;
    $a("atitle").textContent = "Your account";
    btn.textContent = "👤 " + label.split("@")[0].slice(0, 12).toUpperCase();
  } else {
    out.style.display = "block";
    inn.style.display = "none";
    $a("atitle").textContent = "Log in or sign up";
    btn.textContent = "LOG IN";
  }
}

$a("authBtn").onclick = openAuth;
$a("aclose").onclick = closeAuth;
$a("authModal").addEventListener("click", (e) => {
  if (e.target === $a("authModal")) closeAuth();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && $a("authModal").classList.contains("on")) closeAuth();
});
$a("tabLogin").onclick = () => setMode("login");
$a("tabSignup").onclick = () => setMode("signup");


$a("aform").onsubmit = async (e) => {
  e.preventDefault();
  const email = $a("aemail").value.trim(),
    pass = $a("apass").value;
  $a("asubmit").disabled = true;
  say("");
  try {
    if (mode === "signup") {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const name = $a("aname").value.trim();
      if (name) await updateProfile(cred.user, { displayName: name });
    } else {
      await signInWithEmailAndPassword(auth, email, pass);
    }
    $a("apass").value = "";
  } catch (err) {
    fail(err);
  } finally {
    $a("asubmit").disabled = false;
  }
};

$a("agoogle").onclick = async () => {
  say("");
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    fail(err);
  }
};

$a("areset").onclick = async () => {
  const email = $a("aemail").value.trim();
  if (!email) return say("Type your email above first, then press this again.");
  try {
    await sendPasswordResetEmail(auth, email);
    say("Password reset email sent. Check your inbox (and spam).", true);
  } catch (err) {
    fail(err);
  }
};

$a("alogout").onclick = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    fail(err);
  }
};

onAuthStateChanged(auth, async (u) => {
  const was = user;
  user = u;
  render();
  if (u) {
    await loadCloudProgress();
    closeAuth();
  } else if (was) {
    resetLocalProgress(); 
  }
});

setMode("login");
