// Variables Globales
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

var lastKey;
var timeStamp = 0;
var ts = 0; // ts > time stamp mais pour le score (1 sec = 1 score de plus)
var tb = 0; // time stamp aussi mais pour les balles
var sec;
var tm = 0;
var score = 0;
var aTire = false;

/*                            MDJ                           */
/////////////////////////////////////////////////////////////
// Gestion du mode de jeu (event listener au debut (exception))

document.getElementById('gmd1').addEventListener('click', function() {
    leTypeDeJeu = 1;

    highScore = localStorage.getItem('highScore1'); // High Score
    for (let i = 0; i < document.getElementsByClassName('affichHS').length; i++) {
        document.getElementsByClassName('affichHS')[i].innerHTML = highScore;
    }
    
    document.getElementById('sGmd').innerHTML = leTypeDeJeu;
});
document.getElementById('gmd2').addEventListener('click', function() {
    leTypeDeJeu = 2;

    highScore = localStorage.getItem('highScore2'); // High Score
    for (let i = 0; i < document.getElementsByClassName('affichHS').length; i++) {
        document.getElementsByClassName('affichHS')[i].innerHTML = highScore;
    }
    
    document.getElementById('sGmd').innerHTML = leTypeDeJeu;
});

// Mettre par defaut
document.getElementById('saveGmd').addEventListener('click', function() {
    localStorage.setItem('defaultGmd', leTypeDeJeu);
});


var leTypeDeJeu;//prompt('LE TYPE VOULU : (1, 2)'); // 1 normal, 2 modifie
/* if (leTypeDeJeu != 1 && leTypeDeJeu != 2) {
    leTypeDeJeu = 1;
} */

//
let vts = 3;
let vts2 = vts; // Pour pas que le jeu bug, c est cette vitesse qui sera augmentee
let originVts = vts;
//                 et losque que le nombre sera un entier, il changera vts

//////////////////////////////////////////////////////////////////

if (localStorage.getItem('highScore1') == undefined) {
    localStorage.setItem('highScore1', 0);
}
if (localStorage.getItem('highScore2') == undefined) {
    localStorage.setItem('highScore2', 0);
}


// Gestion default game mode avec high score

var highScore;

if (localStorage.getItem('defaultGmd') == undefined) {
    leTypeDeJeu = 1;
    highScore = localStorage.getItem('highScore1'); // High Score
} else {
    leTypeDeJeu = localStorage.getItem('defaultGmd');
    let blabla = 'highScore' + leTypeDeJeu;
    highScore = localStorage.getItem(blabla);
}
// Affichage game mode
document.getElementById('sGmd').innerHTML = leTypeDeJeu;

// Affichage high score
for (let i = 0; i < document.getElementsByClassName('affichHS').length; i++) {
    document.getElementsByClassName('affichHS')[i].innerHTML = highScore;
}


var gameStat = 3; // 0, playing, 1 : game over, 2 : pause, 3 : menu
var maxBalles = 100;
var nbrBalles = 20;//maxBalles;

//Pour les animations
var isAnimating = false;
var divOnglet = 'none';

var pouvoir = 'none';
var cartePouvoir = 'none';
var tempsPouvoir = 0;
console.log(pouvoir);             // MODIFIER :
    var db = {duree: 20, image: document.getElementById('imgCard2x'), msg: 'Double Bulllet'};         // Ici,
    var gm = {duree: 20, image: document.getElementById('imgCardGM'), msg: 'Missiles'};         // Ce qu il fait,
    var infinite = {duree: 20, image: document.getElementById('imgCard8'), msg: 'Infinite Bullets'};   // Affichage
    var ballon = {duree: 15, image: document.getElementById('imgCardB'), msg: 'Big Bullets'};
    var speed = {duree: 12, image: document.getElementById('imgCardSpeed'), msg: 'Fast Ship'};
    var rr = {duree: 17, image: document.getElementById('imgCardRR'), msg: 'Fast Reload'};                          // recharge rapide/ super vitessse
