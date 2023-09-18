const sentence = document.querySelector(".sentence");
const mode = document.querySelector(".mode");
const lightMode = document.querySelector(".sun-icon");
const darkMode = document.querySelector(".moon-icon");
const btnNext = document.querySelector(".btn--next");
const btnRestart = document.querySelector(".btn--restart");
const punctuation = document.querySelector(".text--punctuation");
const numbers = document.querySelector(".text--numbers");
const programming = document.querySelector(".text--programming");
const time15 = document.querySelector(".time--15");
const time30 = document.querySelector(".time--30");
const time60 = document.querySelector(".time--60");
const timer = document.getElementById("timer");
const words = document.querySelector(".words");
const allWords = document.querySelectorAll(".words");
const wordsbox = document.querySelector(".wordsbox");
const timeconfig = document.querySelectorAll(".time");
const typingTab = document.querySelector(".typing-tab");
const resultTab = document.querySelector(".result-tab");
const resultWPM = document.querySelector(".wpm--result");
const resultAccuracy = document.querySelector(".accuracy--result");
const resultTime = document.querySelector(".time--result");
const resultRightWords = document.querySelector(".rightWords--result");
const resultWrongWords = document.querySelector(".wrongWords--result");
const cursor = document.getElementById("cursor");
const inputKeyboard = document.getElementById("text-input");
const body = document.documentElement;

let extraLetter = 0;
let restart = false;
let currentWords = [];
let time = localStorage.getItem("time") * 1000 || 15 * 1000;
let wrongLetters = 0;
let lettersTyped = 0;
let wordsTyped = 0;
let wrongWords = 0;
let activatedMode = JSON.parse(localStorage.getItem("mode")) || [];
let theme;

window.timer = null;
window.gameStart = null;

//This is where the game started
function startGame() {
  if (!body.classList.contains("dark-mode")) {
    lightMode.classList.add("hidden");
  } else {
    darkMode.classList.add("hidden");
  }

  //reset the data
  reset();

  // displaying same set of words
  if (restart)
    currentWords.forEach((word) => (words.innerHTML += formatWord(word)));
  else addWords();

  //showing and hiding tab
  if (!resultTab.classList.contains("hidden")) {
    addClass(resultTab, "hidden");
    removeClass(resultTab, "blur");
  }
  if (typingTab.classList.contains("hide-opacity"))
    removeClass(typingTab, "hide-opacity");
  addClass(document.querySelector(".word"), "current");
  addClass(document.querySelector(".letter"), "current");

  //set the cursor position
  cursor.style.top = 2.8 + "rem";
  cursor.style.left = 3 + "px";

  if (!timer.classList.contains("hide-opacity"))
    addClass(timer, "hide-opacity");
}

function gameOver() {
  clearInterval(window.timer);
  getResult();

  if (resultTab.classList.contains("hidden")) {
    removeClass(resultTab, "hidden");
    addClass(resultTab, "blur");
  }
  if (!typingTab.classList.contains("hide-opacity"))
    addClass(typingTab, "hide-opacity");

  reset();
}

function formatWord(word) {
  return `<div class="word"><span class="letter">${word
    .split("")
    .join('</span><span class="letter">')}</span></div>`;
}

function getResult() {
  const AVERAGE_WORD_LENGTH = 4.8;
  const wpm = parseInt(
    parseInt(lettersTyped / AVERAGE_WORD_LENGTH) / (time / 1000 / 60)
  ); // formula for getting the words per minute
  const accuracy = parseInt(
    ((lettersTyped - wrongLetters) / lettersTyped) * 100
  ); //formula for getting the accuracy
  resultWPM.textContent = parseInt(wpm * (accuracy / 100));
  resultAccuracy.textContent = accuracy + "%";
  resultTime.textContent = `${time / 1000}s`;
  resultRightWords.textContent = wordsTyped - wrongWords;
  resultWrongWords.textContent = wrongWords;
}

function reset() {
  clearInterval(window.timer);
  wrongLetters = 0;
  lettersTyped = 0;
  wordsTyped = 0;
  wrongWords = 0;
  extraLetter = 0;
  window.timer = null;
  window.gameStart = null;
  words.innerHTML = "";
}

function addClass(el, name) {
  el.className += " " + name;
}

function removeClass(el, name) {
  el.className = el.className.replace(name, "");
}

function activateTime(el) {
  for (let i = 0; i < timeconfig.length; i++) {
    let element = timeconfig[i];
    if (element.classList.contains("active")) removeClass(element, "active");
  }
  el.classList.add("active");
}

