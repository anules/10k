#!/usr/bin/env node


var TenThousand = function(playerCount) {
  var lodash = require('lodash');
  var readlineSync = require('readline-sync');
  // var currentPlayer
  var currentTurn;
  var input = ['roll', 'bank', 'keep[x]', 'quit'];

  var init = function(playerCount) {
    this.players = [];
    for(i=0;i<playerCount;i++) {
      playerName = readlineSync.question('PLAYER ' + (i+1) +':');
      player = new Player(playerName);
      this.players[i] = player;
    }
    nameComparison = lodash.pluck(lodash.sortBy(this.players, 'name'), 'name');
    function hasDuplicates(array) {
      var valuesSoFar = Object.create(null);
      for (var i = 0; i < array.length; ++i) {
        var value = array[i];
        if (value in valuesSoFar) {
           return true;
        }
        valuesSoFar[value] = true;
      }
      return false;
    }

    if (hasDuplicates(nameComparison) === true){
      process.stdout.write("You must have unique names. \n");
      init(playerCount);
    }

  };


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

    var availableDice = []
    var currentRollScore = null
    this.refill = function() {
      for (i=0; i<6; i++) {
        availableDice.push(new Die(6))
      }
    }

    this.roll = function() {
      currentRollScore = null
      if(availableDice.length == 0) { this.refill() }
      lodash.forEach(availableDice, function(die) { die.roll() })

      currentRollScore = new Score(availableDice.map(function(die) { return die.value }))
      currentRollScore.calculate()
    }

    this.show = function() {
      lodash.forEach(availableDice, function(die) {
        console.log(die)
        process.stdout.write(die.value.toString())
      })
    }

    this.isBust = function() {
      if(currentRollScore == null) {
        // wtf, man
        throw('WTF')
      } else if(currentRollScore.possibilities.length == 1) {
        return true
      } else {
        return false
      }
    }

    this.remainingDice = function() {
      availableDice.length
    }

    // todo: figure out what we need to ask to keep
    this.keep = function(values) {
      // set aside the selected dice
      // add their point value to the total
      console.log('you kept these dice!');
    }
  }

  // @param dice [Array<Integer>]
  var Score = function(dice) {

    // [{score: 0, remains: '123456'}]
    this.possibilities = [{score: 0, remains: lodash.sortBy(dice).join('')}]

    this.attempt = function(dieset, score) { // e.g., attempt('111', 1000)
      // we will split the possibilities if we find a match.
      lodash.forEach(this.possibilities, function(possibility) {

        while(lodash.contains(possibility.remains, dieset)) {

          console.log('ok, we have something')
          console.log(dieset)
          console.log(possibility)

          // SWEET, it's a scoring combination!
          var newPossibility = {score: possibility.score + score, remains: possibility.remains.replace(dieset,'')}

          console.log('newPossibility')
          console.log(newPossibility)
          // push that sucker on for nex time,
          // and then try again with it (see if this rule matches again)
          this.possibilities.push(newPossibility)
          possibility = newPossibility
        }
      }, this)
    }

    this.calculate = function() {
      this.attempt('123456', 1500)

      this.attempt('112233', 750)
      this.attempt('112244', 750)
      this.attempt('112255', 750)
      this.attempt('112266', 750)
      this.attempt('113344', 750)
      this.attempt('113355', 750)
      this.attempt('113366', 750)
      this.attempt('114455', 750)
      this.attempt('114466', 750)
      this.attempt('224466', 750)
      this.attempt('334466', 750)

      this.attempt('111',   1000)
      this.attempt('1111',  2000)
      this.attempt('11111', 4000)
      this.attempt('111111',8000)
      this.attempt('222',    200)
      this.attempt('2222',   400)
      this.attempt('22222',  800)
      this.attempt('222222',1600)
      this.attempt('333',    300)
      this.attempt('3333',   600)
      this.attempt('33333', 1200)
      this.attempt('333333',2400)
      this.attempt('444',    400)
      this.attempt('4444',   800)
      this.attempt('44444', 1600)
      this.attempt('444444',3200)
      this.attempt('555',    500)
      this.attempt('5555',  1000)
      this.attempt('55555', 2000)
      this.attempt('555555',4000)
      this.attempt('666',    600)
      this.attempt('6666',  1200)
      this.attempt('66666', 2400)
      this.attempt('666666',4800)

      this.attempt('1',      100)
      this.attempt('11',     200)

      this.attempt('5',       50)
      this.attempt('55',     100)
    }
  }

  var Roll = function(dice) {
    function attempt(combo) {

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
  var pass = function() {
    this.players.push(this.players.shift());
  }

  var currentPlayer = function() {
    return this.players[0]
  }


  this.step = function() {
    console.log('starting step')
    process.stdout.write('What would you like to do?\n' + input + '\n');

    var options = {
      quit: function(){ return process.exit(); },
      roll: function(){
        if(currentTurn == null || currentTurn.player != currentPlayer()){
          currentTurn = new Turn(currentPlayer())
        }
        currentTurn.roll();  // TODO
        // OUTPUT SCORE


        if(currentTurn.isBust()) {
          process.stdout.write("OH NOES. YOU BUSTED.\n")
          console.log(this)
          pass();
        } else {
          process.stdout.write("SWEET, the possibilities are:")
          currentTurn.show();
          // prompt for keeping, show combos in select box
        }
      // keep: function() {
      //   if()
      //   }
      }
    }

    // players who are "on the board" can carry forward the
    // score of the previous player's turn by rolling the
    // remaining dice
    if(currentTurn && !currentTurn.isBust() && currentPlayer().score() > 0 && currentTurn.remainingDice > 0){
      options['take'] = function(){
        currentTurn.player = currentPlayer()
        return this.roll();
      }
    }

    // once a turn reaches the player's minimum score, the
    // player can choose to end her turn by banking the score
    if(currentTurn && currentTurn.score >= currentPlayer().minimumScore) {
      options['bank'] = function(){
        currentPlayer().bankScore(currentTurn.score)
        pass();
      }
    }

    options['help'] = function() {
      process.stdout.write("AVAILABLE COMMANDS: " + lodash.keys(options).join() + '\n')
    }

    readlineSync.promptCL(options)
  }

  this.play = function() {
    console.log('starting play')
    while(this.isPlayable()) { this.step() }
    this.showScore()
  }

  this.showScore = function(out) {

    out = out || process.stdout

    // operate on a copy of this.players, since Array.prototype.sort()
    // sorts the array in place, and we don't want to mess up turn order.
    players = players.slice(0)
    players.sort(function(a,b){
      return b.score() - a.score()
    })

    out.write('=== SCOREBOARD ===\n')
    // output one per line
    for(i=0;i<players.length; i++) {
      // player = players[i]

      out.write('SCORE: ' +player.score() + '\t' + 'PLAYER: ' + players[i].name +'\n')
    }
  }

  this.isPlayable = function() {
    return true
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
