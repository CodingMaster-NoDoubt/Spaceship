let img1 = document.getElementById('imgVaisseau1');
let img2 = document.getElementById('imgVaisseau2');
let frameV = 1;
let frameVT = 0; // Temps

function persoSprite(ctx, leV, gamestat) {

    if (frameVT >= 5 && gameStat == 0) {
        if (frameV == 1) {
            frameV = 2;
        } else if (frameV == 2) {
            frameV = 1;
        }

        frameVT = 0;
    }

    if (frameV == 1) {
        ctx.drawImage(img1, leV.x, leV.y, leV.w, leV.h);
    } else if (frameV == 2) {
        ctx.drawImage(img2, leV.x, leV.y, leV.w, leV.h);
    }

    frameVT++;
}