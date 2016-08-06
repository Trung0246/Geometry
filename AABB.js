/**
 * Created by TSH96 on 6/8/2016.
 */

/**
 * Axis-Aligned Bounding Box (AABB)
 * AABB is commonly use in collision detection
 *
 * Static function of AABB able user to create the AABB of basic geometry including:
 *  - Segment
 *  - Circle
 *  - Ellipse
 *  - Quadratic bezier curve
 *  - Cubic bezier curve
 *
 * @param x {number} x value of top left corner
 * @param y {number} y value of top left corner
 * @param width {number} width of the bound
 * @param height {number} height of the bound
 * @constructor
 */
function AABB(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

/**
 * create the AABB from segment (a line with two end point)
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @returns {AABB}
 */
AABB.fromSegment = function (x1, y1, x2, y2) {
    return new AABB(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x1 - x2), Math.abs(y1 - y2));
};

/**
 * create the AABB from circle (a circle with two end point)
 * @param cx {number}
 * @param cy {number}
 * @param r {number}
 * @return {AABB}
 */
AABB.fromCircle = function (cx, cy, r) {
    return new AABB(cx - r, cy - r, r * 2, r * 2);
};

AABB.fromEllipse = function (cx, cy, a1, b1, c1) {
    /**
     * x = x1 + a1 cos(c1) cos(t) - b1 sin(c1) sin(t) --- (1)
     * y = y1 + a1 sin(c1) cos(t) + b1 cos(c1) sin(t) --- (2)
     *
     * Differentiate x and y in term of t
     * dx/dt = -a1 cos(c1) sin(t) - b1 sin(c1) cos(t) --- (3)
     * dy/dt = -a1 sin(c1) sin(t) + b1 cos(c1) cos(t) --- (4)
     *
     * let:
     * a = a1 cos(c1)
     * b = -b1 sin(c1)
     * c = a1 sin(c1)
     * d = b1 cos(c1)
     *
     * Apply chain rule to find the dy/dx
     * dy/dx = dy/dt * dt/dx
     * dy/dx = dy/dt * 1/(dx/dt)
     *
     * The highest point and the lowest point of the ellipse are located at dy/dx = 0, So,
     * 0 = dy/dx * 1/(dx/dt) --- Then
     * dy/dt = 0 --- Substitute (4)
     * -a1 sin(c1) sin(t) + b1 cos(c1) cos(t) = 0 --- Apply substitution of tangent half angle
     * -a1 sin(c1) ((2 x) / (x^2 + 1)) + b1 cos(c1) ((1 - x^2) / (x^2 + 1)) = 0
     *
     *
     *
     */
};