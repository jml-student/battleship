import { Gameboard, getIndex } from '../src/index'

test('Gameboard grid creates correctly', () => {
    const gameboard = new Gameboard()
    expect(gameboard.grid.length).toBe(100)
    expect(gameboard.grid.every((cell) => cell === null)).toBe(true)
})

test('getIndex return correct index', () => {
    const index1 = getIndex('A', 1)
    const index2 = getIndex('J', 1)
    const index3 = getIndex('J', 10)
    expect(index1).toBe(0)
    expect(index2).toBe(9)
    expect(index3).toBe(99)
})

test('PlaceShip works correctly', () => {
    const gameboard = new Gameboard()
    gameboard.placeShip('A', 1, 'horizontal', 3)
    gameboard.placeShip('J', 1, 'horizontal', 4)
    expect(gameboard.grid[getIndex('A', 1)]).not.toBe(null)
    expect(gameboard.grid[getIndex('J', 1)]).not.toBe(null)
    expect(gameboard.grid[getIndex('A', 1) + 1]).toBe(getIndex('A', 1))
    expect(gameboard.grid[getIndex('A', 1) + 2]).toBe(getIndex('A', 1))
    expect(gameboard.grid[getIndex('J', 1) + 1]).toBe(getIndex('J', 1))
    expect(gameboard.grid[getIndex('J', 1) + 2]).toBe(getIndex('J', 1))
    expect(gameboard.grid[getIndex('J', 1) + 3]).toBe(getIndex('J', 1))
})

test('Receive attack works correctly', () => {
    const gameboard = new Gameboard()
    gameboard.placeShip('A', 1, 'horizontal', 3)
    gameboard.receiveAttack('A', 1)
    gameboard.receiveAttack('B', 1)
    expect(gameboard.grid[0].hits).toBe(2)
})
