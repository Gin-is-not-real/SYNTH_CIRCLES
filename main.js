///////////////////////////////////////////
// CONSTS
const REF_NOTES = [
    {frequency: 261.63, FR: "do", EN: "C", key: "q"},
    {frequency: 277.18, FR: "do#", EN: "C#", key: "z"},
    {frequency: 293.66, FR: "ré", EN: "D", key: "s"},
    {frequency: 311.13, FR: "ré", EN: "D#", key: "e"},
    {frequency: 329.63, FR: "mi", EN: "E", key: "d"},
    {frequency: 349.24, FR: "fa", EN: "F", key: "f"},
    {frequency: 369.99, FR: "fa#", EN: "F#", key: "t"},
    {frequency: 392, FR: "sol", EN: "G", key: "g"},
    {frequency: 415.3, FR: "sol#", EN: "G#", key: "y"},
    {frequency: 440, FR: "la", EN: "A", key: "h"},
    {frequency: 466.16, FR: "la#", EN: "A#", key: "u"},
    {frequency: 493.88, FR: "si", EN: "B", key: "j"},
];


const btnPlay = document.getElementById('master-play');
const inpStep = document.getElementById('inp-steps');
const btnRefresh = document.getElementById('btn-refresh');
const sqCanvas = document.getElementById('canvas-seq');
const syCanvas = document.getElementById('canvas-synth');



///////////////////////////////////////////
// INSTANCES

let synth = new BasicPolySynth(3, REF_NOTES);
synth.outputNode.connect(masterCtx.inputNode);


let circleSeq = new GraphCircularSequencer(sqCanvas, sqCanvas.width/2, sqCanvas.width/2, (sqCanvas.width/2) -50);
circleSeq.init();

let circleSynth = new GraphCircularSynth(syCanvas, syCanvas.width/2, syCanvas.width/2, (syCanvas.width/2) -30);
circleSynth.changeNbrOfSteps(synth.notesList.length);
circleSynth.maxEnablesSteps = synth.nbrOfVoices;

// circleSynth.memory = new Array(circleSeq.nbrOfVoices);

///////////////////////////////////////////
// FUNCTION
/**
 * Receive controls data {id} from synth controler, get notes frequencies associate, and trig oscs  
 * @param {Object} data data = {id}
 */
synth.receiveControls = function(data) {
    for(let i = 0; i < data.length; i++) {
        let f = synth.notesList[data[i].id].frequency;
        synth.trig(synth.oscList[i], f)
    }
}

/////////////////////////

/**
 * Called by a click on the graph synth circle path. 
 * Send enablesSteps to the sound generator by calling this receiveControls function for each enable step
 */
circleSynth.sendControlCircle = function() {
    let data = [];
    circleSynth.enablesSteps.forEach(step => {
        data.push({id: step.id});
    })
    synth.receiveControls(data);
}

/**
 * Called by this.controlStepActivation function. Send the id of the graph synth step activated to the sound generator by calling this receiveControls function
 * @param {Object} step 
 */
circleSynth.sendControlStep = function(step) {
    if(step.isEnable === true) {
        let data = [{id: step.id}];
        synth.receiveControls(data);
    }
}

/**
 * Called by the sequencer sendControlStep function.
 * 
 * Record enablesSteps on the memory line corresponding to the old sequencer selectedStep
 * 
 * clear enablesSteps and disable all steps 
 * 
 * load the memory line according to the sequencer new selectedStep
 * 
 * @param {Array of Object} data an array containing two objects with id property; the old sequencer selectedStep and the new.
 */
circleSynth.receiveControls = function(data) {
    // rec old enables step on memory 
    circleSynth.memory[data[0].id] = [];
    circleSynth.enablesSteps.forEach(step => {
        circleSynth.memory[data[0].id].push(step);
    })

    // reset
    this.enablesSteps.forEach(step => {
        step.isEnable = false;
    })
    circleSynth.enablesSteps = [];

    // load new memory
    if(circleSynth.memory[data[1].id] !== undefined) {

        circleSynth.memory[data[1].id].forEach(mem => {
            this.stepEnable(mem);
        })
    }

    this.drawCanvas();
    this.sendControlCircle();
}

/////////////////////////
/**
 * Called by this.selectStep(). 
 * Send old an new selectedStep id to the synth controler
 * 
 * 
 * @param {Object} oldStep the old sequencer selectedStep
 * @param {*} newStep the new sequencer selectedStep
 */
circleSeq.sendControlStep = function(oldStep, newStep) {
    let data = [{id: oldStep.id}, {id: newStep.id}];
    circleSynth.receiveControls(data);
}
///////////////////////////////////////////
// MAIN
circleSeq.selectStep(circleSeq.controls.steps[0]);


///////////////////////////////////////////
// GRAPH EVENTS
btnPlay.addEventListener('click', function(e) {
    console.log(e.target.value)

    let speed = 600;
    let count = 0;
    
    setInterval(function() {
        let step = circleSeq.controls.steps[count];
        console.log(count, step)

        circleSeq.selectStep(step);

        
        count = count === circleSeq.nbrOfSteps -1 ? 0 : count +1;
    }, speed)

})

btnRefresh.addEventListener('click', function() {
    let steps = inpStep.value;
    //init sequencer with new nbr of steps
    circleSeq.changeNbrOfSteps(steps);
    circleSynth.init();
})


circleSeq.canvas.addEventListener('click', (e) => {
    // verifier si un point est touché
    circleSeq.controls.steps.forEach(pnt => {
        const isPointInPath = circleSeq.ctx.isPointInPath(pnt.path, e.offsetX, e.offsetY);

        if(isPointInPath) {
            circleSeq.controlStepActivation(pnt);
        }
    })
});

circleSynth.canvas.addEventListener('click', (e) => {
    let isPointTouched = false;

    // check if a point has been touched
    circleSynth.controls.steps.forEach(step => {

        if(circleSynth.ctx.isPointInPath(step.path, e.offsetX, e.offsetY)) {
            circleSynth.controlStepActivation(step);

            isPointTouched = true;
            return;
        }
    })


    if(isPointTouched === false) {
        if(circleSynth.ctx.isPointInPath(circleSynth.controls.circle.path, e.offsetX, e.offsetY)) {
            circleSynth.controlCircleActivation();
        }
    }
})