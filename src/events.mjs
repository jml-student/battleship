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
    const directionButton = $('.direction')
    directionButton.addEventListener('click', handleChangeDirection)
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
    event.dataTransfer.setData('text/plain', '')
    draggedElement = event.target
}

export function handleDragOver(event) {
    event.preventDefault()
    let index = parseInt(event.target.dataset.index)
    let gridList = getGridList(event.target)
    let cellsIndex = getCellsIndex(index)
    const invalidIndex = cellsIndex.some(cell => cell < 0 || cell > 99)
    if (invalidIndex) {
        return
    }
    cellsIndex.forEach((cell) => {
        gridList[cell].style.backgroundColor = 'var(--dark-blue)'
    })
}

export function handleDragLeave(event) {
    event.preventDefault()
    let index = parseInt(event.target.dataset.index)
    let gridList = getGridList(event.target)
    let cellsIndex = getCellsIndex(index)
    let player = getPlayer(event)
    cellsIndex.forEach((cell) => {
        if (cell >= 0 && cell <= 99 && player.gameboard.grid[cell] === null) {
            gridList[cell].style.backgroundColor = 'var(--light-blue)'
        }
    })
    
}

function handleDragEnd(event) {
    draggedElement = null
}

export function handleDrop(event) {
    event.preventDefault()
    let index = parseInt(event.target.dataset.index)
    let cellsIndex = getCellsIndex(index)
    const invalidIndex = cellsIndex.some(cell => cell < 0 || cell > 99)
    if (invalidIndex) {
        return
    }
    if (draggedElement) {
        let clonedImg = draggedElement.cloneNode(true)
        clonedImg.classList = 'cell-img'
        if (draggedElement.id === 'ship1' || draggedElement.id === 'ship3') {
            clonedImg.classList.add('fix-position')
        }
        event.target.appendChild(clonedImg)
        let player = getPlayer(event)
        let length = getLength()
        player.gameboard.placeShip(index, gameState.direction, length)
        console.log(player.gameboard)
        draggedElement = null
    }
}

export function getCellsIndex(index) {
    if (gameState.direction === 'vertical') {
        if (draggedElement.id === 'ship1') {
            return [index - 20, index - 10, index, index + 10, index + 20, index + 30]
        } else if (draggedElement.id === 'ship2') {
            return [index - 20, index - 10, index, index + 10, index + 20]
        } else if (draggedElement.id === 'ship3') {
            return [index - 10, index, index + 10, index + 20]
        } else if (draggedElement.id === 'ship4') {
            return [index - 10, index, index + 10]
        }
    } else if (gameState.direction === 'horizontal') {
        if (draggedElement.id === 'ship1') {
            return [index - 3, index - 2, index - 1, index, index + 1, index + 2]
        } else if (draggedElement.id === 'ship2') {
            return [index - 2, index - 1, index, index + 1, index + 2]
        } else if (draggedElement.id === 'ship3') {
            return [index - 2, index - 1, index , index + 1]
        } else if (draggedElement.id === 'ship4') {
            return [index - 1, index, index + 1]
        }
    }
}

function handleChangeDirection() {
    gameState.switchDirection()
    const ships = $('.ships')
    const shipsImg = $$('.ships img')
    if (gameState.direction  === 'horizontal') {
        ships.classList.add('column')
        ships.style.justifyContent = 'flex-start'
        shipsImg.forEach((ship) => {
            ship.classList.add('rotate')
        })
    } else if (gameState.direction === 'vertical') {
        ships.classList.remove('column')
        ships.style.justifyContent = 'center'
        shipsImg.forEach((ship) => {
            ship.classList.remove('rotate')
        })
    }
}

function getGridList(target) {
    if (target.parentNode.classList.contains('first-grid')) {
        return $$('.first-grid div')
    } else {
        return $$('.second-grid div')
    }
}

function getPlayer(event) {
    if (event.target.parentNode.classList.contains('first-grid')) {
        return gameState.players[0]
    } else {
        return gameState.players[1]
    }
}

function getLength() {
    if (draggedElement.id === 'ship1') {
        return 6
    } else if (draggedElement.id === 'ship2') {
        return 5
    } else if (draggedElement.id === 'ship3') {
        return 4 
    } else if (draggedElement.id === 'ship4') {
        return 3
    }
}