var pouvoirsD = [db,         gm,     infinite,     ballon,    rr, speed]; // pouvoirs disponibles

//pouvoir = gm;

var imgVaisseau = document.getElementById('imgVaisseau');
var imgMissile = document.getElementById('imgMissile');
var imgMeteor = document.getElementById('imgMeteor');
var imgMeteor2 = document.getElementById('imgMeteor2');
var imgMeteor3 = document.getElementById('imgMeteor3');




// Tableaux / variables des objets
var vaisseau = new Vaisseau();
var missiles = [];
var meteors = [];

// Event Listener

window.addEventListener('keydown', function(e) {
    if (e.keyCode == '37') {              // fleche <
        lastKey = '37';
        vaisseau.dx = -4;
        if (pouvoir == speed) {
            vaisseau.dx = -8;
        }
    } else if (e.keyCode == '39') {       // fleche >
        lastKey = '39';
        vaisseau.dx = 4;
        if (pouvoir == speed) {
            vaisseau.dx = 8;
        }
    } else if (e.keyCode == '32' && gameStat == 0 && aTire == false) {       // Espace
        // if (gameStat == 1) {
        //     restartGame();
        //     return;
        // }

        //POUVOIRS
        if (pouvoir == infinite) {
            missiles.push(new Missile(vaisseau));
            aTire = true;
            return;
        } else if (pouvoir == db && nbrBalles > 0) {
            missiles.push(new Missile(vaisseau, 1));
            missiles.push(new Missile(vaisseau, 2));
            nbrBalles--;
            aTire = true;   
            return;
        }


        if (nbrBalles > 0 && pouvoir != infinite && pouvoir != db) {
            missiles.push(new Missile(vaisseau));
            nbrBalles--;
            aTire = true;
        }

    } else if (e.keyCode == '80') {       // P
        if (gameStat == 2) {
            gameStat = 0;
            displayMenus('pause', 2);
        } else if (gameStat != 1 && gameStat == 0) {
            gameStat = 2;
            displayMenus('pause', 1);
        }
    } else if (e.keyCode == '82' && gameStat == 1) {
        if (isAnimating == false) {
            displayMenus('dead', 2);
            restartGame();
        }
    }
});


window.addEventListener('keyup', function(e) {
    if (e.keyCode == '37' && lastKey == '37') {
        vaisseau.dx = 0;
    } else if (e.keyCode == '39' && lastKey == '39') {
        vaisseau.dx = 0;
    } else if (e.keyCode == '32') {
        aTire = false;
    }
});

/* window.addEventListener('click', function(e) {
    if (gameStat == 1) {
        displayMenus('dead', 2);
        restartGame();
    } else if (gameStat == 2) {
        gameStat = 0;
    }
}); */

window.addEventListener('resize', display);

// Constructeur
function Vaisseau() {
    this.image = imgVaisseau;
    this.w = 30;
    this.h = 40;
    this.x = (canvas.width - this.w) / 2;
    this.y = canvas.height - this.h - 10;
    this.dx = 0;
    this.mode = 'normal';

    this.draw = function() {
        //ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
        persoSprite(ctx, this, gameStat);
    };

    this.animate = function() {
        if (this.x < 0 && this.dx < 0) {
            this.dx = 0;
            return;
        } else if (this.x + this.w > canvas.width && this.dx > 0) { 
            // this.x = canvas.width - this.w;
            this.dx = 0;
            return;
        } else {
            this.x += this.dx;
        }
    }
}

