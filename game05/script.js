const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const timeSelect = document.querySelector('#timeSelect');

const lastTestDiv = document.querySelector("#lastTest");
const fastStartDiv = document.querySelector("#fastStart");

const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace."
];

let currentText = '';
let timeLeft = null;
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;
let wpm = 0;
let sentencesCompleted = 0;

let firstSpaceTyped = false;
let inactivityTimer = null;
let fastStartTime = null;
let fastStartSaved = false;

function webLoad() {
    onLoad();
    displayContent();
    timeSelect.value = "";

    let last = sessionStorage.getItem("lastWPM");
    if (lastTestDiv) {
        lastTestDiv.textContent = last ? "Last Test: " + last + " WPM" : "Last Test: —";
    }

    let fast = sessionStorage.getItem("fastStart");
    if (fastStartDiv) {
        fastStartDiv.textContent = fast ? `Fastest Start: ${fast} sec` : "Fastest Start: —";
    }
}

function onLoad() {
    var temp = sessionStorage.getItem('getHighWpm');
    bestWPM = temp ? parseInt(temp) : 0;
}

function displayContent() {
    timerDisplay.textContent = timeLeft !== null ? timeLeft : "Select Time";
    bestWPMDisplay.textContent = bestWPM;
}

webLoad();

typingArea.addEventListener("paste", (e) => {
    e.preventDefault();
    alert("🚫 Pasting is disabled during the typing test!");
});

timeSelect.addEventListener('change', () => {
    if (timeSelect.value) {
        timeLeft = parseInt(timeSelect.value);
        timerDisplay.textContent = timeLeft;
    } else {
        timeLeft = null;
        timerDisplay.textContent = "Select Time";
    }
});

function startGame() {
    if (!timeSelect.value) {
        alert("⏰ Please select a time first!");
        return;
    }

    timeLeft = parseInt(timeSelect.value);
    isTestActive = true;
    timerDisplay.textContent = timeLeft;
    startBtn.disabled = true;

    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    startTime = Date.now();
    textDisplay.textContent = currentText;

    typingArea.disabled = false;
    typingArea.value = "";
    typingArea.setAttribute('placeholder', 'Start typing...');
    firstSpaceTyped = false;
    fastStartSaved = false;
    fastStartTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;

    if (timeLeft <= 10) {
        timerDisplay.style.color = "red";
        timerDisplay.style.fontSize = "2.2em";
    } else {
        timerDisplay.style.color = "";
        timerDisplay.style.fontSize = "";
    }

    if (timeLeft <= 0) {
        endGame();
    } else {
        displayContent();
    }
}

function endGame() {
    clearInterval(timerInterval);
    isTestActive = false;
    startBtn.disabled = false;
    typingArea.disabled = true;

    sessionStorage.setItem("lastWPM", wpm);

    if (lastTestDiv) {
        lastTestDiv.textContent = "Last Test: " + wpm + " WPM";
    }

    if (wpm > bestWPM) {
        bestWPM = wpm;
        sessionStorage.setItem('getHighWpm', bestWPM);

        bestWPMDisplay.style.color = "red";
        bestWPMDisplay.style.fontWeight = "bold";

        alert(`🎉 New Personal Best! Your WPM: ${wpm}`);
    }

    wpm = 0;
    wpmDisplay.textContent = 0;
    typingArea.value = "";
    textDisplay.textContent = "Press Start to begin typing...";

    timerDisplay.style.color = "";
    timerDisplay.style.fontSize = "";

    timeSelect.value = "";
    timeLeft = null;
    timerDisplay.textContent = "Select Time";
    displayContent();
}

function resetGame() {
    clearInterval(timerInterval);
    isTestActive = false;

    typingArea.value = "";
    typingArea.disabled = true;
    startBtn.disabled = false;

    wpm = 0;
    sentencesCompleted = 0;
    wpmDisplay.textContent = 0;
    accuracyDisplay.textContent = "100%";
    textDisplay.textContent = "Press Start to begin typing...";

    timeSelect.value = "";
    timeLeft = null;
    timerDisplay.textContent = "Select Time";

    timerDisplay.style.color = "";
    timerDisplay.style.fontSize = "";

    displayContent();
}

function loadNewSentence() {
    startTime = Date.now();
    currentText = testTexts[Math.floor(Math.random() * testTexts.length)];
    textDisplay.textContent = currentText;
    typingArea.value = "";
    highlight();
}

function updateStatus() {
    let typed = typingArea.value;

    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        if (isTestActive) {
            textDisplay.style.color = "blue";
            textDisplay.textContent = "Keep typing!";
        }
    }, 3000);

    textDisplay.style.color = "";

    const minute = (Date.now() - startTime) / 1000 / 60;
    const words = typed.trim().split(/\s+/).filter(w => w.length > 0);
    wpm = minute > 0 ? Math.floor(words.length / minute) : 0;
    wpmDisplay.textContent = wpm;

    if (wpm > 100) {
        wpmDisplay.style.fontWeight = "bold";
    }

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === currentText[i]) correct++;
    }

    const accuracy = typed.length ? Math.floor(correct / typed.length * 100) : 0;
    accuracyDisplay.textContent = accuracy + "%";

    accuracyDisplay.style.color = accuracy === 100 ? "green" : "";

    if (!firstSpaceTyped && typed.includes(" ")) {
        firstSpaceTyped = true;
        wpmDisplay.style.fontWeight = "bold";
        setTimeout(() => (wpmDisplay.style.fontWeight = "normal"), 300);
    }

    if (!fastStartSaved && typed.length >= 5) {
        fastStartSaved = true;
        let totalTime = ((Date.now() - fastStartTime) / 1000).toFixed(2);
        sessionStorage.setItem("fastStart", totalTime);
        fastStartDiv.textContent = `Fastest Start: ${totalTime} sec`;
    }

    if (typed.trim() === currentText.trim() && timeLeft > 10) {
        sentencesCompleted++;
        loadNewSentence();
        displayContent();
    }
}

function highlight() {
    const typed = typingArea.value;
    let highText = "";

    for (let i = 0; i < currentText.length; i++) {
        if (i < typed.length) {
            highText += currentText[i] === typed[i]
                ? `<span class="correct">${currentText[i]}</span>`
                : `<span class="incorrect">${currentText[i]}</span>`;
        } else {
            highText += currentText[i];
        }
    }
    textDisplay.innerHTML = highText;
}

function typeControl() {
    if (startTime === null) startTime = Date.now();
    updateStatus();
    highlight();
}

startBtn.addEventListener('click', startGame);
typingArea.addEventListener('input', typeControl);
resetBtn.addEventListener('click', resetGame);
