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
 * 
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
 * @method selectStep(step)
 * @method stepEnable(step)
 * @method stepDisable(step)
 */
class GraphCircularSynth extends GraphCircularControler {
    maxEnablesSteps;
    enablesSteps = [];
    memory = [];

    constructor(canvas, x, y, r, nbrOfSteps = 12) {
        super(canvas, x, y, r);

        this.nbrOfSteps = nbrOfSteps;
    }

    /**
     * Init all controls and draw canvas by callbacks
     */
    init(nbr) {
        if(nbr !== undefined) {
            this.nbrOfSteps = nbr;
        }
        this.enablesSteps = [];
        this.memory = [];
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


    // activation d'un control point
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

        this.drawCanvas();
    }

    // activer
    stepEnable(step) {
        step.isEnable = true;
        this.enablesSteps.push(step);
    }

    // desactiver
    stepDisable(step) {
        step.isEnable = false;
        this.enablesSteps.splice(this.enablesSteps.indexOf(step), 1);
    }


    controlCircleActivation() {
        this.sendControlsSteps(this.enablesSteps);
    }


    sendControlStep(step) {
        // redefined on main
        console.log('please redefine on main ');
    }
    sendControlCircle() {
        console.log('please redefine on main ');
    }
    // playSequence
    // foreach step, if isEnable:
    //  send control to synth controler
}