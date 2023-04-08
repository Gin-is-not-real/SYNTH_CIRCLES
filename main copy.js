///////////////////////////////////////////
// CONSTS
const inpStep = document.getElementById('inp-steps');
const sqCanvas = document.getElementById('canvas-seq');
const syCanvas = document.getElementById('canvas-synth');

///////////////////////////////////////////
// GRAPH
let graphSq = new GraphControler(sqCanvas, sqCanvas.width/2, sqCanvas.width/2, (sqCanvas.width/2) -50);

let graphSyn = new GraphControler(syCanvas, syCanvas.width/2, syCanvas.width/2, (syCanvas.width/2) -30);

///////////////////////////////////////////
// AUDIO
// synth 3 voies

class PolySynth {
    notesList;

    nbrOfVoices;
    oscList;

    constructor(voices, notesArray) {
        this.notesList = notesArray;

        this.nbrOfVoices = voices;
        
    }
}

let synth = {
    REF_NOTES: [
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
    ],
    voices: 3,
    oscs: [],
}
synth.trig = function(osc, freq, time = 300) {
    console.log(osc)
    osc.setFrequency(freq),
    osc.setGain(1);

    setTimeout(() => {
        osc.setGain(0);
    }, time);
}

// click sur un point: jouer le pnt
// click au milieu: jouer la seq


// merger for oscillators
synth.merger = new BasicMerger(audioCtx);

for(let i = 0; i < synth.voices; i ++) {
    let osc = new BasicOsc(audioCtx);
    osc.index = i;
    osc.setGain(0);

    synth.oscs[i] = osc;
    synth.merger.addModule(osc, true);
}

synth.merger.outputNode.connect(masterCtx.inputNode);






///////////////////////////////////////////
// MAIN
init();

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


graphSyn.stepActivation = function(pnt) {
    let seqIndex = parseInt(graphSq.selectedStep) || 0;


    let synthSeqStep;
    if(graphSyn.sequence[seqIndex] === undefined) {
        graphSyn.sequence[seqIndex] = new Array(0);
    }
    synthSeqStep = graphSyn.sequence[seqIndex];
    

    // point enable and seq part storage
    if(pnt.isEnable === false) {

        if(synthSeqStep.length < synth.voices) {
            this.enablePoint(pnt);

            pnt.frequency = synth.REF_NOTES[pnt.index].frequency;
            pnt.oscIndex = synthSeqStep.length;

            synth.oscs[pnt.oscIndex].setFrequency(pnt.frequency);

            synthSeqStep.push(pnt);
        }
    }
    
    else if(pnt.isEnable === true) {
        this.enablePoint(pnt);
        synthSeqStep.splice(synthSeqStep.indexOf(pnt), 1);
    }


    // console.log('graphSyn seq ' + seqIndex, graphSyn.sequence)
}



graphSq.stepActivation = function(pnt) {
    graphSq.enablePoint(pnt);
    graphSq.selectedStep = pnt.index;


    graphSyn.points.forEach(pnt => {
        graphSyn.enablePoint(pnt, false);
    });



    let synSeq = graphSyn.sequence[pnt.index];
    
    if(synSeq !== undefined) {
        
        for(let i = 0; i < synSeq.length; i++) {
            let pnt = synSeq[i];
            graphSyn.enablePoint(pnt, true);
        }
    }

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
            graphSq.stepActivation(pnt);
            // graphSq.enablePoint(pnt);

        }
    })
});



graphSyn.canvas.addEventListener('click', (e) => {
    let isPointTouched = false;

    graphSyn.points.forEach(pnt => {

        if(graphSyn.ctx.isPointInPath(pnt.path, e.offsetX, e.offsetY)) {
            graphSyn.stepActivation(pnt);


            if(pnt.isEnable) {
                synth.trig(synth.oscs[pnt.oscIndex], pnt.frequency);

                isPointTouched = true;
                return;
            }
        }
    })


    if(!isPointTouched) {
        console.log('not point');


        let synthSeqStep = graphSyn.sequence[graphSq.selectedStep];

        if(synthSeqStep) {
            console.log(synthSeqStep);

            synthSeqStep.forEach(pnt => {
                synth.trig(synth.oscs[pnt.oscIndex], pnt.frequency);
            })
        }


    }
});


graphSyn.canvas.addEventListener('mousedown', (e) => {
    // synth.testOscs(graphSyn.sequence[graphSq.selectedStep]);
})