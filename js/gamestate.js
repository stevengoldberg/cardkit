// The state of a ccg type card game.

const CARDS = [
  {
    name: "Twobot",
    attack: 2,
    defense: 2,
    cost: 2
  },
  {
    name: "Threebot",
    attack: 3,
    defense: 3,
    cost: 3
  },
  {
    name: "Fourbot",
    attack: 4,
    defense: 4,
    cost: 4
  },
  {
    name: "Fivebot",
    attack: 5,
    defense: 5,
    cost: 5
  },
  {
    name: "Sixbot",
    attack: 6,
    defense: 6,
    cost: 6
  },
  {
    name: "Sevenbot",
    attack: 7,
    defense: 7,
    cost: 7
  },
  {
    name: "Eightbot",
    attack: 8,
    defense: 8,
    cost: 8
  },
]

function randomCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)]
}

// The state of a single player.
class PlayerState {
  constructor(name, goingFirst) {
    this.name = name
    this.hand = [randomCard(), randomCard(), randomCard()]
    this.board = []
    this.life = 30
    this.mana = 0
    this.maxMana = 0
  }

  // Throws if the index is bad
  getHand(index) {
    if (index >= this.hand.length) {
      throw (this.name + "'s hand has no card at index " + index)
    }
    return this.hand[index]
  }

  // Throws if the index is bad
  getBoard(index) {
    if (index >= this.board.length) {
      throw (this.name + "'s board has no card at index " + index)
    }
    return this.board[index]
  }
}

class GameState {
  constructor() {
    // Index of whose turn it is
    this.turn = 0

    this.players = [new PlayerState("Alice", true),
                    new PlayerState("Bob", false)]
  }

  // The player whose turn it is
  current() {
    return this.players[this.turn]
  }

  // The player whose turn it isn't
  opponent() {
    return this.players[1 - this.turn]
  }

  clearDead() {
    for (let player of this.players) {
      player.board = player.board.filter(card => card.defense > 0)
    }
  }

  // from and to are indices into board
  attack(from, to) {
    let attacker = this.current().getBoard(from)
    let defender = this.opponent().getBoard(to)
    attacker.defense -= defender.attack
    defender.defense -= attacker.attack
    clearDead()
  }

  // Plays a card from the hand. For now assumes it's a creature.
  // Throws if there's not enough mana.
  // from is an index of the hand
  play(from) {
    let player = this.current()
    let card = player.getHand(from)
    if (player.mana < card.cost) {
      throw `need ${card.cost} mana but only have ${player.mana}`
    }
    player.board.push(card)
    player.hand.splice(from, 1)
    player.mana -= card.cost
  }

  // Attacks face
  face(from) {
    let attacker = this.current().getBoard(from)
    this.opponent().life -= attacker.attack
  }

  draw() {
    this.current().hand.push(randomCard())
  }

  beginTurn() {
    this.current().maxMana = Math.min(1 + this.current().maxMana, 10)
    this.current().mana = this.current().maxMana()
    this.draw()
  }

  endTurn() {
    this.turn = 1 - this.turn
  }

  log() {
    console.log("It is player " + this.turn + "'s turn")
    console.log(this.players)
  }
}

module.exports = GameState;
