const modal = document.getElementById('init_dialog');
// const open_modal = document.getElementById('open_dig');
// const close_modal = document.getElementById('close_dig');
const board = document.getElementById('board');
const turn_message = document.getElementById('turn');
const win_message = document.getElementById('win_message');
const score_sheet = document.getElementById('score_sheet');

const mod_form = document.forms['init_form']

// close_modal.addEventListener('click', () => {
//     const user1 = mod_form['user1'].value
//     const user2 = mod_form['user2'].value
//     const symbol1 = mod_form['symbol1'].value
//     const symbol2 = mod_form['symbol2'].value
//     console.log(user1, user2, symbol1, symbol2)
// })


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
    const u1 = createUser("Shaam", "x");
    const u2 = createUser("Adil", "o");
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
            if (global_state.turn == 0) {
                if (global_state.gameBoard[x][y] == '') {
                    global_state.gameBoard[x][y] = global_state.u1.symbol;
                    cell.innerHTML = global_state.u1.symbol;
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
                    cell.innerHTML = global_state.u2.symbol;
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
                    } else{ 
                        global_state.turn = 0;
                        turn_message.innerHTML = `${global_state.u1.username}'s Turn`
                        global_state.move_count += 1;
                    }
                }
            }
        }
        if (global_state.move_count == 9) {
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

gamePlay();
