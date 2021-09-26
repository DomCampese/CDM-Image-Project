/**
 * Focus effect on an image
 * 
 * References:
 * https://p5js.org/reference/#/p5.Image/pixels
 * https://p5js.org/examples/image-brightness.html
 * https://p5js.org/reference/#/p5/filter
 */

let lastMousePosition;
let blurredImg;
let originalImg;
let circleRadius = 150;
const shrinkRate = .05;

function preload() {
    originalImg = loadImage('images/test.jpg');
    blurredImg = loadImage('images/test.jpg');
}

function setup() {
    createCanvas(originalImg.width, originalImg.height);
    pixelDensity(1);
    // Apply a grayscale and blur filter to the images
    blurredImg.filter(GRAY);
    blurredImg.filter(BLUR, 6); 
    blurredImg.loadPixels();
}

function draw() {
    /* Set pixels within circle to tranparent to reveal unfiltered image behind */
    for (let x = 0; x < blurredImg.width; x++) {
        for (let y = 0; y < blurredImg.height; y++) {
            let pixelLoc = (x + y * blurredImg.width) * 4; // 2d to 1d location
            let pixelDistanceFromMouse = dist(x, y, mouseX, mouseY);
            // Results in a circle with radius minDistance
            if (pixelDistanceFromMouse <= circleRadius) {
                // This sets the current pixel to transparent
                blurredImg.pixels[pixelLoc + 3] = 0; // Pixel stored as [r, g, b, a] (a/alpha is transparency)
            } else if (blurredImg.pixels[pixelLoc + 3] == 0) {
                    blurredImg.pixels[pixelLoc + 3] = 255;
            }
        }
    }
    circleRadius -= shrinkRate; // Circle shrinks over time
    blurredImg.updatePixels();
    image(originalImg, 0, 0);
    image(blurredImg, 0, 0); 
    lastMousePosition = [mouseX, mouseY];
}
