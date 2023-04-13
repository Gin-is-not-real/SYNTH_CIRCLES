/**
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {} ctx 
 * @param {Integer} x
 * @param {Integer} y 
 * @param {Integer} r radius
 * @param {Integer} nbrOfSteps the number of points on the circle perimeter
 * @param {Object} controls object containing controls: {circle: {path}, steps: [ {x, y, r, path, id, isEnable} ]}
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
class GraphCircularControler {
    canvas; ctx;    // for draw functions
    x; y; r;        // for init the main path and get steps points

    controls = {};

    constructor(canvas, x, y, r) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.x = x;
        this.y = y;
        this.r = r;
    }

    /**
     * Init all controls and draw canvas by callbacks
     */
    init() {
        this.initControlCircle();
        this.initControlsSteps();
        this.drawCanvas();
    }

    /**
     * Init the control circle with property path
     */
    initControlCircle() {
        let circlePath = new Path2D();
        circlePath.arc(this.x, this.y, this.r, 0, 2 * Math.PI);

        this.controls.circle = {path: circlePath};
    }

    /**
     * Init controls steps with properties x, y, r, path   from an equal division of the circle
     */
    initControlsSteps() {
        let pnts = getXYFromCircleEqualDivision(this.x, this.y, this.r, this.nbrOfSteps);
        let r = this.pntRadius != undefined ? this.pntRadius : 6;

        pnts.forEach(pnt => {
            pnt.id = pnts.indexOf(pnt);
            pnt.isEnable = false;
    
            pnt.path = new Path2D();
            pnt.path.arc(pnt.x, pnt.y, r, 0, 2*Math.PI);
        });
    
        this.controls.steps = pnts;
    }


    
    /**
     * Reset the canvas and draw all elements by callbacks
     */
    drawCanvas() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawControlCircle();

        this.controls.steps.forEach(steps => {
            this.drawControlPoint(steps);
        })
        
        this.canvas.style.transform = "rotate(-90deg)";
    }

    /**
     * Draw the control circle path and rotate the canvas
     */
    drawControlCircle() {
        this.ctx.lineWidth = "1";
        this.ctx.strokeStyle = "black";
        this.ctx.stroke(this.controls.circle.path);
        this.canvas.style.transform = "rotate(-90deg)";
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

//////////////////////////////////////////////////////
    // activation du control circle
    controlCircleActivation() {
        console.log('not implement')
    }
    // activation d'un control point
    controlStepActivation(step) {
        console.log('not implement')
    }

    stepSelect(step) {
        console.log('not implement')
    }
    drawSelectedStep(step) {
        console.log('not implement')
    }
    // activer
    stepEnable(step) {
        console.log('not implement')
    }

    // desactiver
    stepDisable(step) {
        console.log('not implement')
    }

}