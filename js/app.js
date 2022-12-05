'use strict'

const WALL = 'WALL'
const FLOOR = 'FLOOR'
const BALL = 'BALL'
const GAMER = 'GAMER'

const GAMER_IMG = '<img src="img/gamer.png">'
const BALL_IMG = '<img src="img/ball.png">'

// Model:
var gBoard
var gGamerPos
var gInterval
var gballsCount = 0
var gOcupiedCount = 3



function onInitGame() {
    gOcupiedCount = 3
    gballsCount = 0
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
    // endGame()
    gInterval = setInterval(ballAdd, 4000);
    var elballcount = document.querySelector('.count')
    elballcount.innerText = 'balls caught:' + gballsCount

}
function stopInterval() {
    clearInterval(gInterval)
}
// Render the board to an HTML table
function renderBoard(board) {

    const elBoard = document.querySelector('.board')
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })
            // console.log('cellClass:', cellClass)

            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i},${j})" >\n`

            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    elBoard.innerHTML = strHTML
    // var elEndGame = document.querySelector(".count")
    // elEndGame.innerText=

}
function ballAdd() {
    if (gOcupiedCount === 84 || gOcupiedCount === 1) {
        stopInterval()
        alert('done')
        return
    }
    var randomI = getRandomInt(0, gBoard.length)
    var randomJ = getRandomInt(0, gBoard[0].length)

    if (gBoard[randomI][randomJ].gameElement === null && gBoard[randomI][randomJ].type !== WALL) {
        renderCell({ i: randomI, j: randomJ }, BALL_IMG)
        gBoard[randomI][randomJ].gameElement = BALL
        gOcupiedCount++
    } else {
        ballAdd()
    }

}


// function endGame(){
//     var elEndGame = document.querySelector(".count")
//     elEndGame.innerHTML = `<button class="button" onclick="initGame(this)">Restart</button>`

// }

function buildBoard() {
    const board = []
    // DONE: Create the Matrix 10 * 12 
    // DONE: Put FLOOR everywhere and WALL at edges
    for (var i = 0; i < 10; i++) {
        board[i] = []
        for (var j = 0; j < 12; j++) {
            board[i][j] = { type: FLOOR, gameElement: null }
            if (i === 0 || i === 9 || j === 0 || j === 11) {
                board[i][j].type = WALL
            }
        }
    }
    // DONE: Place the gamer and two balls
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER
    board[5][5].gameElement = BALL
    board[7][2].gameElement = BALL

    board[0][5].type = FLOOR //up
    board[5][0].type = FLOOR //left
    board[9][5].type = FLOOR //down
    board[5][11].type = FLOOR//right

    console.log(board)
    return board
}

// Move the player to a specific location
function moveTo(i, j) {
    console.log(i, j)
    const targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return

    // Calculate distance to make sure we are moving to a neighbor cell
    const iAbsDiff = Math.abs(i - gGamerPos.i)
    const jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) {

        if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
            gOcupiedCount--
            console.log('--', gOcupiedCount)
            gballsCount++
            console.log('++', gballsCount)
            var elballcount = document.querySelector('.count')
            elballcount.innerText = 'balls caught:' + gballsCount

            var elPopOnBallCatch = document.querySelector(".player")
            elPopOnBallCatch.play()
        }
        console.log(gballsCount)

        // DONE: Move the gamer
        // REMOVING FROM
        // update Model
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        // update DOM
        renderCell(gGamerPos, '')

        // ADD TO
        // update Model
        targetCell.gameElement = GAMER
        gGamerPos = { i, j }
        // update DOM
        renderCell(gGamerPos, GAMER_IMG)

    }

}

function exitBoard(i,j)
{
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
        renderCell(gGamerPos, '')

        gBoard[i][j].gameElement = GAMER
        gGamerPos = { i, j }
      
        renderCell(gGamerPos, GAMER_IMG)
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) // cell-i-j
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value

}

// Move the player by keyboard arrows
function onHandleKey(event) {
    var i = gGamerPos.i
    var j = gGamerPos.j
    console.log('event.key:', event.key)

    switch (event.key) {
        case 'ArrowLeft':
            if (j ===0 ) {
                j = 11
                exitBoard(i,j)
            }else moveTo(i, j - 1)
            break

        case 'ArrowRight':
            if (j ===11 ) {
                j = 0
                exitBoard(i,j)
            }else moveTo(i, j + 1)
            break

        case 'ArrowUp':
            if (i === 0) {
                i = 9
                exitBoard(i,j)
            }else moveTo(i - 1, j)
            break
        case 'ArrowDown':
            if (i === 9) {
                i = 0
                exitBoard(i,j)
            }else moveTo(i + 1, j)
            break
    }
}

// Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}



function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
