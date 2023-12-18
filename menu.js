score = 0; // število točk
var mobile = false;//ali je uporabnik na telefonu
var tezavnost;
var tapSound = new Audio('media/tap2_cut.mp3');
var goSound = new Audio('media/gameOver_cut.mp3');
var scoredSound = new Audio('media/score_cut.mp3');  //uvožene zvočne datoteke
var crashedSound = new Audio('media/crash_cut.mp3');

function showGame(tez){ // funkcija ki pokaže igro
    document.getElementById("menu").style.display = "none";
    document.getElementById("results").style.display = "none";
    document.getElementById("canvas").style.display = "block";

    if(tez != 0){
    tezavnost = tez;
    }
    
    play();
}

function playSound(type, volume) { // funkcija za predvajanje zvoka
    var click=type.cloneNode(); // lahko ponovno zaigra zvok čeprav se prvi še ni končal
    click.volume=volume; // volumen od 0-1
    click.play(); // "zaigra" zvok
  }

function showResult(){ // funkcija ki prikaže rezultate
    document.getElementById("menu").style.display = "none";
    document.getElementById("results").style.display = "flex";
    document.getElementById("canvas").style.display = "none";

    document.getElementById("score").innerHTML = score; // prikaže dosežene točke
}

function backToMenu(){ // funkcija ki pokaže menu
    document.getElementById("menu").style.display = "flex";
    document.getElementById("results").style.display = "none";
    document.getElementById("canvas").style.display = "none"; 
    
}
function shuffleArray(array) {  //random premeša array
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
