
// CANVAS //
var canvas;
var ctx;

// // MOUSE EVENTS //

// var mousePosition = new Point (0,0);


// METRICS //
var width = 0;
var height = 0;
var ratio = 1;
var scale = 1;
var TAU = 2 * Math.PI;

//INTERACTION
var mouseX = 0;
var mouseY = 0;
var mousePosition;
var mouseIsDown = false;



// ECO SYSTEM //
var visuals = [];
var spores = [];
var org1 = [];
var org2 = [];

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

// this function is called when the page loads

function init() {

    // SETUP CANVAS //
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // add canvas event listener

    // canvas.addEventListener("mousemove", function(event) {
    //     mousePosition.x = event.clientX;
    //     mousePosition.y = event.clientY;
    // });

    
    setupInteraction();

    // INITIALISE AUDIO //
    setupAudio();

    // GENERATE ORGANISMS //

    // so that generate functions are called when the page loads and organisms and spores are created //

    generateSpores(60, 0, 0, width, height);

    generateOrganism1(8, 0, 0, width, height);

    generateOrganism2(4, 0, 0, width, height);


    // BEGIN //
    loop();
}


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------

// for loops generate bunch of instances of spores/organisms within the given coordinates, saving them to an array //

function generateSpores(n, x1, y1, x2, y2) {

    for (var i=0; i<n; i++) {
        spores.push( new Spore(x1, y1, x2, y2) );
    }
}

function generateOrganism1(n, x1, y1, x2, y2) {
    for (var i=0; i<n; i++) {
        org1.push( new Organism1(x1, y1, x2, y2) );
    }
}

function generateOrganism2(n, x1, y1, x2, y2) {
    for (var i=0; i<n; i++) {
        org2.push( new Organism2(x1, y1, x2, y2) );
    }
}

// create an instance generate function for visual, (update and draw on its instances called below)

function generateVisual(position, size) {
    visuals.push( new Visual(position.x, position.y, size * 2) );
}


//-------------------------------------------------------------------------------------------
//  MAIN LOOP
//-------------------------------------------------------------------------------------------

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

function update() {

    // LOOP THROUGH ALL SPORES AND UPDATE THEIR POSITIONS //
    // updates the position of every instance of spore before they are drawn

    for (var i=0; i<spores.length; i++) {
        spores[i].update();
    }

    // LOOP THROUGH ALL ORGANISM1 AND UPDATE THEIR POSITIONS //

    for (var i=0; i<org1.length; i++) {
        org1[i].update();
    }


    // LOOP THROUGH ALL ORGANISM2 AND UPDATE THEIR POSITIONS //

    for (var i=0; i<org2.length; i++) {
        org2[i].update();
    }


    // LOOP THROUGH ALL VISUALS AND ANIMATE THEM //

    for (var i=0; i<visuals.length; i++) {
        visuals[i].update();
    }


}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {

    // FILL BACKGROUND COLOR //
    ctx.fillStyle = '#111133';
    ctx.fillRect(0, 0, width, height);

    // LOOP THROUGH ALL SPORES AND DRAW THEM //

    // so once have created instances of spores in an array we want to draw them. draw loop gets called 60 times per second //

    for (var i=0; i<spores.length; i++) {
        spores[i].draw();
    }


    // LOOP THROUGH ALL ORGANISM1 AND DRAW THEM //

    for (var i=0; i<org1.length; i++) {
        org1[i].draw();
    }


    // LOOP THROUGH ALL ORGANISM2 AND DRAW THEM //

    for (var i=0; i<org2.length; i++) {
        org2[i].draw();
    }


    // LOOP THROUGH ALL VISUALS AND DRAW THEM //

    for (var i=0; i<visuals.length; i++) {
        visuals[i].draw();
    }


    // DRAW TITLE //
    ctx.fillStyle = 'snow';
    ctx.textAlign = 'center';
    ctx.font = '400 ' + (35 * scale) + 'px Open Sans';
    ctx.fillText('S O N I S P O R E', width/2, height - (70 * scale));
}


//-------------------------------------------------------------------------------------------
//  SCREEN WRAP ORGANISMS
//-------------------------------------------------------------------------------------------

function screenWrap(instance) {
    var margin = 50;
    if (instance.position.x > (width + margin)) {
        instance.position.x = -margin;
        instance.wrap();
    }
    if (instance.position.x < -margin) {
        instance.position.x = width + margin;
        instance.wrap();
    }
    if (instance.position.y > (height + margin)) {
        instance.position.y = -margin;
        instance.wrap();
    }
    if (instance.position.y < -margin) {
        instance.position.y = height + margin;
        instance.wrap();
    }
}
