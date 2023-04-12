/**
 * @property {AudioNode} outputNode
 * @property {AudioNode} merger
 * 
 * 
 * @property {Array} notesList - list of internals notes
 * @property {Integer} nbrOfVoices - number of oscillators
 * @property {Array} oscList - list of internals osc nodes
 * 
 * @method init()
 * @method trig()
 * 
 * @method SETTERS setNotesList
 * @method GETTERS 
 */
class BasicPolySynth {
    outputNode;
    merger;

    notesList;
    nbrOfVoices;
    oscList;


    constructor(voices, notesArray) {
        this.notesList = notesArray;

        this.nbrOfVoices = voices;

        this.merger = new BasicMerger(audioCtx);
        this.outputNode = this.merger.outputNode;

        this.init();
    }

    setNotesList(notesList) {
        this.notesList = notesList;
    }

    init() {
        let oscList = [];
        for(let i = 0; i < this.nbrOfVoices; i ++) {
            let osc = new BasicOsc(audioCtx);
            osc.index = i;
            osc.setGain(0);
        
            oscList[i] = osc;
            this.merger.addModule(osc, true);
        }
        this.oscList = oscList;
    }

    
    trig(osc, freq, time = 300) {
        osc.setFrequency(freq);
        osc.setGain(1);

        setTimeout(() => {
            osc.setGain(0);
        }, time);
    }

}