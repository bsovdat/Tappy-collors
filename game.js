//SPREMENLJIVKE
var lastFrameTimeMs = 0;
var cx;
var cy;
var tileSize;
var tileRazmik;
var color = "";

function play(){
    canvas = document.getElementById("canvas");

    height = Math.max(document.documentElement.clientHeight, window.innerHeight, document.getElementById("body").clientHeight || 0);
    width = Math.max(document.documentElement.clientWidth, window.innerWidth, document.getElementById("body").clientWidth || 0);

    canvas.setAttribute("height", Math.round(height));// doda elementu canvas višino
    canvas.setAttribute("width", Math.round(width));// doda elementu canvas širino
    ctx = canvas.getContext("2d");

    lastFrameTimeMs = 0;

    color = new Color(canvas.width, canvas.height, ctx, tezavnost); //ustvari objekt color
    color.new();

    start(); //kliče funkcijo start

}

function start(){
    color.active = true;
    mainLoop(performance.now());//kliče funkcijo mainloop ter ji za argument vnese performance.now()
}


function mainLoop(newTime){
    if(color.active){
        if(lastFrameTimeMs!=0){
            deltaTime = newTime - lastFrameTimeMs;//razlika časov med prejšnijm klicem funkcije in trenutnim
            
            color.update(deltaTime);

            if(color.gameOver){//ko je konec igre 
                score = color.score;
                cancelAnimationFrame(mainLoop); //zaustavi animacijo
                playSound(goSound, 0.5)//"zaigra" zvok
                showResult()//pokaže rezultate menu         

            }
        }
        lastFrameTimeMs = newTime;
        requestAnimationFrame(mainLoop);
    } 
}
function onCanvasClick(event){ // ta funkcija dobi kordinate klika na canvasu
    cy = event.pageY;//y kordinata
    cx = event.pageX-((width-color.w)/2);//x kordinatat

    if(mobile){//če je uporabnik na telefonu
        cy = event.touches[0].pageY;
        cx = event.touches[0].pageX-((width-color.w)/2);
    }

    color.checkHits(cx, cy);//izračunane x in y kordinate vstavi v funkcijo checkHits
}
