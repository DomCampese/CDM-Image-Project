/**
 * Focus effect on an image
 * 
 * References:
 * 
 * Code tutorials
 * https://p5js.org/reference/#/p5.Image/pixels
 * https://p5js.org/examples/image-brightness.html
 * https://p5js.org/reference/#/p5/filter
 * https://www.youtube.com/watch?v=Pn1g1wjxl_0
 * 
 * Images (All allow edits)
 * https://www.flickr.com/photos/kimncris/5759421115/sizes/c/
 * https://www.pexels.com/photo/person-holding-bmw-steering-wheel-2526128/
 * 
 */

/* Image variables */
let images = [];
let currentImageSet = -1;
let blurredImg;
let originalImg;

/* Attention circle variables */
const maxCircleRadius = 150;
const minCircleRadius = 50;
let currentCircleRadius = maxCircleRadius; // start at max
let isCircleShrinking = true;
const circleChangeRate = .05;

function preload() {
    /* Preload all images to be displayed to a 2d array 
       each row containing 2 copies of the image 
       (need blurred and normal for each image)
    */
    let imageFiles = ['images/colorful_street.jpg', 'images/driving_pov.jpg'];
    for (let i = 0; i < imageFiles.length; i++) {
        images.push(
            [loadImage(imageFiles[i]), loadImage(imageFiles[i])]
        );
    }
}

function setup() {
    pixelDensity(1);
    cycleImage();
    createCanvas(originalImg.width, originalImg.height);
    let button = createButton("Next Scene");
    button.position(0, 0);
    button.mousePressed(cycleImage);
}

function cycleImage() {
    /* Display next image or first image again */
    if (++currentImageSet >= images.length) {
        currentImageSet = 0; // display first image
    }

    // Set image variables to the next in the list
    originalImg = images[currentImageSet][0];
    // Filter the image directly in array - gets darker and blurrier
    // as you cycle through
    images[currentImageSet][1].filter(BLUR, 5);
    images[currentImageSet][1].filter(GRAY);
    blurredImg = images[currentImageSet][1];
    
    // Set up new image
    blurredImg.loadPixels();
    resizeCanvas(blurredImg.width, blurredImg.height);
}

function draw() {
    /* Set pixels within circle to tranparent to reveal unfiltered image behind */
    for (let x = 0; x < blurredImg.width; x++) {
        for (let y = 0; y < blurredImg.height; y++) {
            let pixelLoc = (x + y * blurredImg.width) * 4; // 2d to 1d location
            let pixelDistanceFromMouse = dist(x, y, mouseX, mouseY);
            // Results in a circle with radius minDistance
            if (pixelDistanceFromMouse <= currentCircleRadius) {
                // This sets the current pixel to transparent
                blurredImg.pixels[pixelLoc + 3] = 0; // Pixel stored as [r, g, b, a] (a/alpha is transparency)
            } else {
                blurredImg.pixels[pixelLoc + 3] = 255;
            }
        }
    }

    // Change state to shrinking or growing depending on circle radius
    if (currentCircleRadius >= maxCircleRadius) {
        isCircleShrinking = true; // start shrinking
    }
    if (currentCircleRadius <= minCircleRadius) {
        isCircleShrinking = false; // start growing
    }

    // Carry out the actual shrinking
    if (isCircleShrinking) {
        currentCircleRadius -= circleChangeRate; // Circle shrinks over time
    } else {
        currentCircleRadius += circleChangeRate;
    }
    
    blurredImg.updatePixels();
    image(originalImg, 0, 0);
    image(blurredImg, 0, 0); 
}
