// ===============================
// EMAILJS SETUP
// ===============================
// 1. Create an EmailJS account.
// 2. Connect your email service.
// 3. Create a template with these variables:
//    {{to_name}}, {{answer}}, {{message}}, {{time}}
// 4. Replace the three placeholder values below.
// 5. Set EMAIL_ENABLED to true after testing.

const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAIL_ENABLED = false;

if (window.emailjs && EMAIL_ENABLED) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const screens = {
  intro: document.getElementById("introScreen"),
  block: document.getElementById("blockScreen"),
  desk: document.getElementById("deskScreen")
};

const startBtn = document.getElementById("startBtn");
const skipBlockBtn = document.getElementById("skipBlockBtn");
const blastBoard = document.getElementById("blastBoard");
const blockTray = document.getElementById("blockTray");
const clearCountEl = document.getElementById("clearCount");
const toast = document.getElementById("toast");

const legoSlots = [...document.querySelectorAll(".lego-slot")];
const legoPieces = [...document.querySelectorAll(".lego-piece")];
const resetBtn = document.getElementById("resetBtn");
const dialog = document.getElementById("promDialog");
const yesBtn = document.getElementById("yesBtn");
const alsoYesBtn = document.getElementById("alsoYesBtn");
const statusEl = document.getElementById("status");
const confetti = document.getElementById("confetti");
const baseball = document.getElementById("baseball");
const snack = document.getElementById("snack");

function showScreen(name) {
  Object.values(screens).forEach(screen => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

startBtn.addEventListener("click", () => {
  showScreen("block");
  showToast("clear 3 lines, then you unlock the desk");
});

skipBlockBtn.addEventListener("click", () => {
  showToast("fine, we'll call that strategic");
  setTimeout(() => showScreen("desk"), 600);
});

// ===============================
// BLOCK BLAST MINI GAME
// ===============================

const BOARD_SIZE = 6;
let grid = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
let selectedShape = null;
let clearedLines = 0;

const shapes = [
  { name: "two", cells: [[0,0], [0,1]] },
  { name: "three", cells: [[0,0], [0,1], [0,2]] },
  { name: "corner", cells: [[0,0], [1,0], [1,1]] },
  { name: "square", cells: [[0,0], [0,1], [1,0], [1,1]] },
  { name: "tall", cells: [[0,0], [1,0], [2,0]] }
];

function setupBlockGame() {
  grid = [
    [1, 1, 1, 1, 0, 0],
    [0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1, 0],
    [0, 1, 0, 0, 1, 0]
  ];

  clearedLines = 0;
  clearCountEl.textContent = "0";
  renderBlockBoard();
  renderBlockTray();
}

function renderBlockBoard() {
  blastBoard.innerHTML = "";

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement("button");
      cell.className = "blast-cell";
      cell.type = "button";
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (grid[r][c]) cell.classList.add("filled");

      cell.addEventListener("click", () => tryPlaceShape(r, c));
      blastBoard.appendChild(cell);
    }
  }
}

function renderBlockTray() {
  blockTray.innerHTML = "";

  const offered = [shapes[0], shapes[1], shapes[2], shapes[3]];
  offered.forEach((shape, index) => {
    const button = document.createElement("button");
    button.className = "block-piece";
    button.type = "button";
    button.dataset.index = index;
    button.setAttribute("aria-label", `select ${shape.name} block`);

    for (let i = 0; i < 12; i++) {
      const dot = document.createElement("span");
      const row = Math.floor(i / 4);
      const col = i % 4;
      const isPart = shape.cells.some(([r, c]) => r === row && c === col);
      if (isPart) dot.className = "block-dot";
      button.appendChild(dot);
    }

    button.addEventListener("click", () => {
      selectedShape = shape;
      [...document.querySelectorAll(".block-piece")].forEach(p => p.classList.remove("selected"));
      button.classList.add("selected");
      showToast("now tap the board");
    });

    blockTray.appendChild(button);
  });
}

