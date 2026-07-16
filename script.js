/* ==========================================
   ChronoX Tic Tac Toe
   script.js
   Part 1A
========================================== */

// DOM Elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

const restartBtn = document.getElementById("restartBtn");
const newGameBtn = document.getElementById("newGameBtn");

const playerMode = document.getElementById("playerMode");
const computerMode = document.getElementById("computerMode");

const difficulty = document.getElementById("difficulty");

const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const drawScore = document.getElementById("drawScore");

const themeBtn = document.getElementById("themeBtn");

// Game Variables
let board = ["","","","","","","","",""];

let currentPlayer = "X";

let gameRunning = true;

let vsComputer = false;

let level = "easy";

let scoreX = 0;
let scoreO = 0;
let draws = 0;

// Winning Patterns

const winPatterns = [

[0,1,2],

[3,4,5],

[6,7,8],

[0,3,6],

[1,4,7],

[2,5,8],

[0,4,8],

[2,4,6]

];

// =====================================
// Initialize
// =====================================

statusText.textContent = "Player X Turn";

cells.forEach(cell=>{

cell.textContent="";

cell.classList.remove("x","o","win");

});

// =====================================
// Render Board
// =====================================

function renderBoard(){

cells.forEach((cell,index)=>{

cell.textContent=board[index];

cell.classList.remove("x");

cell.classList.remove("o");

if(board[index]==="X"){

cell.classList.add("x");

}

if(board[index]==="O"){

cell.classList.add("o");

}

});

}
/* ==========================================
   Part 1B - Player Moves
========================================== */

// Handle Cell Click
function handleCellClick(e){

    const cell = e.target;

    const index = cell.getAttribute("data-index");

    // Ignore if occupied or game finished
    if(board[index] !== "" || !gameRunning){

        return;

    }

    board[index] = currentPlayer;

    renderBoard();

    checkWinner();

    if(!gameRunning){

        return;

    }

    // Switch Player
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusText.textContent = `Player ${currentPlayer} Turn`;

    // Computer Move
    if(vsComputer && currentPlayer === "O"){

        setTimeout(computerMove,500);

    }

}

// Add Click Events
cells.forEach(cell=>{

    cell.addEventListener("click",handleCellClick);

});

// ==========================================
// Mode Selection
// ==========================================

playerMode.addEventListener("click",()=>{

    vsComputer = false;

    playerMode.classList.add("active");

    computerMode.classList.remove("active");

    resetBoard();

});

computerMode.addEventListener("click",()=>{

    vsComputer = true;

    computerMode.classList.add("active");

    playerMode.classList.remove("active");

    resetBoard();

});

// ==========================================
// Difficulty
// ==========================================

difficulty.addEventListener("change",()=>{

    level = difficulty.value;

});

// ==========================================
// Reset Board
// ==========================================

function resetBoard(){

    board = ["","","","","","","","",""];

    currentPlayer = "X";

    gameRunning = true;

    statusText.textContent = "Player X Turn";

    renderBoard();

    cells.forEach(cell=>{

        cell.classList.remove("win");

    });

}
/* ==========================================================
   Part 2A - Winner Detection & Score Update
========================================================== */

function checkWinner() {

    let roundWon = false;

    for (let i = 0; i < winPatterns.length; i++) {

        const condition = winPatterns[i];

        const a = board[condition[0]];
        const b = board[condition[1]];
        const c = board[condition[2]];

        if (a === "" || b === "" || c === "") {
            continue;
        }

        if (a === b && b === c) {

            roundWon = true;

            // Highlight Winning Cells
            cells[condition[0]].classList.add("win");
            cells[condition[1]].classList.add("win");
            cells[condition[2]].classList.add("win");

            // Stop Game
            gameRunning = false;

            // Update Score
            if (a === "X") {

                scoreX++;
                xScore.textContent = scoreX;

            } else {

                scoreO++;
                oScore.textContent = scoreO;

            }

            statusText.textContent = `🎉 Player ${a} Wins!`;

            saveScores();

            return;

        }

    }

    // Draw

    if (!board.includes("")) {

        draws++;

        drawScore.textContent = draws;

        gameRunning = false;

        statusText.textContent = "🤝 It's a Draw!";

        saveScores();

        return;

    }

}
/* ==========================================================
   Part 2B - Restart, New Game & Local Storage
========================================================== */

