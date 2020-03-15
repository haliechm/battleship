
var currentRow = 0;
var currentCol = 0;

var audio;
var hitAudio;
var missAudio;
var sunkAudio;
var missionCompleteAudio;


var b2Audio;

var opShipsHit = 0;
var opMaxSquares = 49;

var won = false;

var numHits = 0;
var numTries = 0;
var remainingTries = 22;


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
    

    fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);


            if (ship.hits[index] === "hit") {
                // can put sound here for if hitting ship already there
//                view.displayMessage("Oops, you already hit that location!");
                return true;
            } else if (index >= 0) {
                pauseSound();
                playHitAudio();
                ship.hits[index] = "hit";
                view.displayHit(guess);
//                view.displayMessage("HIT!");
                numHits = numHits + 1;
                
                

                if (this.isSunk(ship)) {
//                    view.displayMessage("You sank my battleship!");
//                    pauseSound();

//                    playSunkAudio();
                    sunkAudio.currentTime = 0;
                    sunkAudio.play();
                    this.shipsSunk++;
                }
                return true;
            }
        }
 
        pauseSound();
        playMissAudio();
        view.displayMiss(guess);
        
//        view.displayMessage("You missed.");
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
//        console.log("Ships array: ");
//        console.log(this.ships);
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
    
    displayMessage2: function(msg) {
        let messageArea2 = document.getElementById("messageArea2");
        messageArea2.innerHTML = msg;
    },

    displayHit: function(location) {
        let cell = document.getElementById(location);
        
        cell.setAttribute("class", "hit");
    },
 
    displayMiss: function(location) {
        let cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }

};



let controller = {
    guesses: 0,

    
    processGuessBlind: function(guess) {
        this.guesses++;
        let hit = model.fire(guess);
        
        if (hit && model.shipsSunk == model.numShips) {
//            view.displayMessage("You sank all my battleships in " + this.guesses + " guesses");
            won = true;
//            pauseSound();
            sunkAudio.pause();
            missionCompleteAudio.play();
            
            // here
            console.log("All ships hit");
            var delayInMilliseconds = 4000;
        setTimeout(function() {
            alert("Mission Complete: You sank all battleships with " + numTries + " missiles.");
             document.location.reload();
        clearInterval(interval); 
       
        }, delayInMilliseconds);
        }
        
        
        
        var delayInMilliseconds = 2000; 

        if(!won) {
        setTimeout(function() {
             if (remainingTries <= 0) {
            losePopUp();
        }
        }, delayInMilliseconds);
        }
    }
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}



// event handlers

function updateHighlight() {
    var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
    cell.setAttribute("style", "background-color: #FFFF66; border: 1.5px solid #FFFF66");
    return;
}



function handleFireBlindVersion() {
    var guess = "" + currentRow + currentCol + "";
    controller.processGuessBlind(guess);
}

function handleKeyPress(e) {
    let fireButton = document.getElementById("fireButton");

   
    e = e || window.event;

}



//   document.addEventListener("keydown", e => {
//        // ignore key repeats
////        if (e.repeat)
////            return;
////        if (e.key == "ArrowRight" || e.key == " ") {
////            nextChoice();
////        } else if (e.key == "ArrowLeft" || e.key == "Enter") {
////            finishTurn();
////        } else if (e.key == "ArrowUp") {
////            finishTurn();
////        } else if (e.key == "ArrowDown") {
////            finishTurn();
////        }
//       
//       
//       
////        else if (e.key == "q") {
////            gameOver();
////        }
//    });

function hoverArrowUp() {
     
    if (currentRow>0) {
    var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
    cell.removeAttribute("style", "background-color: black;");
    currentRow = currentRow - 1;
    updateHighlight();
    return;
    }
    
}

function hoverArrowLeft() {
    
      if (currentCol > 0) {
             window.speechSynthesis.cancel();
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
             currentCol = currentCol - 1;
                  updateHighlight();
              }
}

function hoverArrowDown() {
   
     if (currentRow < 6) {
            window.speechSynthesis.cancel();
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
            currentRow = currentRow + 1;
            updateHighlight();
             }
}

function hoverArrowRight() {
    
                if (currentCol < 6) {
             window.speechSynthesis.cancel();
            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
            cell.removeAttribute("style", "border: 1.5px solid yellow;");
            currentCol = currentCol + 1;
            updateHighlight();
            }
}

function chooseArrow() {
      numTries++;
    remainingTries--;
    view.displayMessage("Number of missiles used: " + numTries);
    view.displayMessage2("Number of missiles remaining: " + remainingTries);
    
//          pauseSound();
//          cancelSound();
//
          handleFireBlindVersion();
          return false;
}

    document.getElementById("up").addEventListener("mouseover", hoverArrowUp);
    document.getElementById("left").addEventListener("mouseover", hoverArrowLeft);
    document.getElementById("down").addEventListener("mouseover", hoverArrowDown);
    document.getElementById("right").addEventListener("mouseover", hoverArrowRight);
    document.getElementById("up").addEventListener("click", chooseArrow);
    document.getElementById("left").addEventListener("click", chooseArrow);
    document.getElementById("down").addEventListener("click", chooseArrow);
    document.getElementById("right").addEventListener("click", chooseArrow);

document.addEventListener('keydown', logKey);

