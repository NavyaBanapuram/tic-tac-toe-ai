let mode;
function startGame(selectedMode) {
    mode = selectedMode;
    document.getElementById('home').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'flex';
    createBoard();
}

const board = document.getElementById('board');
let gameBoard = Array(9).fill(null);
let currentPlayer = 'X';

function createBoard() {
    board.innerHTML = '';
    gameBoard = Array(9).fill(null);
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
    }
}

function handleClick(index) {
    if (gameBoard[index] !== null) return;
    gameBoard[index] = currentPlayer;
    document.querySelector(`[data-index='${index}']`).textContent = currentPlayer;
    document.querySelector(`[data-index='${index}']`).classList.add('taken');
    
    if (checkWinner()) return;
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (mode === 'computer' && currentPlayer === 'O') setTimeout(computerMove, 500);
}

function computerMove() {
    let bestMove = minimax(gameBoard, 'O').index;
    handleClick(bestMove);
}

function minimax(board, player) {
    const emptyCells = board.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
    if (checkWinner()) return { score: player === 'O' ? -1 : 1 };
    if (emptyCells.length === 0) return { score: 0 };
    
    let moves = [];
    for (let i of emptyCells) {
        let newBoard = [...board];
        newBoard[i] = player;
        let result = minimax(newBoard, player === 'O' ? 'X' : 'O');
        moves.push({ index: i, score: result.score });
    }
    
    return player === 'O' ? moves.reduce((a, b) => a.score < b.score ? a : b) : moves.reduce((a, b) => a.score > b.score ? a : b);
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            showWinnerPopup(currentPlayer);
            return true;
        }
    }
    if (!gameBoard.includes(null)) {
        showWinnerPopup("It's a draw!");
        return true;
    }
    return false;
}

function showWinnerPopup(winner) {
    document.getElementById('winnerMessage').textContent = winner === "X" ? "🎉 Congratulations! You Won! 🎉" : "💻 Computer Won! Try Again!";
    document.getElementById('winnerPopup').style.display = "block";
}

function retryGame() {
    document.getElementById('winnerPopup').style.display = "none";
    startGame(mode);
}
