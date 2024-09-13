import { GameState } from './index.mjs'
import { addDialogListeners, handleCellClick } from './events.mjs'

function init() {
    showDialog()
    addDialogListeners()
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
    const dialog = $('.choose-vs')
    dialog.showModal()
    dialog.style.display = 'block'
}

export function hideDialog() {
    const dialog = $('.choose-vs')
    dialog.close()
    dialog.style.display = 'none'
}

export function createGrid(firstPlayer, secondPlayer) {
    const firstGrid = $('.first-grid')
    const secondGrid = $('.second-grid')

    for (let i = 0; i < 100; i++) {
        const firstCell = document.createElement('div')
        const secondCell = document.createElement('div')

        firstCell.classList = 'cell'
        secondCell.classList = 'cell'

        firstCell.style.backgroundColor = 'white'
        secondCell.style.backgroundColor = 'white'

        firstCell.dataset.index = i;
        secondCell.dataset.index = i;

        firstCell.addEventListener('click', () => handleCellClick('first', firstPlayer, i))
        secondCell.addEventListener('click', () => handleCellClick('second', secondPlayer, i))

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
