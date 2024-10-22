let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true; // true for player0, false for playerX
let count = 0;
let isSinglePlayer = false; // Multiplayer is default
let isGameOver = false; // Track game state

// On page load, mark multiplayer as active
document.getElementById("multiplayer").classList.add("active");

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

// Reset the game
const resetGame = () => {
  turn0 = true;
  count = 0;
  isGameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Player's move
boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (!isGameOver && box.innerText === "") {
      playerMove(box);

      if (isSinglePlayer && !isGameOver && !turn0) {
        setTimeout(computerMove, 500); // Let AI make its move after a delay
      }
    }
  });
});

const playerMove = (box) => {
  if (turn0) {
    box.innerText = "0";
    box.style.color = "#3498DB";
    turn0 = false;
  } else {
    box.innerText = "X";
    box.style.color = "#FF5733";
    turn0 = true;
  }
  box.disabled = true;
  count++;

  let isWinner = checkWinner();
  if (count === 9 && !isWinner) {
    gameDraw();
  }
};

const computerMove = () => {
  let emptyBoxes = Array.from(boxes).filter((box) => box.innerText === "");
  if (emptyBoxes.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    emptyBoxes[randomIndex].innerText = "X"; 
    emptyBoxes[randomIndex].style.color = "#FF5733";
    emptyBoxes[randomIndex].disabled = true;
    count++;
    turn0 = true;
    checkWinner();
  }
};

const gameDraw = () => {
  msg.innerText = `Game was a draw`;
  msgContainer.classList.remove("hide");
  isGameOver = true;
  disableBoxes();
};

const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.style.backgroundColor = "";
    box.style.color = "";
  });
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, ${winner} is the winner!`;
  msgContainer.classList.remove("hide");
  isGameOver = true;
  disableBoxes();
};

const highlightWinner = (pattern) => {
  pattern.forEach((index) => {
    boxes[index].style.backgroundColor = "lightgreen";
    boxes[index].style.color = "#000";
  });
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos1Val === pos2Val && pos1Val === pos3Val) {
      showWinner(pos1Val);
      highlightWinner(pattern);
      return true;
    }
  }
  return false;
};

// Mode selection buttons
document.getElementById("single-player").addEventListener("click", () => {
  isSinglePlayer = true;
  resetGame();
  document.getElementById("single-player").classList.add("active");
  document.getElementById("multiplayer").classList.remove("active");
});

document.getElementById("multiplayer").addEventListener("click", () => {
  isSinglePlayer = false;
  resetGame();
  document.getElementById("multiplayer").classList.add("active");
  document.getElementById("single-player").classList.remove("active");
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
