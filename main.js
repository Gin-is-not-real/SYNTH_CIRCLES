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

const inpStep = document.getElementById('inp-steps');
const sqCanvas = document.getElementById('canvas-seq');
const syCanvas = document.getElementById('canvas-synth');



///////////////////////////////////////////
// INSTANCES
let graphSq = new GraphControler(sqCanvas, sqCanvas.width/2, sqCanvas.width/2, (sqCanvas.width/2) -50);
let graphSyn = new GraphControler(syCanvas, syCanvas.width/2, syCanvas.width/2, (syCanvas.width/2) -30);

let synth = new BasicPolySynth(3, REF_NOTES);
synth.outputNode.connect(masterCtx.inputNode);



///////////////////////////////////////////
// tests


///////////////////////////////////////////
// MAIN
init();

/*
init separés
meilleur modes de declenchement
*/

///////////////////////////////////////////
// FUNCTION
function init() {
    graphSq.init(inpStep.value);
    graphSq.selectedStep = 0;
    graphSq.draw();


    graphSyn.init(12);
    graphSyn.draw();
    graphSyn.sequence = new Array(parseInt(inpStep.value));
}


graphSq.pointActivation = function(pnt) {
    graphSq.enablePoint(pnt);
    graphSq.selectedStep = pnt.index;

    graphSyn.receiveControlPoint(pnt);
}    


graphSyn.receiveControlPoint = function(stepPnt) {
    // disable all points
    graphSyn.points.forEach(pnt => {
        graphSyn.enablePoint(pnt, false);
    });


    // enable point from sequence
    let synSeq = graphSyn.sequence[stepPnt.index];
    
    if(synSeq !== undefined) {
        
        for(let i = 0; i < synSeq.length; i++) {
            let pnt = synSeq[i];
            graphSyn.enablePoint(pnt, true);
        }

        if(stepPnt.isEnable) {
            graphSyn.sendControlPoint(synth, synSeq);
        }
    }
}

graphSyn.pointActivation = function(pnt) {
    let seqIndex = parseInt(graphSq.selectedStep) || 0;

    // get or init the step sequence
    let synthSeqStep;
    if(graphSyn.sequence[seqIndex] === undefined) {
        graphSyn.sequence[seqIndex] = new Array(0);
    }
    synthSeqStep = graphSyn.sequence[seqIndex];
    

    // if the point is disable
    if(pnt.isEnable === false) {

        if(synthSeqStep.length < synth.nbrOfVoices) {
            this.enablePoint(pnt);

            // update point value and add them on sequence step
            pnt.frequency = synth.notesList[pnt.index].frequency;
            pnt.oscIndex = synthSeqStep.length;
            synthSeqStep.push(pnt);

            graphSyn.sendControlPoint(synth, [pnt]);
        }
    }
    
    else if(pnt.isEnable === true) {
        this.enablePoint(pnt);
        // remove from seq step list
        synthSeqStep.splice(synthSeqStep.indexOf(pnt), 1);
    }

}


graphSyn.sendControlPoint = function(target, controls) {
    // let synthSeqStep = graphSyn.sequence[graphSq.selectedStep];

    controls.forEach(pnt => {
        target.trig(target.oscList[pnt.oscIndex], pnt.frequency);
    })
}







///////////////////////////////////////////
// GRAPH EVENTS
inpStep.addEventListener('input', () => {
    init();
})

graphSq.canvas.addEventListener('click', (e) => {
    graphSq.points.forEach(pnt => {
        const isPointInPath = graphSq.ctx.isPointInPath(pnt.path, e.offsetX, e.offsetY);

        if(isPointInPath) {
            graphSq.pointActivation(pnt);
        }
    })
});



graphSyn.canvas.addEventListener('click', (e) => {
    let isPointTouched = false;

    // check if a point has been touched
    graphSyn.points.forEach(pnt => {

        if(graphSyn.ctx.isPointInPath(pnt.path, e.offsetX, e.offsetY)) {
            graphSyn.pointActivation(pnt);

            if(pnt.isEnable) {
                isPointTouched = true;
                return;
            }
        }
    })


    if(!isPointTouched) {
        console.log('not point');
        let synthSeqStep = graphSyn.sequence[graphSq.selectedStep];
        graphSyn.sendControlPoint(synth, synthSeqStep);
    }
});


graphSyn.canvas.addEventListener('mousedown', (e) => {
    // synth.testoscList(graphSyn.sequence[graphSq.selectedStep]);
})