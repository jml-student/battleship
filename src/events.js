import { 
    Player,
    getCellsIndex,
    getLength,
    computerPlay,
    placeComputerShips
} from './index.js'

import { 
    gameState,
    $,
    $$,
    hideDialog,
    createGrid,
    getGridList,
    getGridId,
    getPlayer,
    changeCellBg,
    handleChangeDirection,
    endGame,
    applyIconShadow,
    displayTitle,
    addPlayerSvgs,
    handleTrashButton,
    handlePassDevice
} from './dom.js'

export let draggedElement = null

export function addDialogListeners() {
    const playerVsPlayer = $('.player-vs-player')
    const playerVsComputer = $('.player-vs-computer')
    const passButton = $('.btn-pass-device')

    playerVsPlayer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()

        gameState.players.push(firstPlayer, secondPlayer)

        passButton.style.color = 'var(--light-black)'

        hideDialog()
        createGrid(firstPlayer, secondPlayer)
        addPlayerSvgs()
        applyIconShadow()
    })

    playerVsComputer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()
        secondPlayer.isReal = false

        gameState.players.push(firstPlayer, secondPlayer)

        passButton.style.color = 'rgb(170, 170, 170)'

        hideDialog()
        createGrid(firstPlayer, secondPlayer)
        addPlayerSvgs()
        applyIconShadow()
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

export function addButtonListeners() {
    const directionButton = $('.btn-direction')
    directionButton.addEventListener('click', handleChangeDirection)

    const trashButton = $('.btn-trash')
    trashButton.addEventListener('click', handleTrashButton)

    const passButton = $('.btn-pass-device')
    passButton.addEventListener('click', handlePassDevice)
}

export function handleCellClick(turn, attackedPlayer, event) {
    let cellIndex = parseInt(event.target.dataset.index)

    const firstGridList = $$('.first-grid > div')
    const secondGridList = $$('.second-grid > div')
    const passButton = $('.btn-pass-device')

    if (turn !== gameState.currentTurn) {
        return
    }

    if (passButton.textContent === 'Reveal') {
        return
    }

    if (attackedPlayer.gameboard.shot.includes(cellIndex)
        || gameState.players[0].gameboard.ships.length < 4
        || gameState.players[1].gameboard.ships.length < 4) {
        return
    }

    attackedPlayer.gameboard.receiveAttack(cellIndex)

    const gridList = gameState.currentTurn === 'second' ? firstGridList : secondGridList
    changeCellBg(gridList, cellIndex)

    if (attackedPlayer.gameboard.allSunk === true) {
        endGame()
        return
    }

    gameState.switchTurn()
    applyIconShadow()
    displayTitle()

    if (gameState.currentTurn === 'second' && gameState.players[1].isReal === false) {
        setTimeout(() => {
            computerPlay(firstGridList)
            if (gameState.players[0].gameboard.allSunk) {
                endGame()
                return
            }
            gameState.switchTurn()
            applyIconShadow()
            displayTitle()
        }, 1000)
    }

}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', '')
    draggedElement = event.target
}

export function handleDragOver(event) {
    event.preventDefault()

    const passButton = $('.btn-pass-device')

    let index = parseInt(event.target.dataset.index)
    let player = getPlayer()
    let gridList = getGridList(event.target)
    let gridId = getGridId(event.target)
    let cellsIndex = getCellsIndex(index)
    let invalidIndex = false
    let invalidShip = false

    for (let i = 0; i < cellsIndex.length - 1; i++) {
        let current = cellsIndex[i]
        let next = cellsIndex[i + 1]
        if (current % 10 === 9 && next % 10 === 0) {
            invalidIndex = true
            break
        }
    }

    for (let j = 0; j < player.gameboard.ships.length; j++) {
        if (player.gameboard.ships[j].length === cellsIndex.length) {
            invalidShip = true
            break
        }
    }

    const findInvalids = cellsIndex.some(cell => cell < 0 || cell > 99 || player.gameboard.grid[cell] !== null)

    if (invalidIndex || invalidShip || findInvalids) {
        return
    }

    if (passButton.textContent === 'Reveal') {
        return
    }

    if (gridId === 'second-grid' && gameState.players[1].isReal === false
        || gameState.currentTurn === 'first' && gridId === 'second-grid'
        || gameState.currentTurn === 'second' && gridId === 'first-grid'
        || player.gameboard.ships.length >= 4
    ) {
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
    let player = getPlayer()

    cellsIndex.forEach((cell) => {
        if (cell >= 0 && cell <= 99 && player.gameboard.grid[cell] === null) {
            gridList[cell].style.backgroundColor = 'var(--light-blue)'
        }
    })
}

function handleDragEnd() {
    draggedElement = null
}

export function handleDrop(event) {
    event.preventDefault()

    const passButton = $('.btn-pass-device')

    let index = parseInt(event.target.dataset.index)
    let gridList = getGridList(event.target)
    let gridId = getGridId(event.target)
    let cellsIndex = getCellsIndex(index)
    let player = getPlayer()
    let invalidIndex = false
    let invalidShip = false

    for (let i = 0; i < cellsIndex.length - 1; i++) {
        let current = cellsIndex[i]
        let next = cellsIndex[i + 1]
        if (current % 10 === 9 && next % 10 === 0) {
            invalidIndex = true
            break
        }
    }

    for (let j = 0; j < player.gameboard.ships.length; j++) {
        if (player.gameboard.ships[j].length === cellsIndex.length) {
            invalidShip = true
            break
        }
    }

    const findInvalids = cellsIndex.some(cell => cell < 0 || cell > 99 || player.gameboard.grid[cell] !== null)

    if (invalidIndex || invalidShip || findInvalids) {
        cellsIndex.forEach((cell) => {
            if (player.gameboard.grid[cell] === null) {
                gridList[cell].style.backgroundColor = 'var(--light-blue)'
            }
        })
        return
    }

    if (passButton.textContent === 'Reveal') {
        return
    }

    if (gridId === 'second-grid' && gameState.players[1].isReal === false
        || gameState.currentTurn === 'first' && gridId === 'second-grid'
        || gameState.currentTurn === 'second' && gridId === 'first-grid'
        || player.gameboard.ships.length >= 4
    ) {
        return
    }
        
    if (draggedElement) {
        let clonedImg = draggedElement.cloneNode(true)
        clonedImg.classList = 'cell-img'
        clonedImg.id = ''
        clonedImg.draggable = false

        if (gameState.direction === 'vertical') {
            if (draggedElement.id === 'ship1' || draggedElement.id === 'ship3') {
                clonedImg.classList.add('fix-vertical-position')
            }
        } else if (gameState.direction === 'horizontal') {
            if (draggedElement.id === 'ship1' || draggedElement.id === 'ship3') {
                clonedImg.classList.add('fix-horizontal-position')
            }
            clonedImg.style.marginLeft = ''
        }

        event.target.appendChild(clonedImg)

        let length = getLength()
        player.gameboard.placeShip(index, gameState.direction, length)
        draggedElement = null
    }

    if (player.gameboard.ships.length === 4) {
        gameState.switchTurn()

        if (gameState.players[1].isReal) {
            applyIconShadow()
            displayTitle()
            return
        } else {
            placeComputerShips()
            gameState.switchTurn()
            displayTitle()
        }
    }
}

