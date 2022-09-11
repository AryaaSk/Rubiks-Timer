let [LEFT_PAD, RIGHT_PAD, NUM_OF_TOUCHES] = [false, false, 0]; //0 = no hands down, 1 = one hand down, 2 = both hands down

const TIMER_INIT_DELAY = 1.5;
const TIMER_UNRESPONSIVE_DELAY = 1;
let TIMER_PREPARING = false;
let TIMER_INIT = false;
let TIMER_RUNNING = false;

let EPOCH_TIME_STARTED = 0;
let TIMER_INTERVAL: number;



const TouchesChanged = async () => {
    //there are 4 possible options when a touch is changed:
    //1: User wants to prepare timer - this is when the user first holds down and needs to wait for 2 seconds before the green light shows
    //2: User wants to init timer - this is not activated by a touch change, it is when the timer is prepared and the user can now let go to start
    //3: User wants to start timer - user lets go and starts timer
    //4 User wants to stop timer - user presses both pads to stop timer
    
    //below is a timeline explaining the different stages and which variables will be actvated
    //TIMER_PREPARING = x, TIMER_INIT = y, TIMER_RUNNING = z
    // (x=true,y=false,z=false)  (x=true,y=true,z=false)    (x=true,y=true,z=true)    (x=false,y=false,z=false)
    //|-------00:00 red--------|-------00:00 green-------|------ss:mm running-------|-------ss:mm stopped-------|

    if (NUM_OF_TOUCHES == 0) {
        //either the user cancelled the process, or trying to start the timer
        if (TIMER_PREPARING == true && TIMER_INIT == true && TIMER_RUNNING == false) {
            StartTimer();
        }
        else {
            ResetTimer();
        }
        return;
    }

    if (NUM_OF_TOUCHES == 1) {
        ResetTimer();
        return;
    }

    //everything after this assumes that both hands are on (numOfTouches == 2)
    if (TIMER_PREPARING == false) {
        await PrepareTimer(TIMER_INIT_DELAY);
        //don't return since the function won't be called again since there is no explicit motion from the user to go from preparing -> init
    }
    if (TIMER_PREPARING == true && TIMER_INIT == false) {
        InitTimer();
        return;
    }
    if (TIMER_PREPARING == true && TIMER_INIT == true && TIMER_RUNNING == true) {
        StopTimer();
        return;
    }
}



const PrepareTimer = async (seconds: number) => {
    const promise = new Promise((resolve) => {
        TIMER_PREPARING = true;

        ChangeTimerColour("red");
        setTimeout(() => {
            resolve(undefined);
        }, seconds * 1000);
    });
    return promise;
}
const InitTimer = () => {
    TIMER_INIT = true;

    SyncTimer(0);
    ChangeTimerColour("#0da20d");
}

const StartTimer = () => {
    TIMER_RUNNING = true;
    
    EPOCH_TIME_STARTED = Date.now();
    ChangeTimerColour("black");
    MaximiseTimer();
    TIMER_INTERVAL = setInterval(() => {
        const elapsedMs = Date.now() - EPOCH_TIME_STARTED;
        SyncTimer(elapsedMs);
    }, 16);
}

const StopTimer = () => {
    console.trace("Stop");

    const epochTimeStopped = Date.now();
    const totalMs = epochTimeStopped - EPOCH_TIME_STARTED;
    if (totalMs < TIMER_UNRESPONSIVE_DELAY * 1000) {
        return;
    }

    clearInterval(TIMER_INTERVAL);
    SyncTimer(totalMs);
    AddTime(totalMs);
    MinimiseTimer();
}

const ResetTimer = () => {
    console.trace("Reset");

    const epochTimeStopped = Date.now();
    const totalMs = epochTimeStopped - EPOCH_TIME_STARTED;
    if (totalMs < TIMER_UNRESPONSIVE_DELAY * 1000) {
        return;
    }

    TIMER_PREPARING = false;
    TIMER_INIT = false;
    TIMER_RUNNING = false;

    ChangeTimerColour("black");
}



const timer = document.getElementById("timer")!;
const SyncTimer = (currentTimeMS: number) => {
    const formatted = FormatTime(currentTimeMS);
    timer.innerText = formatted;
}

const ChangeTimerColour = (colour: string) => {
    timer.style.color = colour;
}

const FormatTime = (ms: number) => {
    const seconds = ms / 1000;
    let formatted = String(seconds).replace(".", ":");

    if (formatted.split("").indexOf(":") == -1) {
        formatted += ":00";
    }
    try {
        if (formatted.split(":")[1].length > 2) {
            formatted = formatted.slice(0, -1); //remove 3rd decimal point if it is there
        }
        if (formatted.split(":")[1].length == 1) {
            formatted += "0" //goes from ss:m -> ss:m0
        }
    }
    catch {}
    if (formatted.length == 4) {
        formatted = "0" + formatted; //goes from s:mm -> 0s:mm
    }
    return formatted;
}



const MaximiseTimer = () => {
    document.body.style.gridTemplateColumns = "0 100%";
    document.getElementById("timesContainer")!.style.visibility = "hidden";
}
const MinimiseTimer = () => {
    document.body.style.gridTemplateColumns = "";
    document.getElementById("timesContainer")!.style.visibility = "";
}