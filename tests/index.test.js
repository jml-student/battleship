/*
    COMMENT THE IMPORT STATEMENTS IN INDEX.JS TO RUN THESE TESTS.
    OTHERWISE THERE WILL BE ENVIROMENT ISSUES.
*/

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
    const player = new Player()
    expect(player.gameboard.grid.length).toBe(100)
    expect(player.gameboard.grid.every((cell) => cell === null)).toBe(true)
    expect(player.gameboard.ships.length).toBe(0)
    expect(player.gameboard.shot.length).toBe(0)
    expect(player.gameboard.missed.length).toBe(0)
    expect(player.gameboard.allSunk).toBe(false)
})

test('PlaceShip works correctly', () => {
    const player = new Player()
    player.gameboard.placeShip(55, 'vertical', 4)
    expect(player.gameboard.ships.length).toBe(1)
})

test('Receive attack works correctly', () => {
    const player = new Player()
    player.gameboard.placeShip(0, 'horizontal', 3)
    player.gameboard.receiveAttack(0)
    player.gameboard.receiveAttack(1)
    player.gameboard.receiveAttack(8)
    expect(player.gameboard.ships.length).toBe(1)
    expect(player.gameboard.grid[0].hits).toBe(2)
    expect(player.gameboard.shot.includes(0)).toBe(true)
    expect(player.gameboard.shot.includes(1)).toBe(true)
    expect(player.gameboard.shot.includes(8)).toBe(true)
    expect(player.gameboard.missed.includes(8)).toBe(true)
})

test('Ship sunks and allSunk works', () => {
    const player = new Player()
    player.gameboard.placeShip(1, 'horizontal', 3)
    player.gameboard.receiveAttack(0)
    player.gameboard.receiveAttack(1)
    player.gameboard.receiveAttack(2)
    console.log(player)
    expect(player.gameboard.ships[0].sunk).toBe(true)
    expect(player.gameboard.allSunk).toBe(true)
})

test('Ship creates correctly', () => {
    const player = new Player()
    player.gameboard.placeShip(0, 'horizontal', 3)
    expect(player.gameboard.ships[0].length).toBe(3)
    expect(player.gameboard.ships[0].direction).toBe('horizontal')
    expect(player.gameboard.ships[0].hits).toBe(0)
    expect(player.gameboard.ships[0].sunk).toBe(false)
})

test('Ship receives hit', () => {
    const player = new Player()
    player.gameboard.placeShip(0, 'horizontal', 3)
    player.gameboard.ships[0].hit()
    expect(player.gameboard.ships[0].hits).toBe(1)
})

test('CheckSunk works', () => {
    const player = new Player()
    player.gameboard.placeShip(0, 'horizontal', 3)
    player.gameboard.ships[0].hit()
    player.gameboard.ships[0].hit()
    player.gameboard.ships[0].hit()
    player.gameboard.ships[0].checkSunk()
    expect(player.gameboard.ships[0].sunk).toBe(true)
})

test('GetCells works', () => {
    let index = 50
    let direction = 'vertical'
    let length = 6
    expect(getCells(index, direction, length)).toEqual([30, 40, 50, 60, 70, 80])
    length--
    expect(expect(getCells(index, direction, length)).toEqual([30, 40, 50, 60, 70]))
    length--
    expect(expect(getCells(index, direction, length)).toEqual([40, 50, 60, 70]))
    length--
    expect(expect(getCells(index, direction, length)).toEqual([40, 50, 60]))
    direction = 'horizontal'
    length = 6
    expect(getCells(index, direction, length)).toEqual([47, 48, 49, 50, 51, 52])
    length--
    expect(getCells(index, direction, length)).toEqual([48, 49, 50, 51, 52])
    length--
    expect(getCells(index, direction, length)).toEqual([48, 49, 50, 51])
    length--
    expect(getCells(index, direction, length)).toEqual([49, 50, 51])
})
