// ---------- Splash screen ----------
const splash = document.getElementById("splash");

document.getElementById("enter").addEventListener("click", () => {
  splash.classList.add("hidden");
});

// ---------- Clock ----------
function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  document.getElementById("clock").textContent = `${date} · ${time}`;
}
updateClock();
setInterval(updateClock, 1000);

// ---------- Windows ----------
let topZ = 10;

function focusWindow(win) {
  topZ++;
  win.style.zIndex = topZ;
}

function openWindow(win) {
  win.style.display = "flex";
  focusWindow(win);
}

function closeWindow(win) {
  win.style.display = "none";
}

// Drag a window by its header
function makeDraggable(win) {
  const header = win.querySelector(".window-header");
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".close-btn")) return; // let the close button work
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    header.setPointerCapture(e.pointerId);
    focusWindow(win);
  });

  header.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    win.style.left = (e.clientX - offsetX) + "px";
    win.style.top = (e.clientY - offsetY) + "px";
  });

  const stopDragging = () => {
    dragging = false;
  };
  header.addEventListener("pointerup", stopDragging);
  header.addEventListener("pointercancel", stopDragging);
}

document.querySelectorAll(".window").forEach((win) => {
  makeDraggable(win);
  win.addEventListener("pointerdown", () => focusWindow(win));
  win.querySelector(".close-btn").addEventListener("click", () => closeWindow(win));
});

// Bottom bar buttons open or close their window
document.querySelectorAll(".app-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const win = document.getElementById(btn.dataset.target);
    if (win.style.display === "flex") {
      closeWindow(win);
    } else {
      openWindow(win);
    }
  });
});

// ---------- Notes app ----------
const notesKey = "myos-notes";
let notes = JSON.parse(localStorage.getItem(notesKey) || "[]");
let currentNote = -1;

const noteList = document.getElementById("note-list");
const noteText = document.getElementById("note-text");

function saveNotes() {
  localStorage.setItem(notesKey, JSON.stringify(notes));
}

function noteTitle(note) {
  const firstLine = note.body.split("\n")[0].trim();
  return firstLine.slice(0, 24) || "Untitled";
}

function renderNotes() {
  noteList.innerHTML = "";
  notes.forEach((note, i) => {
    const btn = document.createElement("button");
    btn.className = "note-item" + (i === currentNote ? " active" : "");
    btn.textContent = noteTitle(note);
    btn.addEventListener("click", () => selectNote(i));
    noteList.appendChild(btn);
  });
}

function selectNote(i) {
  currentNote = i;
  noteText.disabled = i < 0;
  noteText.value = i >= 0 ? notes[i].body : "";
  renderNotes();
}

noteText.addEventListener("input", () => {
  if (currentNote < 0) return;
  notes[currentNote].body = noteText.value;
  saveNotes();
  renderNotes();
});

document.getElementById("new-note").addEventListener("click", () => {
  notes.push({ body: "" });
  saveNotes();
  selectNote(notes.length - 1);
  noteText.focus();
});

document.getElementById("delete-note").addEventListener("click", () => {
  if (currentNote < 0) return;
  notes.splice(currentNote, 1);
  saveNotes();
  selectNote(Math.min(currentNote, notes.length - 1));
});

selectNote(notes.length > 0 ? 0 : -1);

// ---------- PDF reader ----------
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const pdfCanvas = document.getElementById("pdf-canvas");
const pdfInfo = document.getElementById("pdf-info");
let pdfDoc = null;
let pdfPage = 1;

async function renderPdfPage() {
  if (!pdfDoc) return;
  const page = await pdfDoc.getPage(pdfPage);
  const viewport = page.getViewport({ scale: 1.2 });
  pdfCanvas.width = viewport.width;
  pdfCanvas.height = viewport.height;
  await page.render({ canvasContext: pdfCanvas.getContext("2d"), viewport }).promise;
  pdfInfo.textContent = `Page ${pdfPage} of ${pdfDoc.numPages}`;
}

document.getElementById("pdf-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const data = await file.arrayBuffer();
  pdfDoc = await pdfjsLib.getDocument({ data }).promise;
  pdfPage = 1;
  renderPdfPage();
});

document.getElementById("pdf-prev").addEventListener("click", () => {
  if (pdfDoc && pdfPage > 1) {
    pdfPage--;
    renderPdfPage();
  }
});

document.getElementById("pdf-next").addEventListener("click", () => {
  if (pdfDoc && pdfPage < pdfDoc.numPages) {
    pdfPage++;
    renderPdfPage();
  }
});

// ---------- Music player ----------
const audio = new Audio();
const playBtn = document.getElementById("play-btn");
const cover = document.getElementById("cover");
let tracks = [];
let trackIndex = 0;

document.getElementById("music-input").addEventListener("change", (e) => {
  tracks = Array.from(e.target.files).map((file) => ({
    name: file.name.replace(/\.[^.]+$/, ""),
    url: URL.createObjectURL(file),
  }));
  if (tracks.length > 0) {
    loadTrack(0);
  }
});

function loadTrack(i) {
  trackIndex = i;
  audio.src = tracks[i].url;
  document.getElementById("track-name").textContent = tracks[i].name;
  renderPlaylist();
}

function renderPlaylist() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";
  tracks.forEach((track, i) => {
    const btn = document.createElement("button");
    btn.textContent = `${i + 1}. ${track.name}`;
    if (i === trackIndex) btn.classList.add("active");
    btn.addEventListener("click", () => {
      loadTrack(i);
      audio.play();
    });
    list.appendChild(btn);
  });
}

function togglePlay() {
  if (tracks.length === 0) return;
  if (!audio.src) loadTrack(0);
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function nextTrack() {
  if (tracks.length === 0) return;
  loadTrack((trackIndex + 1) % tracks.length);
  audio.play();
}

function prevTrack() {
  if (tracks.length === 0) return;
  loadTrack((trackIndex - 1 + tracks.length) % tracks.length);
  audio.play();
}

playBtn.addEventListener("click", togglePlay);
document.getElementById("next-track").addEventListener("click", nextTrack);
document.getElementById("prev-track").addEventListener("click", prevTrack);
audio.addEventListener("play", () => {
  playBtn.textContent = "⏸";
  cover.classList.add("spinning");
});
audio.addEventListener("pause", () => {
  playBtn.textContent = "▶";
  cover.classList.remove("spinning");
});
audio.addEventListener("ended", nextTrack);