#!/usr/bin/env node

var TenThousand = function(playerCount) {
  var readlineSync = require('readline-sync');
  var currentPlayer, currentTurn

  var init = function(playerCount) {
    this.players = [];
    for(i=0;i<playerCount;i++) {
      var playerName = readlineSync.question('PLAYER ' + (i+1) +':')
      player = new Player(playerName)
      this.players[i] = player
    }

  }

  var Die = function(requested_sides) {
    this.sides = requested_sides || 6
    this.roll = function() {
      this.value = Math.floor(Math.random() * this.sides) + 1
      return this.value
    }

    // initialize with an arbitrary value
    this.roll();
  }

  var Turn = function(player) {
    // setup the turn
    this.score = 0;
    this.player = player;

    var cachedCombos = []
    var availableDice = []
    var selectedDice = []
    for (i=0; i<6; i++) {
      availableDice.push(new Die(6))
    }

    this.isBust = function() {

    }

    this.remainingDice = function() {
      availableDice.length
    }

    // todo: figure out what we need to ask to keep
    this.keep = function(values) {
      // set aside the selected dice
      // add their point value to the total
    }

    // returns an array of possible scoring combinations and dice
    // to be kept, e.g., when [1,3,4,3,3,1] is passed in:
    // [
    //   {score: 500, dice: [1,1,3,3,3]},
    //   {score: 200, dice: [1,1]},
    //   {score: 300, dice: [3,3,3]},
    //   {score: 100, dice: [1]}
    // ]
    this.calculateCombos = function(diceValues, score) {
      return [] if dice.length == 0

      score = score || 0
      dice.sort(function(a,b){ a - b })

      if(dice==[1,2,3,4,5,6]) {
        return [{score: 1500, dice: dice}]
      } else {
        counts = {}
        dice.map(function(x) {counts[x] = (counts[x] || 0) + 1})

        if(Object.keys(counts).length == 3 && Object.keys(counts).map(function(k){counts[k]} == [2,2,2]) {
          return [{score: 1500, dice: dice}]
        } else {

          value = []
          if
          // if any number has more than 3 of a kind, keep or don't.
          // what is the value from keeping it? what dice remain, and what could they do?

          // what is the value from not keeping it? what dice remain?

        }
      }
      // 1,2,3,4,5,6 => 1500
      // 3 distinct pairs => 750
      // 3 * 1 => 1000
      // 3 * n => n * 100
      // 4 * n => (2 * n * 100)
      // x * n => ([3-x] * n * 100)
      // 1 => 100
      // 5 => 50
    }

    this.calc = function(diceValues) {
      diceValues.sort(function(a,b){ a - b })
      if(diceValues == [1,2,3,4,5,6]) {

      }
    }





    this.roll = function() {
      cachedCombos = []
      console.log(availableDice)
      for(i=0;i<availableDice.length; i++) {
        availableDice[i].roll();
      }
    }
  }

  var Roll = function(dice) {
    values = []
    for(i=0;i<dice.length;i++) {

    }
  }

  var Player = function(name) {
    this.name = name;

    var score = 0;

    this.score = function() { return score };
    this.bankScore = function(points) { score = score + points; };
  }

  // private:
  // passes play to next player
  // called by `bank` and in `roll` upon a bust
  this.pass = function() {
    this.players.push(this.players.shift());
    currentPlayer = this.players[0]
  }

  // BANK:
  // add the score and pass
  this.bank = function() {
  }

  this.roll = function() {
    if(currentTurn == null || currentTurn.player != currentPlayer){
      currentTurn = new Turn(currentPlayer)
    }
    currentTurn.roll();

    if(currentTurn.isBust()) {
      process.stdout.write("OH NOES. YOU BUSTED.\n")
      this.pass();
    } else {
      // prompt for keeping, show combos in select box
    }
  }

  this.take = function() {
  }

  this.step = function() {
    options = {
      quit: function(){ return process.exit(); },
      roll: function(){
        if(currentTurn == null || currentTurn.player != currentPlayer){
          currentTurn = new Turn(currentPlayer)
        }
        currentTurn.roll();
        // OUTPUT SCORE


        if(currentTurn.isBust()) {
          process.stdout.write("OH NOES. YOU BUSTED.\n")
          this.pass();
        } else {
          // prompt for keeping, show combos in select box
        }
      }
    }

    // players who are "on the board" can carry forward the
    // score of the previous player's turn by rolling the
    // remaining dice
    if(!currentTurn.isBust() && currentPlayer.score() > 0 && currentTurn.remainingDice > 0){
      options['take'] = function(){
        currentTurn.player = currentPlayer
        return this.roll();
      }
    }

    // once a turn reaches the player's minimum score, the
    // player can choose to end her turn by banking the score
    if(currentTurn.score >= currentPlayer.minimumScore) {
      options['bank'] = function(){
        currentPlayer.bankScore(currentTurn.score)
        this.pass();
      }
    }

    readlineSync.promptCL(options)
  }

  this.play = function() {
    while(this.isPlayable()) { this.step }
  }

  this.showScore = function(out) {
    out = out || process.stdout

    // operate on a copy of this.players, since Array.prototype.sort()
    // sorts the array in place, and we don't want to mess up turn order.
    players = this.players.slice(0)
    players.sort(function(a,b){
      return b.score() - a.score()
    })

    out.write('=== SCOREBOARD ===\n')
    // output one per line
    for(i=0;i<players.length; i++) {
      player = players[i]

      out.write('SCORE: ' +player.score() + '\t' + 'PLAYER: ' +player.name +'\n')
    }
  }

  this.isPlayable = function() {
    return false
    // if any player has exactly 10k, end now
    // else if endgame is in effect, and all players have played, end now
    // else if any player has greater than 10k, start endgame
    // else, keep going
  }

  init.bind(this)(playerCount)
}

console.log('This process is pid ' + process.pid);

tenk = new TenThousand(2);
tenk.showScore();
tenk.play();