//randomly select words from the array (numbers are not in the array)
function generateWords() {
  let words = "";
  let num = Math.floor(Math.random() * 3) + 1;

  if (punctuation.classList.contains("active") && num === 1) {
    words += wordsPunctuation[Math.floor(Math.random() * 200) + 1];
  }
  if (numbers.classList.contains("active") && num === 2) {
    words += (Math.floor(Math.random() * 2100) + 1).toString();
  }
  if (programming.classList.contains("active") && num === 3) {
    words += wordsProgramming[Math.floor(Math.random() * 145) + 1];
  } else if (words === "") {
    words += wordsNormal[Math.floor(Math.random() * 200) + 1];
  }
  if (currentWords.length <= 150) currentWords.push(words);
  return words;
}

function addWords() {
  for (let i = 0; i < 50; i++) {
    words.innerHTML += formatWord(generateWords());
  }
}

function clearCurrentWords() {
  restart = false;
  currentWords = [];
}

function setLocalStorageMode() {
  localStorage.setItem("mode", JSON.stringify(activatedMode));
}
function setLocalStorageTime(seconds) {
  localStorage.setItem("time", JSON.stringify(seconds));
}
function setLocalStorageTheme(theme) {
  localStorage.setItem("theme", JSON.stringify(theme));
}

function getLocalStorage() {
  const activeModes = JSON.parse(localStorage.getItem("mode"));
  if (!activeModes) return;
  const elementsWithMode = document.querySelectorAll("[data-mode]");
  elementsWithMode.forEach((element) => {
    const mode = element.getAttribute("data-mode");
    if (activeModes.includes(mode)) addClass(element, "active");
  });

  const activeTheme = localStorage.getItem("theme");
  if (JSON.parse(activeTheme) === "dark") addClass(body, "dark-mode");

  if (!localStorage.getItem("time")) return;
  const activeTime = localStorage.getItem("time");
  timeconfig.forEach((element) => {
    const time = element.getAttribute("data-time");
    if (activeTime === time) {
      if (!element.classList.contains("active")) addClass(element, "active");
    } else removeClass(element, "active");
  });
}

function setupToggleClickEvent(element) {
  element.addEventListener("click", function () {
    element.classList.toggle("active");
    if (element.classList.contains("active")) {
      if (activatedMode.includes(element.getAttribute("data-mode"))) return;
      activatedMode.push(element.getAttribute("data-mode"));
    } else {
      const newArray = activatedMode.filter(
        (item) => item !== element.getAttribute("data-mode")
      );
      activatedMode = newArray;
    }
    setLocalStorageMode();
    clearCurrentWords();
    startGame();
  });
}

setupToggleClickEvent(punctuation);
setupToggleClickEvent(numbers);
setupToggleClickEvent(programming);

function setupTimeButton(buttonElement, timeInSeconds) {
  buttonElement.addEventListener("click", function () {
    activateTime(buttonElement);
    timer.textContent = timeInSeconds;
    time = timeInSeconds * 1000;
    setLocalStorageTime(timeInSeconds);
    clearCurrentWords();
    startGame();
  });
}

setupTimeButton(time15, 15);
setupTimeButton(time30, 30);
setupTimeButton(time60, 60);

btnNext.addEventListener("click", function () {
  currentWords.length = 0;
  clearCurrentWords();
  startGame();
});

btnRestart.addEventListener("click", function () {
  restart = true;
  startGame();
});

function moveCursor() {
  // move cursor
  const nextLetter = document.querySelector(".letter.current");
  const nextWord = document.querySelector(".word.current");
  const size = nextLetter ? 332 : 328;

  cursor.style.top =
    (nextLetter || nextWord).getBoundingClientRect().top - size + "px";
  cursor.style.left =
    (nextLetter || nextWord).getBoundingClientRect()[
      nextLetter ? "left" : "right"
    ] -
    150 +
    "px";
}