// Restart Current Match
restartBtn.addEventListener("click", () => {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameRunning = true;

    statusText.textContent = "Player X Turn";

    cells.forEach(cell => {

        cell.classList.remove("win");

    });

    renderBoard();

});

// New Game (Reset Everything)
newGameBtn.addEventListener("click", () => {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameRunning = true;

    scoreX = 0;
    scoreO = 0;
    draws = 0;

    xScore.textContent = scoreX;
    oScore.textContent = scoreO;
    drawScore.textContent = draws;

    statusText.textContent = "Player X Turn";

    cells.forEach(cell => {

        cell.classList.remove("win");

    });

    renderBoard();

    saveScores();

});

// ===============================
// Save Scores
// ===============================

function saveScores(){

    const scores = {

        x : scoreX,

        o : scoreO,

        draw : draws

    };

    localStorage.setItem(

        "chronox_scores",

        JSON.stringify(scores)

    );

}

// ===============================
// Load Scores
// ===============================

function loadScores(){

    const saved = JSON.parse(

        localStorage.getItem("chronox_scores")

    );

    if(saved){

        scoreX = saved.x || 0;

        scoreO = saved.o || 0;

        draws = saved.draw || 0;

        xScore.textContent = scoreX;

        oScore.textContent = scoreO;

        drawScore.textContent = draws;

    }

}

// Load Previous Scores
loadScores();
/* ==========================================================
   Part 3A - Computer AI (Easy + Hard)
========================================================== */

// Computer Move
function computerMove() {

    if (!gameRunning) return;

    let move;

    if (level === "easy") {

        move = easyMove();

    } else {

        move = hardMove();

    }

    if (move !== undefined) {

        board[move] = "O";

        renderBoard();

        checkWinner();

        if (gameRunning) {

            currentPlayer = "X";

            statusText.textContent = "Player X Turn";

        }

    }

}

// =========================
// Easy AI
// Random Move
// =========================

function easyMove() {

    const emptyCells = [];

    board.forEach((cell, index) => {

        if (cell === "") {

            emptyCells.push(index);

        }

    });

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(

        Math.random() * emptyCells.length

    );

    return emptyCells[randomIndex];

}

// =========================
// Hard AI
// Win -> Block -> Random
// =========================

function hardMove() {

    // Try Winning

    let move = findBestMove("O");

    if (move !== null) return move;

    // Block Player

    move = findBestMove("X");

    if (move !== null) return move;

    // Center

    if (board[4] === "") return 4;

    // Corners

    const corners = [0,2,6,8];

    for (let corner of corners) {

        if (board[corner] === "") {

            return corner;

        }

    }

    // Random

    return easyMove();

}

// =========================
// Find Winning Move
// =========================

function findBestMove(player) {

    for (let pattern of winPatterns) {

        const [a,b,c] = pattern;

        const values = [

            board[a],

            board[b],

            board[c]

        ];

        const playerCount = values.filter(v => v === player).length;

        const emptyCount = values.filter(v => v === "").length;

        if (playerCount === 2 && emptyCount === 1) {

            if (board[a] === "") return a;

            if (board[b] === "") return b;

            if (board[c] === "") return c;

        }

    }

    return null;

}
/* ==========================================================
   Part 3B - Theme, Final Initialization & Improvements
========================================================== */

// ===============================
// Theme Toggle
// ===============================

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add("light");

}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("light");

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

    }else{

        localStorage.setItem("theme","dark");

    }

});

// ===============================
// Winner Animation
// ===============================

function celebrateWinner(){

    cells.forEach(cell=>{

        if(cell.classList.contains("win")){

            cell.style.transform="scale(1.08)";

            setTimeout(()=>{

                cell.style.transform="scale(1)";

            },300);

        }

    });

}

// ===============================
// Improve checkWinner()
// ===============================

const originalCheckWinner = checkWinner;

checkWinner = function(){

    originalCheckWinner();

    if(!gameRunning){

        celebrateWinner();

    }

};

// ===============================
// Game Initialization
// ===============================

function initializeGame(){

    renderBoard();

    loadScores();

    statusText.textContent="Player X Turn";

}

initializeGame();

// ===============================
// Keyboard Shortcuts
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="r" || e.key==="R"){

        restartBtn.click();

    }

    if(e.key==="n" || e.key==="N"){

        newGameBtn.click();

    }

});

// ===============================
// Console Message
// ===============================

console.log("🎮 ChronoX Tic Tac Toe Loaded Successfully!");

/* ==========================================================
   End of Script.js
========================================================== */