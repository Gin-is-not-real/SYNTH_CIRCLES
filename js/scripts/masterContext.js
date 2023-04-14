//////////////////////////////////////////////////////////////////
// Master Context and controls

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();


let masterCtx = {
    gate: new GainNode(audioCtx, {gain: 1}),
    gain: new GainNode(audioCtx, {gain: 0.01}),
}
masterCtx.inputNode = masterCtx.gain;
masterCtx.outputNode = masterCtx.gate;

masterCtx.inputNode.connect(masterCtx.outputNode).connect(audioCtx.destination);



// DOM CONTROL ELEMENTS
masterCtx.controls = {
    gain:  document.getElementById('master-gain'),
}
// masterCtx.labels = {};

//////////////////////////////////////////////////////////////////
// EVENTS LISTENERS

masterCtx.controls.gain.addEventListener('input', function(e) {
    masterCtx.gain.gain.value = e.target.value;
    // masterLabels.gain.textContent = parseInt(e.target.value *100);
})