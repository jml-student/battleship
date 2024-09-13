import { Player } from '../src/index'
import { setUpEventListeners } from './events'

export function $(el) {
    document.querySelector(el)
}

export function $$(el) {
    document.querySelectorAll(el)
}

export function showDialog() {
    const dialog = $('.choose-vs')
    dialog.showModal()
}

export function closeDialog() {
    const dialog = $('.choose-vs')
    dialog.close()
}

//Init
showDialog()
