// uses Web Audio API to create and control sound in the browser

var audioCtx;
var limiter;
var delay;
var tune;
var output;
// var reverb; possible to add reverb too (rest not set up)

var whiteNotes = [-12,-10,-8,-7,-5,-3,-1,0,2,4,5,7,9,11,12];  // could add array of own samples here. could also perhaps use soundcloud API. could use HTML 5 audio tag to play stuff alongside, could also use to get frequency and make visualisations

//-------------------------------------------------------------------------------------------
//  SETUP
//-------------------------------------------------------------------------------------------

// sets up our musical scale and overall sound volume, as well as a delay effect which we'll be connecting our random sounds to
// using a javascript library called tone.js to make things simpler

function setupAudio() {

    // SCALE //
    tune = new Tune();
    tune.loadScale('ji_12');
    tune.tonicize(440);

    // MASTER VOL //
    Tone.Master.volume.value = -3;
    audioCtx = Tone.context;

    limiter = new Tone.Limiter(-1);
    limiter.toMaster();

    // could change delay to reverb or connect output to limiter instead of delay

    delay = new Tone.PingPongDelay(0.10);
    delay.connect(limiter);

    // reverb = new Tone.JCReverb() // possible to add reverb (look at API)

    // synth = new Tone.MetalSynth(); // etc. could set up synths instead of an Oscillator


    // was originally output = delay; but can change to output = limiter if you want to skip the delay
    output = delay;
}


//-------------------------------------------------------------------------------------------
//  AUDIO EVENT
//-------------------------------------------------------------------------------------------

// function randomiseDelay() {
    // pick a delay between 0.1 0.8
    // delay.delayTime.value = tombola.rangeFloat (0.1, 0.8);
// }

// this gets called whenever an organism breeds or dies //
// going to create an oscillator as our sound source, which allows us to generate a tone at a given pitch
// we'll be connecting that to a gain node, which allows us to effect the volume. we connect the gain to our output
function soundEvent(volume, attack, release) {

    // randomiseDelay(); // call delay change with every sound event

    // configure the time and pitch //
    // use tombola to select a note from our scale at random
    var now = audioCtx.currentTime;
    var duration = attack + release;
    var note = tune.note(tombola.item(whiteNotes));
    // console.log(note);

    // create the oscillator and gain nodes //
    // oscillator is the very basics of synthesis which generates a tone at a given frequency. gain controls volume over time
    // default of oscillator is a sine wave. could change to 'triangle' or 'square' (more abrasive) eg. Oscillator(note, triangle)
    var osc = new Tone.Oscillator(note);
    var amp = audioCtx.createGain();

    // connect the oscillator and gain to the output //
    osc.connect(amp);
    amp.connect(output);

    // setup the volume envelope //
    // quickly ramp up the volume for an attack, then after a while smoothly reduce it again
    // controlling the volume of a sound like this si described as its envelope
    amp.gain.setValueAtTime(0, now);
    amp.gain.linearRampToValueAtTime(volume, now + attack);
    amp.gain.exponentialRampToValueAtTime(0.00001, now + duration);

    // start the sound and schedule it stopping //
    osc.start();
    // stop the sound once it has played its duration
    osc.stop('+' + (duration * 1.1));

}
