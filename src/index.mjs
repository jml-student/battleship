import { changeCellBg } from "./dom.mjs"

export class GameState {
    constructor() {
        this.players = []
        this.currentTurn = 'second'
    }

    switchTurn() {
        this.currentTurn = this.currentTurn === 'first' ? 'second' : 'first'
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

    placeShip(letter, number, direction, length) {
        const ship = new Ship(length, direction)
        this.ships.push(ship)
        const index = getIndex(letter, number)
        this.grid[index] = ship
        if (direction === 'horizontal') {
            for (let i = 1; i < length; i++) {
                this.grid[index + i] = index
            }
        } else if (direction === 'vertical') {
            for (let i = 1; i < length; i++) {
                this.grid[index + i * 10] = index
            }
        }
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
        this.ships.forEach((ship) => {
            if (!ship.sunk) {
                return
            }
        })
        this.allSunk = true
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
