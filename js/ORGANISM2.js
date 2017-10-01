var org2Settings = {
    speed: 2.6,
    minSpeed: 1.1,
    fluctuation: (TAU/360) * 8,
    rotationSpeed: 6,
    small: 32,
    large: 38,
    tail: 22,
    breedRange: 600,
    breedEnergy: 35,
    breedProximity: 20,
    feedRange: 150,
    feedCap: 60,
    feedProximity: 25,
    color: 'orchid',
    soundAttack: 0.1,
    soundRelease: 3,
    soundVolume: 0.2
};

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function Organism2(x1, y1, x2, y2) {
    this.settings = org2Settings;

    // randomise position //
    this.position = new Point(tombola.range(x1, x2), tombola.range(y1, y2));
    this.lastPositions = [];

    // randomise angle //
    this.angle = tombola.rangeFloat(0, TAU);
    this.angleDest = this.angle;

    // randomise other properties //
    this.size = tombola.rangeFloat(this.settings.small, this.settings.large);
    this.speed = tombola.rangeFloat(this.settings.minSpeed, this.settings.speed);
    this.energy = tombola.rangeFloat(7,8);
}


//-------------------------------------------------------------------------------------------
//  UPDATE
//-------------------------------------------------------------------------------------------

Organism2.prototype.update = function() {

    // MOVEMENT //
    // Store a memory of previous positions //
    this.lastPositions.push( this.position.clone() );
    if (this.lastPositions.length > this.settings.tail) {
        this.lastPositions.shift();
    }

    // Randomly increase or decrease rotation & speed //
    this.angle = normaliseAngle(this.angle);
    this.angleDest += tombola.rangeFloat(-this.settings.fluctuation, this.settings.fluctuation);
    if ((this.angleDest - this.angle) > (TAU/2)) {
        this.angleDest -= TAU;
    }
    if ((this.angleDest - this.angle) < -(TAU/2)) {
        this.angleDest += TAU;
    }

    // smoothly transition to angle //
    this.angle = lerp(this.angle, this.angleDest, this.settings.rotationSpeed);
    this.speed += tombola.rangeFloat(-this.settings.fluctuation, this.settings.fluctuation);

    // Cap the max speed so it doesn't get out of control //
    this.speedCap();

    // Update the position by adding the seed to it //
    this.position.x += (this.speed * Math.cos(this.angle));
    this.position.y += (this.speed * Math.sin(this.angle));

    // Wrap around the screen boundaries //
    screenWrap(this);

};


//-------------------------------------------------------------------------------------------
//  DRAW
//-------------------------------------------------------------------------------------------

Organism2.prototype.draw = function() {

    // set color //
    ctx.fillStyle = this.settings.color;
    ctx.strokeStyle = this.settings.color;

    // set scale //
    ctx.lineWidth = 4 * scale;
    var s = this.size;

    // tail //
    if (this.lastPositions.length) {
        ctx.beginPath();
        ctx.moveTo(this.lastPositions[0].x, this.lastPositions[0].y);
        for (var j=0; j<this.lastPositions.length; j+=4) {
            ctx.lineTo(this.lastPositions[j].x, this.lastPositions[j].y);
        }
        ctx.stroke();
    }

    // head //
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(s * 0.75, s/2);
    ctx.lineTo(0, s * 1.25);
    ctx.moveTo(s * 0.75, -s/2);
    ctx.lineTo(0, -s * 1.25);

    ctx.moveTo(0, s/2);
    ctx.lineTo(s/2, 0);
    ctx.lineTo(0, -s/2);

    ctx.stroke();
    ctx.restore();

};


//-------------------------------------------------------------------------------------------
//  KILL
//-------------------------------------------------------------------------------------------

Organism2.prototype.kill = function() {

};


//-------------------------------------------------------------------------------------------
//  SPEED CAP
//-------------------------------------------------------------------------------------------

Organism2.prototype.speedCap = function() {
    this.speed = Math.min(this.speed,this.settings.speed);
    this.speed = Math.max(this.speed,this.settings.minSpeed);
};


//-------------------------------------------------------------------------------------------
//  WRAP
//-------------------------------------------------------------------------------------------

Organism2.prototype.wrap = function() {
    this.lastPositions = [];
};