function logKey(e) {
    
    
    // stops anything from happen with holding down key
    if (e.repeat) {
        return;
    }
    
    // up arrow
    if (e.keyCode == 38) {
        
        hoverArrowUp();
    }
    
    // down arrow
    if (e.keyCode == 40) {
      
        hoverArrowDown();
    }
    
    // right arrow
    if (e.keyCode == 39) {
       
        hoverArrowRight();
    }
    
    // left arrow
    if (e.keyCode == 37) {
       
        hoverArrowLeft();
    }
    
    
    // enter key
     if (e.keyCode == 13) {
        
        chooseArrow();
    }
    
    // space bar
    if (e.keyCode == 32) {
       
    }
    
    
}

function losePopUp() {
    alert("Mission Failed: You ran out of missiles. Try again.")
    document.location.reload();
}





//document.addEventListener('keydown', logKey);
//
//function logKey(e) {
//    
//    
//    // up arrow
//    if (e.keyCode == 38) {
//        pauseSound();
//        cancelSound();
//
//        if (currentRow > 0) {
//            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            cell.removeAttribute("style", "border: 1.5px solid yellow;");
//            currentRow = currentRow - 1;
//            updateHighlight();
//            
//            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            if (cell.hasAttribute("class")) {
//                say("Not open!");
//            } else {
//                say("Open!");
//                audio.play();
//            }
//            return false;
//        }
//        
//    }
//    
//    // down arrow
//    if (e.keyCode == 40) {
//        pauseSound();
//        cancelSound();
//        
//        if (currentRow < 6) {
//            window.speechSynthesis.cancel();
//            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            cell.removeAttribute("style", "border: 1.5px solid yellow;");
//            currentRow = currentRow + 1;
//            updateHighlight();
//            
//            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            if (cell.hasAttribute("class")) {
//                say("Not open!");
//            } else {
//                audio.play();
//                say("Open!");
//            }
//            return false;
//        }
//    }
//    
//    
//    // right arrow
//     if (e.keyCode == 39) {
//         pauseSound();
//         cancelSound();
//         
//         if (currentCol < 6) {
//             window.speechSynthesis.cancel();
//            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            cell.removeAttribute("style", "border: 1.5px solid yellow;");
//            currentCol = currentCol + 1;
//            updateHighlight();
//             
//            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            if (cell.hasAttribute("class")) {
//                say("Not open!");
//            } else {
//                audio.play();
//                say("Open!");
//            }
//            return false;
//         }
//    }
//    
//    // left arrow
//     if (e.keyCode == 37) {
//         pauseSound();
//         cancelSound();
//         
//         
//         if (currentCol > 0) {
//             window.speechSynthesis.cancel();
//            var cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            cell.removeAttribute("style", "border: 1.5px solid yellow;");
//             currentCol = currentCol - 1;
//             cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//            if (cell.hasAttribute("class")) {
//                say("Not open!");
//            } else {
//                audio.play();
//                say("Open!");
//            }
//            
//            updateHighlight();
//             
//            cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");
//             
//         
//            return false;
//         }
//    }
//    
//  
//    
//    // space bar
//      if (e.keyCode == 32) {
//          numTries++;
//          pauseSound();
//          cancelSound();
//
//          handleFireBlindVersion();
//          return false;
//    }
//    
//    // shift key
//    if (e.keyCode == 16) {
//        pauseSound();
//        cancelSound();
//        talk("Score: You have hit your opponent " + numHits + " times out of " + numTries + " tries." + " Mission complete at 9 hits");
//        
//    }
//}

// to comment to display message:  log.textContent += "{ Current Row: " + currentRow + " Current Column: " + currentCol + " } ";

window.onload = init;

// used this From G. Bishop's AudioRunner example

function say(text) {
    
    var letter;
  switch (currentRow) {
    case 0:
      letter = "Eigh";
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
        
      msg.volume = 10;
      msg.rate = 1.2;
   
    
  window.speechSynthesis.speak(msg);
}

function talk(text) {
     var msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1.1;
    window.speechSynthesis.speak(msg);
    
}



function pauseSound() {
    hitAudio.pause();
    hitAudio.currentTime = 0;
    missAudio.pause();
    missAudio.currentTime = 0;
    sunkAudio.pause();
    sunkAudio.currentTime = 0;
    
}

function cancelSound() {
    window.speechSynthesis.cancel();
    window.speechSynthesis.cancel();
    
}

function playHitAudio() {
    
    missAudio.pause();
    missAudio.currentTime = 0;
    sunkAudio.pause();
    sunkAudio.currentTime = 0;
    
    hitAudio.play();
}

function playMissAudio() {

    hitAudio.pause();
    hitAudio.currentTime = 0;
    sunkAudio.pause();
    sunkAudio.currentTime = 0;
    
    missAudio.play();
    
}


function playSunkAudio() {
   
    hitAudio.pause();
    hitAudio.currentTime = 0;
    missAudio.pause();
    missAudio.currentTime = 0;
    
    sunkAudio.play();
    
}



function init() {
    

    model.generateShipLocations();
    
    let cell = document.getElementById("" + currentRow + "" + "" + currentCol + "");

     
    cell.setAttribute("style", "background-color: #FFFF66;");
    
    
    audio = new Audio('sounds/open.mp3');
    audio.volume = .1;
    hitAudio = new Audio('sounds/hit.mp3');
    hitAudio.volume = .2;
    missAudio = new Audio('sounds/missed.mp3');
    missAudio.volume = .3;
    sunkAudio = new Audio('sounds/sinker.mp3');
    missionCompleteAudio = new Audio('sounds/MissionComplete.mp3');
    
    b2Audio = new Audio('sounds/B2.mp3')
    
    view.displayMessage("Number of missiles used: " + numTries);
    view.displayMessage2("Number of missiles remaining: " + remainingTries);

    

   
}

