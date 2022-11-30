
let img = document.getElementById('back');

let frame = 0;
let frame2 = frame - canvas.height;


function movingBack(ctx, canvas, vts) {
    ctx.drawImage(img, 0, frame, canvas.width, canvas.height);
    ctx.drawImage(img, 0, frame2, canvas.width, canvas.height);
    frame += vts;
    frame2 = frame - canvas.height;

    if (frame >= canvas.height) {
        frame = 0;
    }
}