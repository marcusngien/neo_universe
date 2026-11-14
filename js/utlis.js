/* ================= HELPERS ================= */
var IMG_DIR = "images/"; // change this one line if the image folder moves

function $(i) {
  return document.getElementById(i);
}
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}
/* generic path (used for videos) */
function src(p) {
  return encodeURI(p);
}
/* image path: always adds the images/ prefix */
function isrc(p) {
  return encodeURI(IMG_DIR + p);
}
function thumb(d) {
  return '<img src="' + isrc(d.img) + '" alt="" onerror="this.remove()">';
}
function yrsActive(d) {
  return (d.to === null ? NOW : d.to) - d.from;
}
