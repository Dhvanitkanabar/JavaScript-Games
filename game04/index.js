const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');


const uiContainer = document.querySelector('.container');



const statsWrapper = document.createElement("div");
statsWrapper.className = "stats";
statsWrapper.style.display = "flex";
statsWrapper.style.justifyContent = "center";
statsWrapper.style.gap = "20px";
statsWrapper.style.marginTop = "15px";
statsWrapper.style.flexWrap = "wrap";

const hitCounter = document.createElement("span");
hitCounter.id = "hits";
hitCounter.style.color = "#4ECDC4";
hitCounter.style.fontSize = "18px";
hitCounter.textContent = "Hits: 0";

const lastScoreBox = document.createElement("span");
lastScoreBox.id = "lastScore";
lastScoreBox.style.color = "#00eaff";
lastScoreBox.style.fontSize = "18px";
lastScoreBox.textContent = "Last Game: 0";

const fastestHitBox = document.createElement("span");
fastestHitBox.id = "fastestHit";
fastestHitBox.style.color = "#00ff95";
fastestHitBox.style.fontSize = "18px";
fastestHitBox.textContent = "Fastest: ---";

statsWrapper.appendChild(hitCounter);
statsWrapper.appendChild(lastScoreBox);
statsWrapper.appendChild(fastestHitBox);

uiContainer.appendChild(statsWrapper);

const hitMessage = document.createElement("div");
hitMessage.id = "hitMessage";
hitMessage.style.color = "yellow";
hitMessage.style.fontSize = "26px";
hitMessage.style.fontWeight = "bold";
hitMessage.style.height = "30px";
hitMessage.style.textAlign = "center";
hitMessage.style.marginTop = "5px";

uiContainer.insertBefore(hitMessage, statsWrapper);


let score = 0;
let hits = 0;
let time = 30;
let bestScore = 0;
let playGame = false;
let gameId = null;
let moleStartTime = 0;


function webLoad() {
  onLoad();
  loadSessionData();
  displayContent();
}

function onLoad() {
  const temp = localStorage.getItem('highScoreMole');
  bestScore = temp ? parseInt(temp) : 0;
}

function loadSessionData() {
  const last = sessionStorage.getItem("lastScore");
  lastScoreBox.textContent = last ? `Last Game: ${last}` : "Last Game: 0";

  const fast = sessionStorage.getItem("fastestHit");
  fastestHitBox.textContent = fast ? `Fastest: ${fast} ms` : "Fastest: ---";
}

function displayContent() {
  scoreDisplay.textContent = score;
  timeLeftDisplay.textContent = time;
  maxScoreDisplay.textContent = bestScore;
  hitCounter.textContent = `Hits: ${hits}`;

  scoreDisplay.style.color = score > 50 ? "gold" : "white";
}

webLoad();


function randomTimeGenerator(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomIndex() {
  const index = Math.floor(Math.random() * holes.length);
  return holes[index];
}


function popImageGame() {
  if (!playGame) return;

  let minTime = time < 10 ? 300 : 500;
  let maxTime = time < 10 ? 900 : 1500;

  const randomTime = randomTimeGenerator(minTime, maxTime);
  const hole = randomIndex();
  const mole = hole.querySelector('.mole');

  moleStartTime = Date.now(); 
  mole.classList.add('up');

  setTimeout(() => {
    mole.classList.remove('up');
    if (playGame) popImageGame();
  }, randomTime);
}


function endGame() {
  playGame = false;
  clearInterval(gameId);

  sessionStorage.setItem("lastScore", score);
  lastScoreBox.textContent = `Last Game: ${score}`;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('highScoreMole', bestScore);

    maxScoreDisplay.style.textShadow = "0 0 12px yellow";
    setTimeout(() => maxScoreDisplay.style.textShadow = "none", 1000);
  }

  alert(`⏰ Time’s up! Your score: ${score}`);

  startBtn.innerText = "Play Again";
  startBtn.disabled = false;

  time = 30;
  score = 0;
  hits = 0;
  displayContent();
}


function startGame() {
  score = 0;
  hits = 0;
  time = 30;

  sessionStorage.removeItem("lastScore");

  playGame = true;
  startBtn.disabled = true;
  startBtn.innerText = "Playing...";

  displayContent();
  popImageGame();

  gameId = setInterval(() => {
    time--;
    if (time <= 0) endGame();
    displayContent();
  }, 1000);
}


function bonk(event) {
  if (!playGame) return;

  const mole = event.currentTarget;

  if (mole.classList.contains('up')) {
    score++;
    hits++;

    mole.classList.remove('up');
    mole.classList.add('bonked');
    setTimeout(() => mole.classList.remove('bonked'), 200);

    hitMessage.textContent = "Whack!";
    setTimeout(() => hitMessage.textContent = "", 300);

    const timeTaken = Date.now() - moleStartTime;
    const fastest = sessionStorage.getItem("fastestHit");

    if (!fastest || timeTaken < fastest) {
      sessionStorage.setItem("fastestHit", timeTaken);
      fastestHitBox.textContent = `Fastest: ${timeTaken} ms`;
    }

    displayContent();
  }
}


startBtn.addEventListener('click', startGame);
moles.forEach(mole => mole.addEventListener('click', bonk));
