import { changeCellBg, gameState } from "./dom.js"
import { draggedElement } from "./events.js"

export class GameState {
    constructor() {
        this.players = []
        this.currentTurn = 'first'
        this.direction = 'vertical'
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'first' ? 'second' : 'first'
    }

    switchDirection() {
        this.direction = this.direction === 'vertical' ? 'horizontal' : 'vertical'
    }
}

export class Player {
    constructor() {
        this.gameboard = new Gameboard()
        this.isReal = true
    }
}

class Gameboard {
    constructor() {
        this.grid = Array(100).fill(null)
        this.ships = []
        this.shot = []
        this.missed = []
        this.allSunk = false
    }

    placeShip(index, direction, length) {
        const ship = new Ship(length, direction)
        this.ships.push(ship)

        let cells = getCells(index, direction, length)

        cells.forEach((cell) => {
            this.grid[cell] = index
        })
    
        this.grid[index] = ship
    }

    receiveAttack(index) {
        let ship
        
        if (!this.shot.includes(index)) {
            this.shot.push(index)
        }

        if (this.grid[index] !== null) {
            if (typeof this.grid[index] === 'number') {
                ship = this.grid[this.grid[index]]
            } else {
                ship = this.grid[index]
            }
            ship.hit()
            ship.checkSunk()
        } else if (this.grid[index] === null) {
            this.missed.push(index)
        }
        this.checkAllSunk()
    }

    checkAllSunk() {
        let bool = true
        if (this.ships.length > 0) {
            this.ships.forEach((ship) => {
                if (!ship.sunk) {
                    bool = false
                }
            })
        }
        
        if (bool) {
            this.allSunk = true
        }
    }
}

class Ship {
    constructor(length, direction) {
        this.length = length
        this.direction = direction
        this.hits = 0
        this.sunk = false
    }

    hit() {
        this.hits = this.hits + 1
    }

    checkSunk() {
        if (this.length === this.hits) {
            this.sunk = true
        }
    }
}

export function getLength() {
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

export function getCells(index, direction, length){
    if (direction === 'vertical') {
        if (length === 6) {
            return [index - 20, index - 10, index, index + 10, index + 20, index + 30]
        } else if (length === 5) {
            return [index - 20, index - 10, index, index + 10, index + 20]
        } else if (length === 4) {
            return [index - 10, index, index + 10, index + 20]
        } else if (length === 3) {
            return [index - 10, index, index + 10]
        }
    } else if (direction === 'horizontal') {
        if (length === 6) {
            return [index - 3, index - 2, index - 1, index, index + 1, index + 2]
        } else if (length === 5) {
            return [index - 2, index - 1, index, index + 1, index + 2]
        } else if (length === 4) {
            return [index - 2, index - 1, index , index + 1]
        } else if (length === 3) {
            return [index - 1, index, index + 1]
        }
    }
}

export function computerPlay(gridList) {
    let randomIndex
    const playerHits = gameState.players[0].gameboard.shot.length - gameState.players[0].gameboard.missed.length
    const computerHits = gameState.players[1].gameboard.shot.length - gameState.players[1].gameboard.missed.length

    if (playerHits + 1 >= computerHits) {
        do {
            randomIndex = Math.floor(Math.random() * 100);
        } while (gameState.players[0].gameboard.shot.includes(randomIndex))
    } else {
        const shipCells = []

        for (let i = 0; i < gameState.players[0].gameboard.grid.length; i++) {
            if (gameState.players[0].gameboard.grid[i] !== null) {
                shipCells.push(i)
            }
        }

        let randomNum = Math.floor(Math.random() * shipCells.length)
        randomIndex = shipCells[randomNum]
    }

    gameState.players[0].gameboard.receiveAttack(randomIndex)
    changeCellBg(gridList, randomIndex)
}

export function placeComputerShips() {
    let length = 6
    while (gameState.players[1].gameboard.ships.length < 4) {
        let randomIndex = Math.floor(Math.random() * 100)
        let randomDirection = Math.random() < 0.5 ? 'vertical' : 'horizontal'
        let cellsIndex = getCells(randomIndex, randomDirection, length)
        let invalidIndex = false

        const findInvalids = cellsIndex.some(cell => cell < 0 || cell > 99 || gameState.players[1].gameboard.grid[cell] !== null)

        for (let i = 0; i < cellsIndex.length - 1; i++) {
            let current = cellsIndex[i]
            let next = cellsIndex[i + 1]
            if (current % 10 === 9 && next % 10 === 0) {
                invalidIndex = true
                break
            }
        }

        if (invalidIndex || findInvalids) {
            continue
        } else {
            gameState.players[1].gameboard.placeShip(randomIndex, randomDirection, length)
            length = length - 1
        }
    }
}
