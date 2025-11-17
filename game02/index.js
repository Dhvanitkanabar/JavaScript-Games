const currentScore = document.querySelector('#currentScore');
const highScore = document.querySelector('#highScore');
const timer = document.querySelector('#timer');
const clickButton = document.querySelector('#clickButton');
const startButton = document.querySelector('#startButton');
const resetButton = document.querySelector('#resetButton');
const statusMessage = document.querySelector('#statusMessage');
const stopButton = document.querySelector('#stopButton');
const resumeButton = document.querySelector('#resumeButton');


var current = 0;
var high = 0;
var time = 10;
var timeId = null;
var flag = false;      
var paused = false;
var playerName = "";
var baseScale = 1;    


function onWebsite() {
    loadData();
    defaultUI();
    displayContent();
    askPlayerName();
}

function loadData() {
    var temp = localStorage.getItem('highScore');
    high = temp !== null ? parseInt(temp, 10) || 0 : 0;

    var storedName = localStorage.getItem('playerName');
    if (storedName) {
        playerName = storedName;
    }
}

function defaultUI() {
    clickButton.disabled = true;          
    resumeButton.style.display = "none";  
    startButton.disabled = false;
    startButton.textContent = "Start New Game";
    currentScore.style.color = 'black';
}

function askPlayerName() {
    if (!playerName) {
        playerName = prompt("Welcome! Please enter your name:");
        if (!playerName || playerName.trim() === "") {
            playerName = "Player";
        }
        localStorage.setItem('playerName', playerName);
    }
}

function displayContent() {
    currentScore.textContent = current;
    highScore.textContent = high;
    timer.textContent = time;

    if (current > 20) currentScore.style.color = 'red';
    else currentScore.style.color = 'black';
}

function statusMsg(msg) {
    statusMessage.textContent = msg;
}

function stopGame() {
    if (flag && timeId !== null) {
        clearInterval(timeId);
        timeId = null;
        flag = false;
        paused = true;
        startButton.disabled = false;
        clickButton.disabled = true;
        resumeButton.style.display = "inline-block";
        statusMsg("⏸ Game paused. Click 'Resume' to continue!");
    }
}

function resumeGame() {
    if (!paused) {
        statusMsg("⚠ Game is not paused. Start or pause it first!");
        return;
    }
    flag = true;
    paused = false;
    clickButton.disabled = false;
    resumeButton.style.display = "none";
    statusMsg("▶ Game resumed! Keep clicking!");
    timeId = setInterval(function () {
        time--;
        if (time <= 0) {
            endGame();
        }
        displayContent();
    }, 1000);
}

function endGame() {
    clearInterval(timeId);
    timeId = null;
    flag = false;
    clickButton.disabled = true;
    startButton.disabled = false;

    startButton.textContent = "Play Again";

    const cps = (current / 10).toFixed(2);

    if (current > high) {
        high = current;
        localStorage.setItem('highScore', high);
        highScore.textContent = high;

        document.body.style.background = 'gold';
        setTimeout(() => {
            document.body.style.background = '';
        }, 1000);

        statusMsg(`🎉 Congratulations ${playerName}! New high score: ${high}. CPS: ${cps}`);
    } else {
        statusMsg(`You clicked ${current} times (${cps} per sec). Better luck next time 😊`);
    }

    current = 0;
    baseScale = 1;
    clickButton.style.transform = 'scale(1)';
    displayContent();
}

function startGame() {
    clickButton.disabled = false;
    flag = true;
    time = 10;
    paused = false;
    startButton.disabled = true;
    startButton.textContent = "Game in progress...";

    statusMessage.textContent = "👉 Click Me!";
    setTimeout(() => {
        statusMsg(`🎯 ${playerName}, hurry up! The game has started 🎉`);
    }, 1000);

    displayContent();
    timeId = setInterval(function () {
        time--;
        if (time <= 0) {
            endGame();
        }
        displayContent();
    }, 1000);
}

function userClick() {
    if (!flag) return;
    current++;

    baseScale = baseScale * 1.1;
    if (baseScale > 2) baseScale = 2;
    clickButton.style.transform = `scale(${baseScale})`;

    displayContent();
}

function resetHighScore() {
    clearInterval(timeId);
    timeId = null;
    flag = false;
    paused = false;
    localStorage.removeItem('highScore');
    high = 0;
    current = 0;
    time = 10;
    clickButton.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Start New Game";
    resumeButton.style.display = "none";
    displayContent();
    statusMsg("High Score has been reset to 0 🔄 Ready for a new game");
}

startButton.addEventListener('click', startGame);
clickButton.addEventListener('click', userClick);
resetButton.addEventListener('click', resetHighScore);
stopButton.addEventListener('click', stopGame);
resumeButton.addEventListener('click', resumeGame);

onWebsite();
