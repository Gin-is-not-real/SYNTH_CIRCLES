///////////////////////////////////////////////////////////////
// FUNCTIONS TRIGO

/**
 * Get all points xy coords get by dividing a circle on equals parts
 * @param {number} x center x coord
 * @param {number} y center y coord
 * @param {number} r radius 
 * @param {number} nbr nbr of divisions 
 * @returns {Array} array of Objects {x, y}
 */
function getXYFromCircleEqualDivision(x, y, r, nbr) {
    let angle = (360/nbr) * (Math.PI/180);

    let pnts = [];

    for(let i = 0; i < nbr; i++) {
        let coords = getXYFromAngle(x, y, r, angle * i);
        pnts.push(coords);
    }

    return pnts;
}

/**
 * Get the xy coord for a point refering to an angle
 * @param {number} x center x coord
 * @param {number} y center y coord
 * @param {number} r radius 
 * @param {float} angle angle to add
 * @returns {Object} point coord xy {cos, sin}
 */
function getXYFromAngle(x, y, r, angle) {
     let cos = x + (r * Math.cos(angle));
     let sin = y + (r * Math.sin(angle));

     return {x: cos, y: sin};
}