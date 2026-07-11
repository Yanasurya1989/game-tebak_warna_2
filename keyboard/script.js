// =====================================
// MISI KEYBOARD
// script.js
// Part 1
// =====================================

// ---------------- DATA ----------------

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

const numbers = "0123456789".split("");

const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

const symbolMap = {
  "!": "Digit1",
  "@": "Digit2",
  "#": "Digit3",
  $: "Digit4",
  "%": "Digit5",
  "^": "Digit6",
  "&": "Digit7",
  "*": "Digit8",
  "(": "Digit9",
  ")": "Digit0",
};

const symbolHint = {
  "!": "Shift + 1",
  "@": "Shift + 2",
  "#": "Shift + 3",
  $: "Shift + 4",
  "%": "Shift + 5",
  "^": "Shift + 6",
  "&": "Shift + 7",
  "*": "Shift + 8",
  "(": "Shift + 9",
  ")": "Shift + 0",
};

// ---------------- GAME ----------------

let level = 1;
let score = 0;
let questionCount = 0;

const QUESTION_PER_LEVEL = 10;

let currentQuestion = "";
let expectedCode = "";
let expectedShift = false;

let gameOver = false;

// ---------------- ELEMENT ----------------

const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");

const instructionEl = document.getElementById("instruction");
const questionEl = document.getElementById("question");

const pressedEl = document.getElementById("pressedKey");
const typedEl = document.getElementById("typedChar");
const statusEl = document.getElementById("status");

const keys = document.querySelectorAll(".key");

// ---------------- UTIL ----------------

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateHUD() {
  levelEl.textContent = level;
  scoreEl.textContent = score;
}

function clearHighlight() {
  keys.forEach((key) => {
    key.classList.remove("active", "correct", "wrong");
  });
}

function highlight(code) {
  clearHighlight();

  const key = document.querySelector(`[data-code="${code}"]`);

  if (key) {
    key.classList.add("active");
  }
}

function showPressed(event) {
  let text = "";

  if (event.shiftKey) {
    text += "Shift + ";
  }

  if (event.code.startsWith("Key")) {
    text += event.code.replace("Key", "");
  } else if (event.code.startsWith("Digit")) {
    text += event.code.replace("Digit", "");
  } else {
    text += event.key;
  }

  pressedEl.textContent = text;
  typedEl.textContent = event.key;
}

// ---------------- SOAL ----------------

function generateQuestion() {
  statusEl.textContent = "";
  statusEl.className = "status";

  switch (level) {
    case 1:
      currentQuestion = randomItem(letters);

      instructionEl.textContent = "Tekan huruf berikut";

      questionEl.textContent = currentQuestion;

      expectedCode = "Key" + currentQuestion.toUpperCase();

      expectedShift = false;

      break;

    case 2:
      currentQuestion = randomItem(letters).toUpperCase();

      instructionEl.textContent = "Buat huruf KAPITAL";

      questionEl.textContent = currentQuestion;

      expectedCode = "Key" + currentQuestion;

      expectedShift = true;

      break;

    case 3:
      currentQuestion = randomItem(numbers);

      instructionEl.textContent = "Tekan angka berikut";

      questionEl.textContent = currentQuestion;

      expectedCode = "Digit" + currentQuestion;

      expectedShift = false;

      break;

    case 4:
      currentQuestion = randomItem(symbols);

      instructionEl.textContent = "Buat simbol berikut";

      questionEl.textContent = currentQuestion;

      expectedCode = symbolMap[currentQuestion];

      expectedShift = true;

      break;
  }
}

updateHUD();
generateQuestion();

// =====================================
// Part 2
// =====================================

function nextLevel() {
  questionCount = 0;

  if (level < 4) {
    level++;

    updateHUD();

    statusEl.textContent = "🎉 Naik ke Level " + level;

    statusEl.className = "status correct";

    document.querySelector(".container").classList.add("flash");

    setTimeout(() => {
      document.querySelector(".container").classList.remove("flash");

      generateQuestion();
    }, 1200);
  } else {
    gameFinished();
  }
}

