import { changeCellBg } from "./dom.mjs"
import { getCellsIndex } from "./events.mjs"

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
        let cells = getCellsIndex(index)
        cells.forEach((cell) => {
            this.grid[cell] = index
        })
        this.grid[index] = ship
    }

    receiveAttack(arg1, arg2 = null) {
        let ship
        let index
        
        if (arg2 === null) {
            index = arg1
        } else {
            index = getIndex(arg1, arg2)
        }
        
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

export function computerPlay(gameState, gridList) {
    let randomIndex
    do {
        randomIndex = Math.floor(Math.random() * 100);
    } while (gameState.players[0].gameboard.shot.includes(randomIndex));

    gameState.players[0].gameboard.receiveAttack(randomIndex)
    changeCellBg(gridList, randomIndex)
    gameState.switchTurn()
}

function getIndex(letter, number) {
    const rowIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0)
    const columnIndex = number - 1
    const index = rowIndex * 10 + columnIndex
    return index
}
