function Color(w, h, ctx, difficulty){
    this.w = w; // širina canvasa
    this.h = h; // višina canvasa
    this.ctx = ctx;
    this.difficulty = difficulty; //težavnost
    this.active = false;
    this.gameOver = false;

   
    y= 0;

    speed = 200; // začetna hitrost
    speedFactor = 1; // factor povečevanja hitrosti

    teils = []; // kvadrati

    // ozadje = "#232b2b"; 
    ozadje = "#0A0B2B";//barva ozadja 

    colorIndex = -1;
    colorIndex2 = -1;

    
    belowTeilsHeight = this.h /25; // višina spodnjih pravokotnikov

    this.score = 0 // število točk

    colors = ["#fc4445","#3500d3", "#66FCF1", "#ffe400", "#E89C61" ];  //red, blue, green, yellow, svetlo rjava

    this.new = function(){ //
        if((this.w*3)>(this.h*2)){
            this.w = this.h*2/3; //če je potrebno priredi širino canvasa
        }
        
        tileSize = this.w/this.difficulty;  // velikost kvadratov
        tileRazmik = tileSize*2; //razmik med kvadrati
        numOfTiles = Math.ceil(this.h/tileRazmik)+1;

        this.changeColorsArray(colors); // premeša array z barvami
        this.ctx.fillStyle = ozadje; // pobarvamo canvas
        this.ctx.fillRect(0,0, this.w, this.h); // nariše platno
        this.generateTeils();
    }
    this.changeColorsArray = function(arr){
        shuffleArray(arr); // premeša array
    }

    this.checkHits = function(cx, cy){
        pathY = (30/1000)*speed*speedFactor; //pot, ki jo kvadrat naredi v 30 milisekundah
        for(i = (Math.floor(y/tileRazmik)+ 1 ); i <= (Math.floor(y/tileRazmik) + numOfTiles); i++){
            if((cy>=(this.h-(i*tileRazmik - y)) - pathY) && (cy<=(this.h-(i*tileRazmik - y) + tileSize))){ // preverjamo če y kordinata klika ustreza kateremu izmed kvadratov
                if((cx >= teils[i][0]) && (cx <= teils[i][0]+ (this.w/this.difficulty))){ //prevejamo če x kordinata klika ustreza kateremu izmed kvadratov
                    if(teils[i][1]!= ozadje){ //če ta kvadrat še nima barve ozadja, ga dodelimo barvo ozadja
                    this.hitsEvaluation(i);
                    teils[i][1]= ozadje; //spremeni barvo
                    }
                }
            }
        }
        
    }

    this.hitsEvaluation = function(index){

        this.findingColorIndex(index);

        if(colors[colorIndex] == teils[index][1]){  //če je bil kliknjen kvadrat nad pravokotnikom iste barve se odšteje 100 točk, drugače prišteje 10 točk
            this.score -= 100;
        } else{
            this.score += 10;
        }
        playSound(tapSound, 0.55);//predvajanje zvoka "tap"
    }

    this.findingColorIndex = function(index){ //najde index barve v colors arrayu , pod kvadratom na katerega je uporabnik kliknil
        for( j= 0; j< this.difficulty; j++){
            if((j/this.difficulty*this.w) == teils[index][0]){
                colorIndex = j;
            }
        }
    }

    this.teilsEvaluator = function(){
        
        var i = Math.floor(y/tileRazmik)+ 1;
        if(((this.h - (i*tileRazmik - y) + tileSize) >= (this.h - belowTeilsHeight)) && (teils[i][2] != true)){ // pogleda če je kater izmed kvadratov padel
                                                                                                                    //na katerega izmed pravokotnikov
            

            for( m= 0; m< this.difficulty; m++){
                if((m/this.difficulty*this.w) == teils[i][0]){
                    colorIndex2 = m;
                }
            }

            if(colors[colorIndex2]== teils[i][1]){ //če je kvadrat padel na pravokotnik iste barve uporabnik dobi 10 točk
                this.score += 10;                   //če pa ne pa je igre konec
                teils[i][1] = ozadje;
                playSound(scoredSound, 0.55);
            } else if((colors[colorIndex2]!= teils[i][1]) && (teils[i][1]!= ozadje)){
                playSound(crashedSound, 0.65);
                this.gameOver = true;
                this.active = false;
            }

            teils[i][2] = true;//kvadrat je bil pregledan
        }
    }

    this.update = function(time){
        if(this.active){

            y += (time/1000)*speed*speedFactor; // povečava celotne poti (y)
            speedFactor += (time/(1000*60))/speedFactor; // povečava faktorja
            
            this.ctx.fillStyle = ozadje; //pobarva se ozadje
            this.ctx.fillRect(0,0, this.w, this.h-belowTeilsHeight); // pobarvan canvas

            

           for(i = (Math.floor(y/tileRazmik)+ 1 ); i <= (Math.floor(y/tileRazmik) + numOfTiles); i++){
                if(teils[i][1] != ozadje){

                    this.ctx.fillStyle = teils[i][1]
                                                                                                                    //izris kvadratov
                    this.ctx.fillRect(teils[i][0], this.h-(i*tileRazmik - y), tileSize, tileSize);

                }
            }
             
            fontSize = this.w/12;//velikost pisave
            ctx.font = fontSize+"px Verdana";
            ctx.fillStyle = "#fff";                                                //vsak frame izpiše število točk
            ctx.textAlign = "center";
            ctx.fillText(this.score, 5/6*this.w , belowTeilsHeight *2);//izpis števila točk

            this.teilsEvaluator();
            this.drawBelowTeils();
    
        }
    }

    this.drawBelowTeils = function(){
        this.ctx.beginPath();
        for(i = 0; i<this.difficulty;i++){
            this.ctx.fillStyle = colors[i]; // barva kvadrata
            this.ctx.fillRect(i/this.difficulty*this.w, this.h-belowTeilsHeight, tileSize, belowTeilsHeight);  // nariše kvadrat 
        }
    }

    this.generateTeils = function(){//generira array 
        nevidnih = Math.ceil((this.h/(tileSize+tileRazmik)))+1; // število nevidnih kvadratov
        for(i = 0; i<nevidnih; i++){
            teilsLength = teils.length;
            teils.push([]);
            teils[teilsLength].push(100);
            teils[teilsLength].push(ozadje);
            teils[teilsLength].push(true);
        }
        for(i = nevidnih; i<500;i++){
            randomNum = Math.floor(Math.random() * (this.difficulty))/this.difficulty*this.w; // generira random število ki so enaka ali 0 ali 1/3*w ali 2/3*w
            randomNumColor = Math.floor(Math.random() * (this.difficulty)); // generira random število od 0 do števila barv 
            teilsLength = teils.length;
            teils.push([]);
            teils[teilsLength].push(randomNum);//kordinata levega roba kvadrata
            teils[teilsLength].push(colors[randomNumColor]); //barva kvadrata
            teils[teilsLength].push(false); // evaluated??
        }
    }
}
