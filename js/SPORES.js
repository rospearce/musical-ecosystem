
var sporeSettings = {
    speed: 1.6,
    fluctuation: 0.2,
    small: 1,
    large: 4,
    variation: 34,
    color: 'snow',
    highlight: 'coral',
    soundAttack: 0.02,
    soundRelease: 0.12,
    soundVolume: 0.5
};

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function Spore() {
    this.settings = sporeSettings;

    // randomise position //
    this.position = new Point(tombola.range(x1, x2), tombola.range(y1, y2));
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

Spore.prototype.update = function() {

};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

Spore.prototype.draw = function() {

};


//-------------------------------------------------------------------------------------------
//  KILL
//-------------------------------------------------------------------------------------------

Spore.prototype.kill = function() {

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
