/**
 * @property {AudioNode} outputNode
 * 
 * @property {OscillatorNode} oscillator
 * @property {GainNode} gain 
 * 
 * @method SETTERS type, frequency, gain
 * @method GETTERS type, frequency, gain
 */

class BasicOsc {
    REF_NOTES = [
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
    
    outputNode;

    constructor(context) {
        this.context = context;

        this.oscillator = new OscillatorNode(context);
        this.gain = new GainNode(context);

        this.outputNode = this.gain;

        this.oscillator.connect(this.gain);


        // SPECIAL RUN OSCILLATORS
        document.addEventListener('click', (e) => {
            this.oscillator.start();
        },
        {once: true});
    }


    setType(type) {
        this.oscillator.type = type;
    }
    setFrequency(value) {
        this.oscillator.frequency.value = value;
    }
    setGain(value) {
        this.gain.gain.value = value;
    }

    getType() {
        return this.oscillator.type;
    }
    getFrequency() {
        return this.oscillator.frequency.value;
    }
    getGain() {
        return this.gain.gain.value;
    }
}