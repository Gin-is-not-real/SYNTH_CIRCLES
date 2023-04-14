/**
 * @param {HTMLCanvasElement} canvas
 * @param {} ctx 
 * @param {Integer} x
 * @param {Integer} y 
 * @param {Integer} r radius
 * @param {Integer} nbrOfSteps the number of points on the circle perimeter
 * @param {Object} controls object containing controls: {circle: {path}, steps: [ {x, y, r, path, id, isEnable} ]}
 * @param {Integer} maxEnablesSteps the max number for enables steps
 * @param {Array} enablesSteps the enables steps
 * @param {Array} memory multi array to store sequences of enables step
 * 
 * 
 * @method init(nbrOfSteps)
 * 
 * @method drawControlPoint()
 * 
 * @method controlCircleActivation()
 * @method controlStepActivation(step)
 * @method stepEnable(step)
 * @method stepDisable(step)
 */
class GraphCircularSynth extends GraphCircularControler {
    maxEnablesSteps;
    enablesSteps = [];
    memory = [];
    selectedMemoryId;

    constructor(canvas, x, y, r, nbrOfSteps = 12) {
        super(canvas, x, y, r);

        this.nbrOfSteps = nbrOfSteps;
    }

    /**
     * Init or reset properties, controls and draw canvas by callbacks
     * @param {Integer} nbrOfSteps the new number of steps around the circle
     */
    init(nbrOfSteps) {
        if(nbrOfSteps !== undefined) {
            this.nbrOfSteps = nbrOfSteps;
        }
        this.enablesSteps = [];
        this.memory = [];
        this.selectedMemoryId = 0;
        this.initControlCircle();
        this.initControlsSteps();
        this.drawCanvas();
    }

    /**
     * Draw the control point path from the step point in parameter
     * @param {Object} pnt 
     */
    drawControlPoint(pnt) {
        this.ctx.fillStyle = pnt.isEnable ? "black" : "white";
        this.ctx.fill(pnt.path);
    
        this.ctx.strokeStyle = "black";
        this.ctx.stroke(pnt.path);
    }


    /**
     * Called when the circle path is activated
     */
    controlCircleActivation() {
        this.sendControlsSteps(this.enablesSteps);
    }


    /**
     * Called when a step is activated. enable/disable the step, send controls if necessary and draw the canvas
     * @param {Object} step the step to activate
     */
    controlStepActivation(step) {
        if(step.isEnable === true) {
            this.stepDisable(step);
        }
        else {
            if(this.enablesSteps.length < this.maxEnablesSteps) {
                this.stepEnable(step);
                this.sendControlsSteps([step])
            }
        }

        this.recordMemoryLine(this.selectedMemoryId);
        this.drawCanvas();
    }

    /**
     * Make the step enable and store them on the enablesSteps array
     * @param {Object} step 
     */
    stepEnable(step) {
        step.isEnable = true;
        this.enablesSteps.push(step);
    }

    /**
     * Make the step disable and remove them from the enablesSteps array
     * @param {Object} step 
     */
    stepDisable(step) {
        step.isEnable = false;
        this.enablesSteps.splice(this.enablesSteps.indexOf(step), 1);
    }

    /**
     * Clear the enablesSteps array by set this steps isEnable to false and reset the array
     */
    resetEnables() {
        this.enablesSteps.forEach(step => {
            step.isEnable = false;
        })
        this.enablesSteps = []

        this.drawCanvas();

    }

    /**
     * Record the enablesSteps on a memory line according to the id in parameter
     * @param {Integer} lineId the id of the line to record
     */
    recordMemoryLine(lineId) {
        this.memory[lineId] = [];
        this.enablesSteps.forEach(step => {
            this.memory[lineId].push(step);
        })
    }

    /**
     * Load enablesSteps from the memory line at the index in parameter. Reset enablesSteps, update selectedMemoryId, make enables steps stored on memory then draw the canvas
     * @param {Integer} lineId 
     */
    loadMemoryLine(lineId) {
        // console.log('load ', lineId, circleSynth.memory[lineId])
        this.resetEnables();

        this.selectedMemoryId = lineId;

        if(this.memory[lineId] !== undefined) {
            this.memory[lineId].forEach(mem => {
                this.stepEnable(mem);
            })
        }

        this.drawCanvas();
    }


    /**
     * Send enablesSteps to the sound generator by calling this receiveControls function for each enable step
     * 
     * @param {Array of Object} steps Array of steps to send
     */
    sendControlsSteps(steps) {
        let data = [];

        for(let i = 0; i < steps.length; i++) {
            data.push({id: steps[i].id});
        }

        this.target.receiveControls(data);
    }

    /**
     * Called by the sequencer sendControlStep function.
     * 
     * Record enablesSteps on the memory line corresponding to the old sequencer selectedStep
     * 
     * clear enablesSteps  
     * 
     * load the memory line according to the sequencer new selectedStep
     * 
     * @param {Array of Object} data an array containing two objects with id property; the old sequencer selectedStep and the new.
     */
    receiveControls(data, type) {
        this.loadMemoryLine(data.newStep.id);

        if(data.newStep.isEnable) {
            this.sendControlsSteps(this.enablesSteps);
        }
    }

}