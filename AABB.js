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

/**
 * create the AABB from quadratic bezier curve
 * x = (1 - t)^2 x1 + 2 (1 - t) t x2 + t^2 x3 --- (1)
 * y = (1 - t)^2 y1 + 2 (1 - t) t y2 + t^2 y3 --- (2)
 * (0 <= t <= 1)
 *
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param x3 {number}
 * @param y3 {number}
 * @returns {AABB}
 */
AABB.fromBezier2 = function (x1, y1, x2, y2, x3, y3) {
    var right = Math.max(x1, x3);
    var left = Math.min(x1, x3);
    var top = Math.min(y1, y3);
    var bottom = Math.max(y1, y3);

    /**
     * Step 1: differentiate x and y in term of t.
     * dx/dt = -2 (1 - t) x1 + 2 (1 - t) x2 - 2 t x2 + 2 t x3 --- (3)
     * dy/dt = -2 (1 - t) y1 + 2 (1 - t) y2 - 2 t y2 + 2 t y3 --- (4)
     */

    /**
     * Step 2: Find the top and bottom boundary
     * The top and bottom boundary of the quadratic bezier curve are located at dy/dx = 0, So,
     * 0 = dy/dt * 1/(dx/dt) --- Then
     * dy/dt = 0 --- Substitute (4)
     * -2 (1 - t) y1 + 2 (1 - t) y2 - 2 t y2 + 2 t y3 = 0 --- --- Simplify
     * -2 y1 + 2 y2 + t (2 y1 - 4 y2 + 2 y3) = 0 --- Solve the t
     * t = (y1 - y2)/(y1 - 2 y2 + y3)
     * The top or bottom boundary = (1 - t)^2 y1 + 2 (1 - t) t y2 + t^2 y3
     */
    var t = (y1 - y2) / (y1 - 2 * y2 + y3);
    if (0 <= t && t <= 1) {
        var tb = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * y2 + t * t * y3;
        top = Math.min(top, tb);
        bottom = Math.max(bottom, tb);
    }

    /**
     * Step 3: Find the left and right boundary
     * The left and right boundary of the quadratic bezier curve are located at dy/dx = infinity, So,
     * infinity = dy/dt * 1/(dx/dt) --- Then
     * dx/dt = 0 --- Substitute (3)
     * -2 (1 - t) x1 + 2 (1 - t) x2 - 2 t x2 + 2 t x3 = 0 --- --- Simplify
     * -2 x1 + 2 x2 + t (2 x1 - 4 x2 + 2 x3) = 0 --- Solve the t
     * t = (x1 - x2)/(x1 - 2 x2 + x3)
     * The top or bottom boundary = (1 - t)^2 x1 + 2 (1 - t) t x2 + t^2 x3
     */
    t = (x1 - x2) / (x1 - 2 * x2 + x3);
    if (0 <= t && t <= 1) {
        var lr = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * x2 + t * t * x3;
        left = Math.min(left, lr);
        right = Math.max(right, lr);
    }

    return new AABB(top, right, bottom, left);
};

/**
 * create the AABB from cubic bezier curve
 * x = (1 - t)^3 x1 + 3 (1 - t)^2 t x2 + 3 (1 - t) t^2 x3 + t^3 x4 --- (1)
 * y = (1 - t)^3 y1 + 3 (1 - t)^2 t y2 + 3 (1 - t) t^2 y3 + t^3 y4 --- (2)
 * (0 <= t <= 1)
 *
 * @param x1 {number}
 * @param y1 {number}
 * @param x2 {number}
 * @param y2 {number}
 * @param x3 {number}
 * @param y3 {number}
 * @param x4 {number}
 * @param y4 {number}
 * @returns {AABB}
 */
