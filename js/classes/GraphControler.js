class GraphControler {
    canvas;
    ctx;
    x;
    y;
    r;

    constructor(canvas, x, y, r, steps = 12) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.x = x;
        this.y = y;
        this.r = r;

        this.init(steps);
    }


    init(steps) {
        let pnts = getXYFromCircleEqualDivision(this.x, this.y, this.r, steps);
        let r = this.pntRadius != undefined ? this.pntRadius : 6;

        pnts.forEach(pnt => {
            pnt.index = pnts.indexOf(pnt);
            pnt.isEnable = false;
    
            pnt.path = new Path2D();
            pnt.path.arc(pnt.x, pnt.y, r, 0, 2*Math.PI);
        });
    
        this.points = pnts;
    }

    draw() {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI)
        this.ctx.stroke();
    
        this.points.forEach(pnt => {
            this.drawPath(pnt); 
        })
    
        this.canvas.style.transform = "rotate(-90deg)";
    }

    drawPath(pnt) {
        this.ctx.fillStyle = pnt.isEnable ? "black" : "white";
        this.ctx.fill(pnt.path);
    
        this.ctx.strokeStyle = "black";
        this.ctx.stroke(pnt.path);
    }

    enablePoint(pnt, force) {
        if(force !== undefined) {
            pnt.isEnable = force;
        }
        else {
            pnt.isEnable =! pnt.isEnable;
        }
        this.drawPath(pnt);
    }

    pointActivation(pnt) {
        console.log('please implement')
    }
}
