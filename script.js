const words = ["apple", "banana", "cherry", "dragonfruit", "elderberry", "fig", "grape", "kiwi"];
let currentWords = [...words];  // Holds remaining words for the current level
let score = 0;
let speedFactor = 1;
let level = 1;

const gameArea = document.getElementById("game-area");
const scoreboard = document.getElementById("scoreboard");
const typingInput = document.getElementById("typing-input");

function getRandomWord() {
  if (currentWords.length === 0) return null;  // No more words left for this level
  const randomIndex = Math.floor(Math.random() * currentWords.length);
  return currentWords[randomIndex];
}

function createFallingWord() {
  const wordText = getRandomWord();
  if (!wordText) return;  // No words left to drop

  const wordElement = document.createElement("div");
  wordElement.classList.add("falling-word");
  wordElement.textContent = wordText;
  wordElement.style.left = `${Math.random() * (gameArea.offsetWidth - 100)}px`;
  wordElement.style.top = "0px";

  let fallInterval = setInterval(() => {
    wordElement.style.top = `${parseFloat(wordElement.style.top) + (1 * speedFactor)}px`;
    if (parseFloat(wordElement.style.top) > gameArea.offsetHeight) {
      gameArea.removeChild(wordElement);
      clearInterval(fallInterval);
    }
  }, 10);

  gameArea.appendChild(wordElement);
}

function checkTyping(event) {
  const typedText = typingInput.value;
  const fallingWords = document.querySelectorAll(".falling-word");

  if (event.key === "Enter") {
    typingInput.value = "";  // Clear the input on Enter
  }

  fallingWords.forEach(wordElement => {
    const wordText = wordElement.textContent;

    if (typedText === wordText) {
      wordElement.classList.add("explosion");
      setTimeout(() => gameArea.removeChild(wordElement), 500);

      // Remove the word from the current level's list to prevent it from appearing again
      currentWords = currentWords.filter(word => word !== wordText);

      // Increase score based on word length
      score += wordText.length;
      speedFactor += 0.1;

      scoreboard.textContent = `Score: ${score} | Level: ${level}`;
      typingInput.value = "";  // Clear the input when word is matched

      // Check if all words in the level are completed
      if (currentWords.length === 0) {
        advanceLevel();
      }
    } else {
      highlightCorrectLetters(wordElement, typedText);
    }
  });
}

function advanceLevel() {
  if (level < 5) {
    level += 1;
    speedFactor += 0.5;  // Increase the speed slightly each level
    currentWords = [...words];  // Reset current words for the new level
    scoreboard.textContent = `Score: ${score} | Level: ${level}`;
    alert(`Level ${level} starts now!`);
  } else {
    alert(`Congratulations! You've completed all levels!`);
    resetGame();
  }
}

function highlightCorrectLetters(wordElement, typedText) {
  const wordText = wordElement.textContent;
  const newContent = [...wordText].map((char, index) =>
    index < typedText.length && char === typedText[index] ? `<span class="bold-red">${char}</span>` : char
  ).join("");

  wordElement.innerHTML = newContent;
}

function resetGame() {
  level = 1;
  score = 0;
  speedFactor = 1;
  currentWords = [...words];
  scoreboard.textContent = `Score: ${score} | Level: ${level}`;
}

typingInput.addEventListener("keydown", checkTyping);

setInterval(() => createFallingWord(), 2000);
