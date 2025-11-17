const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const pairsEl = document.getElementById('pairs');
const timeEl = document.getElementById('timeLeft');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const resetBtn = document.getElementById('resetBtn');
const bestScoreEl = document.getElementById('bestScore');
const overlay = document.getElementById('countdownOverlay');

const rows = 3;
const cols = 6;
const totalPairs = 9;
const initialTime = 60;
let firstCard = null;
let secondCard = null;
let busy = false;
let moves = 0;
let matchedPairs = 0;
let timeLeft = initialTime;
let timerId = null;
let pendingTimeouts = [];
let bestScore = null;

function onLoad() {
    var temp = localStorage.getItem('previousData');
    if (temp != null) {
        bestScore = parseInt(temp);
    }
    else {
        bestScore = 0;
    }
}

function displayContent() {
    timeEl.textContent = timeLeft;
    bestScoreEl.textContent = bestScore;
}

onLoad();
displayContent();

var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');

    const inner = document.createElement('div');
    inner.classList.add('inner');

    const front = document.createElement('div');
    front.classList.add('front');

    const back = document.createElement('div');
    back.classList.add('back');
    back.textContent = value;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    return card;
}

function matchFound(card){
        
    card.classList.add('flipped');


    if(card == firstCard || card.classList.contains('matched')) return;

    if(firstCard == null){
        firstCard = card;
        return;
    }

    secondCard = card;
    moves++;
    movesEl.textContent = moves;

    console.log(firstCard);
    console.log(secondCard);

    var a = firstCard.querySelector('.back');
    console.log("the back calls for a: " + a.textContent);
    var b = secondCard.querySelector('.back');
    console.log("the back calls for b: " + b.textContent);
    
    if (a.textContent === b.textContent) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        secondCard.classList.add
        firstCard = null;
        secondCard = null;
        matchedPairs++;
        pairsEl.textContent = matchedPairs;
        if (matchedPairs == 9) {
            alert('endgame');
        }
    }
    else {
        setTimeout(function () {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            secondCard = null;
        }, 700);
    }
}

function cardMaking() {
    var arr3 = [...arr1, ...arr1];
    console.log(arr3);

    for (let i = arr3.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var a = arr3[i];
        arr3[i] = arr3[j];
        arr3[j] = a;
    }
    console.log("after suffle method : " + arr3);

    var i = 0;
    arr3.forEach((value) => {
        i++;
        const card = createCard(value);
        console.log(i);
        console.log(card);
        board.appendChild(card);

        
        card.addEventListener('click', function(){
            matchFound(card);
        });
    });
}

cardMaking();
