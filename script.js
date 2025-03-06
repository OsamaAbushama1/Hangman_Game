const categories = {
  fruits: {
    APPLE: "A common red or green fruit",
    BANANA: "A long yellow fruit",
    ORANGE: "A citrus fruit",
    MANGO: "A tropical fruit",
    GRAPE: "Small round fruit",
    PINEAPPLE: "A spiky tropical fruit",
    STRAWBERRY: "A small red berry",
    WATERMELON: "A large green fruit with red inside",
    CHERRY: "A small red stone fruit",
    PEACH: "A fuzzy stone fruit",
    KIWI: "A small brown fruit with green inside",
    LEMON: "A sour yellow citrus fruit",
  },
  countries: {
    EGYPT: "A country in North Africa",
    BRAZIL: "A South American country",
    JAPAN: "An island nation in Asia",
    CANADA: "A country in North America",
    FRANCE: "A European country",
    GERMANY: "A country in Central Europe",
    AUSTRALIA: "A country and continent",
    INDIA: "A country in South Asia",
    ITALY: "A European country known for its history",
    CHINA: "A large country in East Asia",
    RUSSIA: "The largest country by land area",
  },
  animals: {
    ELEPHANT: "A large mammal with a trunk",
    TIGER: "A striped big cat",
    DOLPHIN: "An intelligent sea mammal",
    EAGLE: "A bird of prey",
    PANDA: "A black and white bear",
    KANGAROO: "A jumping marsupial from Australia",
    GIRAFFE: "A tall animal with a long neck",
    ZEBRA: "A striped horse-like animal",
    LION: "The king of the jungle",
    WOLF: "A wild canine animal",
    BEAR: "A large, powerful mammal",
  },
  jobs: {
    DOCTOR: "A person who treats the sick",
    ENGINEER: "A person who designs and builds things",
    TEACHER: "A person who educates students",
    POLICE: "A person who enforces the law",
    FARMER: "A person who grows crops and raises animals",
    PILOT: "A person who flies airplanes",
    CHEF: "A person who cooks food",
    ARTIST: "A person who creates art",
    MUSICIAN: "A person who plays musical instruments",
    SCIENTIST: "A person who researches and discovers new things",
  },
  capitals: {
    CAIRO: "The capital of Egypt",
    PARIS: "The capital of France",
    TOKYO: "The capital of Japan",
    BERLIN: "The capital of Germany",
    ROME: "The capital of Italy",
    MADRID: "The capital of Spain",
    LONDON: "The capital of the United Kingdom",
    OTTAWA: "The capital of Canada",
    MOSCOW: "The capital of Russia",
    BEIJING: "The capital of China",
  },
  sports: {
    FOOTBALL: "A popular sport played with a round ball",
    BASKETBALL: "A sport where players shoot hoops",
    TENNIS: "A sport played with a racket and ball",
    SWIMMING: "A sport in which people move through water",
    CYCLING: "A sport involving riding bicycles",
    BOXING: "A combat sport using gloves",
    GOLF: "A sport where players hit a ball into a hole",
    VOLLEYBALL: "A sport where teams hit a ball over a net",
    CRICKET: "A bat-and-ball game played worldwide",
    BASEBALL: "A bat-and-ball game popular in America",
  },
  vehicles: {
    CAR: "A common road vehicle",
    MOTORCYCLE: "A two-wheeled vehicle",
    AIRPLANE: "A flying vehicle",
    TRAIN: "A rail-based mode of transportation",
    SHIP: "A large watercraft",
    BUS: "A vehicle used for public transportation",
    BICYCLE: "A human-powered two-wheeler",
    TRUCK: "A large vehicle for transporting goods",
    SUBWAY: "An underground train system",
    HELICOPTER: "A rotor-based flying vehicle",
  },
};

const hangmanParts = [
  "rope",
  "head",
  "body",
  "left-arm",
  "right-arm",
  "left-leg",
  "right-leg",
];

let currentWord;
let guessedLetters;
let remainingGuesses;
let hintAttempts;

function getCategoryFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("category") || "fruits";
}

function startGame() {
  const category = getCategoryFromURL();
  const wordsAndHints = categories[category];
  const words = Object.keys(wordsAndHints);
  currentWord = words[Math.floor(Math.random() * words.length)];
  guessedLetters = new Set();
  remainingGuesses = 7;
  hintAttempts = 3;
  hangmanParts.forEach((part) => {
    document.getElementById(part).style.display = "none";
  });
  updateDisplay();
  createKeyboard();
  const message = document.getElementById("message");
  message.textContent = "Guess the word!";
  message.className = "";
  document.getElementById(
    "hint-description"
  ).textContent = `Description: ${wordsAndHints[currentWord]}`;
  document.getElementById(
    "hint-btn"
  ).textContent = `Get Hint (${hintAttempts} attempts left)`;
  document.getElementById("hint-btn").disabled = false;
  document.querySelector("h1").textContent = `Hangman - ${
    category.charAt(0).toUpperCase() + category.slice(1)
  }`;
}

function updateDisplay() {
  const wordDisplay = document.getElementById("word-display");
  wordDisplay.textContent = currentWord
    .split("")
    .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
    .join(" ");

  const wrongGuesses = 7 - remainingGuesses;
  for (let i = 0; i < wrongGuesses && i < hangmanParts.length; i++) {
    document.getElementById(hangmanParts[i]).style.display = "block";
  }
}

function createKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    const button = document.createElement("button");
    button.textContent = letter;
    button.className = "letter-btn";
    button.onclick = () => guessLetter(letter);
    keyboard.appendChild(button);
  }
}

function guessLetter(letter) {
  if (guessedLetters.has(letter)) return;

  guessedLetters.add(letter);
  const button = Array.from(document.getElementsByClassName("letter-btn")).find(
    (btn) => btn.textContent === letter
  );
  if (button) button.disabled = true;

  if (!currentWord.includes(letter)) {
    remainingGuesses--;
  }

  updateDisplay();
  checkGameStatus();
}

function getHint() {
  if (hintAttempts <= 0) return;

  const unguessedLetters = currentWord
    .split("")
    .filter((letter) => !guessedLetters.has(letter));
  if (unguessedLetters.length > 0) {
    const randomLetter =
      unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
    guessedLetters.add(randomLetter);

    const button = Array.from(
      document.getElementsByClassName("letter-btn")
    ).find((btn) => btn.textContent === randomLetter);
    if (button) button.disabled = true;

    hintAttempts--;
    document.getElementById(
      "hint-btn"
    ).textContent = `Get Hint (${hintAttempts} attempts left)`;
    if (hintAttempts === 0) {
      document.getElementById("hint-btn").disabled = true;
    }
    updateDisplay();
    checkGameStatus();
  }
}

function checkGameStatus() {
  const currentState = document
    .getElementById("word-display")
    .textContent.replace(/\s/g, "");
  const message = document.getElementById("message");

  if (remainingGuesses === 0) {
    message.textContent = `Hanged! The word was: ${currentWord}`;
    message.className = "lose-message";
    disableAllButtons();
  } else if (currentState === currentWord) {
    message.textContent = "You saved the prisoner! Well done!";
    message.className = "win-message";
    disableAllButtons();
  }
}

function disableAllButtons() {
  const buttons = document.getElementsByClassName("letter-btn");
  for (let button of buttons) {
    button.disabled = true;
  }
  document.getElementById("hint-btn").disabled = true;
}

window.onload = startGame;
