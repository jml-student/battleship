import { GameState } from './index.mjs'
import { addDialogListeners, addShipListeners, handleCellClick, handleDragOver, handleDragLeave, handleDrop } from './events.mjs'

function init() {
    showDialog()
    addDialogListeners()
    addShipListeners()
}
init()

export const gameState = new GameState()

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

        firstCell.style.backgroundColor = 'rgb(0, 128, 255)'
        secondCell.style.backgroundColor = 'rgb(0, 128, 255)'

        firstCell.dataset.index = i;
        secondCell.dataset.index = i;

        firstCell.addEventListener('click', () => handleCellClick('second', firstPlayer, i))
        secondCell.addEventListener('click', () => handleCellClick('first', secondPlayer, i))

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

export function displayGrid(firstPlayer, secondPlayer) {
    const firstGridList = $$('.first-grid > div')
    const secondGridList = $$('.second-grid > div')

    const firstGameboard = firstPlayer.gameboard
    const secondGameboard = secondPlayer.gameboard

    firstGameboard.grid.forEach((cell, index) => {
        if (cell !== null) {
            firstGridList[index].style.backgroundColor = 'blue'
        }
    })

    secondGameboard.grid.forEach((cell, index) => {
        if (cell !== null) {
            secondGridList[index].style.backgroundColor = 'blue'
        }
    })
}

export function changeCellBg(gridList, index) {
    if (gridList[index].style.backgroundColor === 'blue') {
        gridList[index].style.backgroundColor = 'red'
    } else if (gridList[index].style.backgroundColor === 'white') {
        gridList[index].style.backgroundColor = 'gray'
    }
}

export function endGame(gameState) {
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
    setTimeout(showDialog, 2000)
}

