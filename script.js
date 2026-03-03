// Твои личные данные из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHsaVLk69lTZUISm_HKJr8vkTe-jAVp24",
  authDomain: "prutic.firebaseapp.com",
  databaseURL: "https://prutic-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "prutic",
  storageBucket: "prutic.firebasestorage.app",
  messagingSenderId: "663224557174",
  appId: "1:663224557174:web:5079b7054d9a2aa28c0957",
  measurementId: "G-P0E6QSB4RV"
};

// Инициализация
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gameRef = db.ref('game');

const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

// Логика клика
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = clickedCell.getAttribute('data-index');

    gameRef.once('value').then((snapshot) => {
        const data = snapshot.val() || {
            board: ["", "", "", "", "", "", "", "", ""],
            turn: "X",
            winner: null
        };

        const board = data.board;
        if (board[clickedIndex] !== "" || data.winner) return;

        board[clickedIndex] = data.turn;
        const winner = calculateWinner(board);
        const nextTurn = data.turn === "X" ? "O" : "X";

        gameRef.set({
            board: board,
            turn: nextTurn,
            winner: winner
        });
    });
}

// Слушатель обновлений в сети
gameRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) {
        // Если в базе пусто, создаем начальное состояние
        gameRef.set({
            board: ["", "", "", "", "", "", "", "", ""],
            turn: "X",
            winner: null
        });
        return;
    }

    data.board.forEach((mark, index) => {
        cells[index].innerText = mark;
    });

    if (data.winner) {
        statusElement.innerText = `Победил: ${data.winner}!`;
    } else if (!data.board.includes("")) {
        statusElement.innerText = "Ничья!";
    } else {
        statusElement.innerText = `Ход игрока: ${data.turn}`;
    }
});

function calculateWinner(squares) {
    const lines = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

resetBtn.addEventListener('click', () => {
    gameRef.set({
        board: ["", "", "", "", "", "", "", "", ""],
        turn: "X",
        winner: null
    });
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));