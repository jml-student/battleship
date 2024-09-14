import { Player, computerPlay } from './index.mjs'
import { gameState, $, $$, showDialog, hideDialog, createGrid, displayGrid, changeCellBg, endGame } from './dom.mjs'

export function addDialogListeners() {
    const playerVsPlayer = $('.player-vs-player')
    const playerVsComputer = $('.player-vs-computer')

    playerVsPlayer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()
        gameState.players.push(firstPlayer, secondPlayer)
        hideDialog()
        createGrid(firstPlayer, secondPlayer)
        defaultShips(firstPlayer, secondPlayer)
        displayGrid(firstPlayer, secondPlayer)
    })

    playerVsComputer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()
        secondPlayer.isReal = false
        gameState.players.push(firstPlayer, secondPlayer)
        hideDialog()
        createGrid(firstPlayer, secondPlayer)
        defaultShips(firstPlayer, secondPlayer)
        displayGrid(firstPlayer, secondPlayer)
    })
}

//temporal function to display some ships 
export function defaultShips(firstPlayer, secondPlayer) {
    firstPlayer.gameboard.placeShip('A', 1, 'vertical', 3)
    firstPlayer.gameboard.placeShip('E', 1, 'horizontal', 5)
    secondPlayer.gameboard.placeShip('A', 3, 'vertical', 3)
    secondPlayer.gameboard.placeShip('G', 1, 'horizontal', 5)
}

export function handleCellClick(turn, attackedPlayer, cellIndex) {
    if (turn !== gameState.currentTurn) {
        console.log('It is not your turn.')
        return
    }

    if (attackedPlayer.gameboard.shot.includes(cellIndex)) {
        return
    }
    
    const firstGridList = $$('.first-grid > div')
    const secondGridList = $$('.second-grid > div')

    attackedPlayer.gameboard.receiveAttack(cellIndex)
    const gridList = gameState.currentTurn === 'second' ? firstGridList : secondGridList
    changeCellBg(gridList, cellIndex)

    //console.log(attackedPlayer, attackedPlayer.gameboard.allSunk)
    if (attackedPlayer.gameboard.allSunk === true) {
        endGame(gameState)
    }

    gameState.switchTurn()
    if (gameState.currentTurn === 'second' && gameState.players[1].isReal === false) {
        setTimeout(computerPlay, 500, gameState, firstGridList)
    }
}
