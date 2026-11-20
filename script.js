const QUOTES = [
  "The quick brown fox jumps over the lazy dog while mastering clean JavaScript fundamentals.",
  "Success in software engineering comes from breaking complex problems into small, testable functions.",
  "Consistent daily practice builds muscle memory, allowing your fingers to keep pace with your thoughts.",
  "Pure web technologies provide fast, reliable performance without relying on heavy external libraries.",
  "Debugging is twice as hard as writing the code in the first place, so keep your logic simple and clear."
];

const MAX_TIME = 60;
let timeLeft = MAX_TIME;
let timer = null;
let isTyping = false;

const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const timeDisplay = document.getElementById("time-display");
const mistakesDisplay = document.getElementById("mistakes-display");
const wpmDisplay = document.getElementById("wpm-display");
const accuracyDisplay = document.getElementById("accuracy-display");
const restartBtn = document.getElementById("restart-btn");
const resultsModal = document.getElementById("results-modal");
const modalRestartBtn = document.getElementById("modal-restart-btn");
const finalWpm = document.getElementById("final-wpm");
const finalAcc = document.getElementById("final-acc");
const finalMistakes = document.getElementById("final-mistakes");

function initGame() {
  clearInterval(timer);
  timer = null;
  timeLeft = MAX_TIME;
  isTyping = false;

  quoteInput.value = "";
  quoteInput.disabled = false;
  resultsModal.classList.add("hidden");

  timeDisplay.textContent = `${MAX_TIME}s`;
  mistakesDisplay.textContent = "0";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";

  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  quoteDisplay.innerHTML = "";

  randomQuote.split("").forEach((char, index) => {
    const span = document.createElement("span");
    span.innerText = char;
    if (index === 0) span.classList.add("active");
    quoteDisplay.appendChild(span);
  });

  quoteInput.focus();
}

function updateMetrics(totalTyped, mistakes) {
  mistakesDisplay.textContent = mistakes;

  const timeElapsedInMinutes = (MAX_TIME - timeLeft) / 60;
  let netWpm = 0;
  if (timeElapsedInMinutes > 0) {
    netWpm = Math.round(((totalTyped - mistakes) / 5) / timeElapsedInMinutes);
  }
  if (netWpm < 0 || Number.isNaN(netWpm)) netWpm = 0;
  wpmDisplay.textContent = netWpm;

  let accuracy = 100;
  if (totalTyped > 0) {
    const correctChars = totalTyped - mistakes;
    accuracy = Math.max(0, Math.round((correctChars / totalTyped) * 100));
  }
  accuracyDisplay.textContent = `${accuracy}%`;

  return { netWpm, accuracy, mistakes };
}

function finishGame() {
  clearInterval(timer);
  timer = null;
  quoteInput.disabled = true;

  const spans = quoteDisplay.querySelectorAll("span");
  const userTyped = quoteInput.value;
  let mistakes = 0;

  spans.forEach((span, index) => {
    const char = userTyped[index];
    if (char && char !== span.innerText) mistakes++;
  });

  const stats = updateMetrics(userTyped.length, mistakes);
  finalWpm.textContent = stats.netWpm;
  finalAcc.textContent = `${stats.accuracy}%`;
  finalMistakes.textContent = stats.mistakes;
  resultsModal.classList.remove("hidden");
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = `${timeLeft}s`;

    const spans = quoteDisplay.querySelectorAll("span");
    const userTyped = quoteInput.value;
    let mistakes = 0;
    spans.forEach((span, index) => {
      const char = userTyped[index];
      if (char && char !== span.innerText) mistakes++;
    });
    updateMetrics(userTyped.length, mistakes);
  } else {
    finishGame();
  }
}

quoteInput.addEventListener("input", () => {
  const spans = quoteDisplay.querySelectorAll("span");
  const userTyped = quoteInput.value;

  if (!isTyping && userTyped.length > 0) {
    isTyping = true;
    timer = setInterval(updateTimer, 1000);
  }

  let mistakes = 0;

  spans.forEach((span, index) => {
    const char = userTyped[index];
    span.classList.remove("correct", "incorrect", "active");

    if (char == null) {
      if (index === userTyped.length) {
        span.classList.add("active");
      }
    } else if (char === span.innerText) {
      span.classList.add("correct");
    } else {
      span.classList.add("incorrect");
      mistakes++;
    }
  });

  updateMetrics(userTyped.length, mistakes);

  if (userTyped.length >= spans.length) {
    finishGame();
  }
});

restartBtn.addEventListener("click", initGame);
modalRestartBtn.addEventListener("click", initGame);

initGame();