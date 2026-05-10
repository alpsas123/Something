// ===============================
// EMAILJS SETUP
// ===============================
// 1. Create an EmailJS account.
// 2. Connect your email service.
// 3. Create a template with these variables:
//    {{to_name}}, {{answer}}, {{message}}, {{time}}
// 4. Replace the three placeholder values below.

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

// Optional: set this to false while testing if you do not want emails sent.
const EMAIL_ENABLED = false;

if (window.emailjs && EMAIL_ENABLED) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

// Heart pattern slots on a 3x3 board:
// X . X
// X X X
// . X .
const HEART_SLOTS = new Set(["0", "2", "3", "4", "5", "7"]);

const board = document.getElementById("board");
const slots = [...document.querySelectorAll(".slot")];
const pieces = [...document.querySelectorAll(".piece")];
const dialog = document.getElementById("promDialog");
const yesBtn = document.getElementById("yesBtn");
const alsoYesBtn = document.getElementById("alsoYesBtn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");
const confetti = document.getElementById("confetti");
const baseball = document.getElementById("baseball");
const snack = document.getElementById("snack");

let filledSlots = new Set();
let draggedPiece = null;
let selectedPiece = null;
let revealed = false;

slots.forEach(slot => {
  if (HEART_SLOTS.has(slot.dataset.slot)) {
    slot.classList.add("needed");
  }

  slot.addEventListener("dragover", event => {
    event.preventDefault();
  });

  slot.addEventListener("drop", event => {
    event.preventDefault();
    if (!draggedPiece) return;
    placePiece(slot, draggedPiece);
  });

  slot.addEventListener("click", () => {
    if (!selectedPiece) return;
    placePiece(slot, selectedPiece);
  });
});

pieces.forEach(piece => {
  piece.addEventListener("dragstart", () => {
    draggedPiece = piece;
  });

  piece.addEventListener("dragend", () => {
    draggedPiece = null;
  });

  piece.addEventListener("click", () => {
    if (piece.classList.contains("used")) return;

    pieces.forEach(p => p.classList.remove("selected"));
    selectedPiece = piece;
    piece.classList.add("selected");
  });
});

function placePiece(slot, piece) {
  const slotId = slot.dataset.slot;

  if (!HEART_SLOTS.has(slotId)) {
    gentleShake(slot);
    return;
  }

  if (filledSlots.has(slotId)) return;

  filledSlots.add(slotId);
  slot.classList.add("filled");
  piece.classList.add("used");
  piece.classList.remove("selected");

  if (selectedPiece === piece) selectedPiece = null;

  if (filledSlots.size === HEART_SLOTS.size && !revealed) {
    revealed = true;
    setTimeout(showPromDialog, 650);
  }
}

function gentleShake(element) {
  element.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 220, easing: "ease-out" }
  );
}

function showPromDialog() {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function resetBuild() {
  filledSlots.clear();
  revealed = false;
  selectedPiece = null;
  statusEl.textContent = "";

  slots.forEach(slot => {
    slot.classList.remove("filled");
  });

  pieces.forEach(piece => {
    piece.classList.remove("used", "selected");
  });
}

resetBtn.addEventListener("click", resetBuild);

baseball.addEventListener("click", () => {
  baseball.classList.remove("spin");
  void baseball.offsetWidth;
  baseball.classList.add("spin");
});

snack.addEventListener("click", () => {
  snack.classList.remove("bump");
  void snack.offsetWidth;
  snack.classList.add("bump");
});

yesBtn.addEventListener("click", () => handleYes("yes :)"));
alsoYesBtn.addEventListener("click", () => handleYes("obviously"));

async function handleYes(answer) {
  statusEl.textContent = "sending the very important news...";
  launchConfetti();

  if (!EMAIL_ENABLED) {
    statusEl.textContent = "Email is off for testing, but the yes button works :)";
    return;
  }

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_name: "You",
      answer,
      message: "Neele clicked yes to prom.",
      time: new Date().toLocaleString()
    });

    statusEl.textContent = "sent. good choice :)";
  } catch (error) {
    console.error("EmailJS error:", error);
    statusEl.textContent = "the answer worked, but the email had a tiny issue.";
  }
}

function launchConfetti() {
  const items = ["🧱", "⚾", "❤️", "✨"];
  confetti.innerHTML = "";

  for (let i = 0; i < 34; i++) {
    const piece = document.createElement("span");
    piece.textContent = items[Math.floor(Math.random() * items.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    piece.style.animationDuration = `${1.3 + Math.random() * 1.2}s`;
    confetti.appendChild(piece);
  }

  setTimeout(() => {
    confetti.innerHTML = "";
  }, 2800);
}
