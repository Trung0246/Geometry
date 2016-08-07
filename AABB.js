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
 * @param top {number} top boundary
 * @param right {number} right boundary
 * @param bottom {number} bottom boundary
 * @param left {number} left boundary
 * @constructor
 */
function AABB(top, right, bottom, left) {
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
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
    return new AABB(Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), Math.min(x1, x2));
};

/**
 * create the AABB from circle
 * @param cx {number}
 * @param cy {number}
 * @param r {number}
 * @return {AABB}
 */
AABB.fromCircle = function (cx, cy, r) {
    return new AABB(cy - r, cx + r, cy + r, cx - r);
};

/**
 * create the AABB from ellipse
 * x = cx + a cos(c) cos(t) - b sin(c) sin(t) --- (1)
 * y = cy + a sin(c) cos(t) + b cos(c) sin(t) --- (2)
 * @param cx {number}
 * @param cy {number}
 * @param a {number}
 * @param b {number}
 * @param c {number}
 * @return {AABB}
 */
AABB.fromEllipse = function (cx, cy, a, b, c) {
    /**
     * Step 1: Simplify the equation
     * let:
     * d = a cos(c)
     * e = -b sin(c)
     * f = a sin(c)
     * g = b cos(c)
     * Then:
     * x = cx + d cos(t) + e sin(t) --- (3)
     * y = cy + f cos(t) + g sin(t) --- (4)
     */
    var d = a * Math.cos(c);
    var e = -b * Math.sin(c);
    var f = a * Math.sin(c);
    var g = b * Math.cos(c);

    /**
     * Step 2: Differentiate x and y in term of t
     * dx/dt = -d sin(t) + e cos(t) --- (5)
     * dy/dt = -f sin(t) + g cos(t) --- (6)
     *
     *
     * Apply chain rule to find the dy/dx
     * dy/dx = dy/dt * dt/dx
     * dy/dx = dy/dt * 1/(dx/dt)
     */

    /**
     * Step 3: Find the top and bottom boundary
     * The top and bottom boundary of the ellipse are located at dy/dx = 0, So,
     * 0 = dy/dt * 1/(dx/dt) --- Then
     * dy/dt = 0 --- Substitute (6)
     * -f sin(t) + g cos(t) = 0 --- Apply substitution of tangent half angle
     * -f ((2 x) / (x^2 + 1)) + g ((1 - x^2) / (x^2 + 1)) = 0 --- Simplify
     * g - 2 f x - g x^2 = 0 --- Solve the x
     *
     * x = (-f - Sqrt[f^2 + g^2])/g && (-f + Sqrt[f^2 + g^2])/g
     * Then:
     * t = 2 atan(x)
     * top and bottom boundary = cy + f cos(t) + g sin(t)
     *
     */
    var sqrtD = Math.sqrt(f * f + g * g);
    var t1 = 2 * Math.atan((-f - sqrtD) / g);
    var t2 = 2 * Math.atan((-f + sqrtD) / g);
    var y1 = cy + f * Math.cos(t1) + g * Math.sin(t1);
    var y2 = cy + f * Math.cos(t2) + g * Math.sin(t2);

    /**
     * Step 4: Find the left and right boundary
     * The left and right boundary of the ellipse are located at dy/dx = infinity, So,
     * infinity = dy/dt * 1/(dx/dt) --- Then
     * dx/dt = 0 --- Substitute (5)
     * -d sin(t) + e cos(t) = 0 --- Apply substitution of tangent half angle
     * -d ((2 x) / (x^2 + 1)) + e ((1 - x^2) / (x^2 + 1)) = 0 --- Simplify
     * e - 2 d x - e x^2 = 0 --- Solve the x
     * x = (-d - Sqrt[d^2 + e^2])/e && (-d + Sqrt[d^2 + e^2])/e
     * Then:
     * t = 2 atan(x)
     * left and right boundary = cx + d cos(t) + e sin(t)
     */
    sqrtD = Math.sqrt(d * d + e * e);
    t1 = 2 * Math.atan((-d - sqrtD) / e);
    t2 = 2 * Math.atan((-d + sqrtD) / e);
    var x1 = cx + d * Math.cos(t1) + e * Math.sin(t1);
    var x2 = cx + d * Math.cos(t2) + e * Math.sin(t2);

    return new AABB(Math.min(y1, y2), Math.max(x1, x2), Math.max(y1, y2), Math.min(x1, x2));
};