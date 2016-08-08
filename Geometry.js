/**
 * Created by TSH96 on 30/7/2016.
 * Dependent Library: Intx.js
 */

var Geometry2D = {};

/**
 * A 2D point (x, y)
 * @param x {number}
 * @param y {number}
 * @constructor
 */
Geometry2D.Point = function (x, y) {
    this.x = x;
    this.y = y;
};

/**
 * A straight line.
 * a x + b y + c = 0
 * @param a {number} Coefficient of x
 * @param b {number} Coefficient of y
 * @param c {number} Constant
 * @constructor
 */
Geometry2D.Line = function (a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
};

/**
 * Create a straight Line passing two point
 * @param p1 {Geometry2D.Point}
 * @param p2 {Geometry2D.Point}
 * @returns {Geometry2D.Line}
 * @memberOf Geometry2D.Line
 */
Geometry2D.Line.from2P = function (p1, p2) {
    var a = p2.y - p1.y;
    var b = p1.x - p2.x;
    var c = -p1.y * b - p1.x * a;
    return new Geometry2D.Line(a, b, c);
};

/**
 * y = m x +c
 * @param m {number} Gradient of Line
 * @param c {number} y-intersection of Line
 * @returns {Geometry2D.Line}
 */
Geometry2D.Line.fromGradient = function (m, c) {
    return new Geometry2D.Line(m, 1, c);
};

/**
 * A circle with a center point(cp) and radius(r)
 * @param cp {Geometry2D.Point}
 * @param r {number}
 * @constructor
 */
Geometry2D.Circle = function (cp, r) {
    this.cp = cp;
    this.r = r;
};

/**
 * Create a circle from center point and a point at the circumference
 * @param cp {Geometry2D.Point} center point of the circle
 * @param p {Geometry2D.Point} point at the circumference
 */
Geometry2D.Circle.from2P = function (cp, p) {
    var r = Math.sqrt((cp.x - p.x) * (cp.x - p.x) + (cp.y - p.y) * (cp.y - p.y));
    return new Geometry2D.Circle(cp, r);
};

/**
 * Create the circle from three point from the circumference of the circle
 * @param p1 {Geometry2D.Point}
 * @param p2 {Geometry2D.Point}
 * @param p3 {Geometry2D.Point}
 * @return {Geometry2D.Circle}
 */
Geometry2D.Circle.from3P = function (p1, p2, p3) {
    /**
     * General equation of a circle is:
     * (x - cx)^2 + (y - cy)^2 = r^2 --- (1)
     *
     * Substitute p1, p2, and p3 into eq(1) and get:
     * (x1 - cx)^2 + (y1 - cy)^2 = r^2 --- (2)
     * (x2 - cx)^2 + (y2 - cy)^2 = r^2 --- (3)
     * (x3 - cx)^2 + (y3 - cy)^2 = r^2 --- (4)
     *
     * equate (2) and (3)
     * (x1 - cx)^2 + (y1 - cy)^2 = (x2 - cx)^2 + (y2 - cy)^2
     * -2 cx x1 + x1^2 + 2 cx x2 - x2^2 - 2 cy y1 + y1^2 + 2 cy y2 - y2^2 = 0
     * cx = (x1^2 - x2^2 - 2 cy y1 + y1^2 + 2 cy y2 - y2^2)/(2 (x1 - x2)) --- (5)
     *
     * equate (2) and (4)
     * (x1 - cx)^2 + (y1 - cy)^2 = (x3 - cx)^2 + (y3 - cy)^2
     * -2 cx x1 + x1^2 + 2 cx x3 - x3^2 - 2 cy y1 + y1^2 + 2 cy y3 - y3^2 = 0 --- Substitute (5) and simplify
     * -x2^2 x3 + x1^2 (-x2 + x3) + x3 (-2 cy y1 + y1^2 + 2 cy y2 - y2^2) + x1 (x2^2 - x3^2 - 2 cy y2 + y2^2 + 2 cy y3
     *   - y3^2) + x2 (x3^2 + 2 cy y1 - y1^2 - 2 cy y3 + y3^2) = 0 --- Solve cy
     * cy = (x1^2 x2 - x1 x2^2 - x1^2 x3 + x2^2 x3 + x1 x3^2 - x2 x3^2 + x2 y1^2 - x3 y1^2 - x1 y2^2 + x3 y2^2
     *   + x1 y3^2 - x2 y3^2)/(2 (x2 y1 - x3 y1 - x1 y2 + x3 y2 + x1 y3 - x2 y3)) --- (6)
     */
    var x1 = p1.x;
    var x2 = p2.x;
    var x3 = p3.x;
    var y1 = p1.y;
    var y2 = p2.y;
    var y3 = p3.y;
    var cy = (x1 * x1 * x2 - x1 * x2 * x2 - x1 * x1 * x3 + x2 * x2 * x3 + x1 * x3 * x3 - x2 * x3 * x3 + x2 * y1 * y1 - x3 * y1 * y1 - x1 * y2 * y2 + x3 * y2 * y2 + x1 * y3 * y3 - x2 * y3 * y3) / (2 * (x2 * y1 - x3 * y1 - x1 * y2 + x3 * y2 + x1 * y3 - x2 * y3));

    /**
     * Substitute cy into (5) get cx
     * @type {number}
     */
    var cx = (x1 * x1 - x2 * x2 - 2 * cy * y1 + y1 * y1 + 2 * cy * y2 - y2 * y2) / (2 * (x1 - x2));

    /**
     * Substitute cx and cy into eq (2) get r
     * @type {number}
     */
    var r = Math.sqrt((x1 - cx) * (x1 - cx) + (y1 - cy) * (y1 - cy));

    return new Geometry2D.Circle(new Geometry2D.Point(cx, cy), r);
};

