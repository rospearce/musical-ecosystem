var org3Settings = {
    speed: 0.8,
    minSpeed: 1.2,
    fluctuation: (TAU/360) * 8,
    rotationSpeed: 2,
    small: 65,
    large: 91,
    breedRange: 400,
    breedEnergy: 7,
    breedProximity: 30,
    feedRange: 260,
    feedCap: 20,
    feedProximity: 26,
    color: "rgba(24,76,143,0.5)",
    soundAttack: 0.1,
    soundRelease: 3,
    soundVolume: 0.2
};

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

function Organism3(x1, y1, x2, y2) {
    this.settings = org3Settings;

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

Organism3.prototype.update = function() {

    // ENERGY //

    this.energy -= 0.0025;
    if (this.energy <= 0) {
        this.kill();
    }

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

Organism3.prototype.draw = function() {

    // set color //
    ctx.globaAlpha = this.settings.alpha;
    ctx.fillStyle = this.settings.color;
    ctx.strokeStyle = this.settings.color;

    // set scale //
    ctx.lineWidth = 4 * scale;
    var s = this.size;

    // body //
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(s/4, 0);
    ctx.lineTo(((s/4)*3), 0);
    ctx.quadraticCurveTo(s, 0, s, s/4);
    ctx.quadraticCurveTo(s, s/2, ((s/4)*3), s/2);
    ctx.lineTo(s/4, s/2);
    ctx.quadraticCurveTo(0, s/2, 0, s/4);
    ctx.quadraticCurveTo(0, 0, s/4, 0);
    ctx.stroke();

    ctx.restore();

};


//-------------------------------------------------------------------------------------------
//  KILL
//-------------------------------------------------------------------------------------------

Organism3.prototype.kill = function() {
    removeFromArray(this, org3);
    var area = 10 * scale;
    generateOrganism3(2 || 0 || 0, this.position.x - area, this.position.y - area, this.position.x + area, this.position.y + area);
    generateVisual(this.position, this.size);
};

//-------------------------------------------------------------------------------------------
//  SPEED CAP
//-------------------------------------------------------------------------------------------

Organism3.prototype.speedCap = function() {
    this.speed = Math.min(this.speed,this.settings.speed);
    this.speed = Math.max(this.speed,this.settings.minSpeed);
};


//-------------------------------------------------------------------------------------------
//  WRAP
//-------------------------------------------------------------------------------------------

Organism3.prototype.wrap = function() {
    this.lastPositions = [];
};

