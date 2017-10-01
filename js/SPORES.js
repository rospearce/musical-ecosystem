
var sporeSettings = {
    speed: 1.6,
    fluctuation: 0.2,
    small: 1,
    large: 4,
    variation: 34,
    color: 'snow',
    highlight: 'coral',
    soundAttack: 0.02,
    soundRelease: 1.5,
    soundVolume: 0.5
};

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

// constructor function used to set up each new spore instance

function Spore(x1, y1, x2, y2) {
    this.settings = sporeSettings;

    // tombola.js library contains a set of premade functions for generating random numbers and chance events

    // randomise position between two coordinates (the width and height of the screen) //
    // Point is an object defined in the UTILS.js
    this.position = new Point(tombola.range(x1, x2), tombola.range(y1, y2));

    // change the size and make a visual variant so that there are two varieties of spores, and randomise some motion
    // randomise other properties //
    // rangeFloat(min,max) returns a float value aka a decimal value between min and max, and percent which randomly returns true or false
    this.size = tombola.rangeFloat(this.settings.small, this.settings.large);
    this.variant = tombola.percent(this.settings.variation);
    this.speedX = tombola.rangeFloat(-this.settings.speed, this.settings.speed);
    this.speedY = tombola.rangeFloat(-this.settings.speed, this.settings.speed);

}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

// this is where we create movement/animation for the spores. like the draw method it will be called every frame. update gets called first to slightly modify a spore's position then draw gets called to draw each spore at its new position creating animation

Spore.prototype.update = function() {

    // Randomly increase or decrease horizontal & vertical speeds //
    this.speedX += tombola.rangeFloat(-this.settings.fluctuation, this.settings.fluctuation);
    this.speedY += tombola.rangeFloat(-this.settings.fluctuation, this.settings.fluctuation);

    // Cap the max speed so it doesn't get out of control //
    //the methods speedCap and screenWrap have been prewritten. 
    // screenWrap creates a 50px margin around the edge of the canvas and ensures that spores/organisms swim back from the opposite side that they came out of.
    // speedCap ensures that the numbers don't get too big
    this.speedCap();

    // Update the position by adding the speed to it //
    this.position.x += this.speedX;
    this.position.y += this.speedY;

    // Wrap around the screen boundaries //
    screenWrap(this);

};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

// method of spore, gets called every frame to display and animate our spore instances//

Spore.prototype.draw = function() {

        // ctx is the context of the javascript canvas which is either 2d or 3d

        // set color //
        ctx.fillStyle = this.settings.color;
        ctx.strokeStyle = this.settings.highlight;

         // set size //
        ctx.lineWidth = 4 * scale;
        var s = this.size;

        // move to spore position //
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        // make it so that if variant = true then we draw a diamond shape for the spore's appearance
        /// draw //
        if (this.variant) {
            s *= 2;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.lineTo(s, 0);
            ctx.lineTo(0, s);
            ctx.lineTo(-s, 0);
            ctx.closePath();
            ctx.stroke();
        } else {
            ctx.fillRect(-s / 2, -s / 2, s, s);
        }

        // reset drawing position //
        ctx.restore();

};


//-------------------------------------------------------------------------------------------
//  KILL
//-------------------------------------------------------------------------------------------

// make it so that the spore can die. when killed spores is removed from the spore array and a visual is created

Spore.prototype.kill = function() {
    removeFromArray(this, spores);
    // kill method now calls the generateVisual function
    generateVisual(this.position, this.size);
    // kill method now generates audio effect
    soundEvent(this.settings.soundVolume, this.settings.soundAttack, this.settings.soundRelease);
};


//-------------------------------------------------------------------------------------------
//  SPEED CAP
//-------------------------------------------------------------------------------------------

Spore.prototype.speedCap = function() {
    this.speedX = Math.min(this.speedX,this.settings.speed);
    this.speedX = Math.max(this.speedX,-this.settings.speed);
    this.speedY = Math.min(this.speedY,this.settings.speed);
    this.speedY = Math.max(this.speedY,-this.settings.speed);
};


//-------------------------------------------------------------------------------------------
//  WRAP
//-------------------------------------------------------------------------------------------

Spore.prototype.wrap = function() {

};