function gameFinished() {
  gameOver = true;

  instructionEl.textContent = "Permainan selesai";

  questionEl.textContent = "🏆";

  pressedEl.textContent = "-";

  typedEl.textContent = "-";

  statusEl.className = "status correct";

  statusEl.innerHTML = "Selamat!<br>Skor Akhir : <b>" + score + "</b>";
}

function showHint() {
  if (level === 2) {
    statusEl.innerHTML =
      "❌ Salah<br>Gunakan <b>Shift + " + currentQuestion + "</b>";
  } else if (level === 4) {
    statusEl.innerHTML =
      "❌ Salah<br>Gunakan <b>" + symbolHint[currentQuestion] + "</b>";
  } else {
    statusEl.textContent = "❌ Salah";
  }
}

function checkAnswer(event) {
  if (gameOver) return;

  // jangan anggap Shift sebagai jawaban
  if (
    event.key === "Shift" ||
    event.code === "ShiftLeft" ||
    event.code === "ShiftRight"
  ) {
    return;
  }

  showPressed(event);

  highlight(event.code);

  const correct =
    event.code === expectedCode && event.shiftKey === expectedShift;

  const key = document.querySelector(`[data-code="${event.code}"]`);

  if (correct) {
    score += 10;

    questionCount++;

    statusEl.textContent = "✅ Benar";

    statusEl.className = "status correct";

    if (key) {
      key.classList.remove("active");

      key.classList.add("correct");

      setTimeout(() => {
        key.classList.remove("correct");
      }, 300);
    }

    updateHUD();

    if (questionCount >= QUESTION_PER_LEVEL) {
      nextLevel();
    } else {
      setTimeout(() => {
        generateQuestion();
      }, 600);
    }
  } else {
    score = Math.max(0, score - 2);

    updateHUD();

    statusEl.className = "status wrong";

    showHint();

    if (key) {
      key.classList.remove("active");

      key.classList.add("wrong");

      setTimeout(() => {
        key.classList.remove("wrong");
      }, 300);
    }
  }
}

// =====================================
// Part 3
// =====================================

// ---------- Suara ----------

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.frequency.value = freq;
  osc.type = "sine";

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.value = 0.08;

  osc.start();

  setTimeout(() => {
    osc.stop();
  }, duration);
}

function soundCorrect() {
  beep(650, 120);
}

function soundWrong() {
  beep(220, 220);
}

function soundLevel() {
  beep(500, 120);

  setTimeout(() => beep(700, 120), 120);

  setTimeout(() => beep(900, 180), 240);
}

// ---------- Main Lagi ----------

function restartGame() {
  level = 1;
  score = 0;
  questionCount = 0;

  gameOver = false;

  updateHUD();

  pressedEl.textContent = "-";
  typedEl.textContent = "-";

  generateQuestion();
}

// ---------- Tambah tombol restart ----------

const btn = document.createElement("button");

btn.textContent = "🔄 Main Lagi";

btn.style.marginTop = "20px";
btn.style.padding = "12px 25px";
btn.style.fontSize = "18px";
btn.style.display = "none";
btn.style.cursor = "pointer";

document.querySelector(".container").appendChild(btn);

btn.onclick = function () {
  btn.style.display = "none";

  restartGame();
};

// ---------- Override gameFinished ----------

const oldFinish = gameFinished;

gameFinished = function () {
  oldFinish();

  btn.style.display = "inline-block";
};

// ---------- Override nextLevel ----------

const oldNext = nextLevel;

nextLevel = function () {
  soundLevel();

  oldNext();
};

// ---------- Event Keyboard ----------

document.addEventListener("keydown", (event) => {
  if (event.repeat) return;

  if (gameOver) return;

  if (event.key === "Shift") return;

  const beforeScore = score;
  const beforeLevel = level;

  checkAnswer(event);

  if (score > beforeScore) {
    soundCorrect();
  } else {
    soundWrong();
  }

  if (level !== beforeLevel) {
    soundLevel();
  }
});
