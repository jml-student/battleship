import { Ship } from '../src/index'

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

test('Ship is sunks', () => {
    const ship = new Ship(3, 'horizontal')
    ship.hit()
    ship.hit()
    ship.hit()
    ship.isSunk()
    expect(ship.sunk).toBe(true)
})