//event everytime the user click key
window.addEventListener("keydown", (ev) => {
  let key = ev.key;
  const currentWord = document.querySelector(".word.current");
  const currentLetter = document.querySelector(".letter.current");
  const expected = currentLetter?.innerHTML || " ";
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";
  const isFirstLetter = currentLetter === currentWord.firstChild;
  const isFirstWord = currentWord.previousSibling ? true : false;

  //fix some special characters issue
  if (key === "<") key = "&lt;";
  if (key === ">") key = "&gt;";
  if (key === "&") key = "&amp;";

  if (!window.timer && isLetter) {
    window.timer = function () {
      if (!window.gameStart) {
        window.gameStart = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round(time / 1000 - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      timer.textContent = sLeft + "";
      if (timer.classList.contains("hide-opacity")) {
        removeClass(timer, "hide-opacity");
      }
    };
    window.timer(); // para di delay start ng timer

    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const msPassed = currentTime - window.gameStart;
      const sPassed = Math.round(msPassed / 1000);
      const sLeft = Math.round(time / 1000 - sPassed);
      if (sLeft <= 0) {
        gameOver();
        return;
      }
      timer.textContent = sLeft + "";
      if (timer.classList.contains("hide-opacity")) {
        removeClass(timer, "hide-opacity");
      }
    }, 1000);
  }

  if (isLetter) {
    if (currentLetter) {
      if (key === expected) addClass(currentLetter, "correct");
      else {
        addClass(currentLetter, "incorrect");
        wrongLetters++;
      }

      removeClass(currentLetter, "current");
      if (currentLetter.nextSibling) {
        addClass(currentLetter.nextSibling, "current");
      }
      lettersTyped++;
    } else {
      const incorrectLetter = document.createElement("span");
      incorrectLetter.innerHTML = key;
      incorrectLetter.className = "letter incorrect extra";
      if (extraLetter <= 5) {
        currentWord.appendChild(incorrectLetter);
        extraLetter++;
      }
    }
  }

  if (isSpace) {
    if (currentLetter) return;
    if (expected !== " ") {
      const lettersToInvalidate = [
        ...document.querySelectorAll(".word.current .letter:not(.correct)"),
      ];
      lettersToInvalidate.forEach((letter) => {
        addClass(letter, "incorrect");
      });
    }
    removeClass(currentWord, "current");
    addClass(currentWord.nextSibling, "current");
    if (currentLetter) {
      removeClass(currentLetter, "current");
    }
    addClass(currentWord.nextSibling.firstChild, "current");

    const children = currentWord.children;
    for (let i = 0; i < children.length; i++) {
      if (
        currentWord.children[i].classList.contains("incorrect") &&
        !currentWord.classList.contains("error")
      ) {
        addClass(currentWord, "error");
        wrongWords++;
        break;
      }
    }

    wordsTyped++;

    // move line / delete words
    if (
      currentWord.getBoundingClientRect().top > window.innerHeight - 450 &&
      currentWord.getBoundingClientRect().left > window.innerWidth - 380
    ) {
      if (
        currentWord.nextElementSibling.getBoundingClientRect().top ===
        currentWord.getBoundingClientRect().top
      )
        return;
      var elements = words.children;
      // Remove all the previous elements
      while (currentWord.getBoundingClientRect().top > 430) {
        var elementToRemove = elements[0]; // Always remove the first element since it shifts after each removal
        words.removeChild(elementToRemove);
      }
      if (allWords.length <= 20) {
        addWords();
      }
    }
    extraLetter = 0;
  }

  if (isBackspace) {
    if (currentLetter && isFirstLetter) {
      if (!currentWord.previousElementSibling) return;
      // make prev word current, last letter current
      if (
        !isFirstWord ||
        currentWord.classList.contains("error") ||
        currentWord.previousElementSibling.classList.contains("error")
      ) {
        removeClass(currentWord, "current");
        addClass(currentWord.previousSibling, "current");
        removeClass(currentLetter, "current");
        addClass(currentWord.previousSibling.lastChild, "current");
        removeClass(currentWord.previousSibling.lastChild, "incorrect");
        removeClass(currentWord.previousSibling.lastChild, "correct");
        wordsTyped--;
        wrongWords--;
      }
      removeClass(currentWord.previousSibling, "error");
    }
    if (currentLetter && !isFirstLetter) {
      // move back one letter, invalidate letter
      removeClass(currentLetter, "current");
      addClass(currentLetter.previousSibling, "current");
      removeClass(currentLetter.previousSibling, "incorrect");
      removeClass(currentLetter.previousSibling, "correct");
    }
    if (!currentLetter) {
      addClass(currentWord.lastChild, "current");
      removeClass(currentWord.lastChild, "incorrect");
      removeClass(currentWord.lastChild, "correct");
      lettersTyped--;
    }
    if (currentWord.lastElementChild.classList.contains("extra")) {
      currentWord.lastElementChild.remove();
      extraLetter--;
      lettersTyped--;
      wrongLetters++;
    }
    if (
      currentWord.previousSibling?.lastElementChild.classList.contains(
        "extra"
      ) &&
      isFirstLetter
    ) {
      currentWord.previousSibling.lastElementChild.remove();
      lettersTyped--;
      wrongLetters++;
    }
  }

  moveCursor();
});

window.addEventListener("resize", function () {
  moveCursor();
});

window.addEventListener("click", function () {
  body.focus();
});

mode.addEventListener("click", function () {
  body.classList.toggle("dark-mode");
  lightMode.classList.toggle("hidden");
  darkMode.classList.toggle("hidden");
  if (body.classList.contains("dark-mode")) {
    setLocalStorageTheme("dark");
  } else setLocalStorageTheme("light");
});

body.addEventListener("click", function () {
  inputKeyboard.focus();
});

getLocalStorage();
startGame();
