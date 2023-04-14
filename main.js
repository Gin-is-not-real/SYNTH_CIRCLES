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
const btnStop = document.getElementById('master-stop');
const inpStep = document.getElementById('inp-steps');
const inpBpm = document.getElementById('inp-bmp');
const btnRefresh = document.getElementById('btn-refresh');

const inpVoices1 = document.getElementById('inp-voices-1');
const inpVoices2 = document.getElementById('inp-voices-2');
const btnVoices1 = document.getElementById('btn-voices-1');
const btnVoices2 = document.getElementById('btn-voices-2');

const sqCanvas = document.getElementById('canvas-seq');
const syCanvas = document.getElementById('canvas-synth');
const syCanvas2 = document.getElementById('canvas-synth2');


///////////////////////////////////////////
// INSTANCES

let synth = new BasicPolySynth(3, REF_NOTES);
synth.outputNode.connect(masterCtx.inputNode);

let synth2 = new BasicPolySynth(3, REF_NOTES);
synth2.outputNode.connect(masterCtx.inputNode);


let circleSynth = new GraphCircularSynth(syCanvas, syCanvas.width/2, syCanvas.width/2, (syCanvas.width/2) -30);
circleSynth.init(synth.notesList.length);
circleSynth.target = synth;
circleSynth.maxEnablesSteps = circleSynth.target.nbrOfVoices;

let circleSynth2 = new GraphCircularSynth(syCanvas2, syCanvas2.width/2, syCanvas2.width/2, (syCanvas2.width/2) -30);
circleSynth2.init(synth2.notesList.length);
circleSynth2.target = synth2;
circleSynth2.maxEnablesSteps = circleSynth2.target.nbrOfVoices;


let circleSeq = new GraphCircularSequencer(sqCanvas, sqCanvas.width/2, sqCanvas.width/2, (sqCanvas.width/2) -50);
circleSeq.init(16);
circleSeq.targets = [circleSynth, circleSynth2];
///////////////////////////////////////////
// FUNCTION
/**
 * Receive controls data {id} from synth controler, get notes frequencies associate, and trig oscs  
 * @param {Object} data data = {id}
 */
synth.receiveControls = function(data) {
    for(let i = 0; i < data.length; i++) {
        let f = this.notesList[data[i].id].frequency;
        this.trig(this.oscList[i], f)
    }
}
synth2.receiveControls = function(data) {
    for(let i = 0; i < data.length; i++) {
        let f = this.notesList[data[i].id].frequency;
        this.trig(this.oscList[i], f)
    }
}



///////////////////////////////////////////
// MAIN
circleSeq.selectStep(circleSeq.controls.steps[0]);


///////////////////////////////////////////
// EVENTS
let intervalId;
/*
1m = 60 000ms
1bpm = 60 000ms/1bat
*/
const minToMs = 60000;
let bpm = 130;


btnPlay.addEventListener('click', function(e) {
    let count = 0;
    
    if(intervalId === undefined) {
        intervalId = setInterval(function() {
            let step = circleSeq.controls.steps[count];
    
            circleSeq.playStep(step);
            
            count = count === circleSeq.nbrOfSteps -1 ? 0 : count +1;
        }, minToMs/bpm)
    }
})

btnStop.addEventListener('click', function() {
    clearInterval(intervalId);
    intervalId = undefined;
    circleSeq.playedStep = undefined;
    circleSeq.drawCanvas();
})

inpBpm.addEventListener('input', function(e) {
    bpm = parseInt(e.target.value);
})

btnRefresh.addEventListener('click', function() {
    let nbrOfSteps = inpStep.value;
    //init sequencer with new nbr of steps
    circleSeq.init(nbrOfSteps);
    circleSynth.init();
    circleSynth2.init();
})



btnVoices1.addEventListener('click', function() {
    synth.nbrOfVoices = inpVoices1.value;
    synth.init();
    circleSynth.maxEnablesSteps = synth.nbrOfVoices;
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
circleSynth2.canvas.addEventListener('click', (e) => {
    let isPointTouched = false;

    // check if a point has been touched
    circleSynth2.controls.steps.forEach(step => {

        if(circleSynth2.ctx.isPointInPath(step.path, e.offsetX, e.offsetY)) {
            circleSynth2.controlStepActivation(step);

            isPointTouched = true;
            return;
        }
    })

    if(isPointTouched === false) {
        if(circleSynth2.ctx.isPointInPath(circleSynth2.controls.circle.path, e.offsetX, e.offsetY)) {
            circleSynth2.controlCircleActivation();
        }
    }
})