AABB.fromBezier3 = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var top = Math.min(y1, y4);
    var right = Math.max(x1, x4);
    var bottom = Math.max(y1, y4);
    var left = Math.min(x1, x4);

    /**
     * Step 1: differentiate x and y in term of t.
     * dx/dt = -3 (1 - t)^2 x1 + 3 (1 - t)^2 x2 - 6 (1 - t) t x2 + 6 (1 - t) t x3 - 3 t^2 x3 + 3 t^2 x4 --- (3)
     * dy/dt = -3 (1 - t)^2 y1 + 3 (1 - t)^2 y2 - 6 (1 - t) t y2 + 6 (1 - t) t y3 - 3 t^2 y3 + 3 t^2 y4 --- (4)
     */

    /**
     * Step 2: Find the top and bottom boundary
     * The top and bottom boundary of the quadratic bezier curve are located at dy/dx = 0, So,
     * 0 = dy/dt * 1/(dx/dt) --- Then
     * dy/dt = 0 --- Substitute (4)
     * -3 (1 - t)^2 y1 + 3 (1 - t)^2 y2 - 6 (1 - t) t y2 + 6 (1 - t) t y3 - 3 t^2 y3 + 3 t^2 y4 = 0 --- --- Simplify
     * -3 y1 + 3 y2 + t (6 y1 - 12 y2 + 6 y3) + t^2 (-3 y1 + 9 y2 - 9 y3 + 3 y4) = 0 --- Solve the t
     * t1 = (y1 - 2 y2 + y3 - Sqrt[y2^2 - y1 y3 - y2 y3 + y3^2 + y1 y4 - y2 y4])/(y1 - 3 y2 + 3 y3 - y4)
     * t2 = (y1 - 2 y2 + y3 + Sqrt[y2^2 - y1 y3 - y2 y3 + y3^2 + y1 y4 - y2 y4])/(y1 - 3 y2 + 3 y3 - y4)
     * The top or bottom boundary = (1 - t)^3 y1 + 3 (1 - t)^2 t y2 + 3 (1 - t) t^2 y3 + t^3 y4
     */
    var sqrtD = Math.sqrt(y2 * y2 - y1 * y3 - y2 * y3 + y3 * y3 + y1 * y4 - y2 * y4);
    var d = y1 - 3 * y2 + 3 * y3 - y4;
    var t1 = (y1 - 2 * y2 + y3 - sqrtD) / d;
    var t2 = (y1 - 2 * y2 + y3 + sqrtD) / d;
    var tb;
    if (0 <= t1 && t1 <= 1) {
        tb = (1 - t1) * (1 - t1) * (1 - t1) * y1 + 3 * (1 - t1) * (1 - t1) * t1 * y2 + 3 * (1 - t1) * t1 * t1 * y3 + t1 * t1 * t1 * y4;
        top = Math.min(top, tb);
    }
    if (0 <= t2 && t2 <= 1) {
        tb = (1 - t2) * (1 - t2) * (1 - t2) * y1 + 3 * (1 - t2) * (1 - t2) * t2 * y2 + 3 * (1 - t2) * t2 * t2 * y3 + t2 * t2 * t2 * y4;
        bottom = Math.max(bottom, tb);
    }

    /**
     * Step 3: Find the left and right boundary
     * The left and right boundary of the quadratic bezier curve are located at dy/dx = infinity, So,
     * infinity = dy/dt * 1/(dx/dt) --- Then
     * dx/dt = 0 --- Substitute (3)
     * -3 (1 - t)^2 x1 + 3 (1 - t)^2 x2 - 6 (1 - t) t x2 + 6 (1 - t) t x3 - 3 t^2 x3 + 3 t^2 x4 = 0 --- --- Simplifx
     * -3 x1 + 3 x2 + t (6 x1 - 12 x2 + 6 x3) + t^2 (-3 x1 + 9 x2 - 9 x3 + 3 x4) = 0 --- Solve the t
     * t1 = (x1 - 2 x2 + x3 - Sqrt[x2^2 - x1 x3 - x2 x3 + x3^2 + x1 x4 - x2 x4])/(x1 - 3 x2 + 3 x3 - x4)
     * t2 = (x1 - 2 x2 + x3 + Sqrt[x2^2 - x1 x3 - x2 x3 + x3^2 + x1 x4 - x2 x4])/(x1 - 3 x2 + 3 x3 - x4)
     * The top or bottom boundarx = (1 - t)^3 x1 + 3 (1 - t)^2 t x2 + 3 (1 - t) t^2 x3 + t^3 x4
     */
    sqrtD = Math.sqrt(x2 * x2 - x1 * x3 - x2 * x3 + x3 * x3 + x1 * x4 - x2 * x4);
    d = x1 - 3 * x2 + 3 * x3 - x4;
    t1 = (x1 - 2 * x2 + x3 - sqrtD) / d;
    t2 = (x1 - 2 * x2 + x3 + sqrtD) / d;
    var lr;
    if (0 <= t1 && t1 <= 1) {
        lr = (1 - t1) * (1 - t1) * (1 - t1) * x1 + 3 * (1 - t1) * (1 - t1) * t1 * x2 + 3 * (1 - t1) * t1 * t1 * x3 + t1 * t1 * t1 * x4;
        left = Math.min(left, lr);
    }
    if (0 <= t2 && t2 <= 1) {
        lr = (1 - t2) * (1 - t2) * (1 - t2) * x1 + 3 * (1 - t2) * (1 - t2) * t2 * x2 + 3 * (1 - t2) * t2 * t2 * x3 + t2 * t2 * t2 * x4;
        right = Math.max(right, lr);
    }

    return new AABB(top, right, bottom, left);
};