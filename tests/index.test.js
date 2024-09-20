import { GameState, Gameboard, Player, Ship, getCells } from '../src/index.js'

test('GameState creates and works correctly', () => {
    const gameState = new GameState()
    expect(gameState.currentTurn).toBe('first')
    expect(gameState.direction).toBe('vertical')
})

test('Switch turn works correctly', () => {
    const gameState = new GameState()
    gameState.switchTurn()
    expect(gameState.currentTurn).toBe('second')
})

test('Switch direction works correctly', () => {
    const gameState = new GameState()
    gameState.switchDirection()
    expect(gameState.direction).toBe('horizontal')
})

test('Player creates correctly', () => {
    const player = new Player()
    expect(player.gameboard).not.toBe(null)
    expect(player.isReal).toBe(true)
})

test('Gameboard grid creates correctly', () => {
    const gameboard = new Gameboard()
    expect(gameboard.grid.length).toBe(100)
    expect(gameboard.grid.every((cell) => cell === null)).toBe(true)
    expect(gameboard.ships.length).toBe(0)
    expect(gameboard.shot.length).toBe(0)
    expect(gameboard.missed.length).toBe(0)
    expect(gameboard.allSunk).toBe(false)
})

test('PlaceShip works correctly', () => {
    const gameboard = new Gameboard()
    gameboard.placeShip(55, 'vertical', 4)
    expect(gameboard.ships.length).toBe(1)
})

test('Receive attack works correctly', () => {
    const gameboard = new Gameboard()
    gameboard.placeShip(0, 'horizontal', 3)
    gameboard.receiveAttack(0)
    gameboard.receiveAttack(1)
    gameboard.receiveAttack(8)
    expect(gameboard.ships.length).toBe(1)
    expect(gameboard.grid[0].hits).toBe(2)
    expect(gameboard.shot.includes(0)).toBe(true)
    expect(gameboard.shot.includes(1)).toBe(true)
    expect(gameboard.shot.includes(8)).toBe(true)
    expect(gameboard.missed.includes(8)).toBe(true)
})

test('Ship sunks and allSunk works', () => {
    const gameboard = new Gameboard()
    gameboard.placeShip(0, 'horizontal', 3)
    gameboard.receiveAttack(0)
    gameboard.receiveAttack(1)
    gameboard.receiveAttack(2)
    expect(gameboard.grid[0].sunk).toBe(true)
    expect(gameboard.allSunk).toBe(true)
})

test('Ship creates correctly', () => {
    const ship = new Ship(3, 'horizontal')
    expect(ship.length).toBe(3)
    expect(ship.direction).toBe('horizontal')
    expect(ship.hits).toBe(0)
    expect(ship.sunk).toBe(false)
})

test('Ship receives hit', () => {
    const ship = new Ship()
    ship.hit()
    expect(ship.hits).toBe(1)
})

test('CheckSunk works', () => {
    const ship = new Ship(3, 'horizontal')
    ship.hit()
    ship.hit()
    ship.hit()
    ship.isSunk()
    expect(ship.sunk).toBe(true)
})

test('GetCells works', () => {
    let index = 50
    let direction = 'vertical'
    let length = 6
    expect(getCells(index, direction, length)).toBe([30, 40, 50, 60, 70, 80])
    length--
    expect(expect(getCells(index, direction, length)).toBe([30, 40, 50, 60, 70]))
    length--
    expect(expect(getCells(index, direction, length)).toBe([40, 50, 60, 70]))
    length--
    expect(expect(getCells(index, direction, length)).toBe([40, 50, 60]))
    direction = 'horizontal'
    length = 6
    expect(getCells(index, direction, length)).toBe([47, 48, 49, 50, 51, 52])
    length--
    expect(getCells(index, direction, length)).toBe([48, 49, 50, 51, 52])
    length--
    expect(getCells(index, direction, length)).toBe([48, 49, 50, 51])
    length--
    expect(getCells(index, direction, length)).toBe([49, 50, 51])
})
