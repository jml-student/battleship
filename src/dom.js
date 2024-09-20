import { GameState } from './index.js'
import { addDialogListeners, addShipListeners, handleCellClick, handleDragOver, handleDragLeave, handleDrop } from './events.js'

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
    const title = $('.title')

    dialog.showModal()
    dialog.style.display = 'block'

    title.textContent = 'Place the four ships'
}

export function hideDialog() {
    const dialog = $('.init-dialog')
    dialog.close()
    dialog.style.display = 'none'
}

export function createGrid(firstPlayer, secondPlayer) {
    const grids = $('.grids')
    grids.innerHTML = ''

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

export function getGridId(target) {
    if (target.parentNode.classList.contains('first-grid')) {
        return 'first-grid'
    } else {
        return 'second-grid'
    }
}

export function getPlayer() {
    if (gameState.currentTurn === 'first') {
        return gameState.players[0]
    } else {
        return gameState.players[1]
    }
}

export function changeCellBg(gridList, index) {
    if (gameState.currentTurn === 'first') {
        if (gameState.players[1].gameboard.grid[index] === null) {
            gridList[index].style.backgroundColor = 'gray'
        } else {
            gridList[index].style.backgroundColor = 'var(--red)'
        }
    } else {
        if (gameState.players[0].gameboard.grid[index] === null) {
            gridList[index].style.backgroundColor = 'gray'
        } else {
            gridList[index].style.backgroundColor = 'var(--red)'
        } 
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
        if (gameState.players[1].isReal) {
            title.textContent = 'First Player Wins!'
        } else {
            title.textContent = 'You Win!'
        }
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
    setTimeout(showDialog, 2000)
}

export function applyIconShadow() {
    const firstIcon = $('.first-icon')
    const secondIcon = $('.second-icon')

    if (gameState.currentTurn === 'first') {
        firstIcon.style.boxShadow = '0px 0px 5px 3px rgb(185, 185, 185)'
        firstIcon.style.border = '3px solid var(--dark-blue)'
        secondIcon.style.border = ''
    } else {
        secondIcon.style.boxShadow = '0px 0px 5px 3px rgb(185, 185, 185)'
        secondIcon.style.border = '3px solid var(--dark-blue)'
        firstIcon.style.border = ''
    }
}

export function displayTitle() {
    const title = $('.title')

    if (gameState.currentTurn === 'first') {
        if (gameState.players[1].isReal) {
            title.textContent = 'First player turn'
        } else {
            title.textContent = 'Your turn'
        }
    } else {
        if (gameState.players[1].isReal) {
            title.textContent = 'Second player turn'
        } else {
            title.textContent = 'Computer turn'
        }
    }
}

export function addPlayerSvgs() {
    const firstIcon = $('.first-icon')
    const secondIcon = $('.second-icon')

    if (gameState.players[1].isReal) {
        firstIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
        <span class="player-name">First Player</span>`
        secondIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
        <span class="player-name">Second Player</span>`
    } else {
        firstIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
        <span class="player-name">You</span>`
        secondIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M10.5 15.5C10.5 15.87 10.4 16.2 10.22 16.5C9.88 15.91 9.24 15.5 8.5 15.5S7.12 15.91 6.78 16.5C6.61 16.2 6.5 15.87 6.5 15.5C6.5 14.4 7.4 13.5 8.5 13.5S10.5 14.4 10.5 15.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16M15.5 13.5C14.4 13.5 13.5 14.4 13.5 15.5C13.5 15.87 13.61 16.2 13.78 16.5C14.12 15.91 14.76 15.5 15.5 15.5S16.88 15.91 17.22 16.5C17.4 16.2 17.5 15.87 17.5 15.5C17.5 14.4 16.61 13.5 15.5 13.5Z" /></svg>
        <span class="player-name">Computer</span>`
    }
}
