"use strict";
const X_THRESHOLD = 0.1;
const TOUCH_DOWN = (x, y) => {
    if (x < -X_THRESHOLD) {
        LEFT_PAD = true;
    }
    else if (x > X_THRESHOLD) {
        RIGHT_PAD = true;
    }
    TriggerEvent();
};
const TOUCH_MOVED = (x, y) => { };
const TOUCH_UP = (x, y) => {
    if (x < -X_THRESHOLD) {
        LEFT_PAD = false;
    }
    else if (x > X_THRESHOLD) {
        RIGHT_PAD = false;
    }
    TriggerEvent();
};
const TriggerEvent = () => {
    const oldNumOfTouches = NUM_OF_TOUCHES;
    NUM_OF_TOUCHES = Number(LEFT_PAD) + Number(RIGHT_PAD);
    if (NUM_OF_TOUCHES == 1) { //I have added this as a temporary fix, as it stops the transition state between 2 - 0
        //the problem is when you remove both hands it doesn't go straight from 2 - 0, it goes 2 - 1 - 0
        NUM_OF_TOUCHES = 0;
    }
    if (NUM_OF_TOUCHES != oldNumOfTouches) {
        TouchesChanged();
    }
};
document.body.oncontextmenu = ($e) => {
    $e.preventDefault();
};
