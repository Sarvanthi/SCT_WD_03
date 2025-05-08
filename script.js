    const board = document.getElementById('board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const statusDisplay = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    const modeRadios = document.querySelectorAll('input[name="mode"]');

    let gameActive = false;
    let currentPlayer = 'X';
    let boardState = Array(9).fill('');
    let gameMode = 'pvp'; // 'pvp' or 'pvc'

    const winningConditions = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6]
    ];

    function setStatus(message) {
      statusDisplay.textContent = message;
    }

    function startGame() {
      boardState.fill('');
      cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('disabled', 'win');
      });
      currentPlayer = 'X';
      gameActive = true;
      setStatus(`Player ${currentPlayer}'s turn`);
    }

    function switchPlayer() {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      setStatus(`Player ${currentPlayer}'s turn`);
      if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 400);
      }
    }

    function checkResult() {
      let roundWon = false;
      for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (
          boardState[a] && 
          boardState[a] === boardState[b] && 
          boardState[b] === boardState[c]
        ) {
          roundWon = true;
          highlightWinningCells(condition);
          break;
        }
      }

      if (roundWon) {
        setStatus(`Player ${currentPlayer} wins!`);
        gameActive = false;
        disableBoard();
        return;
      }

      if (!boardState.includes('')) {
        setStatus(`It's a draw!`);
        gameActive = false;
        return;
      }

      switchPlayer();
    }

    function highlightWinningCells(indices) {
      indices.forEach(i => cells[i].classList.add('win'));
    }

    function disableBoard() {
      cells.forEach(cell => cell.classList.add('disabled'));
    }

    function handleCellClick(e) {
      const idx = +e.target.getAttribute('data-index');
      if (!gameActive || boardState[idx] !== '' || (gameMode === 'pvc' && currentPlayer === 'O')) {
        return;
      }

      makeMove(idx);
    }

    function makeMove(idx) {
      boardState[idx] = currentPlayer;
      cells[idx].textContent = currentPlayer;
      cells[idx].classList.add('disabled');

      checkResult();
    }

    function computerMove() {
      if (!gameActive) return;

      const winningMove = findBestMove('O');
      if (winningMove !== -1) {
        makeMove(winningMove);
        return;
      }

      const blockMove = findBestMove('X');
      if (blockMove !== -1) {
        makeMove(blockMove);
        return;
      }

      if (boardState[4] === '') {
        makeMove(4);
        return;
      }

      const corners = [0,2,6,8].filter(i => boardState[i] === '');
      if (corners.length > 0) {
        makeMove(corners[Math.floor(Math.random() * corners.length)]);
        return;
      }

      const empties = boardState.map((val, i) => val === '' ? i : -1).filter(i => i !== -1);
      if (empties.length > 0) {
        makeMove(empties[Math.floor(Math.random() * empties.length)]);
      }
    }

    function findBestMove(player) {
      for (const condition of winningConditions) {
        const line = condition.map(i => boardState[i]);
        if (
          line.filter(val => val === player).length === 2 &&
          line.includes('')
        ) {
          return condition[line.indexOf('')];
        }
      }
      return -1;
    }

    function handleModeChange() {
      gameMode = document.querySelector('input[name="mode"]:checked').value;
      startGame();
    }

    modeRadios.forEach(radio => {
      radio.addEventListener('change', handleModeChange);
    });

    restartBtn.addEventListener('click', () => {
      startGame();
    });

    cells.forEach(cell => {
      cell.addEventListener('click', handleCellClick);
      cell.addEventListener('keydown', (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCellClick(e);
        }
      });
    });

    startGame();
