import { GameState } from './index.mjs'
import { addDialogListeners, addShipListeners, handleCellClick, handleDragOver, handleDragLeave, handleDrop } from './events.mjs'

showDialog()
addDialogListeners()
addShipListeners()

export let gameState = new GameState()

export function getGameState() {
    return gameState
}

export function setGamestate(value) {
    gameState = value
}

export function $(el) {
    return document.querySelector(el)
}

export function $$(el) {
    return document.querySelectorAll(el)
}

export function showDialog() {
    const dialog = $('.init-dialog')
    dialog.showModal()
    dialog.style.display = 'block'
}

export function hideDialog() {
    const dialog = $('.init-dialog')
    dialog.close()
    dialog.style.display = 'none'
}

export function createGrid(firstPlayer, secondPlayer) {
    const grids = $('.grids')
    grids.innerHTML = ''

    const title = $('.title')
    title.textContent = ''

    const firstContainer = document.createElement('div')
    firstContainer.classList = 'first-container'

    const firstGrid = document.createElement('div')
    firstGrid.classList = 'first-grid'

    const firstPlayerCont = document.createElement('div')
    firstPlayerCont.classList = 'first-player'

    const secondContainer = document.createElement('div')
    secondContainer.classList = 'second-container'

    const secondGrid = document.createElement('div')
    secondGrid.classList = 'second-grid'

    const secondPlayerCont = document.createElement('div')
    secondPlayerCont.classList = 'second-player'

    firstContainer.appendChild(firstGrid)
    firstContainer.appendChild(firstPlayerCont)

    secondContainer.appendChild(secondGrid)
    secondContainer.appendChild(secondPlayerCont)

    grids.appendChild(firstContainer)
    grids.appendChild(secondContainer)

    for (let i = 0; i < 100; i++) {
        const firstCell = document.createElement('div')
        const secondCell = document.createElement('div')

        firstCell.classList = 'cell'
        secondCell.classList = 'cell'

        firstCell.style.backgroundColor = 'var(--light-blue)'
        secondCell.style.backgroundColor = 'var(--light-blue)'

        firstCell.dataset.index = i
        secondCell.dataset.index = i

        if (secondPlayer.isReal) {
            firstCell.addEventListener('click', (event) => handleCellClick('second', firstPlayer, event))
        }
        secondCell.addEventListener('click', (event) => handleCellClick('first', secondPlayer, event))

        firstCell.addEventListener('dragover', handleDragOver)
        secondCell.addEventListener('dragover', handleDragOver)

        firstCell.addEventListener('dragleave', handleDragLeave)
        secondCell.addEventListener('dragleave', handleDragLeave)

        firstCell.addEventListener('drop', handleDrop)
        secondCell.addEventListener('drop', handleDrop)

        firstGrid.appendChild(firstCell)
        secondGrid.appendChild(secondCell)
    }
}

export function getGridList(target) {
    if (target.parentNode.classList.contains('first-grid')) {
        return $$('.first-grid div')
    } else {
        return $$('.second-grid div')
    }
}

export function getPlayer(event) {
    if (event.target.parentNode.classList.contains('first-grid')) {
        return gameState.players[0]
    } else {
        return gameState.players[1]
    }
}

export function changeCellBg(gridList, index) {
    if (gridList[index].style.backgroundColor === 'var(--dark-blue)') {
        gridList[index].style.backgroundColor = 'var(--red)'
    }
    if (gridList[index].style.backgroundColor === 'var(--light-blue)') {
        gridList[index].style.backgroundColor = 'gray'
    }
}

export function handleChangeDirection() {
    const ships = $('.ships')
    const allShips = $$('.ships img')
    const ship1 = $('#ship1')
    const ship2 = $('#ship2')
    const ship3 = $('#ship3')
    const ship4 = $('#ship4')

    gameState.switchDirection()

    if (gameState.direction  === 'horizontal') {
        ship1.src = './img/ship1.2.png'
        ship2.src = './img/ship2.2.png'
        ship3.src = './img/ship3.2.png'
        ship4.src = './img/ship4.2.png'

        ships.style.flexDirection = 'column'

        allShips.forEach((ship) => {
            ship.style.height = '50px'
            ship.style.width = 'var(--height)'
        })

    } else if (gameState.direction === 'vertical') {
        ship1.src = './img/ship1.png'
        ship2.src = './img/ship2.png'
        ship3.src = './img/ship3.png'
        ship4.src = './img/ship4.png'

        ships.style.flexDirection = ''

        allShips.forEach((ship) => {
            ship.style.height = 'var(--height)'
            ship.style.width = ''
        })
    }
}

export function endGame() {
    const title = $('.title')

    if (gameState.currentTurn === 'first') {
        title.textContent = 'First Player Wins!'
    } else {
        if (gameState.players[1].isReal) {
            title.textContent = 'Second Player Wins!'
        } else {
            title.textContent = 'Computer Wins!'
        }
    }
    if (gameState.direction === 'horizontal') {
        handleChangeDirection()
    }
    let newGameState = new GameState()
    setGamestate(newGameState)
    console.log(gameState)
    setTimeout(showDialog, 2000)
}

export function applyIconShadow() {
    const firstIcon = $('.first-icon')
    const secondIcon = $('.second-icon')

    if (gameState.currentTurn === 'first') {
        //firstIcon.style.boxShadow = '0px 0px 5px 3px rgb(185, 185, 185)'
        firstIcon.style.border = '3px solid var(--dark-blue)'
        //secondIcon.style.boxShadow = ''
        secondIcon.style.border = ''
    } else {
        //secondIcon.style.boxShadow = '0px 0px 5px 3px rgb(185, 185, 185)'
        secondIcon.style.border = '3px solid var(--dark-blue)'
        //firstIcon.style.boxShadow = ''
        firstIcon.style.border = ''
    }
}
