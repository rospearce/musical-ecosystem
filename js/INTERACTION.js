//interaction


function setupInteraction() {
    canvas.addEventListener("mousedown", mousePress, false);
    canvas.addEventListener("mouseup", mouseRelease, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    // keypress event must be done to the window
    //window.addEventListener("keypress", key, false )
}

// mouse events

function mouseMove(event) {
    mouseX = event.pageX * ratio;
    mouseY = event.pageY * ratio;
    mousePosition = new Point(mouseX, mouseY);
    // console.log(mousePosition);
    rolloverCheck();
}

function mousePress() {
    mouseIsDown = true;
    rolloverCheck();
}

function mouseRelease() {
    mouseIsDown = false;
}

function rolloverCheck () {
    var test = hitBox(0, 0, width, height);
}

// key events

function key (event) {
    // do stuff
}