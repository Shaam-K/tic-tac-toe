const modal = document.getElementById('init_dialog');
const close_modal = document.getElementById('close_dig');
const board = document.getElementById('board');
const turn_message = document.getElementById('turn');
const win_message = document.getElementById('win_message');
const score_sheet = document.getElementById('score_sheet');
const reset_creator = document.getElementById('div_btn');
const heading = document.getElementById('heading');
const score_board = document.getElementById('score');
const mod_form = document.forms['init_form']

function clearScreen() {
    heading.innerHTML = ""
    turn_message.innerHTML = ""
    score_sheet.innerHTML = ""
    win_message.innerHTML = ""
    score_board.classList.add('removeBod');
}

function fillScreen() {
    heading.innerHTML = "Tic Tac Toe";
    turn_message.innerHTML = "--";
    win_message.innerHTML = "--";
    score_board.classList.remove('removeBod');
}

clearScreen();

close_modal.addEventListener('click', () => {
    const user1 = mod_form['user1'].value
    const user2 = mod_form['user2'].value
    const symbol1 = mod_form['symbol1'].value
    const symbol2 = mod_form['symbol2'].value
    console.log(user1, user2, symbol1, symbol2);
    modal.classList.add('hide');
    fillScreen();

    reset_creator.innerHTML = `
        <button class="btn btn-dark" id="reset_button">New Game</button>
        <button class="btn btn-dark" id="reset_match">New Match</button>
    `

    const reset_button = document.getElementById('reset_button');
    const reset_match = document.getElementById('reset_match');

    reset_button.addEventListener('click', () => {
        reset();
    })

    reset_match.addEventListener('click', () => {
        modal.classList.remove('hide');
    })


    function createUser(username, symbol) {
        const score = 0;
        return { username, symbol, score }
    }

    const global_state = (() => {
        const gameBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
        const winConditions = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ]
        const u1 = createUser(user1, symbol1);
        const u2 = createUser(user2, symbol2);
        let turn = 0;
        let game_state = 0;
        let move_count = 0;
        return { gameBoard, winConditions, u1, u2, game_state, move_count, turn }
    })();

    function reset() {
        global_state.turn = 1;
        global_state.game_state = 0;
        global_state.move_count = 0;
        global_state.gameBoard = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ]
        turn_message.innerHTML = "--";
        win_message.innerHTML = "--";
        gamePlay();
    }

    function createBoard() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div')
                cell.classList.add("box");
                cell.dataset.x = i;
                cell.dataset.y = j;
                board.appendChild(cell);
            }
        }
    }
    function gamePlay() {
        board.innerHTML = "";
        createBoard();
        score_sheet.innerHTML = `
        <h1>Score</h1>
        <h3>${global_state.u1.username}: ${global_state.u1.score}</h3>
        <h3>${global_state.u2.username}: ${global_state.u2.score}</h3>
        `
        board.addEventListener('click', (e) => {
            const cell = e.target;
            const x = cell.dataset.x;
            const y = cell.dataset.y;

            if (global_state.move_count < 9 && global_state.game_state == 0) {
                console.log('inside game loop');
                if (global_state.turn == 0) {
                    if (global_state.gameBoard[x][y] == '') {
                        global_state.gameBoard[x][y] = global_state.u1.symbol;
                        cell.innerHTML = `<span class="box_value">${global_state.u1.symbol}</span>`;
                        cell.classList.add('p1');
                        cell.classList.add('taken');

                        const win_result = gameCheck(global_state.u1.symbol);

                        if (win_result) {
                            global_state.game_state = 1;
                            win_message.innerHTML = `${global_state.u1.username} wins!`
                            global_state.u1.score += 1
                            score_sheet.innerHTML = `
                            <h1>Score</h1>
                            <h3>${global_state.u1.username}: ${global_state.u1.score}</h3>
                            <h3>${global_state.u2.username}: ${global_state.u2.score}</h3>
                            `
                        } else {
                            turn_message.innerHTML = `${global_state.u2.username}'s Turn`
                            global_state.turn = 1;
                            global_state.move_count += 1;
                        }
                    }
                } else {
                    if (global_state.gameBoard[x][y] == '') {
                        global_state.gameBoard[x][y] = global_state.u2.symbol;
                        cell.innerHTML = `<span class="box_value">${global_state.u2.symbol}</span>`
                        cell.classList.add('p2');
                        cell.classList.add('taken');

                        const win_result = gameCheck(global_state.u2.symbol);
                        if (win_result) {
                            global_state.game_state = 1;
                            win_message.innerHTML = `${global_state.u2.username} wins!`
                            global_state.u2.score += 1
                            score_sheet.innerHTML = `
                            <h1>Score</h1>
                            <h3>${global_state.u1.username}: ${global_state.u1.score}</h3>
                            <h3>${global_state.u2.username}: ${global_state.u2.score}</h3>
                            `
                        } else {
                            global_state.turn = 0;
                            turn_message.innerHTML = `${global_state.u1.username}'s Turn`
                            global_state.move_count += 1;
                        }
                    }
                }
            }
            if (global_state.move_count == 9 && global_state.game_state == 0) {
                global_state.game_state = 1;
                win_message.innerHTML = "Its a Tie!"
                global_state.u1.score += 1
                global_state.u2.score += 1
                score_sheet.innerHTML = `
                <h1>Score</h1>
                <h3>${global_state.u1.username}: ${global_state.u1.score}</h3>
                <h3>${global_state.u2.username}: ${global_state.u2.score}</h3>
                `
            }
        })

    }

    function gameCheck(symbol) {
        const wins = global_state.winConditions
        for (let i = 0; i < wins.length; i++) {
            const win = wins[i]
            let count = 0;
            for (let j = 0; j < win.length; j++) {
                const x = win[j][0]
                const y = win[j][1]
                if (global_state.gameBoard[x][y] == symbol) {
                    count += 1
                }
            }
            if (count == 3) {
                return true
            }
        }
        return false
    }

    if (global_state.move_count != 9) {
        gamePlay();
    }
})
