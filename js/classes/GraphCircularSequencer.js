/**
 * @param {HTMLCanvasElement} canvas
 * @param {} ctx 
 * @param {Integer} x
 * @param {Integer} y 
 * @param {Integer} r radius
 * @param {Integer} nbrOfSteps the number of points on the circle perimeter
 * @param {Object} controls object containing controls: {circle: {path}, steps: [ {x, y, r, path, id, isEnable} ]}
 * @param {Object} selectedStep the seleted step
 * @param {Object} playedStep the played step
 * 
 * 
 * @method init(nbrOfSteps)
 * 
 * @method drawControlPoint()
 * 
 * @method controlStepActivation(step)
 * @method stepEnable(step)
 * @method stepDisable(step)
 */
class GraphCircularSequencer extends GraphCircularControler {
    selectedStep;   // step control point
    playedStep;

    constructor(canvas, x, y, r, nbrOfSteps = 16) {
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

        this.initControlCircle();
        this.initControlsSteps(10);
        this.selectedStep = this.controls.steps[0];
        this.drawCanvas();
    }


    /**
     * Draw the control point path from the step point in parameter
     * @param {Object} pnt 
     */
    drawControlPoint(pnt) {
        let bgColor = window.getComputedStyle(this.canvas).getPropertyValue("background-color");

        this.ctx.fillStyle = pnt.isEnable ? "rgb(70, 89, 91)" : bgColor;
        this.ctx.fill(pnt.path);
    
        this.ctx.lineWidth = "1";
        this.ctx.strokeStyle = "black";

        if(pnt === this.playedStep) {
            this.ctx.lineWidth = "2";
            this.ctx.strokeStyle = "rgb(225, 32, 32)";      //red
        }

        if(pnt === this.selectedStep) {
            this.ctx.lineWidth = "2";
            this.ctx.strokeStyle = "rgb(223, 223, 106)";    //yellow
        }

        this.ctx.stroke(pnt.path);
    }


    /**
     * 
     * @param {Object} step 
     */
    playStep(step) {
        this.playedStep = step;

        this.sendControlsSteps(this.playedStep, step, 'play');
        this.drawCanvas();
    }


    /**
     * Called when a step is activated. Select a step by calling selectStep fucntion, enable/disable the step, send controls if necessary and draw the canvas
     * @param {Object} step the step to activate
     */
    controlStepActivation(step) {
        this.selectStep(step);

        if(step.isEnable === true) {
            this.stepDisable(step);
        }
        else {
            this.stepEnable(step);
        }

        this.drawCanvas();
    }

    /**
     * Called when a step is selected. Send controls (old and new selectedStep) and update the selectedStep property, then draw the canvas
     * @param {Object} step 
     */
    selectStep(step) {
        this.sendControlsSteps(this.selectedStep, step, 'select');
        this.selectedStep = step;
        this.drawCanvas();
    }


    /**
     * Make the step enable by switch this isEnable property
     * @param {Object} step 
     */
    stepEnable(step) {
        step.isEnable = true;
    }

    /**
     * Make the step disable by switch this isEnable property
     * @param {Object} step 
     */
    stepDisable(step) {
        step.isEnable = false;
    }


    sendControlsSteps(oldStep, newStep, type) {
        let data = {oldStep: oldStep, newStep: newStep};
    
        this.targets.forEach(targ => {
            targ.receiveControls(data, type);
        })
    }
}