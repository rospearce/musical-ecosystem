
// CANVAS //
var canvas;
var ctx;


// METRICS //
var width = 0;
var height = 0;
var ratio = 1;
var scale = 1;
var TAU = 2 * Math.PI;


// ECO SYSTEM //
var visuals = [];
var spores = [];
var org1 = [];
var org2 = [];

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function init() {

    // SETUP CANVAS //
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    // SET CANVAS & DRAWING POSITIONS //
    metrics();

    // INITIALISE AUDIO //
    setupAudio();

    // GENERATE ORGANISMS //


    // BEGIN //
    loop();
}


//-------------------------------------------------------------------------------------------
//  GENERATE
//-------------------------------------------------------------------------------------------

function generateSpores() {
}

function generateOrganism1() {
}

function generateOrganism2() {
}

function generateVisual() {
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


    // LOOP THROUGH ALL ORGANISM1 AND UPDATE THEIR POSITIONS //


    // LOOP THROUGH ALL ORGANISM2 AND UPDATE THEIR POSITIONS //


    // LOOP THROUGH ALL VISUALS AND ANIMATE THEM //


}


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

function draw() {

    // FILL BACKGROUND COLOR //
    ctx.fillStyle = '#111133';
    ctx.fillRect(0, 0, width, height);

    // LOOP THROUGH ALL SPORES AND DRAW THEM //


    // LOOP THROUGH ALL ORGANISM1 AND DRAW THEM //


    // LOOP THROUGH ALL ORGANISM2 AND DRAW THEM //


    // LOOP THROUGH ALL VISUALS AND DRAW THEM //


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
