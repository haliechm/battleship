//
//    if (document.getElementById("easy").checked) {
//        console.log("easy!");
//        difficulty = "easy";
//    } else if (document.getElementById("medium").checked) {
//        console.log("medium!");
//        difficulty = "medium";
//    } else if (document.getElementById("difficult").checked) {
//        console.log("difficult!");
//        difficulty = "difficult";
//    } else if (document.getElementById("exdifficult").checked) {
//        console.log("exdifficult!");
//        difficulty = "exdifficult";
//    } else if (document.getElementById("missionimpossible").checked) {
//        console.log("missionimpossible!");
//        difficulty = "missionimpossible";
//    }
//

var difficulty;

function setDifficulty() {
    console.log("yayyyyyy");
    //
    if (document.getElementById("easy").checked) {
        alert("boo yah e");
        console.log("easy!");
        difficulty = "easy";
        alert("difficulty: " + difficulty);
    } else if (document.getElementById("medium").checked) {
        alert("boo yah m");
        console.log("medium!");
        difficulty = "medium";
    } else if (document.getElementById("difficult").checked) {
        alert("boo yah d");
        console.log("difficult!");
        difficulty = "difficult";
    } else if (document.getElementById("exdifficult").checked) {
        alert("boo yah ed");
        console.log("exdifficult!");
        difficulty = "exdifficult";
    } else if (document.getElementById("missionimpossible").checked) {
        alert("boo yah mi");
        console.log("missionimpossible!");
        difficulty = "missionimpossible";
    }

}


function getDifficulty() {
    return difficulty;
}
