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
        displayGrid(firstPlayer, secondPlayer)
    })

    playerVsComputer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()
        secondPlayer.isReal = false
        gameState.players.push(firstPlayer, secondPlayer)
        hideDialog()
        createGrid(firstPlayer, secondPlayer)
        displayGrid(firstPlayer, secondPlayer)
    })
}

export function addShipListeners() {
    const ships = $$('.ships img')
    ships.forEach((ship) => {
        ship.addEventListener('dragstart', handleDragStart)
    })
    ships.forEach((ship) => {
        ship.addEventListener('dragend', handleDragEnd)
    })
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

    if (attackedPlayer.gameboard.allSunk === true) {
        endGame(gameState)
    }

    gameState.switchTurn()
    if (gameState.currentTurn === 'second' && gameState.players[1].isReal === false) {
        setTimeout(computerPlay, 500, gameState, firstGridList)
    }
}

let draggedElement = null

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', '');
    draggedElement = event.target
}

export function handleDragOver(event) {
    event.preventDefault()
    let index = event.target.dataset.index
    let gridList = getGridList(event.target)
    let cellsIndex = getCellsIndex(index)
    cellsIndex.forEach((cell) => {
        if (cell >= 0 && cell <= 99) {
            gridList[cell].classList.add('drag-preview')
        }
    })
}

export function handleDragLeave(event) {
    event.preventDefault()
    let index = event.target.dataset.index
    let gridList = getGridList(event.target)
    let cellsIndex = getCellsIndex(index)
    cellsIndex.forEach((cell) => {
        if (cell >= 0 && cell <= 99) {
            gridList[cell].classList.remove('drag-preview')
        }
    })
    
}

function handleDragEnd(event) {
    draggedElement = null
}

function getCellsIndex(index) {
    if (draggedElement.id === 'ship1') {
        return [index - 20, index - 10, index, index + 10, index + 20, index + 30]
    } else if (draggedElement.id === 'ship2') {
        return [index - 20, index - 10, index, index + 10, index + 20]
    } else if (draggedElement.id === 'ship3') {
        return [index - 10, index, index + 10, index + 20]
    } else if (draggedElement.id === 'ship4') {
        return [index - 10, index, index + 10]
    }
}

function getGridList(target) {
    if (target.parentNode.classList.contains('first-grid')) {
        return $$('.first-grid div');
    } else {
        return $$('.second-grid div');
    }
}

export function handleDrop(event) {
    event.preventDefault()

    if (draggedElement) {
        let clonedImg = draggedElement.cloneNode(true)
        clonedImg.classList = 'cell-img'
        event.target.appendChild(clonedImg);
        draggedElement = null;
    }
}
