import { Player } from '../src/index'

test('Player creates correctly', () => {
    const player = new Player()
    expect(player.gameboard).not.toBe(null)
    expect(player.isReal).toBe(true)
})
