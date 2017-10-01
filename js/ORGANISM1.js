// unlike a spore, and organism swims in a direction, feeds on spores to gain energy, and when it has enough energy it looks for a breeding partner. if it runs out of energy it will die, releasing spores back into the system.

var org1Settings = {
    speed: 3.5,
    minSpeed: 1.8,
    fluctuation: (TAU/360) * 12,
    rotationSpeed: 12,
    small: 16,
    large: 22,
    tail: 17,
    breedRange: 420,
    breedEnergy: 8,
    breedProximity: 20,
    feedRange: 260,
    feedCap: 20,
    feedProximity: 16,
    color: 'coral',
    soundAttack: 0.1,
    soundRelease: 3.5,
    soundVolume: 0.2,
    mouseRange: 600,
    mouseProximity: 20
};

//-------------------------------------------------------------------------------------------
//  INITIALISE
//-------------------------------------------------------------------------------------------

// contructor function for organism1 - similar to what we did for spore except now we're randomising a direction for our organism to head in

function Organism1(x1, y1, x2, y2) {
    this.settings = org1Settings;

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

// several types of behaviour to code
// update method could be improved in the future by separating each behaviour like breeding and feeding into its own method

Organism1.prototype.update = function() {

    // BREEDING //
    // similar to the feeding code, the breeding code checks if an organism has enough energy to breed before looping through any potential partners and seeing if they're close by
    // if so they'll head towards them and when close enough create a brand new instance of organism1
    if (this.energy > this.settings.breedEnergy) {
        var partner = null;
        var range = this.settings.breedRange;

        // check for potential partners //
        for (j=0; j<org1.length; j++) {
            var organism = org1[j];
            if (organism!== this && organism.energy > this.settings.breedEnergy && distanceBetweenPoints(this.position, organism.position) < range ) {
                partner = organism;
                range = distanceBetweenPoints(this.position, organism.position);
            }
        }
        if (partner) {
            // point towards partner //
            this.angleDest = angleBetweenPoints(this.position, partner.position);
            if (this.speed < partner.speed) {
                this.speed -= this.settings.fluctuation;
            } else {
                this.speed += this.settings.fluctuation;
            }

            // if close enough to partner, breed! //
            if (distanceBetweenPoints(this.position, partner.position) < this.settings.breedProximity) {
                var area = 10 * scale;
                generateOrganism1(1, this.position.x - area, this.position.y - area, this.position.x + area, this.position.y + area);
                generateVisual(this.position, this.size);
                soundEvent(this.settings.soundVolume, this.settings.soundAttack, this.settings.soundRelease);
                this.energy -= 5;
                partner.energy -= 5;
            }
        }
    }

    // FEEDING //
    // also create a need for feeding by making the organism's energy gradually deplete over time
    // code checks to see if the organism needs to eat, then loops through all available food to see if there is any in range, and if so adjusts its angle to point towards it
    if (!partner && this.energy < this.settings.feedCap) {
        var target = null;
        var range = this.settings.feedRange;
        for (j=0; j<spores.length; j++) {
            var organism = spores[j];
            if (organism.variant && distanceBetweenPoints(this.position, organism.position) < range ) {
                target = organism;
                range = distanceBetweenPoints(this.position, organism.position);
            }
        }
        if (target) {

            // point towards target //
            this.angleDest = angleBetweenPoints(this.position, target.position);

            // if close enough to target, eat it! //
            if (distanceBetweenPoints(this.position, target.position) < this.settings.feedProximity) {
                this.energy += (target.size * 1.5);
                target.kill();
            }
        }
    }


    // ENERGY //
    this.energy -= 0.005;
    if (this.energy <= 0) {
        this.kill();
    }

    // INTERACTION //

    if (mouseIsDown) {
        range = distanceBetweenPoints(this.position, organism.position);
        if (range < this.settings.mouseRange) {
        var mouseAngle = angleBetweenPoints(this.position, mousePosition);
        this.angleDest = mouseAngle;
        }
    
    // mouseProximity used for grow function, mouseRange for range to call the organisms towards the mouse

        if (range < this.settings.mouseProximity){
            this.size += 0.1;
        }
    }

    // size cap

    if (this.size > 50) {
        this.kill
    }

    // MOVEMENT //
    
    // instead of adding random numbers to the x axis and the y axis movement like in a spore, here we add a random number fluctuation to our angle, creating more of a swimming motion
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

// as well as some regular line drawing we have a loop where we connect a line between a stored history of previous positions, creating a trailing tail
// we're also rotating the drawing context to match the direction the organism is headed

Organism1.prototype.draw = function() {

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

// make is so that the organism can die
// when an organism1 dies, it gets deleted from the array of instances, and creates a cloud of spores in its places

Organism1.prototype.kill = function() {
removeFromArray(this, org1);
    var area = 30 * scale;
    generateSpores(this.size * 0.72, this.position.x - area, this.position.y - area, this.position.x + area, this.position.y + area);
    
    // kill method now calls the generateVisual function
    generateVisual(this.position, this.size);

    // kill method now calls soundEvent function to generate audio effect
    soundEvent(this.settings.soundVolume, this.settings.soundAttack, this.settings.soundRelease);
};


//-------------------------------------------------------------------------------------------
//  SPEED CAP
//-------------------------------------------------------------------------------------------

Organism1.prototype.speedCap = function() {
    this.speed = Math.min(this.speed,this.settings.speed);
    this.speed = Math.max(this.speed,this.settings.minSpeed);
};


//-------------------------------------------------------------------------------------------
//  WRAP
//-------------------------------------------------------------------------------------------

Organism1.prototype.wrap = function() {
    this.lastPositions = [];
};
