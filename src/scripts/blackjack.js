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
    name: 'Jugador 1',
    score: 0,
    domScore: () => $({ selector: '[data-player="player"] [data-score]' }),
    domCards: () => $({ selector: '[data-player="player"] [data-cards]' }),
    match: {
      win: 0,
      loss: 0,
    }
  },
  [LABEL_CPU]: {
    name: 'Computadora',
    score: 0,
    domScore: () => $({ selector: '[data-player="cpu"] [data-score]' }),
    domCards: () => $({ selector: '[data-player="cpu"] [data-cards]' }),
    match: {
      win: 0,
      loss: 0,
    }
  }
}

const templateItemCard = ({ selectedCard }) => {
  return (`
    <li class="first-of-type:ml-0 -ml-20" >
      <figure class="max-w-[160px]">
        <img src="./cards/${selectedCard}.png" alt="Card with value ${selectedCard}" />
      </figure>
    </li>
  `)
}

const BTN_NEW_GAME = $({ selector: '#btn-new-game' })
const BTN_REQUEST_GAME = $({ selector: '#btn-request-card' })
const BTN_STOP_GAME = $({ selector: '#btn-stop-game' })

function actionsShift ({ turn }) {
  const selectedCard = requestCard()
  const player = PLAYERS[turn]
  const { score } = player

  const newScore = score + cardValue({ selectedCard })
  updatedScore({ player, newScore })
  addCardInBoard({ player, selectedCard })
}

function cpuShift ({ scoreCompare }) {
  const playerCompare = PLAYERS[scoreCompare]
  const { score: scoreCurrentCompare } = playerCompare

  const playerCPU = PLAYERS[LABEL_CPU]
  const { score: scoreCPU } = PLAYERS[LABEL_CPU]

  const selectedCard = requestCard()
  if (!selectedCard) return

  const valueCard = cardValue({ selectedCard })
  const newScoreCPU = scoreCPU + valueCard

  if ((newScoreCPU >= scoreCurrentCompare)) return

  updatedScore({ player: playerCPU, newScore: newScoreCPU })
  addCardInBoard({ player: playerCPU, selectedCard })

  /**
   * ejecucion de una unica vez de cpu cuando jugador pierde
  */
  if (scoreCurrentCompare >= 21) return

  cpuShift({ scoreCompare })
}

function gameValidations ({ turn }) {
  const currentPlayer = PLAYERS[turn]
  const { name, score, match } = currentPlayer

  if (score > 21) {
    console.warn(`Has perdido ${name}`);
    BTN_REQUEST_GAME.disabled = true

    const newLoss = match.loss + 1
    match.loss = newLoss

    return newLoss
  }

  if (score === 21) {
    console.warn(`Has echo 21 ${name}`);
    BTN_REQUEST_GAME.disabled = true

    const newWin = match.win + 1
    match.win = newWin

    return newWin
  }

  return false
}

function updatedScore ({ player, newScore }) {
  const newDOMScore = player?.domScore()
  newDOMScore.innerText = newScore
  player.score = newScore

  // console.log(player);
}

function addCardInBoard ({ player, selectedCard }) {
  const newTemplate = templateItemCard({ selectedCard })
  const currentCards = player?.domCards()

  if (currentCards === null) {
    throw new Error('No fue posible encontrar donde renderizar la carta. Verifique que esten los siguientes selectores "[data-player="PLAYER_NAME"] [data-cards]"')
    return
  }

  currentCards.insertAdjacentHTML('beforeend', newTemplate)
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
  if (currentDeck.length === 0) return false

  return currentDeck.shift()
}

function cardValue ({ selectedCard }) {
  if (!selectedCard) return false

  const value = selectedCard.substring(0, selectedCard.length - 1)
  return CARD_VALUES[value]
}

// createDeck()
// requestCard()
// cardValue({ card: 'AD' })

// Events
BTN_REQUEST_GAME.addEventListener('click', () => {
  actionsShift({ turn: LABEL_PLAYER })
  const finishTurn = gameValidations({ turn: LABEL_PLAYER })

  console.log(finishTurn);

  if (finishTurn) cpuShift({ scoreCompare: LABEL_PLAYER, stopGame: true })
})

BTN_STOP_GAME.addEventListener('click', () => {
  cpuShift({ scoreCompare: LABEL_PLAYER })

  BTN_REQUEST_GAME.disabled = true
  BTN_STOP_GAME.disabled = true
})

createDeck()