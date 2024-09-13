import { setUpListeners } from './events.mjs'

(function init() {
    showDialog()
    setUpListeners()
})()

export function $(el) {
    return document.querySelector(el)
}

export function $$(el) {
    return document.querySelectorAll(el)
}

export function showDialog() {
    const dialog = $('.choose-vs')
    dialog.showModal()
}

export function closeDialog() {
    const dialog = $('.choose-vs')
    dialog.close()
}

export function createGrid() {
    const firstGrid = $('.first-grid')
    const secondGrid = $('.second-grid')

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div')
        cell.classList = 'cell'
        firstGrid.appendChild(cell)
        secondGrid.appendChild(cell)
    }
}

export function displayGrid(firstPlayer, secondPlayer) {
    const firstPlayer = firstPlayer
    const secondPlayer = secondPlayer

    const firstGridList = $$('.first-grid > div')
    const secondGridList = $$('.second-grid > div')

    firstPlayer.gameboard.grid.forEach((cell, index) => {
        if (cell !== null) {
            firstGridList[index].style.backGroundColor = 'blue'
        }
    })

    secondPlayer.gameboard.grid.forEach((cell, index) => {
        if (cell !== null) {
            secondGridList[index].style.backGroundColor = 'blue'
        }
    })
}

//temporal function to display some ships 
export function createDefaultShips(firstPlayer, secondPlayer) {
    firstPlayer.gameboard.placeShip('A', 1, 'vertical', 3)
    firstPlayer.gameboard.placeShip('E', 1, 'horizontal', 5)
    secondPlayer.gameboard.placeShip('A', 3, 'vertical', 3)
    secondPlayer.gameboard.placeShip('G', 1, 'horizontal', 5)

    displayGrid(firstPlayer, secondPlayer)
}