function tryPlaceShape(startRow, startCol) {
  if (!selectedShape) {
    showToast("pick a block first");
    return;
  }

  const canPlace = selectedShape.cells.every(([dr, dc]) => {
    const r = startRow + dr;
    const c = startCol + dc;
    return r >= 0 && c >= 0 && r < BOARD_SIZE && c < BOARD_SIZE && grid[r][c] === 0;
  });

  if (!canPlace) {
    showToast("not enough room there");
    return;
  }

  selectedShape.cells.forEach(([dr, dc]) => {
    grid[startRow + dr][startCol + dc] = 1;
  });

  selectedShape = null;
  renderBlockBoard();
  checkClears();
}

function checkClears() {
  const rowsToClear = [];
  const colsToClear = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    if (grid[r].every(Boolean)) rowsToClear.push(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    if (grid.every(row => row[c])) colsToClear.push(c);
  }

  const total = rowsToClear.length + colsToClear.length;

  if (!total) {
    showToast("nice, keep going");
    return;
  }

  clearedLines += total;
  clearCountEl.textContent = Math.min(clearedLines, 3);

  [...blastBoard.children].forEach(cell => {
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (rowsToClear.includes(r) || colsToClear.includes(c)) {
      cell.classList.add("clearing");
    }
  });

  setTimeout(() => {
    rowsToClear.forEach(r => {
      for (let c = 0; c < BOARD_SIZE; c++) grid[r][c] = 0;
    });
    colsToClear.forEach(c => {
      for (let r = 0; r < BOARD_SIZE; r++) grid[r][c] = 0;
    });

    renderBlockBoard();

    if (clearedLines >= 3) {
      showToast("desk unlocked");
      setTimeout(() => showScreen("desk"), 800);
    } else {
      showToast("line cleared");
    }
  }, 360);
}

setupBlockGame();

// ===============================
// LEGO HEART GAME
// ===============================

// Heart pattern:
// X . X
// X X X
// . X .
const HEART_SLOTS = new Set(["0", "2", "3", "4", "5", "7"]);
let selectedPiece = null;
let filledSlots = new Set();
let revealed = false;

legoSlots.forEach(slot => {
  if (HEART_SLOTS.has(slot.dataset.slot)) {
    slot.classList.add("needed");
  }

  slot.addEventListener("click", () => {
    if (!selectedPiece) {
      showToast("pick a LEGO piece first");
      return;
    }

    placeLego(slot, selectedPiece);
  });
});

legoPieces.forEach(piece => {
  piece.addEventListener("click", () => {
    if (piece.classList.contains("used")) return;

    legoPieces.forEach(p => p.classList.remove("selected"));
    selectedPiece = piece;
    piece.classList.add("selected");
  });
});

function placeLego(slot, piece) {
  const slotId = slot.dataset.slot;

  if (!HEART_SLOTS.has(slotId)) {
    shake(slot);
    showToast("almost, but the heart does not go there");
    return;
  }

  if (filledSlots.has(slotId)) return;

  filledSlots.add(slotId);
  slot.classList.add("filled");
  piece.classList.add("used");
  piece.classList.remove("selected");
  selectedPiece = null;

  if (filledSlots.size === HEART_SLOTS.size && !revealed) {
    revealed = true;
    showToast("heart built");
    setTimeout(showPromDialog, 850);
  }
}

function resetLego() {
  filledSlots.clear();
  selectedPiece = null;
  revealed = false;
  statusEl.textContent = "";

  legoSlots.forEach(slot => slot.classList.remove("filled"));
  legoPieces.forEach(piece => piece.classList.remove("selected", "used"));
}

resetBtn.addEventListener("click", resetLego);

baseball.addEventListener("click", () => {
  baseball.classList.remove("spin");
  void baseball.offsetWidth;
  baseball.classList.add("spin");
  showToast("baseball inspected");
});

snack.addEventListener("click", () => {
  snack.classList.remove("bump");
  void snack.offsetWidth;
  snack.classList.add("bump");
  showToast("uncrustable status: probably stolen");
});

function showPromDialog() {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

// ===============================
// YES BUTTON + EMAIL
// ===============================

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

// ===============================
// SMALL EFFECTS
// ===============================

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

function shake(element) {
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

function launchConfetti() {
  const items = ["🧱", "⚾", "❤️", "✨", "🥪"];
  confetti.innerHTML = "";

  for (let i = 0; i < 42; i++) {
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