Geometry2D.Circle.prototype = {
    /**
     * Return the gradient of the circle at point.
     * gradient is the degree of steepness of a graph(included circle) at any point.
     * @param point {Geometry2D.Point}
     * @returns {number}
     */
    getGradient: function (point) {
        return -(point.x - this.cp.x) / (point.y - this.cp.y);
    },


    /**
     * return the tangnet of the circle at point
     * @param point{Geometry2D.Point}
     * @param [result]{Geometry2D.Line}
     * @returns {Geometry2D.Line}
     */
    getTangent: function (point, result) {
        result = result ? result : new Geometry2D.Line(0, 0, 0);
        result.a = point.x - this.cp.x;
        result.b = point.y - this.cp.y;
        result.c = -result.a * point.x - result.b * point.y;
        return result;
    },


    /**
     * get the values of y on the circle respect to x
     * The result of y will write/store on the result[0] and result[0]
     * @param x {number}
     * @param [result] {Array}
     * @return {Array} [y1, y2]
     */
    getY: function (x, result) {
        result = result ? result : [];
        var d = Math.pow(this.r, 2) - Math.pow(x - this.cp.x, 2);
        if (d > 0) {
            var sqrtD = Math.sqrt(d);
            result[0] = this.cp.y - sqrtD;
            result[1] = this.cp.y + sqrtD;
        }
        return result;
    },


    /**
     * get the values of x on the circle respect to y
     * The result of x will write/store on the result[0] and result[0]
     * @param y {number}
     * @param [result] {Array}
     * @return {Array} [x1, x2]
     */
    getX: function (y, result) {
        result = result ? result : [];
        var d = Math.pow(this.r, 2) - Math.pow(y - this.cp.y, 2);
        if (d > 0) {
            var sqrtD = Math.sqrt(d);
            result[0] = this.cp.x - sqrtD;
            result[1] = this.cp.x + sqrtD;
        }
        return result;
    }

};

Geometry2D.Line.prototype = {
    /**
     * Get the gradient(m) of the Line
     * @returns {number}
     */
    getGradient: function () {
        return -this.a / this.b;
    },


    /**
     * Get the y value with respect x value in the line.
     * @param x {number}
     * @returns {number}
     */
    getY: function (x) {
        return (-this.c - this.a * x) / this.b;
    },


    /**
     * Get the x value with respect y value in the line.
     * @param y {number}
     * @returns {number}
     */
    getX: function (y) {
        return (-this.c - this.b * y) / this.a;
    },


    /**
     * get the normal line at the point x
     * normal line is the line perpendicular to this line.
     * @param x {number}
     * @return {Geometry2D.Line}
     */
    normal: function (x) {
        var y = this.getY(x);
        var a = this.b;
        var b = -this.a;
        var c = -a * x - b * y;

        return new Geometry2D.Line(a, b, c);
    },


    /**
     * get the line reflected over a mirrorLine of this line
     * @param {Geometry2D.Line} mirrorLine
     * @param {Geometry2D.Line} [result]
     * @returns {Geometry2D.Line}
     */
    reflectOver: function (mirrorLine, result) {
        result = result || new Geometry2D.Line(0, 0, 0);

        var a = this.a;
        var b = this.b;
        var c = this.c;
        var m_a = mirrorLine.a;
        var m_b = mirrorLine.b;
        var m_c = mirrorLine.c;

        result.a = -a * m_a * m_a + a * m_b * m_b - 2 * m_a * m_b * b;
        result.b = b * (m_a * m_a - m_b * m_b) - 2 * m_a * a * m_b;
        result.c = c * (m_a * m_a + m_b * m_b) - 2 * (m_a * a * m_c + m_b * b * m_c);

        return result;
    },


    /**
     * Get the angle between this line and otherLine
     * always return acute angle(in radius)
     * @param otherLine {Geometry2D.Line}
     * @returns {number} angle in radius
     */
    getAngle: function (otherLine) {
        var angle = Math.abs(Math.atan(-this.a / this.b) - Math.atan(-otherLine.a / otherLine.b));
        return angle > Math.PI / 2 ? Math.PI - angle : angle;
    },


    intersectCircle: function (circle, resultPoint1, resultPoint2) {
        var a = 1 + Math.pow(this.a, 2) / Math.pow(this.b, 2);
        var b = (2 * this.a * this.c) / (this.b * this.b) - 2 * circle.cp.x - (2 * this.a * circle.cp.y) / this.b;
        var c = Math.pow(this.c, 2) / Math.pow(this.b, 2) - circle.r * circle.r + Math.pow(circle.cp.x, 2) + 2 * this.c * circle.cp.y / this.b + Math.pow(circle.cp.y, 2);
        var d = b * b - 4 * a * c;
        if (d >= 0) {
            var sqrtD = Math.sqrt(d);
            var x1 = (-b - sqrtD) / 2 * a;
            var x2 = (-b + sqrtD) / 2 * a;

            var y1 = this.getY(x1);
            var y2 = this.getY(x2);

            return [new Geometry2D.Point(x1, y1), new Geometry2D.Point(x2, y2)];
        }
    },

    /**
     * Return the line as string. Example:
     * 12x + 3y - 23 = 0
     * @returns {string}
     */
    toString: function () {
        return this.a + 'x ' + (this.b > 0 ? '+ ' : '- ') + Math.abs(this.b) + 'y '
            + (this.c > 0 ? '+ ' : '- ') + Math.abs(this.c) + ' = 0';
    }
};