function Missile(leV, nb) {
    this.w = 3;
    this.h = 6;
    this.x = leV.x + leV.w / 2 - this.w / 2;
    this.y = leV.y - this.h;//canvas.height - leV.h - 10;
    this.image = imgMissile;
    this.dy = -6;
    this.mk = false; // marked for delition, ceux a supprimer du tableau "missiles"
    this.typeP = pouvoir; // type de pouvoir
    
    // POUVOIRS
    if (pouvoir == ballon) {
        this.image = document.getElementById('imgMissileB'); //Image de grosse balle
        this.w = 24;
        this.h = 48;
        this.y = leV.y - this.h;
        this.x = leV.x + leV.w / 2 - this.w / 2;
    } else if (pouvoir == db) {   // nb est un attribut specifiant c kelle balle des
        this.x = leV.x + (leV.w / 3 * nb - this.w / 2);   // deux ballees si le pouvoir est db
    } else if (pouvoir == gm) {
        this.image = document.getElementById('imgMissileG');
    }


    this.draw = function() {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    this.animate = function() {
        this.y += this.dy;

        if (this.y + this.h < 0) {
            this.mk = true;
        }
    }
}

function Meteor(x, dx, dy, w, h, v, lscore) {
    this.image = imgMeteor;
    this.imageN = 1;
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = -this.h;
    this.dy = dy;
    this.dx = dx;
    this.centre = {                    // Plus facile pour collision detection si c 
        x: this.x + this.w / 2,        // un cercle
        y: this.y + this.h / 2
    };
    this.rayon = 7.5;                  // commentaire juste en haut
    
    this.mk = false;                 // marked for deletion
    this.sup = false;                // meme chose que this.mk mais avec animation (pour balles)
    this.transparence = 1;
    
    this.v = v;                       // nombre de vies
    this.score = lscore;            // score que donne le meteor

    this.draw = function() {

        if (this.sup == true) {
            if (this.transparence < 0.1) {
                this.mk = true;
            }
            ctx.globalAlpha = this.transparence
            ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
            ctx.globalAlpha = 1;
            if (gameStat == 0) {this.transparence -= 1 / 60;}
            return;
        }


        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }

    this.animate = function() {

        if (this.sup == true) {
            this.image = document.getElementById('imgMeteorF');
            if (leTypeDeJeu == 1) {
                return;
            } else if (leTypeDeJeu == 2) {
                this.dy = vts;
            }
        }

        if (this.y > canvas.height) {
            this.mk = true;
        } else if (this.x < 0 || this.x + this.w > canvas.width) {
            this.dx = -this.dx;
        }

        if (this.v < 1 && this.sup == false) {
            score += this.score // Ajout du score lorsque tue
            this.sup = true;
        }


        if (this.sup == false) {    // Verifier si le type de jeu est 2 et que le meteor
            this.x += this.dx;      // est en train d exploser
        }
        this.y += this.dy;

        
    }
}

function Card(sorte, leMeteor) {
    this.w = 20;
    this.h = 20;
    this.x = leMeteor.x + leMeteor.w / 2 - this.w / 2;
    this.y = leMeteor.y;
    this.dy = 2;
    this.dx = 0;
    if (leTypeDeJeu == 2) { // SI TYPE DE JEU = 2
        this.dy = leMeteor.dy; 
        this.dx = leMeteor.dx;
    }

    this.sorte = sorte;

    /* switch(sorte) {
        case db:
            this.image = document.getElementById('imgCard2x');
            break;
        case gm:
            this.image = document.getElementById('imgCardGM');
            break;
        case infinite:
            this.image = document.getElementById('imgCard8');
            break;
        case ballon:
            this.image = document.getElementById('imgCardB');
            break;
        case rr:
            this.image = document.getElementById('imgCardRR');
            break;
        case speed:
            this.image = document.getElementById('imgCardSpeed');
            break;
    } */

    this.draw = function() {
        ctx.drawImage(this.sorte.image, this.x, this.y, this.w, this.h);
    }

    this.animate = function() {
        if (this.y > canvas.height) {
            cartePouvoir = 'none';
        }
        this.y += this.dy;

        if (this.x + this.w > canvas.width || this.x < 0) { // LORSQUE TYPE DE JEU = 2
            this.dx = -this.dx;
        }
        this.x += this.dx;
    }
}




// Boucle ***********************************************************
function jeux() {
    requestAnimationFrame(jeux);
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // STATUS DE LA PARTIE


    if (gameStat == 3) { // Menu
        return;
    }



    if (gameStat == 2) {
        
        for (let f = 0; f < meteors.length; f++) {
            meteors[f].draw();
        }
        for (let i = 0; i < missiles.length; i++) {
            missiles[i].draw();
            //missiles[i].animate();
        }
        vaisseau.draw();

        if (cartePouvoir != "none") {
            cartePouvoir.draw();
        }

        /* ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px serif'
        ctx.fillText('Paused', canvas.width / 2 - 65, canvas.height / 2 - 20, 200); */
        

        return;
    }


    if (gameStat == 1) {
        /* ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '50px serif';
        ctx.fillText('You are dead', canvas.width / 2 - 100, canvas.height / 2 - 20, 200);
        ctx.font = '35px serif';
        ctx.fillText('Votre score : ' + score, canvas.width / 2 - 100, canvas.height / 2 + 20, 200); */
        return;
    }

    // Animation du fond ecran si mode de jeu = 2
    if (leTypeDeJeu == 2) { 
        movingBack(ctx, canvas, vts);
    }


    // AFFICHAGE (SCORE ET BALLES ET POUVOIR)

    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'white';

    ctx.fillText("Score : " + score, 10, 20);

    ctx.fillText("Bullets left : " + nbrBalles, canvas.width - 150, 20);

    // Affichage pour les divs

    var affichScoreClass = document.getElementsByClassName('affichScore');
    var affichHSClass = document.getElementsByClassName('affichHS');
    var affichSecondsClass = document.getElementsByClassName('affichSeconds');

    for (let d = 0; d < affichScoreClass.length; d++) {
        affichScoreClass[d].innerHTML = score;
    }


    let minaa = Math.floor(sec / 60);
    let secaa = sec - minaa * 60;

    for (let d = 0; d < affichSecondsClass.length; d++) {
        if (sec < 60) {
            affichSecondsClass[d].innerHTML = sec;
        } else if (sec > 59) {
            affichSecondsClass[d].innerHTML = minaa + 'min ' + secaa;
        }
    }

    // High Score Update

    if (score > highScore) {
        highScore = score;
        let blabla = 'highScore' + leTypeDeJeu;
        localStorage.setItem(blabla, score);
    }

    for (let d = 0; d < affichHSClass.length; d++) {
        affichHSClass[d].innerHTML = highScore;
    }
    
    // POUVOIRS AFFICHAGE

        if (pouvoir != 'none') {
        ctx.fillText("Power : " + pouvoir.msg, 10, 40, 200);
        ctx.fillText('Time left : ' + Math.floor(pouvoir.duree - tempsPouvoir / 60), canvas.width - 135, 40);
    } else {
        ctx.fillText('Power : none', 10, 40, 200);
    }

    //let affichP;  Variable qui affiche le message du pouvoir
    /* switch(pouvoir) {
        case db:
            affichP = 'Double Balles';
            break;
        case gm:
            affichP = "Gros Missiles";
            break;
        case ballon:
            affichP = "Plus Grosses Balles";
            break;
        case infinite:
            affichP = "Infinies Balles";
            break;
        case 'none':
            affichP = 'Aucun';
            break;
        case speed:
            affichP = "Super Vitesse";
            break;
        case rr:
            affichP = "Recharge Rapide"
            break;
    } */


    
    // AJOUT DU SCORE

    if (ts > 59) {
        score++;
        ts = 0;
    }

    // AJOUT DES BALLES

    if (tb > 39 && nbrBalles < maxBalles && pouvoir != infinite && pouvoir != rr) {
        nbrBalles++;
        tb = 0;
    } else if (tb > 39 && nbrBalles < maxBalles && pouvoir == rr) {
        nbrBalles += 3;
        tb = 0;
    }
    
    //-------------------------------------------------------------

    // OBSERVATION DU TEMPS DES POUVOIRS

    if (Math.floor(tempsPouvoir / 60 >= pouvoir.duree)) {
        pouvoir = 'none';
        tempsPouvoir = 0;
        console.log('fin pouvoir');
    }



    //-----------------------------------------------------------------

    // GENERATIONS DES METEORS

    if (tm > 39) {
        tm = 0;
        if (getR(3) != 0) {
            genMeteor();
        }
    }



    // DESSINER ET ANIMER LES OBJETS

    vaisseau.draw();
    vaisseau.animate();
    
    for (let i = 0; i < missiles.length; i++) {
        missiles[i].draw();
        missiles[i].animate();
    }
    missiles = missiles.filter(leM => leM.mk == false); // voir js filter sur chrome

    for (let f = 0; f < meteors.length; f++) {
        meteors[f].draw();
        meteors[f].animate();
    }
    meteors = meteors.filter(leM => leM.mk == false);

    if (cartePouvoir != "none") {
        cartePouvoir.draw();
        cartePouvoir.animate();
    }

    
    


    // DETECTION DES COLLISIONS


    collisionDetection();

    //////////////////////////////////////////


    // GESTION DU TEMPS

    timeStamp++;
    tm++;
    sec = Math.floor(timeStamp / 60);
    ts++;
    tb++;

    if (pouvoir != 'none') { // Pour les pouvoirs
        tempsPouvoir++;
    }


    // AUGMENTER LA VTS SI LE TYPE DE JEU EST 2
    if (leTypeDeJeu == 2 && vts < 7) { // Anti bug, 2e vitesse
        vts2 *= 1.0001;

        if (vts2 - vts >= 1) {
            vts++;
        }
    }
    
    //console.log(pouvoir + ', ' + cartePouvoir);
}
// ******************************************************************



// Fonction
function genMeteor() { // x, dx, dy, w, h, v
    var nb = getR(sec / 2, 1); // Le nombre de meteors
    if (sec > 20) {
        var type = getR(3, 1); // le type (grosseur et vie)
    } else if (sec > 10 && sec < 21) {
        var type = getR(2, 1); // le type (grosseur et vie)
    } else {
        var type = 1; // le type (grosseur et vie)
    }
    
    var valeurs = {};

    if (type == 1) {
        valeurs.w = 30;
        valeurs.h = 30;
        valeurs.v = 1;
        valeurs.score = 10;
    } else if (type == 2) {                   // TYPES
        valeurs.w = 50;
        valeurs.h = 50;
        valeurs.v = 2;
        valeurs.score = 30;
    } else if (type == 3) {
        valeurs.w = 75;
        valeurs.h = 75;
        valeurs.v = 3;
        valeurs.score = 50;
    }


    valeurs.x = getR(canvas.width - valeurs.w);
    valeurs.dy = getR(2, 1);

    
    if (leTypeDeJeu == 2) {
        if (getR(2) == 1) {
            valeurs.dy = getR(2) + vts; // VITESSE AJOUTEE SI MODE DE JEU = 2
        } else {
            valeurs.dy = vts - getR(2); // VITESSE AJOUTEE SI MODE DE JEU = 2
        }
    }
    
    if (getR(2) == 1) {                       // VITESSE NEGATIVE OU POSITIVE
        valeurs.dx = getR(2, 1) * -1;
    } else {
        valeurs.dx = getR(2, 1);
    }


    meteors.push(new Meteor(valeurs.x, valeurs.dx, valeurs.dy, valeurs.w, valeurs.h, valeurs.v, valeurs.score)); // x, dx, dy, w, h, v
}

function getR(max, min) {
    if (min == undefined) {
        min = 0;
    }

    let result = Math.floor(Math.random() * max + min);
    return result;
}

function collisionDetection() {
    for (let i = 0; i < meteors.length; i++) {
        for (let j = 0; j < missiles.length; j++) {
            if (collide(meteors[i], missiles[j]) && meteors[i].sup != true)
                        /* (
                        (missiles[j].x < meteors[i].x + meteors[i].w &&
                        missiles[j].x > meteors[i].x &&
                        missiles[j].y < meteors[i].y + meteors[i].h &&
                        missiles[j].y > meteors[i].y) 
                        ||
                        (meteors[i].x < missiles[j].x + missiles[j].w &&
                            meteors[i].x > missiles[j].x &&
                            meteors[i].y < missiles[j].y + missiles[j].h &&
                            meteors[i].y > missiles[j].y)              
                        ) */ 
                {


                if (missiles[j].typeP == gm && meteors[i].sup != true) { // Verifie si le missile avait le pouvoir 'gm'
                    missiles[j].mk = true;
                    meteors[i].v -= 3;
                } else {
                    meteors[i].v--;   // une vie en moins
                    if (meteors[i].imageN == 1) {          // Changer l image pour meilleur rendu
                        meteors[i].image = imgMeteor2;
                        meteors[i].imageN++;
                    } else if (meteors[i].imageN == 2 && meteors[i].v == 1) {
                        meteors[i].image = imgMeteor3;
                    }
                }
                if (pouvoir != ballon && meteors[i].sup == false && pouvoir != gm) {
                    missiles[j].mk = true; // Suppression de la balle
                }
                
                //Generation des pouvoirs
                if (pouvoir == 'none' && meteors[i].v < 1 && cartePouvoir == 'none' && meteors[i].sup == false) { // Si le joueur n'a pas de pouvoir et qu un meteor est tue
                    if (/* getR(2) == 0 */getR(5, 0) == 3) { //db, gm, infinite, ballon
                        console.log('np');
                        cartePouvoir = new Card(pouvoirsD[getR(pouvoirsD.length)], meteors[i]);
                        //pouvoir = pouvoirsD[getR(pouvoirsD.length)];
                    }
                }
            }
        }
        if (collide(vaisseau, meteors[i]) && meteors[i].sup != true)
                    /* (vaisseau.x < meteors[i].x + meteors[i].w &&
                    vaisseau.x > meteors[i].x &&
                    vaisseau.y < meteors[i].y + meteors[i].h &&
                    vaisseau.y > meteors[i].y) 
                    ||
                    (meteors[i].x < vaisseau.x + vaisseau.w &&
                    meteors[i].x > vaisseau.x &&
                    meteors[i].y < vaisseau.y + vaisseau.h &&
                    meteors[i].y > vaisseau.y) */
            {
                gameStat = 1;
                displayMenus('dead', 1);

        } else if (collide(vaisseau, cartePouvoir)) {
            pouvoir = cartePouvoir.sorte;
            cartePouvoir = 'none';
        }
    }
}

function collide(objet1, objet2) {
    if (
        (
            objet1.x > objet2.x && objet1.x < objet2.x + objet2.w &&
            objet1.y > objet2.y && objet1.y < objet2.y + objet2.h
        )
        ||
        (
            objet2.x > objet1.x && objet2.x < objet1.x + objet1.w &&
            objet2.y > objet1.y && objet2.y < objet1.y + objet1.h
        )
        ||
        (
            objet1.x + objet1.w > objet2.x && objet1.x + objet1.w < objet2.x + objet2.w &&
            objet1.y + objet1.h > objet2.y && objet1.y + objet1.h < objet2.y + objet2.h
        )
        ||
        (
            objet2.x + objet2.w > objet1.x && objet2.x + objet2.w < objet1.x + objet1.w &&
            objet2.y + objet2.h > objet1.y && objet2.y + objet2.h < objet1.y + objet1.h
        )
    ) {
        return true;
    }
}

function restartGame() {
    vaisseau.x = (canvas.width - vaisseau.w) / 2;
    vaisseau.y = canvas.height - vaisseau.h - 10;
    missiles = [];
    meteors = [];
    gameStat = 0;
    timeStamp = 0;
    tm = 0;
    ts = 0;
    score = 0;
    nbrBalles = 20;
    tempsPouvoir = 0;
    pouvoir = 'none';
    cartePouvoir = 'none';
    vts = originVts;
    vts2 = vts;
}


// FONCTIONS DISPLAY ET EVENT LISTENER POUR CSS

function display() {
    canvas.style.marginTop = (window.innerHeight - canvas.height) / 2 + 'px';
    
    let copies = document.getElementsByClassName('copie');
    for (let i = 0; i < copies.length; i++) {
        copies[i].style.marginTop = (window.innerHeight - canvas.height) / 2 + 'px';
        //copies[i].style.right = (window.innerWidth) / 2 + 'px';
    }
}

function displayMenus(div, nb) { // 1 pour montrer, 2 pour cacher
    if (div == 'pause' && nb == 1) {
        chClass(document.getElementById('pause'), 1);
        //document.getElementById('pause').classList.toggle('cacher');
    } else if (div == 'pause' && nb == 2) {
        chClass(document.getElementById('pause'), 2);
        //document.getElementById('pause').classList.toggle('cacher');
    } else if (div == 'dead' && nb == 1) {
        chClass(document.getElementById('dead'), 1);
    } else if (div == 'dead' && nb == 2) {
        chClass(document.getElementById('dead'), 2);
    } else if (div == 'menu') {
        chClass(document.getElementById('menu'), nb);
    }    
    
}

function chClass(objet, nb1) {
    
    if (nb1 == 2) {                     // cacher
        isAnimating = true;
        objet.classList.toggle('cacher');
        setTimeout(function() {
            objet.classList.toggle('dspn');
            isAnimating = false;
        }, 600);
        // console.log(objet.classList);
    } else if (nb1 == 1) {               // montrer
        isAnimating = true;
        objet.classList.toggle('dspn');
        setTimeout(function() {
            objet.classList.toggle('cacher');
            isAnimating = false;    
        }, 100)
        //objet.classList.toggle('cacher');
    }
    
}

// EVENT LISTENER DES BOUTONS

var restartClass = document.getElementsByClassName('restart');

for (let i = 0; i < restartClass.length; i++) {
    restartClass[i].addEventListener('click', function() {
        if (isAnimating == false) {
            if (gameStat == 2) {
                displayMenus('pause', 2);
            } else if (gameStat == 1) {
                displayMenus('dead', 2);
            } else if (gameStat == 3) {
                displayMenus('menu', 2);
            }

            restartGame();
        } else {
            return;
        }
    });
}


var menuClass = document.getElementsByClassName('menuBtn');

for (let i = 0; i < menuClass.length; i++) {
    menuClass[i].addEventListener('click', function() {
        if (isAnimating == false) {
            if (gameStat == 2) {
                displayMenus('pause', 2);
            } else if (gameStat == 1) {
                displayMenus('dead', 2);
            }

            gameStat = 3;

            //Montrer le menu
            displayMenus('menu', 1);
        }
    });
}


document.getElementById('resume').addEventListener('click', function() {
    if (isAnimating == false) {
        gameStat = 0;
        displayMenus('pause', 2);
    } else {
        return;
    }
});

document.getElementById('oHtp').addEventListener('click', function() {
    if (isAnimating == false && divOnglet == 'none') {
        chClass(document.getElementById('howToPlay'), 1); // Montrer
        divOnglet = document.getElementById('howToPlay');
    } else {
        console.log('ERROR');
    }
});

document.getElementById('oMdj').addEventListener('click', function() {
    if (isAnimating == false && divOnglet == 'none') {
        chClass(document.getElementById('mdj'), 1); // Montrer
        divOnglet = document.getElementById('mdj');
    }
});

document.getElementById('oUpdate').addEventListener('click', function() {
    if (isAnimating == false && divOnglet == 'none') {
        chClass(document.getElementById('update'), 1);
        divOnglet = document.getElementById('update');
    }
});


var xClass = document.getElementsByClassName('x');

for (let i = 0; i < xClass.length; i++) {
    xClass[i].addEventListener('click', function() {
        if (isAnimating == false && divOnglet != 'none') {
            chClass(divOnglet, 2);
            divOnglet = 'none';
        } else {
            console.log('ERROR');
        }
    });
}


jeux();
display();