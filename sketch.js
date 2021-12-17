/**
 * @author Dom Campese 09-27-2021
 * Creates an attention effect on a list of images and allows
 * the user to cycle through them
 * 
 * References:
 * Coding resources
 * https://p5js.org/reference/#/p5.Image/pixels
 * https://p5js.org/examples/image-brightness.html
 * https://p5js.org/reference/#/p5/filter
 * https://p5js.org/reference/#/p5/createButton
 * 
 * Images (All allow edits)
 * https://www.pexels.com/photo/person-holding-mug-and-mobile-phone-6802052/
 * https://www.pexels.com/photo/person-holding-bmw-steering-wheel-2526128/ 
 * https://www.flickr.com/photos/kimncris/5759421115/sizes/c/
 */

/* Image variables */
let images = [];
let currentImageSet = -1; // cycle at the start leading to set #0
let blurredImg;
let originalImg;

/* Attention circle variables */
const maxCircleRadius = 250;
const minCircleRadius = 50;
let currentCircleRadius = maxCircleRadius; // start at max
let isCircleShrinking = true;
const circleChangeRate = .08;

function preload() {
    /* Preload all images to be displayed to a 2d array 
       each row containing 2 copies of the image 
       (need blurred and normal for each image)
    */
    let imageFiles = [
        'images/driving_pov.jpg', 
        'images/work.jpg',
        'images/colorful_street.jpg', 
    ];
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
    let nextButton = createButton("Next");
    let t = true, f = false; 
    nextButton.position(windowWidth - 200, windowHeight / 2 - 30);
    nextButton.mousePressed(() => {
        cycleImage(true); // cycle to next
    });
    let previousButton = createButton("Prev");
    previousButton.position(50, windowHeight / 2 - 30);
    previousButton.mousePressed(() => {
        cycleImage(false); // cycle to previous
    });
}

// next parameter decides if next or previous
function cycleImage(next) {
    /* Display next image or first image again */
    if (next) {
        // Move forward or wrap around
        if (++currentImageSet >= images.length) {
            currentImageSet = 0; // display first image
        }
    } else {
        // Move backwards or wrap around
        if (--currentImageSet < 0) {
            currentImageSet = images.length-1;
        }
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
    frameRate(20);
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
