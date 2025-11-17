const colorDisplay = document.querySelector('#colorDisplay');
const messageDisplay = document.querySelector('#message');
const currentStreakDisplay = document.querySelector('#currentStreak');
const bestStreakDisplay = document.querySelector('#bestStreak');
const colorBoxes = document.querySelectorAll('.color-box');
const newRoundBtn = document.querySelector('#newRoundBtn');
const easyBtn = document.querySelector('#easyBtn');
const hardBtn = document.querySelector('#hardBtn');
const resetStreakBtn = document.querySelector('#resetStreakBtn');
const lifelineIcons = document.querySelectorAll('.lifeline'); 

var currentStreak = 0;
var bestStreak = 0;
var pickCorrectColor = 0;
var color = [];
var num = 6; 
var lifelinesRemaining = 3; 

function webLoad() {
    onLoad();
    resetLifelines(); 
    setGame();
    displayContent();
}

function onLoad() {
    var temp = localStorage.getItem('highBestStreak');
    if (temp != null) {
        bestStreak = parseInt(temp);
    } else {
        bestStreak = 0;
    }
}

function displayContent() {
    currentStreakDisplay.textContent = currentStreak;
    bestStreakDisplay.textContent = bestStreak;
}

function resetLifelines() {
    lifelinesRemaining = 3;
    lifelineIcons.forEach(icon => {
        icon.textContent = '❤️';
    });
}

function colorGenerate() {
    var a = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    var c = Math.floor(Math.random() * 256);
    return `rgb(${a}, ${b}, ${c})`;
}

function generateColors(num) {
    var arr = [];
    for (var i = 0; i < num; i++) {
        arr.push(colorGenerate());
    }
    return arr;
}

function pickGenerate() {
    const index = Math.floor(Math.random() * color.length);
    return color[index];
}

function setGame() {
    color = generateColors(num);
    pickCorrectColor = pickGenerate();
    colorDisplay.textContent = pickCorrectColor;
    colorDisplay.style.backgroundColor = 'transparent'; 
    colorDisplay.style.fontWeight = 'normal';

    for (var i = 0; i < colorBoxes.length; i++) {
        if (color[i]) {
            colorBoxes[i].style.display = 'block';
            colorBoxes[i].style.backgroundColor = color[i];
            colorBoxes[i].style.pointerEvents = "auto";
            colorBoxes[i].style.border = "none"; 
            colorBoxes[i].classList.remove('glow');
        } else {
            colorBoxes[i].style.display = 'none';
        }
    }
    messageDisplay.textContent = '';
    messageDisplay.style.color = "white";
}

function reset() {
    currentStreak = 0;
    bestStreak = 0;
    localStorage.removeItem('highBestStreak');
    messageDisplay.textContent = 'You reset your Best Streak!';
    resetLifelines(); 
    displayContent();
    setGame();
}

function newRound() {
    if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        localStorage.setItem('highBestStreak', bestStreak);

        colorDisplay.style.fontWeight = 'bold';
    }

    resetLifelines(); 
    setGame();
    messageDisplay.textContent = 'New Round Started!';
    displayContent();
}

function winGuess(event) {
    var tempBox = event.target;

    if (pickCorrectColor === tempBox.style.backgroundColor) {

        tempBox.classList.add('glow');

        messageDisplay.style.color = "white";
        messageDisplay.textContent = 'You WON!';

        currentStreak++;
        displayContent();

        if (currentStreak === 1) {
            messageDisplay.textContent = 'First Win!';
        }

        if (currentStreak >= 3) {
            messageDisplay.textContent = 'Streak!';
            messageDisplay.style.color = 'lightgreen';
        }

        colorBoxes.forEach((box) => {
            if (box.style.pointerEvents != "none") {
                box.style.backgroundColor = pickCorrectColor;
            }
            box.style.pointerEvents = "none";
        });

        colorDisplay.style.backgroundColor = pickCorrectColor;

    } else {

        lifelinesRemaining--; 
        
        if (lifelinesRemaining >= 0) {
            lifelineIcons[lifelinesRemaining].textContent = '❌';
        }

        tempBox.classList.add('shake');
        setTimeout(() => tempBox.classList.remove('shake'), 300);

        tempBox.style.backgroundColor = '#808080';
        tempBox.style.pointerEvents = "none";

        if (lifelinesRemaining > 0) {
            messageDisplay.textContent = 'Try Again!';
            messageDisplay.style.color = "white";
        } else {
            messageDisplay.textContent = 'Game Over! Streak Reset.';
            currentStreak = 0;
            displayContent();

            colorBoxes.forEach((box) => {
                box.style.pointerEvents = "none"; 
                if (box.style.backgroundColor === pickCorrectColor) {
                    box.style.border = "3px solid white";
                }
            });

            colorDisplay.style.backgroundColor = pickCorrectColor;
        }
    }
}

colorBoxes.forEach((box) => {
    box.addEventListener('click', winGuess);
});

resetStreakBtn.addEventListener('click', reset);

newRoundBtn.addEventListener('click', newRound);

easyBtn.addEventListener('click', function() {
    num = 3;
    messageDisplay.textContent = 'Easy Mode';

    easyBtn.style.backgroundColor = 'lightgreen';
    hardBtn.style.backgroundColor = '';

    resetLifelines(); 
    setGame();
});

hardBtn.addEventListener('click', function() {
    num = 6;
    messageDisplay.textContent = 'Hard Mode';

    hardBtn.style.backgroundColor = 'lightgreen';
    easyBtn.style.backgroundColor = '';

    resetLifelines(); 
    setGame();
});

let playerName = prompt("Enter your name:");
if (playerName && playerName.trim() !== "") {
    document.getElementById("playerName").textContent = `Player: ${playerName}`;
} else {
    document.getElementById("playerName").textContent = "Player: Guest";
}

webLoad();
