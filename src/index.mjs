export class Ship {
    constructor(length, direction) {
        this.length = length
        this.direction = direction
        this.hits = 0
        this.sunk = false
    }

    hit() {
        this.hits = this.hits + 1
    }

    isSunk() {
        if (this.length === this.hits) {
            this.sunk = true
        }
    }
}

export class Gameboard {
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

    receiveAttack(letter, number) {
        let ship
        const index = getIndex(letter, number)
        if (this.shot.includes(index)) {
            return
        } else {
            this.shot.push(index)
        }
        if (this.grid[index] !== null) {
            if (typeof this.grid[index] === 'number') {
                ship = this.grid[this.grid[index]]
            } else {
                ship = this.grid[index]
            }
            ship.hit()
            ship.isSunk()
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

export class Player {
    constructor() {
        this.gameboard = new Gameboard()
        this.isReal = true
    }
}

export function getIndex(letter, number) {
    const rowIndex = letter.charCodeAt(0) - 'A'.charCodeAt(0)
    const columnIndex = number - 1
    const index = rowIndex * 10 + columnIndex
    return index
}
