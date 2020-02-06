
var currentRow = 5;
var currentCol = 4;

var audio;
var hitAudio;
var missAudio;
var sunkAudio;
var missionCompleteAudio;

var opShipsHit = 0;
var opMaxSquares = 49;


let model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    
   
// add start over option at end of game


    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);


            if (ship.hits[index] === "hit") {
                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                missAudio.pause();
                hitAudio.currentTime = 0;
                hitAudio.play();
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!");
                
                

                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
//                    say("You sunk my battleship!");
                    missAudio.pause();
//                    hitAudio.pause();
                    sunkAudio.currentTime = 0;
                    sunkAudio.play();
                    this.shipsSunk++;
                }
                return true;
            }
        }
        // if miss it
        hitAudio.pause();
        missAudio.currentTime = 0;
        missAudio.play();
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },

    isSunk: function(ship) {
        for (let i = 0; i < this.shipLength; i++)  {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function() {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
    },

    generateShip: function() {
        let direction = Math.floor(Math.random() * 2);
        let row, col;

        if (direction === 1) { // horizontal
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else { // vertical
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            col = Math.floor(Math.random() * this.boardSize);
        }

        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collision: function(locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }

};


let view = {
    displayMessage: function(msg) {
        let messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
//        cell.setAttribute("div");
        
        cell.setAttribute("class", "hit");
//        say("Hit!");
    },
 
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
//        say("Miss!");
    }

};

let controller = {
    guesses: 0,

//    processGuess: function(guess) {
//        let location = parseGuess(guess);
//        if (location) {
//            this.guesses++;
//            let hit = model.fire(location);
//            if (hit && model.shipsSunk === model.numShips) {
//                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
//            }
//        }
//    },
    
    processGuessBlind: function(guess) {
        this.guesses++;
        let hit = model.fire(guess);
        
        if (hit && model.shipsSunk == model.numShips) {
            view.displayMessage("You sank all my battleships in " + this.guesses + " guesses");
            hitAudio.pause();
            missAudio.pause();
            sunkAudio.pause();
            missionCompleteAudio.play();
//            say("Congratulations, you sunk all my battleships!");
        }
        
        // 2 second delay
        var delayInMilliseconds = 2000; //2 second

        setTimeout(function() {
            //your code to be executed after 1 second
            talk("opponent's turn.");
            opponentsTurn();
        }, delayInMilliseconds);
//        talk("opponent's turn.");
//        opponentsTurn();
        // say it is now your opponents turn
        // hit enter to continue
//        talk("Opponent's turn");
//        
//        opponentsTurn();
    }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function opponentsTurn() {
    var oGuess = Math.floor(getRandomArbitrary(1, 5));
    opMaxSquares = opMaxSquares - 10;
    var missed = true;
    
    // say opponents turn
    
    if (oGuess == 4) {
        opShipsHit = opShipsHit + 1;
        // make noise
//        missAudio.pause();
//        sunkAudio.pause();
//        hitAudio.pause();
        hitAudio.currentTime = 0;
        hitAudio.play();
        missed = false;
       
    } else {
        // make miss noise
//        sunkAudio.pause();
//        hitAudio.pause();
//        missAudio.pause();
        missAudio.currentTime = 0;
        missAudio.play();
    }
    
    if (opShipsHit == 9) {
        //opponent wins and game is over
        // say opponent wins, game over
        talk("Opponent has sunk your last ship. Game Over.")
//         gameOver();
    }
    
    if (missed) {
        talk("Opponent has missed. Make your next move now.");
    } else {
        talk("Opponent has hit your ship. Time to retaliate..")
    }
    // say hit enter to continue to your turn
    
    return;
}


// helper function to parse a guess from the user

//function parseGuess(guess) {
//    let alphabet = ["A", "B", "C", "D", "E", "F", "G"];
//
//    if (guess === null || guess.length !== 2) {
//        alert("Oops, please enter a letter and a number on the board.");
//    } else {
//        let firstChar = guess.charAt(0);
//        let row = alphabet.indexOf(firstChar);
//        let column = guess.charAt(1);
//
//        if (isNaN(row) || isNaN(column)) {
//            alert("Oops, that isn't on the board.");
//        } else if (row < 0 || row >= model.boardSize ||
//            column < 0 || column >= model.boardSize) {
//            alert("Oops, that's off the board!");
//        } else {
//            return row + column;
//        }
//    }
//    return null;
//}

function gameOver() {
    
}

// event handlers

function updateHighlight() {
    var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
    cell.setAttribute("style", "border: 1.5px solid yellow;");
    return;
}

// for some reason need to keep this to see original highlighted square (idk why)
//function handleFireButton() {
//    let guessInput = document.getElementById("guessInput");
//    let guess = guessInput.value.toUpperCase();
//
//    controller.processGuess(guess);
//
//    guessInput.value = "";
//}

function handleFireBlindVersion() {
    var guess = "" + currentRow + currentCol + "";
    controller.processGuessBlind(guess);
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");

   
    e = e || window.event;

//    if (e.keyCode === 39 ||e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 38) {
//        alert("helllur");
//        var cell = document.getElementById(currentRow + currentCol);
//        cell.removeAttribute("class", "highlight");
//        currentCol = currentCol + 1;
//        updateHighlight();
//    }
    
//    if (e.keyCode === 13) {
//        fireButton.click();
//        // need to keep return false here for some reason
//        return false;
//    }
    
    // if move right then go to right one square
}


document.addEventListener('keydown', logKey);

function logKey(e) {
    
    // add if current col > 6 and hit right for instance, make a clank noise to denote at boundary point
    
    // up arrow
    if (e.keyCode == 38) {
//         audio.play();
//         missAudio.play();
//         missAudio.pause();
//         hitAudio.play();
//         hitAudio.pause();
//        hitAudio.pause();
        if (currentRow > 0) {
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
            currentRow = currentRow - 1;
            updateHighlight();
            
            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            if (cell.hasAttribute("class")) {
                say("Not open!");
            } else {
                say("Open!");
                audio.play();
            }
            return false;
        }
        
    }
    
    // down arrow
    if (e.keyCode == 40) {
//         audio.play();
//         missAudio.play();
//         missAudio.pause();
//         hitAudio.play();
//         hitAudio.pause();
//        hitAudio.pause();
        if (currentRow < 6) {
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
            currentRow = currentRow + 1;
            updateHighlight();
            
            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            if (cell.hasAttribute("class")) {
                say("Not open!");
            } else {
                audio.play();
                say("Open!");
            }
            return false;
        }
    }
    
    // need to fix that can bypass opponents turn by not hitting enter
    
    // right arrow
     if (e.keyCode == 39) {
//          audio.play();
//         missAudio.play();
//         missAudio.pause();
//         hitAudio.play();
//         hitAudio.pause();
//         hitAudio.pause();
         if (currentCol < 6) {
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
            currentCol = currentCol + 1;
            updateHighlight();
             
            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            if (cell.hasAttribute("class")) {
                say("Not open!");
            } else {
                audio.play();
                say("Open!");
            }
            return false;
         }
    }
    
    // left arrow
     if (e.keyCode == 37) {
         
//         audio.play();
//         missAudio.play();
//         missAudio.pause();
//         hitAudio.play();
//         hitAudio.pause();
         
         
         if (currentCol > 0) {
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
             currentCol = currentCol - 1;
             cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            if (cell.hasAttribute("class")) {
                say("Not open!");
            } else {
                audio.play();
                say("Open!");
            }
            
            updateHighlight();
             
            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
             
         
            return false;
         }
    }
    
      if (e.keyCode == 32) {
//            audio.play();
//         missAudio.play();
//         missAudio.pause();
//         hitAudio.play();
//         hitAudio.pause();
//          audio.pause();
          handleFireBlindVersion();
          return false;
    }
    
    // enter goes to opponents turn
//    if (e.keyCode == 13) {
//        opponentsTurn();
//    }
    
    
    
    // shift goes to your turn

}

// to comment to display message:  log.textContent += "{ Current Row: " + currentRow + " Current Column: " + currentCol + " } ";
3
window.onload = init;

// used this From G. Bishop's AudioRunner example
function say(text) {
//    voices = this.getVoices();
    
    var letter;
  switch (currentRow) {
    case 0:
      letter = "Ay";
      break;
     case 1:
      letter = "B";
      break;
     case 2:
      letter = "C";
      break;
    case 3:
      letter = "D";
      break;
     case 4:
      letter = "E";
      break;
     case 5:
      letter = "F";
      break;
     case 6:
      letter = "G";
      break;
  }
  var msg = new SpeechSynthesisUtterance(letter + "   "  + currentCol + "");
//    msg.voice = voices[1];
  
        var voices = window.speechSynthesis.getVoices();
//        msg.voice = voices[1];
        
        msg.volume = 10;
        msg.rate = 2;
//        msg.pitch = 0.8;
//        msg.lang = 'en-US';
//        msg.voiceURI = "native";
//    msg.voice = voices[1];
//  msg.voice = voices[4];
  window.speechSynthesis.speak(msg);
}

function talk(text) {
     var msg = new SpeechSynthesisUtterance(text);
    msg.rate = 2;
    window.speechSynthesis.speak(msg);
    
}

// https://www.w3schools.com/graphics/tryit.asp?filename=trygame_sound
//function sound(src) {
//    this.sound = document.createElement("audio");
//    this.sound.src = src;
//    this.sound.setAttribute("preload", "auto");
//    this.sound.setAttribute("controls", "none");
//    ths.sound.style.display = "none";
//    document.body.appedChild(this.sound);
//    this.play = function() {
//        this.sound.play();
//    }
//    this.stop = function() {
//        this.sound.pause();
//    }
//}



function init() {
    
//    let fireButton = document.getElementById("fireButton");
//    fireButton.onclick = handleFireButton;
//
//    
//    let guessInput = document.getElementById("guessInput");
//    guessInput.onkeypress = handleKeyPress;

//    startAllAudio();
    model.generateShipLocations();
    
    let cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
   
//    var a = document.createAttribute("my_attrib");
//    a.value = "newVal";
//    cell.setAttributeNode(a);
//    cell.setAttribute("newVal", "my_attrib");
    
//    cell.setAttribute("class", "highlight");
    
    cell.setAttribute("style", "border: 1.5px solid yellow;");
    
    
    audio = new Audio('sounds/open.mp3');
    audio.volume = .2;
    hitAudio = new Audio('sounds/hit.mp3');
    hitAudio.volume = .4;
    missAudio = new Audio('sounds/missed.mp3');
    missAudio.volume = .3;
    sunkAudio = new Audio('sounds/sinker.mp3');
    missionCompleteAudio = new Audio('sounds/MissionComplete.mp3');
    
//    say(say("Open to fire!");
   
}

