export class Ship {
    constructor(length) {
        this.length = 0
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
        this.grid = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null))
    }
    placeShip(i, j) {}
}

export class Player {}
