// var player1 = prompt("enter your name :-");
// console.log(player1);
// var player2 = prompt("enter you name :-");
// console.log(player2);


const boxes = document.querySelectorAll(".box");
console.log(boxes);
var turn = true;


 
 const WinnerPattern = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6]
];
function checkWinner() {
    for (var row of WinnerPattern) {
        var b1=boxes[row[0]].innerHTML;
        var b2=boxes[row[1]].innerHTML;
        var b3 = boxes[row[2]].innerHTML;
        
        if (b1 != "" && b2 != "" && b3 != "") {
        if (b1 === b2 && b2 === b3) {
            if (b1 === "o") {
                console.log("the winner is "+player1);
                

            }
            else {
                console.log("the winner is "+player2);
                
            }
             boxes.forEach(box => {
                    box.disabled = true;
                });
        }
    }
 }
    
}
boxes.forEach(box => {
     box.addEventListener("click", () => {
         if (turn) {
             box.innerHTML = "o";
             turn = false;
         }
         else {
             box.innerHTML = "X";
             turn = true;
         }
         box.disabled = true;

         checkWinner();
     });
 });
