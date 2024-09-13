import { Player } from './index.mjs'
import { $, closeDialog, createGrid, createDefaultShips, displayGrid } from './dom.mjs'

export function setUpListeners() {
    const playerVsPlayer = $('.player-vs-player')
    const playerVsComputer = $('.player-vs-computer')

    playerVsPlayer.addEventListener('click', () => {
        const firstPlayer = new Player()
        const secondPlayer = new Player()
        closeDialog()
        createGrid()
        createDefaultShips(firstPlayer, secondPlayer)
        displayGrid(firstPlayer, secondPlayer)
    })

    playerVsComputer.addEventListener('click', () => {
        const player = new Player()
        const computer = new Player()
        computer.isReal = false
        closeDialog()
        createGrid()
        createDefaultShips(player, computer)
        displayGrid(player, computer)
    })
}
