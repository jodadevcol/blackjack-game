import { LABEL_CPU, LABEL_PLAYER } from "../const/const"
import { $ } from "./helpers/dom"

const BLACKJACK_OBJ = {
  deck: [],
  suits: ['C', 'D', 'H', 'S'],
  ranks: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
}

const CARD_VALUES = {
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  'J': 10,
  'Q': 10,
  'K': 10,
  'A': 11
}

const PLAYERS = {
  [LABEL_PLAYER]: {
    score: 0,
    domScore: () => $({ selector: '[data-player="player"] [data-score]' })
  },
  [LABEL_CPU]: {
    score: 0,
    domScore: () => $({ selector: '[data-player="cpu"] [data-score]' })
  }
}

const BTN_NEW_GAME = $({ selector: '#btn-new-game' })
const BTN_REQUEST_GAME = $({ selector: '#btn-request-card' })
const BTN_STOP_GAME = $({ selector: '#btn-stop-game' })

function shiftActions ({ turn }) {
  const selectedCard = requestCard()
  const { score } = PLAYERS[turn]
  const newScore = score + cardValue({ selectedCard })
  updatedScore({ player: PLAYERS[turn], newScore })
}

function updatedScore ({ player, newScore }) {
  const newDOMScore = player?.domScore()
  newDOMScore.innerText = newScore
  player.score = newScore
}

function createDeck () {
  const { deck, suits, ranks } = BLACKJACK_OBJ

  suits.map(suit => {
    ranks.map(rank => {
      deck.push(`${rank}${suit}`)
    })
  })

  deck.sort((a, b) => 0.5 - Math.random())
}

function requestCard () {
  const currentDeck = BLACKJACK_OBJ.deck
  if (currentDeck.length === 0) return

  const firstCard = currentDeck.shift()
  return firstCard
}

function cardValue ({ selectedCard }) {
  const value = selectedCard.substring(0, selectedCard.length - 1)
  return CARD_VALUES[value]
}

// createDeck()
// requestCard()
// cardValue({ card: 'AD' })

// Events
BTN_REQUEST_GAME.addEventListener('click', () => {
  shiftActions({ turn: LABEL_PLAYER })
})

createDeck()