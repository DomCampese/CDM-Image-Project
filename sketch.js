/**
 * Focus effect on an image
 * 
 * References:
 * https://p5js.org/reference/#/p5.Image/pixels
 * https://p5js.org/examples/image-brightness.html
 * https://p5js.org/reference/#/p5/filter
 */

let blurredImg;
let originalImg;

function preload() {
    originalImg = loadImage('images/test.jpg');
    blurredImg = loadImage('images/test.jpg');
}

function setup() {
    const w = windowWidth;
    const h = windowHeight;
    createCanvas(w, h);
    pixelDensity(1);
    /* Apply a grayscale and blur filter to the images */
    blurredImg.filter(GRAY);
    blurredImg.filter(BLUR, 4); 
    blurredImg.loadPixels();
}

function draw() {
    /* Set pixels that are minDistance pixels or less away from cursor
       to transparent to reveal sharp image behind */
    const minDistance = 150
    for (let x = 0; x < blurredImg.width; x++) {
        for (let y = 0; y < blurredImg.height; y++) {
            let pixelLoc = (x + y * blurredImg.width) * 4; // 2d to 1d location
            let pixelDistanceFromMouse = dist(x, y, mouseX, mouseY);
            /* Results in a circle with radius minDistance */
            if (pixelDistanceFromMouse <= minDistance) {
                // This sets the current pixel to transparent
                blurredImg.pixels[pixelLoc + 3] = 0; // Pixel stored as [r, g, b, a] (a/alpha is transparency)
             } else {
                // Set opaque
                blurredImg.pixels[pixelLoc + 3] = 255;
            }
        }
    }
    blurredImg.updatePixels();
    image(originalImg, 0, 0);
    image(blurredImg, 0, 0); 
}
