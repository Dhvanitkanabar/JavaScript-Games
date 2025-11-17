const boxes = document.querySelectorAll(".box");
let player = true; // true = O, false = X

const Winner = [
[ 1,  2,  3,  4,  5,  6,  7,  8,  9 ],
[10, 11, 12, 13, 14, 15, 16, 17, 18 ],
[19, 20, 21, 22, 23, 24, 25, 26, 27 ],
[28, 29, 30, 31, 32, 33, 34, 35, 36 ],
[37, 38, 39, 40, 41, 42, 43, 44, 45 ],
[46, 47, 48, 49, 50, 51, 52, 53, 54 ],
[55, 56, 57, 58, 59, 60, 61, 62, 63 ],
[64, 65, 66, 67, 68, 69, 70, 71, 72 ],
[73, 74, 75, 76, 77, 78, 79, 80, 81 ],
[ 1, 10, 19, 28, 37, 46, 55, 64, 73 ],
[ 2, 11, 20, 29, 38, 47, 56, 65, 74 ],
[ 3, 12, 21, 30, 39, 48, 57, 66, 75 ],
[ 4, 13, 22, 31, 40, 49, 58, 67, 76 ],
[ 5, 14, 23, 32, 41, 50, 59, 68, 77 ],
[ 6, 15, 24, 33, 42, 51, 60, 69, 78 ],
[ 7, 16, 25, 34, 43, 52, 61, 70, 79 ],
[ 8, 17, 26, 35, 44, 53, 62, 71, 80 ],
[ 9, 18, 27, 36, 45, 54, 63, 72, 81 ],
[ 1, 11, 21, 31, 41, 51, 61, 71, 81 ],
[ 9, 17, 25, 33, 41, 49, 57, 65, 73 ],


];

function checkWinner() {
    for (let data of Winner) {
        const btn1 = boxes[data[0]].innerHTML;
        const btn2 = boxes[data[1]].innerHTML;
        const btn3 = boxes[data[2]].innerHTML;
        const btn4 = boxes[data[3]].innerHTML;
        const btn5 = boxes[data[4]].innerHTML;
        const btn6 = boxes[data[5]].innerHTML;
        const btn7 = boxes[data[6]].innerHTML;
        const btn8 = boxes[data[7]].innerHTML;
        const btn9 = boxes[data[8]].innerHTML;

        if (btn1 !== "" && btn1 === btn2 && btn1 === btn3&& btn1===btn4&&btn1===btn5&&btn1===btn6&&btn1===btn7&&btn1===btn8&&btn1===btn9) {
            console.log("Winner is " + btn1);

         
            boxes.forEach(box => box.disabled = true);

           
            const ansBox = document.querySelector(".ans");
            if (ansBox) ansBox.innerHTML = "Winner: " + btn1;
        }
    }
}

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (player) {
            box.innerHTML = "O";
            player = false;
        } else {
            box.innerHTML = "X";
            player = true;
        }
        box.disabled = true;

        checkWinner();
    });
});