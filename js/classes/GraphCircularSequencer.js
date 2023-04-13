/**
 * @param {HTMLCanvasElement} canvas
 * @param {} ctx 
 * @param {Integer} x
 * @param {Integer} y 
 * @param {Integer} r radius
 * @param {Integer} nbrOfSteps the number of points on the circle perimeter
 * @param {Object} controls object containing controls: {circle: {path}, steps: [ {x, y, r, path, id, isEnable} ]}
 * @param {Object} selectedStep the seleted step
 * 
 * @method changeNbrOfSteps(nbr)
 * 
 * @method init()
 * @method initControlCircle()
 * @method initControlsSteps()
 * 
 * @method drawCanvas()
 * @method drawControlCircle()
 * @method drawControlPoint()
 * 
 * @method controlCircleActivation()
 * @method controlStepActivation(step)
 * @method stepEnable(step)
 * @method stepDisable(step)
 */
class GraphCircularSequencer extends GraphCircularControler {
    selectedStep;   // step control point

    constructor(canvas, x, y, r, nbrOfSteps = 16) {
        super(canvas, x, y, r, nbrOfSteps = 16);
    }

    /**
     * Init all controls and draw canvas by callbacks
     */
    init() {
        this.initControlCircle();
        this.initControlsSteps();

        this.selectedStep = this.controls.steps[0];
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
        if(pnt === this.selectedStep) {
            this.ctx.strokeStyle = "red";
        }
        this.ctx.stroke(pnt.path);
    }


    // activation d'un control point
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

    selectStep(step) {
        this.sendControlStep(this.selectedStep, step);
        this.selectedStep = step;
    }

    // activer
    stepEnable(step) {
        step.isEnable = true;
    }

    // desactiver
    stepDisable(step) {
        step.isEnable = false;
    }

    sendControlStep(step) {
        // send control step to synth controler: , pour selectionner et lire la sequence
        console.log('please redefine on main ');
    }

    // playSequence
    // foreach step, if isEnable:
    //  send control to synth controler
}