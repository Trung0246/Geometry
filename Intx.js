/**
 * Created by TSH96 on 1/8/2016.
 */

'use strict';

/**
 * Intersection library (Intx.js)
 * This library is design to find the intersection between different basic geometry
 * Basic geometry include:
 *  - Line
 *  - Segment
 *  - Circle
 *  - Ellipse
 *  - Quadratic Bezier Curve
 *  - Cubic Bezier Curve (include self-intersection)
 */
var Intx = {
    /**
     * Intersect of two line.
     * The number of intersection between 2 lines is always <= 1
     * Line 1: a1 x + b1 y + c1 == 0
     * Line 2: a2 x + b2 y + c2 == 0
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param c2 {number}
     * @param result {Array} [x1, y1]
     * @return {number} number of intersections
     */
    lineLine: function (a1, b1, c1, a2, b2, c2, result) {
        var d = a2 * b1 - a1 * b2;
        if (d !== 0) {
            result[0] = (b2 * c1 - b1 * c2) / d;
            result[0] = (a1 * c2 - a2 * c1) / d;
            return 1;
        } else {
            return 0;
        }
    },

    /**
     * Intersect of two segment.
     * The number of intersection between 2 segment is always <= 1
     *
     * Line 1: (in parametric form) (0 <= t1 <= 1)
     * x(t1) = (1 - t1) x1 + t1 x2
     * y(t1) = (1 - t1) y1 + t1 y2
     *
     * Line 2: (in parametric form) (0 <= t2 <= 1)
     * x(t2) = (1 - t2) x3 + t2 x4
     * y(t2) = (1 - t2) y3 + t2 y4
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    segmentSegment: function (x1, y1, x2, y2, x3, y3, x4, y4, result) {
        /**
         * Step 1: Equate the x and y of two line
         * (1 - t1) x1 + t1 x2 == (1 - t2) x3 + t2 x4 --- (1)
         * (1 - t1) y1 + t1 y2 == (1 - t2) y3 + t2 y4 --- (2)
         */

        /**
         * Step 2: get the t1 and t2 by solve the eq(1) and eq(2) simultaneously and get:
         * t1 = -(-x3 y1 + x4 y1 + x1 y3 - x4 y3 - x1 y4 + x3 y4) / (x3 y1 - x4 y1 - x3 y2 + x4 y2 - x1 y3 + x2 y3 + x1 y4 - x2 y4)
         * t2 = (-x2 y1 + x3 y1 + x1 y2 - x3 y2 - x1 y3 + x2 y3) / (x3 y1 - x4 y1 - x3 y2 + x4 y2 - x1 y3 + x2 y3 + x1 y4 - x2 y4)
         */

        var d = x3 * y1 - x4 * y1 - x3 * y2 + x4 * y2 - x1 * y3 + x2 * y3 + x1 * y4 - x2 * y4; // denominator of t1 and t2

        /**
         * check if the denominator is not equal to zero to prevent zero exception
         */
        if (d !== 0) {
            var t1 = -(-x3 * y1 + x4 * y1 + x1 * y3 - x4 * y3 - x1 * y4 + x3 * y4) / d;
            var t2 = (-x2 * y1 + x3 * y1 + x1 * y2 - x3 * y2 - x1 * y3 + x2 * y3) / d;

            if (0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1) {
                result[0] = (1 - t1) * x1 + t1 * x2;
                result[1] = (1 - t1) * y1 + t1 * y2;
                return 1;
            }
        }
        return 0;
    },

    /**
     * Intersect of two circle.
     * The number of intersection between 2 circle is always <= 2
     *
     * Circle 1: (parametric function)
     * x = r1 cos t1 + a1 --- (1)
     * y = r1 cos t1 + b1 --- (2)
     *
     * Circle 2:
     * x = r2 cos t2 + a2 --- (3)
     * y = r2 cos t2 + b2 --- (4)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param r1 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param r2 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    circleCircle: function (a1, b1, r1, a2, b2, r2, result) {
        /**
         * Step 1: Normalize the Circle 1 to origin
         * Let:
         * x = x' r1 + a1 --- (5)
         * y = y' r1 + b1 --- (6)
         *
         * (5) -> (1):
         * x' r1 + a1 = r1 cos t1 + a1
         * x' = cos t1 --- (7)
         *
         * (6) -> (2):
         * y' r1 + b1 = r1 sin t1 + b1
         * y' = sin t1 --- (8)
         *
         * (5) -> (3):
         * x' r1 + a1 = r2 cos t2 + a2
         * x' = (r2 / r1) cos t2 + (a2 - a1) / r1 --- (9)
         *
         * (6) -> (4):
         * y' r1 + b1 = r2 sin t2 + b2
         * y' = (r2 / r1) sin t2 + (b2 - b1) / r1 --- (10)
         *
         * Let:
         * a = (a2 - a1) / r1 --- (11)
         * b = (b2 - b1) / r1 --- (12)
         * r = r2 / r1 --- (13)
         *
         * Then:
         * (9) : x' = r cos t2 + a --- (14)
         * (10): y' = r sin t2 + b --- (15)
         */
        var a = (a2 - a1) / r1;
        var b = (b2 - b1) / r1;
        var r = r2 / r1;

        /**
         * Step 2: Equate x' and y'
         * cos t1 = r cos t2 + a --- (16)
         * sin t1 = r sin t2 + b --- (17)
         *
         * Square eq(16) and eq(17)
         * (cos t1)^2 = (r cos t2 + a)^2 --- (18)
         * (sin t1)^2 = (r sin t2 + b)^2 --- (19)
         *
         * Substitute into trigonometry identity sin^2 x + cos^2 x = 1
         * (r cos t2 + a)^2 + (r sin t2 + b)^2 = 1
         *
         * r^2 cos^2 t2 + 2 r a cos t2 + a^2 + r^2 sin^2 t2 + 2 r b sin t2 + b^2 = 1 --- Factorize
         * r^2 (cos^2 t2 + sin^2 t2) + 2 r (q cos t2 + b sin t2) + a^2 + b^2 = 1 --- Substitute sin^2 x + cos^2 x = 1
         * 2 r (q cos t2 + b sin t2) + a^2 + b^2 + r^2 = 1 --- Shift
         * a cos(t2) + b sin(t2) = (1 - a^2 - b^2 - r^2) / (2 r) --- Let c = (1 - a^2 - b^2 - r^2) / (2 r)
         * a cos(t2) + b sin(t2) = c --- (20)
         *
         * Let: (Tangent half-angle substitution)
         * x = tan(t2/2) --- (21)
         * Then:
         * sin t2 = (2 x) / (x^2 + 1) --- (22)
         * cos t2 = (1 - x^2) / (x^2 + 1) --- (23)
         *
         * (22) , (23) -> (20)
         * a ((1 - x^2) / (x^2 + 1)) + b ((2 x) / (x^2 + 1)) = c --- Factorize
         * (a + 2 b x - a x^2) / (1 + x^2) = c --- Multiply both side with (x^2 + 1)
         * a + 2 b x - a x^2 = (1 + x^2) c --- Expand and Shift
         * a - c + 2 b x + (-a - c) x^2 = 0  --- Substitute back (21)
         * a - c + 2 b tan(t2/2) + (-a - c) tan(t2/2)^2 = 0
         */

        var c = (1 - a * a - b * b - r * r) / (2 * r);

        /**
         * Step 3: Solve Quadratic Equation eq(24)
         * tan(t2/2) = (2 a +/- sqrt(4 a^2 - 4 (b + c)  (c - b))) / (2 (b + c)) --- Simplify
         * tan(t2/2) = (a +/- sqrt(a^2 + b^2 - c^2))/(b + c) --- Shift
         * t2 = 2 atan((a +/- sqrt(a^2 + b^2 - c^2))/(b + c))
         */

        var D = a * a + b * b - c * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t2 = 2 * Math.atan(b / (a + c));
            result[0] = r2 * Math.cos(t2) + a2;
            result[1] = r2 * Math.sin(t2) + b2;

            return 1;
        }
        else if (D > 0) { // two root
            var sqrtD = Math.sqrt(D);
            var t21 = 2 * Math.atan((b + sqrtD) / (a + c));
            result[0] = r2 * Math.cos(t21) + a2;
            result[1] = r2 * Math.sin(t21) + b2;

            var t22 = 2 * Math.atan((b - sqrtD) / (a + c));
            result[2] = r2 * Math.cos(t22) + a2;
            result[3] = r2 * Math.sin(t22) + b2;

            return 2;
        } // else no root
        return 0;
    },

    /**
     * Intersect of two ellipse.
     * The number of intersection between 2 circle is always <= 2
     *
     * Ellipse 1:
     * x = x1 + a1 cos(c1) cos(t1) - b1 sin(c1) sin(t1) --- (1)
     * y = y1 + a1 sin(c1) cos(t1) + b1 cos(c1) sin(t1) --- (2)
     *
     * Ellipse 2:
     * x = x2 + a2 cos(c2) cos(t2) - b2 sin(c2) sin(t2) --- (3)
     * y = y2 + a2 sin(c2) cos(t2) + b2 cos(c2) sin(t2) --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param c2 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    ellipseEllipse: function (x1, y1, a1, b1, c1, x2, y2, a2, b2, c2, result) {
        /**
         * Step 1: Normalize the ellipse
         * 1. shift the position of the ellipse 1 to the origin.
         *   transform matrix, T1 = {{1, 0, -x1}, {0, 1, -y1} ,{0, 0, 1}}
         *
         * 2. rotate the ellipse 1 so that its major axis is along x axis.
         *   transform matrix, T2 = {{cos(-c1), -sin(-c1), 0}, {sin(-c1), cos(-c1), 0}, {0, 0, 1}}
         *
         * 3. scale the ellipse 1 to make it become circle.
         *   transform matrix, T3 = {{b1, 0, 0}, {0, a1, 0}, {0, 0, 1}}
         *
         * 4. combine these transform matrices become:
         *   Tc = {{b1 cos(c1), b1 sin(c1), -b1 x1 cos(c1) - b1 y1 sin(c1)}, {-a1 sin(c1), a1 cos(c1), -a1 y1 cos(c1) + a1 x1 sin(c1)}, {0, 0, 1}}
         *
         * 5. Rewrite ellipse 1 and ellipse in matrix form.
         *   E1 = {{x1 + a1 cos(c1) cos(t1) - b1 sin(c1) sin(t1)}, {y1 + a1 sin(c1) cos(t1) + b1 cos(c1) sin(t1)}, {1}}
         *   E2 = {{x2 + a2 cos(c2) cos(t2) - b2 sin(c2) sin(t2)}, {y2 + a2 sin(c2) cos(t2) + b2 cos(c2) sin(t2)}, {1}}
         *
         * 6. Multiply Tc*E1 and Tc*E2 and rewrite them in parametric form.
         *   ellipse 1:
         *   x' = a1 b1 cos(t1) --- (5)
         *   y' = a1 b1 sin(t1) --- (6)
         *   ellipse 2:
         *   x' = b1 (-x1 cos(c1) + x2 cos(c1) - y1 sin(c1) + y2 sin(c1)) + a2 b1 cos(c1 - c2) cos(t2) + b1 b2 sin(c1 - c2) sin(t2) --- (7)
         *   y' = a1 (-y1 cos(c1) + y2 cos(c1) + x1 sin(c1) - x2 sin(c1)) - a1 a2 sin(c1 - c2) cos(t2) + a1 b2 cos(c1 - c2) sin(t2) --- (8)
         *
         */

        /**
         * Step 2: Collect the constant:
         * Let:
         * a = b1 (-x1 cos(c1) + x2 cos(c1) - y1 sin(c1) + y2 sin(c1))
         * b = a2 b1 cos(c1 - c2)
         * c = b1 b2 sin(c1 - c2)
         * d = a1 (-y1 cos(c1) + y2 cos(c1) + x1 sin(c1) - x2 sin(c1))
         * e = - a1 a2 sin(c1 - c2)
         * f = a1 b2 cos(c1 - c2)
         * r = a1 b1
         *
         * Then:
         * (5) x' = r cos(t1) --- (9)
         * (6) y' = r sin(t1) --- (10)
         * (7): x' = a + b cos(t2) + c sin(t2) --- (11)
         * (8): y' = d + e cos(t2) + f sin(t2) --- (12)
         */
        var a = b1 * (-x1 * Math.cos(c1) + x2 * Math.cos(c1) - y1 * Math.sin(c1) + y2 * Math.sin(c1));
        var b = a2 * b1 * Math.cos(c1 - c2);
        var c = b1 * b2 * Math.sin(c1 - c2);
        var d = a1 * (-y1 * Math.cos(c1) + y2 * Math.cos(c1) + x1 * Math.sin(c1) - x2 * Math.sin(c1));
        var e = -a1 * a2 * Math.sin(c1 - c2);
        var f = a1 * b2 * Math.cos(c1 - c2);
        var r = a1 * b1;

        /**
         * Step 3: equate x' and y'
         * r cos(t1) = a + b cos(t2) + c sin(t2)
         * cos(t1) = (a + b cos(t2) + c sin(t2)) / r --- (13)
         *
         * r sin(t1) = d + e cos(t2) + f sin(t2)
         * sin(t1) = (d + e cos(t2) + f sin(t2)) / r --- (14)
         *
         * Substitute into trigonometry identity sin^2 x + cos^2 x = 1
         * ((a + b cos(t2) + c sin(t2)) / r)^2 + ((d + e cos(t2) + f sin(t2)) / r)^2 = 1 --- Shift
         * (a + b cos(t2) + c sin(t2))^2 + (d + e cos(t2) + f sin(t2))^2 = r^2 --- Expand and then simplify
         * a^2 + d^2 + (2 a b + 2 d e) cos(t2) + (b^2 + e^2) cos(t2)^2 + (2 a c + 2 d f + (2 b c + 2 e f) cos(t2)) sin(t2) + (c^2 + f^2) sin(t2)^2 = r^2 --- (15)
         *
         * Let:
         * x = tan(t2/2) --- (16)
         * Then:
         * sin t2 = (2 x) / (x^2 + 1) --- (17)
         * cos t2 = (1 - x^2) / (x^2 + 1) --- (18)
         *
         * (17), (18) -> (15), Then Expand and Simplify.
         *
         * Let: q0 + q1 x + q2 x^2 + q3 x^3 + q4 x^4 = 0 --- (20)
         */

        var q0 = a * a + 2 * a * b + b * b + d * d + 2 * d * e + e * e - r * r;
        var q1 = 4 * a * c + 4 * b * c + 4 * d * f + 4 * e * f;
        var q2 = 2 * a * a - 2 * b * b + 4 * c * c + 2 * d * d - 2 * e * e + 4 * f * f - 2 * r * r;
        var q3 = 4 * a * c - 4 * b * c + 4 * d * f - 4 * e * f;
        var q4 = a * a - 2 * a * b + b * b + d * d - 2 * d * e + e * e - r * r;

        /**
         * Step 4: Solve the quartic Equation eq(20)
         */
        var roots = [];
        var l = this.quarticSolver(q0, q1, q2, q3, q4, roots);
        for (var n = 0; n < l; ++n) {
            var x = roots[n];

            /**
             * x = tan(t2/2) --- (16)
             * t2 = 2 atan(x)
             */
            var t2 = 2 * Math.atan(x);

            /**
             * x2 + a2 cos(c2) cos(t2) - b2 sin(c2) sin(t2) --- (3)
             * @type {number}
             */
            result[n * 2] = x2 + a2 * Math.cos(t2) * Math.cos(c2) - b2 * Math.sin(t2) * Math.sin(c2);

            /**
             * y2 + a2 sin(c2) cos(t2) + b2 cos(c2) sin(t2) --- (4)
             * @type {number}
             */
            result[n * 2 + 1] = y2 + a2 * Math.cos(t2) * Math.sin(c2) + b2 * Math.sin(t2) * Math.cos(c2);
        }

        return l;


    },

    /**
     * Intersect of two quadratic bezier curve.
     * The number of intersection between 2 quadratic bezier curve is always <= 4
     *
     * Quadratic bezier curve 1: (parametric function) (0 <= t1 <= 1)
     * x = (1 - t1)^2 x1 + 2 (1 - t1) t1 x2 + t1^2 x3 --- (1)
     * y = (1 - t1)^2 y1 + 2 (1 - t1) t1 y2 + t1^2 y3 --- (2)
     *
     * Quadratic bezier curve 2: (parametric function) (0 <= t2 <= 1)
     * x = (1 - t2)^2 x4 + 2 (1 - t2) t2 x5 + t2^2 x6 --- (3)
     * y = (1 - t2)^2 y4 + 2 (1 - t2) t2 y5 + t2^2 y6 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param x6 {number}
     * @param y6 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    bezier2Bezier2: function (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, result) {
        /**
         * Step 1: Equate x and y.
         * (1) and (2)
         * (1 - t1)^2 x1 + 2 (1 - t1) t1 x2 + t1^2 x3 = (1 - t2)^2 x4 + 2 (1 - t2) t2 x5 + t2^2 x6
         * x1 - x4 + t1 (-2 x1 + 2 x2) + t1^2 (x1 - 2 x2 + x3) + t2 (2 x4 - 2 x5) + t2^2 (-x4 + 2 x5 - x6) --- (5)
         * (3) and (4)
         * (1 - t1)^2 y1 + 2 (1 - t1) t1 y2 + t1^2 y3 = (1 - t2)^2 y4 + 2 (1 - t2) t2 y5 + t2^2 y6
         * y1 - y4 + t1 (-2 y1 + 2 y2) + t1^2 (y1 - 2 y2 + y3) + t2 (2 y4 - 2 y5) + t2^2 (-y4 + 2 y5 - y6) --- (6)
         *
         * Let:
         * a = x1 - 2 x2 + x3
         * b = -2 x1 + 2 x2
         * c = -x4 + 2 x5 - x6
         * d = 2 x4 - 2 x5
         * e = x1 - x4
         * f = y1 - 2 y2 + y3
         * g = -2 y1 + 2 y2
         * h = -y4 + 2 y5 - y6
         * i = 2 y4 - 2 y5
         * j = y1 - y4
         * Then:
         * (5): a t1^2 + b t1 + c t2^2 + d t2 + e = 0 --- (7)
         * (6): f t1^2 + g t1 + h t2^2 + i t2 + j = 0 --- (8)
         */
        var a = x1 - 2 * x2 + x3;
        var b = -2 * x1 + 2 * x2;
        var c = -x4 + 2 * x5 - x6;
        var d = 2 * x4 - 2 * x5;
        var e = x1 - x4;
        var f = y1 - 2 * y2 + y3;
        var g = -2 * y1 + 2 * y2;
        var h = -y4 + 2 * y5 - y6;
        var i = 2 * y4 - 2 * y5;
        var j = y1 - y4;

        /**
         * Step 2: Combine two implicit equation become one polynomial equation
         * From eq(7): Solve for the t1
         * a t1^2 + b t1 + c t2^2 + d t2 + e = 0
         * t1 = (-b - Sqrt[b^2 - 4 a e - 4 a d t2 - 4 a c t2^2])/(2 a) --- (9)
         * t1 = (-b + Sqrt[b^2 - 4 a e - 4 a d t2 - 4 a c t2^2])/(2 a) --- (10)
         *
         * (9) -> (8) : (11) and (10) -> (9) : (12) Then
         * (11) * (12) = 0 Then simplify:
         * e^2 f^2 - b e f g + a e g^2 + b^2 f j - 2 a e f j - a b g j +
         *   a^2 j^2 + (2 d e f^2 - b d f g + a d g^2 + b^2 f i - 2 a e f i -
         *   a b g i - 2 a d f j + 2 a^2 i j) t2 + (d^2 f^2 + 2 c e f^2 -
         *   b c f g + a c g^2 + b^2 f h - 2 a e f h - a b g h - 2 a d f i +
         *   a^2 i^2 - 2 a c f j + 2 a^2 h j) t2^2 + (2 c d f^2 - 2 a d f h -
         *   2 a c f i + 2 a^2 h i) t2^3 + (c^2 f^2 - 2 a c f h + a^2 h^2) t2^4 --- (13)
         *
         * Let:
         * q0 = e^2 f^2 - b e f g + a e g^2 + b^2 f j - 2 a e f j - a b g j + a^2 j^2
         * q1 = 2 d e f^2 - b d f g + a d g^2 + b^2 f i - 2 a e f i - a b g i - 2 a d f j + 2 a^2 i j
         * q2 = d^2 f^2 + 2 c e f^2 - b c f g + a c g^2 + b^2 f h - 2 a e f h - a b g h - 2 a d f i + a^2 i^2 - 2 a c f j + 2 a^2 h j
         * q3 = 2 c d f^2 - 2 a d f h - 2 a c f i + 2 a^2 h i
         * q4 = c^2 f^2 - 2 a c f h + a^2 h^2
         * Then:
         * (13): q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 = 0 --- (14)
         */
        var q0 = e * e * f * f - b * e * f * g + a * e * g * g + b * b * f * j - 2 * a * e * f * j - a * b * g * j + a * a * j * j,
            q1 = 2 * d * e * f * f - b * d * f * g + a * d * g * g + b * b * f * i - 2 * a * e * f * i - a * b * g * i - 2 * a * d * f * j + 2 * a * a * i * j,
            q2 = d * d * f * f + 2 * c * e * f * f - b * c * f * g + a * c * g * g + b * b * f * h - 2 * a * e * f * h - a * b * g * h - 2 * a * d * f * i + a * a * i * i - 2 * a * c * f * j + 2 * a * a * h * j,
            q3 = 2 * c * d * f * f - 2 * a * d * f * h - 2 * a * c * f * i + 2 * a * a * h * i,
            q4 = c * c * f * f - 2 * a * c * f * h + a * a * h * h;

        /**
         * Solve Quartic equation eq(14)
         */
        var roots = [];
        var length = this.quarticSolver(q0, q1, q2, q3, q4, roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t2 = roots[n];
            var t1 = (e * f - a * j + d * f * t2 - a * i * t2 + c * f * t2 * t2 - a * h * t2 * t2) / (-b * f + a * g);

            if (0 <= t2 && t2 <= 1 && 0 <= t1 && t1 <= 1) {
                var x = (1 - t2) * (1 - t2) * x4 + 2 * (1 - t2) * t2 * x5 + t2 * t2 * x6;
                var y = (1 - t2) * (1 - t2) * y4 + 2 * (1 - t2) * t2 * y5 + t2 * t2 * y6;
                result[noOfIntx * 2] = x;
                result[noOfIntx++ * 2 + 1] = y;
            }
        }
        return noOfIntx;

    },

    /**
     * Intersect of two cubic bezier curve.
     * The number of intersection between 2 cubic bezier curve is always <= 9
     *
     * Cubic bezier curve 1: (parametric function) (0 <= t1 <= 1)
     * x = (1 - t1)^3 x1 + 3 (1 - t1)^2 t1 x2 + 3 (1 - t1) t1^2 x3 + t1^3 x4 --- (1)
     * y = (1 - t1)^3 y1 + 3 (1 - t1)^2 t1 y2 + 3 (1 - t1) t1^2 y3 + t1^3 y4 --- (2)
     *
     * Cubic bezier curve 2: (parametric function) (0 <= t2 <= 1)
     * x = (1 - t2)^3 x5 + 3 (1 - t2)^2 t2 x6 + 3 (1 - t2) t2^2 x7 + t2^3 x8 --- (3)
     * y = (1 - t2)^3 y5 + 3 (1 - t2)^2 t2 y6 + 3 (1 - t2) t2^2 y7 + t2^3 y8 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param x6 {number}
     * @param y6 {number}
     * @param x7 {number}
     * @param y7 {number}
     * @param x8 {number}
     * @param y8 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    bezier3Bezier3: function (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7, x8, y8, result) {
        /**
         * Step 1: Equate x and y.
         * (1) and (2)
         * (1 - t1)^3 x1 + 3 (1 - t1)^2 t1 x2 + 3 (1 - t1) t1^2 x3 + t1^3 x4 =
         *   (1 - t2)^3 x5 + 3 (1 - t2)^2 t2 x6 + 3 (1 - t2) t2^2 x7 + t2^3 x8
         * t1^3 (-x1 + 3 x2 - 3 x3 + x4) + t1^2 (3 x1 - 6 x2 + 3 x3) + t1 (-3 x1 + 3 x2) + t2^3 (x5 - 3 x6 + 3 x7 - x8)
         *   + t2^2 (-3 x5 + 6 x6 - 3 x7) + t2 (3 x5 - 3 x6) + x1 - x5 = 0 --- (5)
         *
         * (3) and (4)
         * (1 - t1)^3 y1 + 3 (1 - t1)^2 t1 y2 + 3 (1 - t1) t1^2 y3 + t1^3 y4 = (1 - t2)^3 y5 + 3 (1 - t2)^2 t2 y6 + 3 (1 - t2) t2^2 y7 + t2^3 y8
         * t1^3 (-y1 + 3 y2 - 3 y3 + y4) + t1^2 (3 y1 - 6 y2 + 3 y3) + t1 (-3 y1 + 3 y2) + t2^3 (y5 - 3 y6 + 3 y7 - y8)
         *   + t2^2 (-3 y5 + 6 y6 - 3 y7) + t2 (3 y5 - 3 y6) + y1 - y5 = 0 --- (6)
         *
         * Let:
         * a = -x1 + 3 x2 - 3 x3 + x4
         * b = 3 x1 - 6 x2 + 3 x3
         * c = -3 x1 + 3 x2
         * d = x5 - 3 x6 + 3 x7 - x8
         * e = -3 x5 + 6 x6 - 3 x7
         * f = 3 x5 - 3 x6
         * g = x1 - x5
         * h = -y1 + 3 y2 - 3 y3 + y4
         * i = 3 y1 - 6 y2 + 3 y3
         * j = -3 y1 + 3 y2
         * k = y5 - 3 y6 + 3 y7 - y8
         * l = -3 y5 + 6 y6 - 3 y7
         * m = 3 y5 - 3 y6
         * n = y1 - y5
         * Then:
         * (5): a t1^3 + b t1^2 + c t1 + d t2^3 + e t2^2 + f t2 + g = 0 --- (7)
         * (6): h t1^3 + i t1^2 + j t1 + k t2^3 + l t2^2 + m t2 + n = 0 --- (8)
         */
        var a = -x1 + 3 * x2 - 3 * x3 + x4,
            b = 3 * x1 - 6 * x2 + 3 * x3,
            c = -3 * x1 + 3 * x2,
            d = x5 - 3 * x6 + 3 * x7 - x8,
            e = -3 * x5 + 6 * x6 - 3 * x7,
            f = 3 * x5 - 3 * x6,
            g = x1 - x5,
            h = -y1 + 3 * y2 - 3 * y3 + y4,
            i = 3 * y1 - 6 * y2 + 3 * y3,
            j = -3 * y1 + 3 * y2,
            k = y5 - 3 * y6 + 3 * y7 - y8,
            l = -3 * y5 + 6 * y6 - 3 * y7,
            m = 3 * y5 - 3 * y6,
            n = y1 - y5;

        /**
         * Step 2: Combine two implicit equation become one polynomial equation
         * From eq(7): get t1^3
         * t1^3 = (b t1^2 + c t1 + d t2^3 + e t2^2 + f t2 + g) / -a --- (9)
         *
         * Substitute (9) -> (8): (10). Then eq(10) is quadratic equation of t1
         * Solve t1 of eq (10), then get two solution (11) and (12)
         *
         * Substitute (11) -> (7): (13) and (12) -> (7): (14)
         * Then (13) * (14): (15) --- 9th degree polynomial equation
         *
         * Let q0 until q9 are the coefficient of the polynomial
         * Then:
         * (13): q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 + q5 t2^5 + q6 t2^6 + q7 t2^7 + q8 t2^8 + q9 t2^9 = 0 --- (14)
         */
        var q = [
            g * g * g * h * h * h - c * g * g * h * h * i - a * g * g * i * i * i + c * c * g * h * h * j - b * c * g * h *
            i * j + 3 * a * g * g * h * i * j + a * c * g * i * i * j + b * b * g * h * j * j - 2 * a * c * g * h * j * j -
            a * b * g * i * j * j + a * a * g * j * j * j - b * g * g * h * (-i * i + 2 * h * j) - c * c * c * h * h * n +
            3 * b * c * g * h * h * n - 3 * a * g * g * h * h * n + b * c * c * h * i * n - 2 * b * b * g * h * i * n - a *
            c * g * h * i * n + 2 * a * b * g * i * i * n - b * b * c * h * j * n + a * b * g * h * j * n + a * b * c * i *
            j * n - 3 * a * a * g * i * j * n - a * a * c * j * j * n - a * c * c * (i * i - 2 * h * j) * n + b * b * b * h
            * n * n - 3 * a * b * c * h * n * n + 3 * a * a * g * h * n * n - a * b * b * i * n * n + 2 * a * a * c * i * n
            * n + a * a * b * j * n * n - a * a * a * n * n * n,

            3 * f * g * g * h * h * h - 2 * c * f * g * h * h * i - 2 * a * f * g * i * i * i + c * c * f * h * h * j - b *
            c * f * h * i * j + 6 * a * f * g * h * i * j + a * c * f * i * i * j + b * b * f * h * j * j - 2 * a * c * f *
            h * j * j - a * b * f * i * j * j + a * a * f * j * j * j + 2 * b * f * g * h * (i * i - 2 * h * j) - c * c * c
            * h * h * m + 3 * b * c * g * h * h * m - 3 * a * g * g * h * h * m + b * c * c * h * i * m - 2 * b * b * g * h
            * i * m - a * c * g * h * i * m + 2 * a * b * g * i * i * m - b * b * c * h * j * m + a * b * g * h * j * m + a
            * b * c * i * j * m - 3 * a * a * g * i * j * m - a * a * c * j * j * m - a * c * c * (i * i - 2 * h * j) * m +
            3 * b * c * f * h * h * n - 6 * a * f * g * h * h * n - 2 * b * b * f * h * i * n - a * c * f * h * i * n + 2 *
            a * b * f * i * i * n + a * b * f * h * j * n - 3 * a * a * f * i * j * n + 2 * b * b * b * h * m * n - 6 * a *
            b * c * h * m * n + 6 * a * a * g * h * m * n - 2 * a * b * b * i * m * n + 4 * a * a * c * i * m * n + 2 * a *
            a * b * j * m * n + 3 * a * a * f * h * n * n - 3 * a * a * a * m * n * n,

            3 * f * f * g * h * h * h + 3 * e * g * g * h * h * h - c * f * f * h * h * i - 2 * c * e * g * h * h * i + b *
            f * f * h * i * i - a * f * f * i * i * i - 2 * a * e * g * i * i * i + c * c * e * h * h * j - 2 * b * f * f *
            h * h * j - b * c * e * h * i * j + 3 * a * f * f * h * i * j + 6 * a * e * g * h * i * j + a * c * e * i * i *
            j + b * b * e * h * j * j - 2 * a * c * e * h * j * j - a * b * e * i * j * j + a * a * e * j * j * j + 2 * b *
            e * g * h * (i * i - 2 * h * j) - c * c * c * h * h * l + 3 * b * c * g * h * h * l - 3 * a * g * g * h * h * l
            + b * c * c * h * i * l - 2 * b * b * g * h * i * l - a * c * g * h * i * l + 2 * a * b * g * i * i * l - b * b
            * c * h * j * l + a * b * g * h * j * l + a * b * c * i * j * l - 3 * a * a * g * i * j * l - a * a * c * j * j
            * l - a * c * c * (i * i - 2 * h * j) * l + 3 * b * c * f * h * h * m - 6 * a * f * g * h * h * m - 2 * b * b *
            f * h * i * m - a * c * f * h * i * m + 2 * a * b * f * i * i * m + a * b * f * h * j * m - 3 * a * a * f * i *
            j * m + b * b * b * h * m * m - 3 * a * b * c * h * m * m + 3 * a * a * g * h * m * m - a * b * b * i * m * m +
            2 * a * a * c * i * m * m + a * a * b * j * m * m + 3 * b * c * e * h * h * n - 3 * a * f * f * h * h * n - 6 *
            a * e * g * h * h * n - 2 * b * b * e * h * i * n - a * c * e * h * i * n + 2 * a * b * e * i * i * n + a * b *
            e * h * j * n - 3 * a * a * e * i * j * n + 2 * b * b * b * h * l * n - 6 * a * b * c * h * l * n + 6 * a * a *
            g * h * l * n - 2 * a * b * b * i * l * n + 4 * a * a * c * i * l * n + 2 * a * a * b * j * l * n + 6 * a * a *
            f * h * m * n - 3 * a * a * a * m * m * n + 3 * a * a * e * h * n * n - 3 * a * a * a * l * n * n,

            f * f * f * h * h * h + 6 * e * f * g * h * h * h + 3 * d * g * g * h * h * h - 2 * c * e * f * h * h * i - 2 *
            c * d * g * h * h * i + 2 * b * e * f * h * i * i - 2 * a * e * f * i * i * i - 2 * a * d * g * i * i * i + c *
            c * d * h * h * j - 4 * b * e * f * h * h * j - b * c * d * h * i * j + 6 * a * e * f * h * i * j + 6 * a * d *
            g * h * i * j + a * c * d * i * i * j + b * b * d * h * j * j - 2 * a * c * d * h * j * j - a * b * d * i * j *
            j + a * a * d * j * j * j + 2 * b * d * g * h * (i * i - 2 * h * j) - c * c * c * h * h * k + 3 * b * c * g * h
            * h * k - 3 * a * g * g * h * h * k + b * c * c * h * i * k - 2 * b * b * g * h * i * k - a * c * g * h * i * k
            + 2 * a * b * g * i * i * k - b * b * c * h * j * k + a * b * g * h * j * k + a * b * c * i * j * k - 3 * a * a
            * g * i * j * k - a * a * c * j * j * k - a * c * c * (i * i - 2 * h * j) * k + 3 * b * c * f * h * h * l - 6 *
            a * f * g * h * h * l - 2 * b * b * f * h * i * l - a * c * f * h * i * l + 2 * a * b * f * i * i * l + a * b *
            f * h * j * l - 3 * a * a * f * i * j * l + 3 * b * c * e * h * h * m - 3 * a * f * f * h * h * m - 6 * a * e *
            g * h * h * m - 2 * b * b * e * h * i * m - a * c * e * h * i * m + 2 * a * b * e * i * i * m + a * b * e * h *
            j * m - 3 * a * a * e * i * j * m + 2 * b * b * b * h * l * m - 6 * a * b * c * h * l * m + 6 * a * a * g * h *
            l * m - 2 * a * b * b * i * l * m + 4 * a * a * c * i * l * m + 2 * a * a * b * j * l * m + 3 * a * a * f * h *
            m * m - a * a * a * m * m * m + 3 * b * c * d * h * h * n - 6 * a * e * f * h * h * n - 6 * a * d * g * h * h *
            n - 2 * b * b * d * h * i * n - a * c * d * h * i * n + 2 * a * b * d * i * i * n + a * b * d * h * j * n - 3 *
            a * a * d * i * j * n + 2 * b * b * b * h * k * n - 6 * a * b * c * h * k * n + 6 * a * a * g * h * k * n - 2 *
            a * b * b * i * k * n + 4 * a * a * c * i * k * n + 2 * a * a * b * j * k * n + 6 * a * a * f * h * l * n + 6 *
            a * a * e * h * m * n - 6 * a * a * a * l * m * n + 3 * a * a * d * h * n * n - 3 * a * a * a * k * n * n,

            3 * e * f * f * h * h * h + 3 * e * e * g * h * h * h + 6 * d * f * g * h * h * h - c * e * e * h * h * i - 2 *
            c * d * f * h * h * i + b * e * e * h * i * i + 2 * b * d * f * h * i * i - a * e * e * i * i * i - 2 * a * d *
            f * i * i * i - 2 * b * e * e * h * h * j - 4 * b * d * f * h * h * j + 3 * a * e * e * h * i * j + 6 * a * d *
            f * h * i * j + 3 * b * c * f * h * h * k - 6 * a * f * g * h * h * k - 2 * b * b * f * h * i * k - a * c * f *
            h * i * k + 2 * a * b * f * i * i * k + a * b * f * h * j * k - 3 * a * a * f * i * j * k + 3 * b * c * e * h *
            h * l - 3 * a * f * f * h * h * l - 6 * a * e * g * h * h * l - 2 * b * b * e * h * i * l - a * c * e * h * i *
            l + 2 * a * b * e * i * i * l + a * b * e * h * j * l - 3 * a * a * e * i * j * l + b * b * b * h * l * l - 3 *
            a * b * c * h * l * l + 3 * a * a * g * h * l * l - a * b * b * i * l * l + 2 * a * a * c * i * l * l + a * a *
            b * j * l * l + 3 * b * c * d * h * h * m - 6 * a * e * f * h * h * m - 6 * a * d * g * h * h * m - 2 * b * b *
            d * h * i * m - a * c * d * h * i * m + 2 * a * b * d * i * i * m + a * b * d * h * j * m - 3 * a * a * d * i *
            j * m + 2 * b * b * b * h * k * m - 6 * a * b * c * h * k * m + 6 * a * a * g * h * k * m - 2 * a * b * b * i *
            k * m + 4 * a * a * c * i * k * m + 2 * a * a * b * j * k * m + 6 * a * a * f * h * l * m + 3 * a * a * e * h *
            m * m - 3 * a * a * a * l * m * m - 3 * a * e * e * h * h * n - 6 * a * d * f * h * h * n + 6 * a * a * f * h *
            k * n + 6 * a * a * e * h * l * n - 3 * a * a * a * l * l * n + 6 * a * a * d * h * m * n - 6 * a * a * a * k *
            m * n,

            3 * e * e * f * h * h * h + 3 * d * f * f * h * h * h + 6 * d * e * g * h * h * h - 2 * c * d * e * h * h * i +
            2 * b * d * e * h * i * i - 2 * a * d * e * i * i * i - 4 * b * d * e * h * h * j + 6 * a * d * e * h * i * j +
            3 * b * c * e * h * h * k - 3 * a * f * f * h * h * k - 6 * a * e * g * h * h * k - 2 * b * b * e * h * i * k -
            a * c * e * h * i * k + 2 * a * b * e * i * i * k + a * b * e * h * j * k - 3 * a * a * e * i * j * k + 3 * b *
            c * d * h * h * l - 6 * a * e * f * h * h * l - 6 * a * d * g * h * h * l - 2 * b * b * d * h * i * l - a * c *
            d * h * i * l + 2 * a * b * d * i * i * l + a * b * d * h * j * l - 3 * a * a * d * i * j * l + 2 * b * b * b *
            h * k * l - 6 * a * b * c * h * k * l + 6 * a * a * g * h * k * l - 2 * a * b * b * i * k * l + 4 * a * a * c *
            i * k * l + 2 * a * a * b * j * k * l + 3 * a * a * f * h * l * l - 3 * a * e * e * h * h * m - 6 * a * d * f *
            h * h * m + 6 * a * a * f * h * k * m + 6 * a * a * e * h * l * m - 3 * a * a * a * l * l * m + 3 * a * a * d *
            h * m * m - 3 * a * a * a * k * m * m - 6 * a * d * e * h * h * n + 6 * a * a * e * h * k * n + 6 * a * a * d *
            h * l * n - 6 * a * a * a * k * l * n,

            e * e * e * h * h * h + 6 * d * e * f * h * h * h + 3 * d * d * g * h * h * h - c * d * d * h * h * i + b * d *
            d * h * i * i - a * d * d * i * i * i - 2 * b * d * d * h * h * j + 3 * a * d * d * h * i * j + 3 * b * c * d *
            h * h * k - 6 * a * e * f * h * h * k - 6 * a * d * g * h * h * k - 2 * b * b * d * h * i * k - a * c * d * h *
            i * k + 2 * a * b * d * i * i * k + a * b * d * h * j * k - 3 * a * a * d * i * j * k + b * b * b * h * k * k -
            3 * a * b * c * h * k * k + 3 * a * a * g * h * k * k - a * b * b * i * k * k + 2 * a * a * c * i * k * k + a *
            a * b * j * k * k - 3 * a * e * e * h * h * l - 6 * a * d * f * h * h * l + 6 * a * a * f * h * k * l + 3 * a *
            a * e * h * l * l - a * a * a * l * l * l - 6 * a * d * e * h * h * m + 6 * a * a * e * h * k * m + 6 * a * a *
            d * h * l * m - 6 * a * a * a * k * l * m - 3 * a * d * d * h * h * n + 6 * a * a * d * h * k * n - 3 * a * a *
            a * k * k * n,

            3 * d * e * e * h * h * h + 3 * d * d * f * h * h * h - 3 * a * e * e * h * h * k - 6 * a * d * f * h * h * k +
            3 * a * a * f * h * k * k - 6 * a * d * e * h * h * l + 6 * a * a * e * h * k * l + 3 * a * a * d * h * l * l -
            3 * a * a * a * k * l * l - 3 * a * d * d * h * h * m + 6 * a * a * d * h * k * m - 3 * a * a * a * k * k * m,

            3 * d * d * e * h * h * h - 6 * a * d * e * h * h * k + 3 * a * a * e * h * k * k - 3 * a * d * d * h * h * l +
            6 * a * a * d * h * k * l - 3 * a * a * a * k * k * l,

            d * d * d * h * h * h - 3 * a * d * d * h * h * k + 3 * a * a * d * h * k * k - a * a * a * k * k * k
        ];

        /**
         * Step 3: Solve 9th degree of polynomial equation
         */
        var roots = [];
        var length = this.polySolver(q, roots);
        var noOfIntx = 0;
        for (var index = 0; index < length; ++index) {
            var t2 = roots[index];
            var t11;
            var t12;
            var _a = -b * h + a * i;
            var _b = -c * h + a * j;
            var _c = -g * h + a * n - f * h * t2 + a * m * t2 - e * h * t2 * t2 + a * l * t2 * t2 - d * h * t2 * t2 * t2 + a * k * t2 * t2 * t2;
            var D = _b * _b - 4 * _a * _c;
            if (D > 0 && Math.abs(D) < 1e7) {
                var sqrtD = Math.sqrt(D);
                t11 = (-_b - sqrtD ) / (2 * _a);
                t12 = (-_b + sqrtD ) / (2 * _a);
                console.log(t11, t12);
            }
            if (0 <= t2 && t2 <= 1 && (0 <= t11 && t11 <= 1 || 0 <= t12 && t12 <= 1 )) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * (1 - t2) * x5 + 3 * (1 - t2) * (1 - t2) * t2 * x6 + 3 * (1 - t2) * t2 * t2 * x7 + t2 * t2 * t2 * x8; // x
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * (1 - t2) * y5 + 3 * (1 - t2) * (1 - t2) * t2 * y6 + 3 * (1 - t2) * t2 * t2 * y7 + t2 * t2 * t2 * y8; // y
            }
        }
        return noOfIntx;
    },

    /**
     * intersection of a line to a segment.
     * The number of intersection between a line to a segment is always <= 1
     *
     * Line 1: a x + b y + c == 0 --- (1)
     *
     * Segment: (in parametric form) (0 <= t <= 1)
     * x(t1) = (1 - t) x1 + t x2 --- (2)
     * y(t1) = (1 - t) y1 + t y2 --- (3)
     *
     * @param a {number}
     * @param b {number}
     * @param c {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    lineSegment: function (a, b, c, x1, y1, x2, y2, result) {
        /**
         * Step 1: Substitute eq(2) and eq(3) into eq(1)
         * a ((1 - t) x1 + t x2) + b ((1 - t) y1 + t y2) + c == 0 --- (4)
         */

        /**
         * Step 2: solve the t form e1(4)
         * t = (c + a x1 + b y1) / (a x1 - a x2 + b y1 - b y2)
         */

        var d = a * x1 - a * x2 + b * y1 - b * y2; // denominator of t

        /**
         * check if the denominator is not equal to zero to prevent zero exception
         */
        if (d !== 0) {
            var t = (c + a * x1 + b * y1) / d;

            if (0 <= t && t <= 1) {
                result[0] = (1 - t) * x1 + t * x2;
                result[1] = (1 - t) * y1 + t * y2;
                return 1;
            }
        }
        return 0;
    },

    /**
     * intersection of a line to a circle.
     * The number of intersection between a line to a circle is always <= 2
     *
     *
     * Line: a1 x + b1 y + c1 = 0 --- (1)
     *
     * Circle: (in parametric form)
     * x = r cos(t) + a2 --- (2)
     * y = r sin(t) + b2 --- (3)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param r {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    lineCircle: function (a1, b1, c1, a2, b2, r, result) {
        /**
         * Step 1: Substitution
         * (2), (3) -> (1)
         * a1 (r cos(t) + a2) + b1 (r sin(t) + b2) + c1 = 0
         * a1 a2 + b1 b2 + c1 + a1 r cos(t) + b1 r sin(t) = 0 --- (4)
         */

        /**
         * Step 2: Tangent half-angle substitution
         * Let: (Tangent half-angle substitution)
         * x = tan(t/2) --- (5)
         * Then:
         * sin(t) = (2 x) / (x^2 + 1) --- (6)
         * cos(t) = (1 - x^2) / (x^2 + 1) --- (7)
         *
         * (6), (7) -> (4)
         * a1 a2 + b1 b2 + c1 + a1 r ((1 - x^2) / (x^2 + 1)) + b1 r ((2 x) / (x^2 + 1))  = 0 --- Simplify
         * b1 b2 + c1 + a1 (a2 + r) + 2 b1 r x + (b1 b2 + c1 + a1 (a2 - r)) x^2 --- (8)
         *
         * let:
         * a = (b1 b2 + c1 + a1 (a2 - r))
         * b = 2 b1 r
         * c = b1 b2 + c1 + a1 (a2 + r)
         * Then:
         * (8): a x^2 + b x +c = 0
         *
         */
        var a = b1 * b2 + c1 + a1 * (a2 - r);
        var b = 2 * b1 * r;
        var c = b1 * b2 + c1 + a1 * (a2 + r);

        /**
         * Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t = 2 * Math.atan(-b / (2 * a));
            result[0] = r * Math.cos(t) + a2;
            result[1] = r * Math.sin(t) + b2;

            return 1;
        }
        else if (D > 0) { // two root
            var sqrtD = Math.sqrt(D);
            var t1 = 2 * Math.atan((-b - sqrtD) / (2 * a));
            result[0] = r * Math.cos(t1) + a2;
            result[1] = r * Math.sin(t1) + b2;

            var t2 = 2 * Math.atan((-b + sqrtD) / (2 * a));
            result[2] = r * Math.cos(t2) + a2;
            result[3] = r * Math.sin(t2) + b2;

            return 2;
        } // else no root
        return 0;
    },

    /**
     * intersection of a line to a ellipse.
     * The number of intersection between a line to a ellipse is always <= 2
     *
     *
     * Line: a1 x + b1 y + c1 = 0 --- (1)
     *
     * Circle: (in parametric form)
     * x = x2 + a2 cos(c2) cos(t) - b2 sin(c2) sin(t) --- (2)
     * y = y2 + a2 sin(c2) cos(t) + b2 cos(c2) sin(t) --- (3)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param c2 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    lineEllipse: function (a1, b1, c1, x2, y2, a2, b2, c2, result) {
        /**
         * Step 1: Substitution
         * (2), (3) -> (1):
         * a1 (x2 + a2 Cos[c2] Cos[t] - b2 Sin[c2] Sin[t]) + b1 (y2 + a2 Sin[c2] Cos[t] + b2 Cos[c2] Sin[t]) + c1 = 0
         * c1 + a1 x2 + b1 y2 + Cos[t] (a1 a2 Cos[c2] + a2 b1 Sin[c2]) + (b1 b2 Cos[c2] - a1 b2 Sin[c2]) Sin[t] = 0 --- (4)
         */

        /**
         * Step 2: Tangent half-angle substitution
         * Let: (Tangent half-angle substitution)
         * x = tan(t/2) --- (5)
         * Then:
         * sin(t) = (2 x) / (x^2 + 1) --- (6)
         * cos(t) = (1 - x^2) / (x^2 + 1) --- (7)
         *
         * (6), (7) -> (4)
         * c1 + a1 x2 + b1 y2 + ((1 - x^2) / (x^2 + 1)) (a1 a2 Cos[c2] + a2 b1 Sin[c2]) + (b1 b2 Cos[c2] - a1 b2 Sin[c2]) ((2 x) / (x^2 + 1)) = 0
         * c1 + a1 x2 + b1 y2 + a1 a2 Cos[c2] + a2 b1 Sin[c2] + x^2 (c1 + a1 x2 + b1 y2 - a1 a2 Cos[c2] - a2 b1 Sin[c2]) + x (2 b1 b2 Cos[c2] - 2 a1 b2 Sin[c2]) = 0 --- (8)
         *
         * Let:
         * a = c1 + a1 x2 + b1 y2 - a1 a2 Cos[c2] - a2 b1 Sin[c2]
         * b = 2 b1 b2 Cos[c2] - 2 a1 b2 Sin[c2]
         * c = c1 + a1 x2 + b1 y2 + a1 a2 Cos[c2] + a2 b1 Sin[c2]
         * Then:
         * (8): a x^2 + b x + c = 0 --- (9)
         */
        var a = c1 + a1 * x2 + b1 * y2 - a1 * a2 * Math.cos(c2) - a2 * b1 * Math.sin(c2);
        var b = 2 * b1 * b2 * Math.cos(c2) - 2 * a1 * b2 * Math.sin(c2);
        var c = c1 + a1 * x2 + b1 * y2 + a1 * a2 * Math.cos(c2) + a2 * b1 * Math.sin(c2);

        /**
         * Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t = 2 * Math.atan(-b / (2 * a));
            result[0] = x2 + a2 * Math.cos(c2) * Math.cos(t) - b2 * Math.sin(c2) * Math.sin(t);
            result[1] = y2 + a2 * Math.sin(c2) * Math.cos(t) + b2 * Math.cos(c2) * Math.sin(t);

            return 1;
        }
        else if (D > 0) { // two root
            var sqrtD = Math.sqrt(D);
            var t1 = 2 * Math.atan((-b - sqrtD) / (2 * a));
            result[0] = x2 + a2 * Math.cos(c2) * Math.cos(t1) - b2 * Math.sin(c2) * Math.sin(t1);
            result[1] = y2 + a2 * Math.sin(c2) * Math.cos(t1) + b2 * Math.cos(c2) * Math.sin(t1);

            var t2 = 2 * Math.atan((-b + sqrtD) / (2 * a));
            result[2] = x2 + a2 * Math.cos(c2) * Math.cos(t2) - b2 * Math.sin(c2) * Math.sin(t2);
            result[3] = y2 + a2 * Math.sin(c2) * Math.cos(t2) + b2 * Math.cos(c2) * Math.sin(t2);

            return 2;
        } // else no root
        return 0;

    },

    /**
     * intersection of a line to a quadratic bezier curve.
     * The number of intersection between a line to a quadratic bezier curve is always <= 2
     *
     *
     * Line: a1 x + b1 y + c1 = 0 --- (1)
     *
     * Quadratic bezier curve 1: (parametric function) (0 <= t <= 1)
     * x = (1 - t)^2 x1 + 2 (1 - t) t x2 + t^2 x3 --- (2)
     * y = (1 - t)^2 y1 + 2 (1 - t) t y2 + t^2 y3 --- (3)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    lineBezier2: function (a1, b1, c1, x1, y1, x2, y2, x3, y3, result) {
        /**
         * Step 1: Substitution
         * (2), (3) -> (1):
         * a1 ((1 - t)^2 x1 + 2 (1 - t) t x2 + t^2 x3) + b1 ((1 - t)^2 y1 + 2 (1 - t) t y2 + t^2 y3) + c1 = 0 --- Simplify
         * c1 + a1 x1 + b1 y1 + t (-2 a1 x1 + 2 a1 x2 - 2 b1 y1 + 2 b1 y2) + t^2 (a1 x1 - 2 a1 x2 + a1 x3 + b1 y1 - 2 b1 y2 + b1 y3) --- (4)
         *
         * Let:
         * a = a1 x1 - 2 a1 x2 + a1 x3 + b1 y1 - 2 b1 y2 + b1 y3
         * b = -2 a1 x1 + 2 a1 x2 - 2 b1 y1 + 2 b1 y2
         * c = c1 + a1 x1 + b1 y1
         * Then:
         * (4): a t^2 + b t +c = 0 --- (5)
         */
        var a = a1 * x1 - 2 * a1 * x2 + a1 * x3 + b1 * y1 - 2 * b1 * y2 + b1 * y3,
            b = -2 * a1 * x1 + 2 * a1 * x2 - 2 * b1 * y1 + 2 * b1 * y2,
            c = c1 + a1 * x1 + b1 * y1;

        /**
         * Step 2: Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t = -b / (2 * a);
            if (0 <= t && t <= 1) {
                result[0] = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * x2 + t * t * x3; // x
                result[1] = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * y2 + t * t * y3; // y
                return 1;
            }
        }
        else if (D > 0) { // two root
            var noOfIntx = 0;
            var sqrtD = Math.sqrt(D);
            var t1 = (-b - sqrtD) / (2 * a);
            if (0 <= t1 && t1 <= 1) {
                result[noOfIntx * 2] = (1 - t1) * (1 - t1) * x1 + 2 * (1 - t1) * t1 * x2 + t1 * t1 * x3; // x
                result[noOfIntx++ * 2 + 1] = (1 - t1) * (1 - t1) * y1 + 2 * (1 - t1) * t1 * y2 + t1 * t1 * y3; // y
            }

            var t2 = (-b + sqrtD) / (2 * a);
            if (0 <= t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * x1 + 2 * (1 - t2) * t2 * x2 + t2 * t2 * x3; // x
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * y1 + 2 * (1 - t2) * t2 * y2 + t2 * t2 * y3; // y
            }

            return noOfIntx;
        } // else no root
        return 0;

    },

    /**
     * intersection of a line to a quadratic cubic curve.
     * The number of intersection between a line to a cubic bezier curve is always <= 3
     *
     *
     * Line: a1 x + b1 y + c1 = 0 --- (1)
     *
     * Quadratic bezier curve 1: (parametric function) (0 <= t <= 1)
     * x = (1 - t)^3 x1 + 3 (1 - t)^2 t x2 + 3 (1 - t) t^2 x3 + t^3 x4 --- (2)
     * y = (1 - t)^3 y1 + 3 (1 - t)^2 t y2 + 3 (1 - t) t^2 y3 + t^3 y4 --- (3)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    lineBezier3: function (a1, b1, c1, x1, y1, x2, y2, x3, y3, x4, y4, result) {
        /**
         * Step 1: Substitution
         * (2), (3) -> (1):
         * a1 ((1 - t)^3 x1 + 3 (1 - t)^2 t x2 + 3 (1 - t) t^2 x3 + t^3 x4) + b1 ((1 - t)^3 y1 + 3 (1 - t)^2 t y2 + 3 (1 - t) t^2 y3 + t^3 y4) + c1 = 0 --- Simplify
         * c1 + a1 x1 + b1 y1 + t (-3 a1 x1 + 3 a1 x2 - 3 b1 y1 + 3 b1 y2) +
         *   t^2 (3 a1 x1 - 6 a1 x2 + 3 a1 x3 + 3 b1 y1 - 6 b1 y2 + 3 b1 y3) +
         *   t^3 (-a1 x1 + 3 a1 x2 - 3 a1 x3 + a1 x4 - b1 y1 + 3 b1 y2 - 3 b1 y3 +
         *   b1 y4) = 0 --- (4)
         *
         * Let:
         * q0 = c1 + a1 x1 + b1 y1
         * q1 = -3 a1 x1 + 3 a1 x2 - 3 b1 y1 + 3 b1 y2
         * q2 = 3 a1 x1 - 6 a1 x2 + 3 a1 x3 + 3 b1 y1 - 6 b1 y2 + 3 b1 y3
         * q3 = -a1 x1 + 3 a1 x2 - 3 a1 x3 + a1 x4 - b1 y1 + 3 b1 y2 - 3 b1 y3 + b1 y4
         * Then:
         * (4): q0 + q1 t + q2 t^2 + q3 t^3 = 0 --- (5)
         */
        var q0 = c1 + a1 * x1 + b1 * y1,
            q1 = -3 * a1 * x1 + 3 * a1 * x2 - 3 * b1 * y1 + 3 * b1 * y2,
            q2 = 3 * a1 * x1 - 6 * a1 * x2 + 3 * a1 * x3 + 3 * b1 * y1 - 6 * b1 * y2 + 3 * b1 * y3,
            q3 = -a1 * x1 + 3 * a1 * x2 - 3 * a1 * x3 + a1 * x4 - b1 * y1 + 3 * b1 * y2 - 3 * b1 * y3 + b1 * y4;

        /**
         * Step 2: Solve quartic equation.
         */
        var roots = [];
        var length = this.cubicSolver(q0, q1, q2, q3, roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t = roots[n];
            if (0 <= t && t <= 1) {
                result[noOfIntx * 2] = (1 - t) * (1 - t) * (1 - t) * x1 + 3 * (1 - t) * (1 - t) * t * x2 + 3 * (1 - t) * t * t * x3 + t * t * t * x4;
                result[noOfIntx++ * 2 + 1] = (1 - t) * (1 - t) * (1 - t) * y1 + 3 * (1 - t) * (1 - t) * t * y2 + 3 * (1 - t) * t * t * y3 + t * t * t * y4;
            }
        }
        return noOfIntx;
    },

    /**
     * intersection of a segment to a circle.
     * The number of intersection between a line to a ellipse is always <= 2
     *
     * segment: (in parametric form) (0 <= t1 <= 1)
     * x = (1 - t1) x1 + t1 x2 --- (1)
     * y = (1 - t1) y1 + t1 y2 --- (2)
     *
     * Circle: (in parametric form)
     * x = r cos(t2) + a1 --- (3)
     * y = r sin(t2) + b1 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param a1 {number}
     * @param b1 {number}
     * @param r {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    segmentCircle: function (x1, y1, x2, y2, a1, b1, r, result) {
        /**
         * Step 1: Substitution
         * (2): r cos(t2) = x - a1 --- (5)
         * (3): r sin(t2) = y - b1 --- (6)
         *
         * Substitute (4), (5) ->  (r sin(t2))^2 + (r cos(t2))^2 = r^2
         * (x - a1)^2 + (y - b1)^2 = r^2 --- (7)
         *
         * Substitute (1), (2) -> (7)
         * ((1 - t1) x1 + t1 x2 - a1)^2 + ((1 - t1) y1 + t1 y2 - b1)^2 = r^2 --- Expand and Simplify
         * a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2 + t1 (2 a1 x1 - 2 x1^2 - 2 a1 x2 + 2 x1 x2 + 2 b1 y1
         *    - 2 y1^2 - 2 b1 y2 + 2 y1 y2) + t1^2 (x1^2 - 2 x1 x2 + x2^2 + y1^2 - 2 y1 y2 + y2^2) --- (8)
         *
         * Let:
         * a = x1^2 - 2 x1 x2 + x2^2 + y1^2 - 2 y1 y2 + y2^2
         * b = 2 a1 x1 - 2 x1^2 - 2 a1 x2 + 2 x1 x2 + 2 b1 y1 - 2 y1^2 - 2 b1 y2 + 2 y1 y2
         * c = a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2
         * Then:
         * (8): a t1^2 + b t1 + c = 0
         */

        var a = x1 * x1 - 2 * x1 * x2 + x2 * x2 + y1 * y1 - 2 * y1 * y2 + y2 * y2,
            b = 2 * a1 * x1 - 2 * x1 * x1 - 2 * a1 * x2 + 2 * x1 * x2 + 2 * b1 * y1 - 2 * y1 * y1 - 2 * b1 * y2 + 2 * y1 * y2,
            c = a1 * a1 + b1 * b1 - r * r - 2 * a1 * x1 + x1 * x1 - 2 * b1 * y1 + y1 * y1;

        /**
         * Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t1 = -b / (2 * a);

            if (0 <= t1 && t1 <= 1) {
                result[0] = (1 - t1) * x1 + t1 * x2;
                result[1] = (1 - t1) * y1 + t1 * y2;
                return 1;
            }
        }
        else if (D > 0) { // two root
            var sqrtD = Math.sqrt(D);
            var noOfIntx = 0;

            var t11 = (-b - sqrtD) / (2 * a);
            if (0 <= t11 && t11 <= 1) {
                result[0] = (1 - t11) * x1 + t11 * x2;
                result[1] = (1 - t11) * y1 + t11 * y2;
                ++noOfIntx;
            }

            var t12 = (-b + sqrtD) / (2 * a);
            if (0 <= t12 && t12 <= 1) {
                result[noOfIntx * 2] = (1 - t12) * x1 + t12 * x2;
                result[noOfIntx * 2 + 1] = (1 - t12) * y1 + t12 * y2;
                ++noOfIntx;
            }

            return noOfIntx;
        } // else no root
        return 0;
    },

    /**
     * intersection of a segment to a ellipse.
     * The number of intersection between a line to a ellipse is always <= 2
     *
     * segment: (in parametric form) (0 <= t1 <= 1)
     * x = (1 - t1) x1 + t1 x2 --- (1)
     * y = (1 - t1) y1 + t1 y2 --- (2)
     *
     * Circle: (in parametric form)
     * x = x3 + a2 cos(c2) cos(t2) - b2 sin(c2) sin(t2) --- (3)
     * y = y3 + a2 sin(c2) cos(t2) + b2 cos(c2) sin(t2) --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param cx {number}
     * @param cy {number}
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    segmentEllipse: function (x1, y1, x2, y2, cx, cy, a1, b1, c1, result) {
        /**
         * Step 1: Normalize the ellipse
         * 1. shift the position of the ellipse 1 to the origin.
         *   transform matrix, T1 = {{1, 0, -x2}, {0, 1, -y2} ,{0, 0, 1}}
         *
         * 2. rotate the ellipse 1 so that its major axis is along x axis.
         *   transform matrix, T2 = {{cos(-c1), -sin(-c1), 0}, {sin(-c1), cos(-c1), 0}, {0, 0, 1}}
         *
         * 3. scale the ellipse 1 to make it become circle.
         *   transform matrix, T3 = {{b1, 0, 0}, {0, a1, 0}, {0, 0, 1}}
         *
         * 4. combine these transform matrices become:
         *   Tc = {{b1 Cos[c1], b1 Sin[c1], -b1 cx Cos[c1] - b1 cy Sin[c1]}, {-a1 Sin[c1], a1 Cos[c1], -a1 cy Cos[c1] + a1 cx Sin[c1]}, {0, 0, 1}}
         *
         * 5. Rewrite segment and ellipse in matrix form.
         *   S = {{x1, x2}, {y1, y2}, {1, 1}}
         *   E = {{cx + a1 Cos[c1] Cos[t2] - b1 Sin[c1] Sin[t2]}, {cy + a1 Sin[c1] Cos[t2] + b1 Cos[c1] Sin[t2]}, {1}}
         *
         * 6. Multiply Tc*S and Tc*E2 and rewrite them in parametric form.
         *   segment:
         *   x1' = b1 ((-cx + x1) Cos[c1] + (-cy + y1) Sin[c1])
         *   y1' = a1 ((-cy + y1) Cos[c1] + (cx - x1) Sin[c1])
         *   x2' = b1 ((-cx + x2) Cos[c1] + (-cy + y2) Sin[c1])
         *   y2' = a1 ((-cy + y2) Cos[c1] + (cx - x2) Sin[c1])
         *
         *   ellipse:
         *   x' = a1 b1 cos(t2) --- (5)
         *   y' = a1 b1 sin(t2) --- (6)
         *
         *   Let:
         *   r = a1 b1
         *   Then:
         *   x' = (1 - t1) x1' + t1 x2' --- (7)
         *   y' = (1 - t1) y1' + t1 y2' --- (8)
         *   x' = r cos(t2) --- (9)
         *   y' = r sin(t2) --- (10)
         */
        var x1_ = b1 * ((-cx + x1) * Math.cos(c1) + (-cy + y1) * Math.sin(c1));
        var y1_ = a1 * ((-cy + y1) * Math.cos(c1) + (cx - x1) * Math.sin(c1));
        var x2_ = b1 * ((-cx + x2) * Math.cos(c1) + (-cy + y2) * Math.sin(c1));
        var y2_ = a1 * ((-cy + y2) * Math.cos(c1) + (cx - x2) * Math.sin(c1));
        var r = a1 * b1;

        /**
         * Step 2: Equate x' and y'
         * r cos(t2) = (1 - t1) x1' + t1 x2' --- (9)
         * r sin(t2) = (1 - t1) y1' + t1 y2' --- (10)
         *
         * Substitute (9), (10) ->  (r sin(t2))^2 + (r cos(t2))^2 = r^2
         * ((1 - t1) x1' + t1 x2')^2 + ((1 - t1) y1' + t1 y2')^2 = r^2 --- Expand and Simplify
         * -r^2 + x1^2 + y1^2 + t1 (-2 x1^2 + 2 x1 x2 - 2 y1^2 + 2 y1 y2) + t1^2 (x1^2 - 2 x1 x2 + x2^2 + y1^2 - 2 y1 y2 + y2^2) --- (11)
         *
         * Let:
         * a = x1^2 - 2 x1 x2 + x2^2 + y1^2 - 2 y1 y2 + y2^2
         * b = -2 x1^2 + 2 x1 x2 - 2 y1^2 + 2 y1 y2
         * c = -r^2 + x1^2 + y1^2
         */
        var a = x1_ * x1_ - 2 * x1_ * x2_ + x2_ * x2_ + y1_ * y1_ - 2 * y1_ * y2_ + y2_ * y2_,
            b = -2 * x1_ * x1_ + 2 * x1_ * x2_ - 2 * y1_ * y1_ + 2 * y1_ * y2_,
            c = -r * r + x1_ * x1_ + y1_ * y1_;

        /**
         * Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t1 = -b / (2 * a);

            if (0 <= t1 && t1 <= 1) {
                result[0] = (1 - t1) * x1 + t1 * x2;
                result[1] = (1 - t1) * y1 + t1 * y2;
                return 1;
            }
        }
        else if (D > 0) { // two root
            var sqrtD = Math.sqrt(D);
            var noOfIntx = 0;

            var t11 = (-b - sqrtD) / (2 * a);
            if (0 <= t11 && t11 <= 1) {
                result[0] = (1 - t11) * x1 + t11 * x2;
                result[1] = (1 - t11) * y1 + t11 * y2;
                ++noOfIntx;
            }

            var t12 = (-b + sqrtD) / (2 * a);
            if (0 <= t12 && t12 <= 1) {
                result[noOfIntx * 2] = (1 - t12) * x1 + t12 * x2;
                result[noOfIntx * 2 + 1] = (1 - t12) * y1 + t12 * y2;
                ++noOfIntx;
            }

            return noOfIntx;
        } // else no root
        return 0;
    },

    /**
     * intersection of a segment to a quadratic bezier curve.
     * The number of intersection between a line to a quadratic bezier curve is always <= 2
     *
     * segment: (in parametric form) (0 <= t1 <= 1)
     * x = (1 - t1) x1 + t1 x2 --- (1)
     * y = (1 - t1) y1 + t1 y2 --- (2)
     *
     * Circle: (in parametric form) (0 <= t2 <= 1)
     * x = (1 - t2)^2 x3 + 2 (1 - t2) t2 x4 + t2^2 x5 --- (3)
     * y = (1 - t2)^2 y3 + 2 (1 - t2) t2 y4 + t2^2 y5 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    segmentBezier2: function (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, result) {
        /**
         * Step 1: Equate x and y
         * (1) and (3):
         * (1 - t1) x1 + t1 x2 = (1 - t2)^2 x3 + 2 (1 - t2) t2 x4 + t2^2 x5 --- Solve t1
         * t1 = (x1 - x3 + 2 t2 x3 - t2^2 x3 - 2 t2 x4 + 2 t2^2 x4 - t2^2 x5)/(x1 - x2) --- (5)
         *
         * (2) and (4):
         * (1 - t1) y1 + t1 y2 = (1 - t2)^2 y3 + 2 (1 - t2) t2 y4 + t2^2 y5 --- Substitute eq(5) and Simplify
         * -x2 y1 + x3 (y1 - y2) + x1 y2 - x1 y3 + x2 y3 +
         *   t2 (2 x4 y1 - 2 x3 (y1 - y2) - 2 x4 y2 + 2 x1 y3 - 2 x2 y3 -
         *   2 x1 y4 + 2 x2 y4) +
         *   t2^2 (-2 x4 y1 + x5 y1 + x3 (y1 - y2) + 2 x4 y2 - x5 y2 - x1 y3 +
         *   x2 y3 + 2 x1 y4 - 2 x2 y4 - x1 y5 + x2 y5) = 0 --- (6)
         *
         * Let:
         * a = -2 x4 y1 + x5 y1 + x3 (y1 - y2) + 2 x4 y2 - x5 y2 - x1 y3 + x2 y3 + 2 x1 y4 - 2 x2 y4 - x1 y5 + x2 y5
         * b = 2 x4 y1 - 2 x3 (y1 - y2) - 2 x4 y2 + 2 x1 y3 - 2 x2 y3 - 2 x1 y4 + 2 x2 y4
         * c = -x2 y1 + x3 (y1 - y2) + x1 y2 - x1 y3 + x2 y3
         * Then:
         * (6): a t2^2 + b t2 + c = 0 --- (7)
         */

        var a = -2 * x4 * y1 + x5 * y1 + x3 * (y1 - y2) + 2 * x4 * y2 - x5 * y2 - x1 * y3 + x2 * y3 + 2 * x1 * y4 - 2 * x2 * y4 - x1 * y5 + x2 * y5,
            b = 2 * x4 * y1 - 2 * x3 * (y1 - y2) - 2 * x4 * y2 + 2 * x1 * y3 - 2 * x2 * y3 - 2 * x1 * y4 + 2 * x2 * y4,
            c = -x2 * y1 + x3 * (y1 - y2) + x1 * y2 - x1 * y3 + x2 * y3;

        /**
         * Step 2: Solve quadratic equation
         */
        var D = b * b - 4 * a * c; // // Discriminant. More on https://en.wikipedia.org/wiki/Discriminant
        if (D === 0) { // only one root
            var t2 = -b / (2 * a);
            var t1 = (x1 - x3 + 2 * t2 * x3 - t2 * t2 * x3 - 2 * t2 * x4 + 2 * t2 * t2 * x4 - t2 * t2 * x5) / (x1 - x2);
            if (0 <= t1 && t1 <= 1 && 0 <= t2 && t2 <= 1) {
                result[0] = (1 - t2) * (1 - t2) * x3 + 2 * (1 - t2) * t2 * x4 + t2 * t2 * x5; // x
                result[1] = (1 - t2) * (1 - t2) * y3 + 2 * (1 - t2) * t2 * y4 + t2 * t2 * y5; // y
                return 1;
            }
        }
        else if (D > 0) { // two root
            var noOfIntx = 0;
            var sqrtD = Math.sqrt(D);
            var t21 = (-b - sqrtD) / (2 * a);
            var t11 = (x1 - x3 + 2 * t21 * x3 - t21 * t21 * x3 - 2 * t21 * x4 + 2 * t21 * t21 * x4 - t21 * t21 * x5) / (x1 - x2);
            if (0 <= t11 && t11 <= 1 && 0 <= t21 && t21 <= 1) {
                result[noOfIntx * 2] = (1 - t21) * (1 - t21) * x3 + 2 * (1 - t21) * t21 * x4 + t21 * t21 * x5; // x
                result[noOfIntx++ * 2 + 1] = (1 - t21) * (1 - t21) * y3 + 2 * (1 - t21) * t21 * y4 + t21 * t21 * y5; // y
            }

            var t22 = (-b + sqrtD) / (2 * a);
            var t12 = (x1 - x3 + 2 * t22 * x3 - t22 * t22 * x3 - 2 * t22 * x4 + 2 * t22 * t22 * x4 - t22 * t22 * x5) / (x1 - x2);
            if (0 <= t12 && t12 <= 1 && 0 <= t22 && t22 <= 1) {
                result[noOfIntx * 2] = (1 - t22) * (1 - t22) * x3 + 2 * (1 - t22) * t22 * x4 + t22 * t22 * x5; // x
                result[noOfIntx++ * 2 + 1] = (1 - t22) * (1 - t22) * y3 + 2 * (1 - t22) * t22 * y4 + t22 * t22 * y5; // y
            }

            return noOfIntx;
        } // else no root
        return 0;
    },

    /**
     * intersection of a segment to a cubic bezier curve.
     * The number of intersection between a line to a cubic bezier curve is always <= 3
     *
     * segment: (in parametric form) (0 <= t1 <= 1)
     * x = (1 - t1) x1 + t1 x2 --- (1)
     * y = (1 - t1) y1 + t1 y2 --- (2)
     *
     * Circle: (in parametric form) (0 <= t2 <= 1)
     * x = (1 - t2)^3 x3 + 3 (1 - t2)^2 t2 x4 + 3 (1 - t2) t2^2 x5 + t2^3 x6 --- (3)
     * y = (1 - t2)^3 y3 + 3 (1 - t2)^2 t2 y4 + 3 (1 - t2) t2^2 y5 + t2^3 y6 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param x6 {number}
     * @param y6 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    segmentBezier3: function (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, result) {
        /**
         * Step 1: Equate x and y
         * (1) and (3):
         * (1 - t1) x1 + t1 x2 = (1 - t2)^3 x3 + 3 (1 - t2)^2 t2 x4 + 3 (1 - t2) t2^2 x5 + t2^3 x6 --- Solve t1
         * t1 = (1/(-x1 +
         *   x2))(-x1 + x3 - 3 t2 x3 + 3 t2^2 x3 - t2^3 x3 + 3 t2 x4 -
         *   6 t2^2 x4 + 3 t2^3 x4 + 3 t2^2 x5 - 3 t2^3 x5 + t2^3 x6) --- (5)
         *
         * (2) and (4):
         * (1 - t1) y1 + t1 y2 = (1 - t2)^3 y3 + 3 (1 - t2)^2 t2 y4 + 3 (1 - t2) t2^2 y5 + t2^3 y6 --- Substitute eq(5) and Simplify
         * -x2 y1 + x3 (y1 - y2) + x1 y2 - x1 y3 + x2 y3 +
         *   t2 (3 x4 y1 - 3 x3 (y1 - y2) - 3 x4 y2 + 3 x1 y3 - 3 x2 y3 -
         *   3 x1 y4 + 3 x2 y4) +
         *   t2^2 (-6 x4 y1 + 3 x5 y1 + 3 x3 (y1 - y2) + 6 x4 y2 - 3 x5 y2 -
         *   3 x1 y3 + 3 x2 y3 + 6 x1 y4 - 6 x2 y4 - 3 x1 y5 + 3 x2 y5) +
         *   t2^3 (3 x4 y1 - 3 x5 y1 + x6 y1 - x3 (y1 - y2) - 3 x4 y2 + 3 x5 y2 -
         *   x6 y2 + x1 y3 - x2 y3 - 3 x1 y4 + 3 x2 y4 + 3 x1 y5 - 3 x2 y5 -
         *   x1 y6 + x2 y6) --- (6)
         *
         * Let:
         * q0 = x2 y1 - x3 (y1 - y2) - x1 y2 + x1 y3 - x2 y3
         * q1 = -3 x4 y1 + 3 x3 (y1 - y2) + 3 x4 y2 - 3 x1 y3 + 3 x2 y3 + 3 x1 y4 - 3 x2 y4
         * q2 = 6 x4 y1 - 3 x5 y1 - 3 x3 (y1 - y2) - 6 x4 y2 + 3 x5 y2 + 3 x1 y3 - 3 x2 y3 - 6 x1 y4 + 6 x2 y4 + 3 x1 y5 - 3 x2 y5
         * q3 = -3 x4 y1 + 3 x5 y1 - x6 y1 + x3 (y1 - y2) + 3 x4 y2 - 3 x5 y2 + x6 y2 - x1 y3 + x2 y3 + 3 x1 y4 - 3 x2 y4 - 3 x1 y5 + 3 x2 y5 + x1 y6 - x2 y6
         *
         * Then:
         * (6): q0 + q1 t2 + q2 t2^2 + q3 t2^3 = 0 --- (7)
         */
        var q0 = x2 * y1 - x3 * (y1 - y2) - x1 * y2 + x1 * y3 - x2 * y3,
            q1 = -3 * x4 * y1 + 3 * x3 * (y1 - y2) + 3 * x4 * y2 - 3 * x1 * y3 + 3 * x2 * y3 + 3 * x1 * y4 - 3 * x2 * y4,
            q2 = 6 * x4 * y1 - 3 * x5 * y1 - 3 * x3 * (y1 - y2) - 6 * x4 * y2 + 3 * x5 * y2 + 3 * x1 * y3 - 3 * x2 * y3 - 6 * x1 * y4 + 6 * x2 * y4 + 3 * x1 * y5 - 3 * x2 * y5,
            q3 = -3 * x4 * y1 + 3 * x5 * y1 - x6 * y1 + x3 * (y1 - y2) + 3 * x4 * y2 - 3 * x5 * y2 + x6 * y2 - x1 * y3 + x2 * y3 + 3 * x1 * y4 - 3 * x2 * y4 - 3 * x1 * y5 + 3 * x2 * y5 + x1 * y6 - x2 * y6;

        /**
         * Step 2: Solve cubic equation eq(7)
         */
        var roots = [];
        var length = this.cubicSolver(q0, q1, q2, q3, roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t2 = roots[n];
            var t1 = (1 / (-x1 + x2)) * (-x1 + x3 - 3 * t2 * x3 + 3 * t2 * t2 * x3 - t2 * t2 * t2 * x3 + 3 * t2 * x4 - 6 * t2 * t2 * x4 + 3 * t2 * t2 * t2 * x4 + 3 * t2 * t2 * x5 - 3 * t2 * t2 * t2 * x5 + t2 * t2 * t2 * x6);
            if (0 <= t1 && t1 <= 1 && 0 < t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * (1 - t2) * x3 + 3 * (1 - t2) * (1 - t2) * t2 * x4 + 3 * (1 - t2) * t2 * t2 * x5 + t2 * t2 * t2 * x6;
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * (1 - t2) * y3 + 3 * (1 - t2) * (1 - t2) * t2 * y4 + 3 * (1 - t2) * t2 * t2 * y5 + t2 * t2 * t2 * y6;
            }
        }
        return noOfIntx;
    },

    /**
     * Intersect of a circle and a ellipse
     * The number of intersection between a circle and a ellipse is always <= 4
     *
     * Circle: (parametric form)
     * x = r cos(t1) + a1 --- (1)
     * y = r sin(t1) + b1 --- (2)
     *
     * Ellipse: (parametric form)
     * x = x1 + a2 cos(t2) cos(c2) - b2 sin(t2) sin(c2) --- (3)
     * y = y1 + a2 cos(t2) sin(c2) + b2 sin(t2) cos(c2) --- (4)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param r {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param a2 {number}
     * @param b2 {number}
     * @param c2 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    circleEllipse: function (a1, b1, r, x1, y1, a2, b2, c2, result) {
        /**
         * Step 1: Normalize the Circle
         * x = x' + a1 --- (5)
         * y = y' + b1 --- (6)
         *
         * (5) -> (1)
         * x' + a1 = r cos(t1) + a1
         * x' = r cos(t1) --- (7)
         *
         * (6) -> (2)
         * y' + b1 = r sin(t1) + b1
         * y' = r sin(t1) --- (8)
         *
         * (5) -> (3)
         * x' + a1 = x1 + a2 cos(t2) cos(c2) - b2 sin(t2) sin(c2)
         * x'  = (x1 - a1) + (a2 cos(c2)) cos(t2)  - (b2 sin(c2)) sin(t2) --- (9)
         *
         * (6) -> (4)
         * y' + b1 = y1 + a2 cos(t2) sin(c2) + b2 sin(t2) cos(c2)
         * y' = (y1 - b1) + (a2 sin(c2)) cos(t2) + (b2 cos(c2)) sin(t2) --- (10)
         *
         * Let:
         * a = x1 - a1
         * b = a2 cos(c2)
         * c = -b2 sin(c2)
         * d = y1 - b1
         * e = a2 sin(c2)
         * f = b2 cos(c2)
         *
         * Then:
         * x' = a + b cos(t2) + c sin(t2) --- (11)
         * y' = d + e cos(t2) + f sin(t2) --- (12)
         */
        var a = x1 - a1;
        var b = a2 * Math.cos(c2);
        var c = -b2 * Math.sin(c2);
        var d = y1 - b1;
        var e = a2 * Math.sin(c2);
        var f = b2 * Math.cos(c2);

        /**
         * Step 2: equate x' and y'
         * r cos(t1) = a + b cos(t2) + c sin(t2)
         * cos(t1) = (a + b cos(t2) + c sin(t2)) / r --- (13)
         *
         * r sin(t1) = d + e cos(t2) + f sin(t2)
         * sin(t1) = (d + e cos(t2) + f sin(t2)) / r --- (14)
         *
         * Substitute into trigonometry identity sin^2 x + cos^2 x = 1
         * ((a + b cos(t2) + c sin(t2)) / r)^2 + ((d + e cos(t2) + f sin(t2)) / r)^2 = 1 --- Shift
         * (a + b cos(t2) + c sin(t2))^2 + (d + e cos(t2) + f sin(t2))^2 = r^2 --- Expand and then simplify
         * a^2 + d^2 + (2 a b + 2 d e) cos(t2) + (b^2 + e^2) cos(t2)^2 + (2 a c + 2 d f + (2 b c + 2 e f) cos(t2)) sin(t2) + (c^2 + f^2) sin(t2)^2 = r^2 --- (15)
         *
         * Let:
         * x = tan(t2/2) --- (16)
         * Then:
         * sin t2 = (2 x) / (x^2 + 1) --- (17)
         * cos t2 = (1 - x^2) / (x^2 + 1) --- (18)
         *
         * (17), (18) -> (15), Then Expand and Simplify.
         *
         * Let: q0 + q1 x + q2 x^2 + q3 x^3 + q4 x^4 = 0 --- (20)
         */

        var q0 = a * a + 2 * a * b + b * b + d * d + 2 * d * e + e * e - r * r;
        var q1 = 4 * a * c + 4 * b * c + 4 * d * f + 4 * e * f;
        var q2 = 2 * a * a - 2 * b * b + 4 * c * c + 2 * d * d - 2 * e * e + 4 * f * f - 2 * r * r;
        var q3 = 4 * a * c - 4 * b * c + 4 * d * f - 4 * e * f;
        var q4 = a * a - 2 * a * b + b * b + d * d - 2 * d * e + e * e - r * r;

        /**
         * Step 3: Solve the quartic Equation eq(20)
         */
        var roots = [];
        var l = this.quarticSolver(q0, q1, q2, q3, q4, roots);
        for (var n = 0; n < l; ++n) {
            var x = roots[n];

            /**
             * x = tan(t2/2) --- (16)
             * t2 = 2 atan(x)
             */
            var t2 = 2 * Math.atan(x);

            /**
             * x = x1 + a2 cos(t2) cos(c2) - b2 sin(t2) sin(c2) --- (3)
             * @type {number}
             */
            result[n * 2] = x1 + a2 * Math.cos(t2) * Math.cos(c2) - b2 * Math.sin(t2) * Math.sin(c2);

            /**
             * y = y1 + a2 cos(t2) sin(c2) + b2 sin(t2) cos(c2) --- (4)
             * @type {number}
             */
            result[n * 2 + 1] = y1 + a2 * Math.cos(t2) * Math.sin(c2) + b2 * Math.sin(t2) * Math.cos(c2);
        }

        return l;
    },

    /**
     * Intersect of a circle and a quadratic bezier curve
     * The number of intersection between a circle and a quadratic bezier curve is always <= 4
     *
     * Circle: (parametric form)
     * x = r cos(t1) + a1 --- (1)
     * y = r sin(t1) + b1 --- (2)
     *
     * Quadratic bezier curve 1: (parametric function)  (0 <= t2 <= 1)
     * x = (1 - t2)^2 x1 + 2 (1 - t2) t2 x2 + t2^2 x3 --- (3)
     * y = (1 - t2)^2 y1 + 2 (1 - t2) t2 y2 + t2^2 y3 --- (4)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param r {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    circleBezier2: function (a1, b1, r, x1, y1, x2, y2, x3, y3, result) {
        /**
         * Step 1: Substitution
         * (1): r cos(t1) = x - a1 --- (5)
         * (2): r sin(t1) = y - b1 --- (6)
         *
         * (3) -> (5)
         * r cos(t1) = (1 - t2)^2 x1 + 2 (1 - t2) t2 x2 + t2^2 x3 - a1 --- (7)
         *
         * (4) -> (6)
         * r sin(t1) = (1 - t2)^2 y1 + 2 (1 - t2) t2 y2 + t2^2 y3 - b1 --- (8)
         *
         * Substitute (7), (8) ->  (r sin(t2))^2 + (r cos(t2))^2 = r^2
         * ((1 - t2)^2 x1 + 2 (1 - t2) t2 x2 + t2^2 x3 - a1)^2 + ((1 - t2)^2 y1 + 2 (1 - t2) t2 y2 + t2^2 y3 - b1)^2 = r^2 --- Expand and Simplify
         * a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2 +
         *   t2 (4 a1 x1 - 4 x1^2 - 4 a1 x2 + 4 x1 x2 + 4 b1 y1 - 4 y1^2 -
         *   4 b1 y2 + 4 y1 y2) +
         *   t2^2 (-2 a1 x1 + 6 x1^2 + 4 a1 x2 - 12 x1 x2 + 4 x2^2 - 2 a1 x3 +
         *   2 x1 x3 - 2 b1 y1 + 6 y1^2 + 4 b1 y2 - 12 y1 y2 + 4 y2^2 -
         *   2 b1 y3 + 2 y1 y3) +
         *   t2^3 (-4 x1^2 + 12 x1 x2 - 8 x2^2 - 4 x1 x3 + 4 x2 x3 - 4 y1^2 +
         *   12 y1 y2 - 8 y2^2 - 4 y1 y3 + 4 y2 y3) +
         *   t2^4 (x1^2 - 4 x1 x2 + 4 x2^2 + 2 x1 x3 - 4 x2 x3 + x3^2 + y1^2 -
         *   4 y1 y2 + 4 y2^2 + 2 y1 y3 - 4 y2 y3 + y3^2) --- (9)
         *
         * Let:
         * q0 = a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2
         * q1 = 4 a1 x1 - 4 x1^2 - 4 a1 x2 + 4 x1 x2 + 4 b1 y1 - 4 y1^2 - 4 b1 y2 + 4 y1 y2
         * q2 = -2 a1 x1 + 6 x1^2 + 4 a1 x2 - 12 x1 x2 + 4 x2^2 - 2 a1 x3 + 2 x1 x3 - 2 b1 y1 + 6 y1^2 + 4 b1 y2 - 12 y1 y2 + 4 y2^2 - 2 b1 y3 + 2 y1 y3
         * q3 = -4 x1^2 + 12 x1 x2 - 8 x2^2 - 4 x1 x3 + 4 x2 x3 - 4 y1^2 + 12 y1 y2 - 8 y2^2 - 4 y1 y3 + 4 y2 y3
         * q4 = x1^2 - 4 x1 x2 + 4 x2^2 + 2 x1 x3 - 4 x2 x3 + x3^2 + y1^2 - 4 y1 y2 + 4 y2^2 + 2 y1 y3 - 4 y2 y3 + y3^2
         * Then:
         * q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 = 0
         *
         */

        var q0 = a1 * a1 + b1 * b1 - r * r - 2 * a1 * x1 + x1 * x1 - 2 * b1 * y1 + y1 * y1,
            q1 = 4 * a1 * x1 - 4 * x1 * x1 - 4 * a1 * x2 + 4 * x1 * x2 + 4 * b1 * y1 - 4 * y1 * y1 - 4 * b1 * y2 + 4 * y1 * y2,
            q2 = -2 * a1 * x1 + 6 * x1 * x1 + 4 * a1 * x2 - 12 * x1 * x2 + 4 * x2 * x2 - 2 * a1 * x3 + 2 * x1 * x3 - 2 * b1 * y1 + 6 * y1 * y1 + 4 * b1 * y2 - 12 * y1 * y2 + 4 * y2 * y2 - 2 * b1 * y3 + 2 * y1 * y3,
            q3 = -4 * x1 * x1 + 12 * x1 * x2 - 8 * x2 * x2 - 4 * x1 * x3 + 4 * x2 * x3 - 4 * y1 * y1 + 12 * y1 * y2 - 8 * y2 * y2 - 4 * y1 * y3 + 4 * y2 * y3,
            q4 = x1 * x1 - 4 * x1 * x2 + 4 * x2 * x2 + 2 * x1 * x3 - 4 * x2 * x3 + x3 * x3 + y1 * y1 - 4 * y1 * y2 + 4 * y2 * y2 + 2 * y1 * y3 - 4 * y2 * y3 + y3 * y3;

        /**
         * Step 2: Solve the quartic Equation eq(20)
         */
        var roots = [];
        var l = this.quarticSolver(q0, q1, q2, q3, q4, roots);
        var noOfIntx = 0;
        for (var n = 0; n < l; ++n) {
            var t2 = roots[n];

            if (0 <= t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * x1 + 2 * (1 - t2) * t2 * x2 + t2 * t2 * x3;
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * y1 + 2 * (1 - t2) * t2 * y2 + t2 * t2 * y3;
            }
        }

        return noOfIntx;
    },

    /**
     * Intersect of a circle and a cubic bezier curve
     * The number of intersection between a circle and a cubic bezier curve is always <= 6
     *
     * Circle: (parametric form)
     * x = r cos(t1) + a1 --- (1)
     * y = r sin(t1) + b1 --- (2)
     *
     * Quadratic bezier curve 1: (parametric function)  (0 <= t2 <= 1)
     * x = (1 - t2)^3 x1 + 3 (1 - t2)^2 t2 x2 + 3 (1 - t2) t2^2 x3 + t2^3 x4 --- (3)
     * y = (1 - t2)^3 y1 + 3 (1 - t2)^2 t2 y2 + 3 (1 - t2) t2^2 y3 + t2^3 y4 --- (4)
     *
     * @param a1 {number}
     * @param b1 {number}
     * @param r {number}
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    circleBezier3: function (a1, b1, r, x1, y1, x2, y2, x3, y3, x4, y4, result) {
        /**
         * Step 1: Substitution
         * (1): r cos(t1) = x - a1 --- (5)
         * (2): r sin(t1) = y - b1 --- (6)
         *
         * (3) -> (5)
         * r cos(t1) = (1 - t2)^3 x1 + 3 (1 - t2)^2 t2 x2 + 3 (1 - t2) t2^2 x3 + t2^3 x4 - a1 --- (7)
         *
         * (4) -> (6)
         * r sin(t1) = (1 - t2)^3 y1 + 3 (1 - t2)^2 t2 y2 + 3 (1 - t2) t2^2 y3 + t2^3 y4 - b1 --- (8)
         *
         * Substitute (7), (8) ->  (r sin(t2))^2 + (r cos(t2))^2 = r^2
         * ((1 - t2)^3 x1 + 3 (1 - t2)^2 t2 x2 + 3 (1 - t2) t2^2 x3 + t2^3 x4 - a1)^2 + ((1 - t2)^3 y1 + 3 (1 - t2)^2 t2 y2 + 3 (1 - t2) t2^2 y3 + t2^3 y4 - b1)^2 = r^2 --- Expand and Simplify
         * a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2 +
         *   t2 (6 a1 x1 - 6 x1^2 - 6 a1 x2 + 6 x1 x2 + 6 b1 y1 - 6 y1^2 -
         *   6 b1 y2 + 6 y1 y2) +
         *   t2^2 (-6 a1 x1 + 15 x1^2 + 12 a1 x2 - 30 x1 x2 + 9 x2^2 - 6 a1 x3 +
         *   6 x1 x3 - 6 b1 y1 + 15 y1^2 + 12 b1 y2 - 30 y1 y2 + 9 y2^2 -
         *   6 b1 y3 + 6 y1 y3) +
         *   t2^3 (2 a1 x1 - 20 x1^2 - 6 a1 x2 + 60 x1 x2 - 36 x2^2 + 6 a1 x3 -
         *   24 x1 x3 + 18 x2 x3 - 2 a1 x4 + 2 x1 x4 + 2 b1 y1 - 20 y1^2 -
         *   6 b1 y2 + 60 y1 y2 - 36 y2^2 + 6 b1 y3 - 24 y1 y3 + 18 y2 y3 -
         *   2 b1 y4 + 2 y1 y4) +
         *   t2^4 (15 x1^2 - 60 x1 x2 + 54 x2^2 + 36 x1 x3 - 54 x2 x3 + 9 x3^2 -
         *   6 x1 x4 + 6 x2 x4 + 15 y1^2 - 60 y1 y2 + 54 y2^2 + 36 y1 y3 -
         *   54 y2 y3 + 9 y3^2 - 6 y1 y4 + 6 y2 y4) +
         *   t2^5 (-6 x1^2 + 30 x1 x2 - 36 x2^2 - 24 x1 x3 + 54 x2 x3 - 18 x3^2 +
         *   6 x1 x4 - 12 x2 x4 + 6 x3 x4 - 6 y1^2 + 30 y1 y2 - 36 y2^2 -
         *   24 y1 y3 + 54 y2 y3 - 18 y3^2 + 6 y1 y4 - 12 y2 y4 + 6 y3 y4) +
         *   t2^6 (x1^2 - 6 x1 x2 + 9 x2^2 + 6 x1 x3 - 18 x2 x3 + 9 x3^2 -
         *   2 x1 x4 + 6 x2 x4 - 6 x3 x4 + x4^2 + y1^2 - 6 y1 y2 + 9 y2^2 +
         *   6 y1 y3 - 18 y2 y3 + 9 y3^2 - 2 y1 y4 + 6 y2 y4 - 6 y3 y4 + y4^2) --- (9)
         *
         * Let:
         * q0 = a1^2 + b1^2 - r^2 - 2 a1 x1 + x1^2 - 2 b1 y1 + y1^2
         * q1 = 6 a1 x1 - 6 x1^2 - 6 a1 x2 + 6 x1 x2 + 6 b1 y1 - 6 y1^2 - 6 b1 y2 + 6 y1 y2
         * q2 = -6 a1 x1 + 15 x1^2 + 12 a1 x2 - 30 x1 x2 + 9 x2^2 - 6 a1 x3 + 6 x1 x3 - 6 b1 y1 + 15 y1^2 + 12 b1 y2 - 30 y1 y2 + 9 y2^2 - 6 b1 y3 + 6 y1 y3
         * q3 = 2 a1 x1 - 20 x1^2 - 6 a1 x2 + 60 x1 x2 - 36 x2^2 + 6 a1 x3 - 24 x1 x3 + 18 x2 x3 - 2 a1 x4 + 2 x1 x4 + 2 b1 y1 - 20 y1^2 - 6 b1 y2 + 60 y1 y2 - 36 y2^2 + 6 b1 y3 - 24 y1 y3 + 18 y2 y3 - 2 b1 y4 + 2 y1 y4
         * q4 = 15 x1^2 - 60 x1 x2 + 54 x2^2 + 36 x1 x3 - 54 x2 x3 + 9 x3^2 - 6 x1 x4 + 6 x2 x4 + 15 y1^2 - 60 y1 y2 + 54 y2^2 + 36 y1 y3 - 54 y2 y3 + 9 y3^2 - 6 y1 y4 + 6 y2 y4
         * q5 = -6 x1^2 + 30 x1 x2 - 36 x2^2 - 24 x1 x3 + 54 x2 x3 - 18 x3^2 + 6 x1 x4 - 12 x2 x4 + 6 x3 x4 - 6 y1^2 + 30 y1 y2 - 36 y2^2 - 24 y1 y3 + 54 y2 y3 - 18 y3^2 + 6 y1 y4 - 12 y2 y4 + 6 y3 y4
         * q6 = x1^2 - 6 x1 x2 + 9 x2^2 + 6 x1 x3 - 18 x2 x3 + 9 x3^2 - 2 x1 x4 + 6 x2 x4 - 6 x3 x4 + x4^2 + y1^2 - 6 y1 y2 + 9 y2^2 + 6 y1 y3 - 18 y2 y3 + 9 y3^2 - 2 y1 y4 + 6 y2 y4 - 6 y3 y4 + y4^2
         * Then:
         * (9) q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 + q5 t2^5 + q6 t2^6 = 0 --- (10)
         *
         */
        var q0 = a1 * a1 + b1 * b1 - r * r - 2 * a1 * x1 + x1 * x1 - 2 * b1 * y1 + y1 * y1,
            q1 = 6 * a1 * x1 - 6 * x1 * x1 - 6 * a1 * x2 + 6 * x1 * x2 + 6 * b1 * y1 - 6 * y1 * y1 - 6 * b1 * y2 + 6 * y1 * y2,
            q2 = -6 * a1 * x1 + 15 * x1 * x1 + 12 * a1 * x2 - 30 * x1 * x2 + 9 * x2 * x2 - 6 * a1 * x3 + 6 * x1 * x3 - 6 * b1 * y1 + 15 * y1 * y1 + 12 * b1 * y2 - 30 * y1 * y2 + 9 * y2 * y2 - 6 * b1 * y3 + 6 * y1 * y3,
            q3 = 2 * a1 * x1 - 20 * x1 * x1 - 6 * a1 * x2 + 60 * x1 * x2 - 36 * x2 * x2 + 6 * a1 * x3 - 24 * x1 * x3 + 18 * x2 * x3 - 2 * a1 * x4 + 2 * x1 * x4 + 2 * b1 * y1 - 20 * y1 * y1 - 6 * b1 * y2 + 60 * y1 * y2 - 36 * y2 * y2 + 6 * b1 * y3 - 24 * y1 * y3 + 18 * y2 * y3 - 2 * b1 * y4 + 2 * y1 * y4,
            q4 = 15 * x1 * x1 - 60 * x1 * x2 + 54 * x2 * x2 + 36 * x1 * x3 - 54 * x2 * x3 + 9 * x3 * x3 - 6 * x1 * x4 + 6 * x2 * x4 + 15 * y1 * y1 - 60 * y1 * y2 + 54 * y2 * y2 + 36 * y1 * y3 - 54 * y2 * y3 + 9 * y3 * y3 - 6 * y1 * y4 + 6 * y2 * y4,
            q5 = -6 * x1 * x1 + 30 * x1 * x2 - 36 * x2 * x2 - 24 * x1 * x3 + 54 * x2 * x3 - 18 * x3 * x3 + 6 * x1 * x4 - 12 * x2 * x4 + 6 * x3 * x4 - 6 * y1 * y1 + 30 * y1 * y2 - 36 * y2 * y2 - 24 * y1 * y3 + 54 * y2 * y3 - 18 * y3 * y3 + 6 * y1 * y4 - 12 * y2 * y4 + 6 * y3 * y4,
            q6 = x1 * x1 - 6 * x1 * x2 + 9 * x2 * x2 + 6 * x1 * x3 - 18 * x2 * x3 + 9 * x3 * x3 - 2 * x1 * x4 + 6 * x2 * x4 - 6 * x3 * x4 + x4 * x4 + y1 * y1 - 6 * y1 * y2 + 9 * y2 * y2 + 6 * y1 * y3 - 18 * y2 * y3 + 9 * y3 * y3 - 2 * y1 * y4 + 6 * y2 * y4 - 6 * y3 * y4 + y4 * y4;

        /**
         * Step 2: Solve 6th degree polynomial eq(10)
         */
        var roots = [];
        var length = this.polySolver([q0, q1, q2, q3, q4, q5, q6], roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t2 = roots[n];
            if (0 <= t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * (1 - t2) * x1 + 3 * (1 - t2) * (1 - t2) * t2 * x2 + 3 * (1 - t2) * t2 * t2 * x3 + t2 * t2 * t2 * x4; // x
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * (1 - t2) * y1 + 3 * (1 - t2) * (1 - t2) * t2 * y2 + 3 * (1 - t2) * t2 * t2 * y3 + t2 * t2 * t2 * y4; // y
            }
        }
        return noOfIntx;
    },

    /**
     * Intersect of a ellipse and a quadratic bezier curve
     * The number of intersection between a circle and a quadratic bezier curve is always <= 4
     *
     * Ellipse: (parametric function)
     * x = x1 + a1 cos(c1) cos(t1) - b1 sin(c1) sin(t1) --- (1)
     * y = y1 + a1 sin(c1) cos(t1) + b1 cos(c1) sin(t1) --- (2)
     *
     * Quadratic bezier curve 1: (parametric function)  (0 <= t2 <= 1)
     * x = (1 - t2)^2 x2 + 2 (1 - t2) t2 x3 + t2^2 x4 --- (3)
     * y = (1 - t2)^2 y2 + 2 (1 - t2) t2 y3 + t2^2 y4 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    ellipseBezier2: function (x1, y1, a1, b1, c1, x2, y2, x3, y3, x4, y4, result) { //test
        var cosc1 = Math.cos(c1);
        var sinc1 = Math.sin(c1);
        /**
         * Step 1: Normalize the ellipse
         * 1. shift the position of the ellipse 1 to the origin.
         *   transform matrix, T1 = {{1, 0, -x2}, {0, 1, -y2} ,{0, 0, 1}}
         *
         * 2. rotate the ellipse 1 so that its major axis is along x axis.
         *   transform matrix, T2 = {{cos(-c1), -sin(-c1), 0}, {sin(-c1), cos(-c1), 0}, {0, 0, 1}}
         *
         * 3. scale the ellipse 1 to make it become circle.
         *   transform matrix, T3 = {{b1, 0, 0}, {0, a1, 0}, {0, 0, 1}}
         *
         * 4. combine these transform matrices become:
         *   Tc = {{b1 Cos[c1], b1 Sin[c1], -b1 x1 Cos[c1] - b1 y1 Sin[c1]}, {-a1 Sin[c1], a1 Cos[c1], -a1 y1 Cos[c1] + a1 x1 Sin[c1]}, {0, 0, 1}}
         *
         * 5. Rewrite segment and ellipse in matrix form.
         *   S = {{x1, x2, x3}, {y1, y2, y3}, {1, 1}}
         *   E = {{x1 + a1 Cos[c1] Cos[t1] - b1 Sin[c1] Sin[t1]}, {y1 + a1 Sin[c1] Cos[t1] + b1 Cos[c1] Sin[t1]}, {1}}
         *
         * 6. Multiply Tc*E1 and Tc*E2 and rewrite them in parametric form.
         *   segment:
         *   x2' = b1 ((-x1 + x2) Cos[c1] + (-y1 + y2) Sin[c1])
         *   y2' = a1 ((-y1 + y2) Cos[c1] + (x1 - x2) Sin[c1])
         *   x3' = b1 ((-x1 + x3) Cos[c1] + (-y1 + y3) Sin[c1])
         *   y3' = a1 ((-y1 + y3) Cos[c1] + (x1 - x3) Sin[c1])
         *   x4' = b1 ((-x1 + x4) Cos[c1] + (-y1 + y4) Sin[c1])
         *   y4' = a1 ((-y1 + y4) Cos[c1] + (x1 - x4) Sin[c1])
         *
         *   ellipse:
         *   x' = a1 b1 cos(t2) --- (5)
         *   y' = a1 b1 sin(t2) --- (6)
         *
         *   Let:
         *   r = a1 b1
         *   Then:
         *   x' = (1 - t2)^2 x2' + 2 (1 - t2) t2 x3' + t2^2 x4' --- (7)
         *   y' = (1 - t2)^2 y2' + 2 (1 - t2) t2 y3' + t2^2 y4' --- (8)
         *   x' = r cos(t1) --- (9)
         *   y' = r sin(t1) --- (10)
         */
        var x2_ = b1 * ((-x1 + x2) * cosc1 + (-y1 + y2) * sinc1),
            y2_ = a1 * ((-y1 + y2) * cosc1 + (x1 - x2) * sinc1),
            x3_ = b1 * ((-x1 + x3) * cosc1 + (-y1 + y3) * sinc1),
            y3_ = a1 * ((-y1 + y3) * cosc1 + (x1 - x3) * sinc1),
            x4_ = b1 * ((-x1 + x4) * cosc1 + (-y1 + y4) * sinc1),
            y4_ = a1 * ((-y1 + y4) * cosc1 + (x1 - x4) * sinc1),
            r = a1 * b1;

        /**
         * Step  2: Substitution
         * Substitute (7), (8) ->  (r sin(t1))^2 + (r cos(t1))^2 = r^2
         * ((1 - t2)^2 x2 + 2 (1 - t2) t2 x3 + t2^2 x4)^2 + ((1 - t2)^2 y2 + 2 (1 - t2) t2 y3 + t2^2 y4)^2 = r^2 --- Expand and Simplify
         *
         * -r^2 + x2^2 + y2^2 + t2 (-4 x2^2 + 4 x2 x3 - 4 y2^2 + 4 y2 y3) +
         *   t2^2 (6 x2^2 - 12 x2 x3 + 4 x3^2 + 2 x2 x4 + 6 y2^2 - 12 y2 y3 +
         *   4 y3^2 + 2 y2 y4) +
         *   t2^3 (-4 x2^2 + 12 x2 x3 - 8 x3^2 - 4 x2 x4 + 4 x3 x4 - 4 y2^2 +
         *   12 y2 y3 - 8 y3^2 - 4 y2 y4 + 4 y3 y4) +
         *   t2^4 (x2^2 - 4 x2 x3 + 4 x3^2 + 2 x2 x4 - 4 x3 x4 + x4^2 + y2^2 -
         *   4 y2 y3 + 4 y3^2 + 2 y2 y4 - 4 y3 y4 + y4^2) --- (11)
         *
         * Let:
         * q0 = -r^2 + x2^2 + y2^2
         * q1 = -4 x2^2 + 4 x2 x3 - 4 y2^2 + 4 y2 y3
         * q2 = 6 x2^2 - 12 x2 x3 + 4 x3^2 + 2 x2 x4 + 6 y2^2 - 12 y2 y3 + 4 y3^2 + 2 y2 y4
         * q3 = -4 x2^2 + 12 x2 x3 - 8 x3^2 - 4 x2 x4 + 4 x3 x4 - 4 y2^2 + 12 y2 y3 - 8 y3^2 - 4 y2 y4 + 4 y3 y4
         * q4 = x2^2 - 4 x2 x3 + 4 x3^2 + 2 x2 x4 - 4 x3 x4 + x4^2 + y2^2 - 4 y2 y3 + 4 y3^2 + 2 y2 y4 - 4 y3 y4 + y4^2
         * Then:
         * (11): q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 = 0 --- (12)
         */
        var q0 = -r * r + x2_ * x2_ + y2_ * y2_,
            q1 = -4 * x2_ * x2_ + 4 * x2_ * x3_ - 4 * y2_ * y2_ + 4 * y2_ * y3_,
            q2 = 6 * x2_ * x2_ - 12 * x2_ * x3_ + 4 * x3_ * x3_ + 2 * x2_ * x4_ + 6 * y2_ * y2_ - 12 * y2_ * y3_ + 4 * y3_ * y3_ + 2 * y2_ * y4_,
            q3 = -4 * x2_ * x2_ + 12 * x2_ * x3_ - 8 * x3_ * x3_ - 4 * x2_ * x4_ + 4 * x3_ * x4_ - 4 * y2_ * y2_ + 12 * y2_ * y3_ - 8 * y3_ * y3_ - 4 * y2_ * y4_ + 4 * y3_ * y4_,
            q4 = x2_ * x2_ - 4 * x2_ * x3_ + 4 * x3_ * x3_ + 2 * x2_ * x4_ - 4 * x3_ * x4_ + x4_ * x4_ + y2_ * y2_ - 4 * y2_ * y3_ + 4 * y3_ * y3_ + 2 * y2_ * y4_ - 4 * y3_ * y4_ + y4_ * y4_;

        /**
         * Step 3: Solve the quartic Equation eq(12)
         */
        var roots = [];
        var l = this.quarticSolver(q0, q1, q2, q3, q4, roots);
        var noOfIntx = 0;
        for (var n = 0; n < l; ++n) {
            var t2 = roots[n];

            if (0 <= t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * x2 + 2 * (1 - t2) * t2 * x3 + t2 * t2 * x4;
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * y2 + 2 * (1 - t2) * t2 * y3 + t2 * t2 * y4;
            }
        }

        return noOfIntx;
    },

    /**
     * Intersect of a ellipse and a cubic bezier curve
     * The number of intersection between a ellipse and a cubic bezier curve is always <= 6
     *
     * Ellipse: (parametric function)
     * x = x1 + a1 cos(c1) cos(t1) - b1 sin(c1) sin(t1) --- (1)
     * y = y1 + a1 sin(c1) cos(t1) + b1 cos(c1) sin(t1) --- (2)
     *
     * Quadratic bezier curve 1: (parametric function)  (0 <= t2 <= 1)
     * x = (1 - t2)^3 x2 + 3 (1 - t2)^2 t2 x3 + 3 (1 - t2) t2^2 x4 + t2^3 x5 --- (3)
     * y = (1 - t2)^3 y2 + 3 (1 - t2)^2 t2 y3 + 3 (1 - t2) t2^2 y4 + t2^3 y5 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param a1 {number}
     * @param b1 {number}
     * @param c1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    ellipseBezier3: function (x1, y1, a1, b1, c1, x2, y2, x3, y3, x4, y4, x5, y5, result) {
        var sinc1 = Math.sin(c1);
        var cosc1 = Math.cos(c1);
        /**
         * Step 1: Normalize the ellipse
         * 1. shift the position of the ellipse 1 to the origin.
         *   transform matrix, T1 = {{1, 0, -x2}, {0, 1, -y2} ,{0, 0, 1}}
         *
         * 2. rotate the ellipse 1 so that its major axis is along x axis.
         *   transform matrix, T2 = {{cos(-c1), -sin(-c1), 0}, {sin(-c1), cos(-c1), 0}, {0, 0, 1}}
         *
         * 3. scale the ellipse 1 to make it become circle.
         *   transform matrix, T3 = {{b1, 0, 0}, {0, a1, 0}, {0, 0, 1}}
         *
         * 4. combine these transform matrices become:
         *   Tc = {{b1 Cos[c1], b1 Sin[c1], -b1 x1 Cos[c1] - b1 y1 Sin[c1]}, {-a1 Sin[c1], a1 Cos[c1], -a1 y1 Cos[c1] + a1 x1 Sin[c1]}, {0, 0, 1}}
         *
         * 5. Rewrite segment and ellipse in matrix form.
         *   S = {{x1, x2, x3, x4}, {y1, y2, y3, y4}, {1, 1}}
         *   E = {{x1 + a1 Cos[c1] Cos[t1] - b1 Sin[c1] Sin[t1]}, {y1 + a1 Sin[c1] Cos[t1] + b1 Cos[c1] Sin[t1]}, {1}}
         *
         * 6. Multiply Tc*E1 and Tc*E2 and rewrite them in parametric form.
         *   segment:
         *   x2' = b1 ((-x1 + x2) Cos[c1] + (-y1 + y2) Sin[c1])
         *   y2' = a1 ((-y1 + y2) Cos[c1] + (x1 - x2) Sin[c1])
         *   x3' = b1 ((-x1 + x3) Cos[c1] + (-y1 + y3) Sin[c1])
         *   y3' = a1 ((-y1 + y3) Cos[c1] + (x1 - x3) Sin[c1])
         *   x4' = b1 ((-x1 + x4) Cos[c1] + (-y1 + y4) Sin[c1])
         *   y4' = a1 ((-y1 + y4) Cos[c1] + (x1 - x4) Sin[c1])
         *   x5' = b1 ((-x1 + x5) Cos[c1] + (-y1 + y5) Sin[c1])
         *   y5' = a1 ((-y1 + y5) Cos[c1] + (x1 - x5) Sin[c1])
         *
         *   ellipse:
         *   x' = a1 b1 cos(t2) --- (5)
         *   y' = a1 b1 sin(t2) --- (6)
         *
         *   Let:
         *   r = a1 b1
         *   Then:
         *   x' = (1 - t2)^2 x2' + 2 (1 - t2) t2 x3' + t2^2 x4' --- (7)
         *   y' = (1 - t2)^2 y2' + 2 (1 - t2) t2 y3' + t2^2 y4' --- (8)
         *   x' = r cos(t1) --- (9)
         *   y' = r sin(t1) --- (10)
         */
        var x2_ = b1 * ((-x1 + x2) * cosc1 + (-y1 + y2) * sinc1),
            y2_ = a1 * ((-y1 + y2) * cosc1 + (x1 - x2) * sinc1),
            x3_ = b1 * ((-x1 + x3) * cosc1 + (-y1 + y3) * sinc1),
            y3_ = a1 * ((-y1 + y3) * cosc1 + (x1 - x3) * sinc1),
            x4_ = b1 * ((-x1 + x4) * cosc1 + (-y1 + y4) * sinc1),
            y4_ = a1 * ((-y1 + y4) * cosc1 + (x1 - x4) * sinc1),
            x5_ = b1 * ((-x1 + x5) * cosc1 + (-y1 + y5) * sinc1),
            y5_ = a1 * ((-y1 + y5) * cosc1 + (x1 - x5) * sinc1),
            r = a1 * b1;

        /**
         * Step  2: Substitution
         * Substitute (7), (8) ->  (r sin(t1))^2 + (r cos(t1))^2 = r^2
         * ((1 - t2)^3 x2 + 3 (1 - t2)^2 t2 x3 + 3 (1 - t2) t2^2 x4 + t2^3 x5)^2 + ((1 - t2)^3 y2 + 3 (1 - t2)^2 t2 y3 + 3 (1 - t2) t2^2 y4 + t2^3 y5)^2 = r^2 --- Expand and Simplify -> (11)
         *
         * -r^2 + x2^2 + y2^2 + t2 (-4 x2^2 + 4 x2 x3 - 4 y2^2 + 4 y2 y3) +
         *   t2^2 (6 x2^2 - 12 x2 x3 + 4 x3^2 + 2 x2 x4 + 6 y2^2 - 12 y2 y3 +
         *   4 y3^2 + 2 y2 y4) +
         *   t2^3 (-4 x2^2 + 12 x2 x3 - 8 x3^2 - 4 x2 x4 + 4 x3 x4 - 4 y2^2 +
         *   12 y2 y3 - 8 y3^2 - 4 y2 y4 + 4 y3 y4) +
         *   t2^4 (x2^2 - 4 x2 x3 + 4 x3^2 + 2 x2 x4 - 4 x3 x4 + x4^2 + y2^2 -
         *   4 y2 y3 + 4 y3^2 + 2 y2 y4 - 4 y3 y4 + y4^2) --- (11)
         *
         * Let:
         * q0 = -r^2 + x2^2 + y2^2
         * q1 = -6 x2^2 + 6 x2 x3 - 6 y2^2 + 6 y2 y3
         * q2 = 15 x2^2 - 30 x2 x3 + 9 x3^2 + 6 x2 x4 + 15 y2^2 - 30 y2 y3 + 9 y3^2 + 6 y2 y4
         * q3 = -20 x2^2 + 60 x2 x3 - 36 x3^2 - 24 x2 x4 + 18 x3 x4 + 2 x2 x5 - 20 y2^2 + 60 y2 y3 - 36 y3^2 - 24 y2 y4 + 18 y3 y4 + 2 y2 y5
         * q4 = 15 x2^2 - 60 x2 x3 + 54 x3^2 + 36 x2 x4 - 54 x3 x4 + 9 x4^2 - 6 x2 x5 + 6 x3 x5 + 15 y2^2 - 60 y2 y3 + 54 y3^2 + 36 y2 y4 - 54 y3 y4 + 9 y4^2 - 6 y2 y5 + 6 y3 y5
         * q5 = -6 x2^2 + 30 x2 x3 - 36 x3^2 - 24 x2 x4 + 54 x3 x4 - 18 x4^2 + 6 x2 x5 - 12 x3 x5 + 6 x4 x5 - 6 y2^2 + 30 y2 y3 - 36 y3^2 - 24 y2 y4 + 54 y3 y4 - 18 y4^2 + 6 y2 y5 - 12 y3 y5 + 6 y4 y5
         * q6 = x2^2 - 6 x2 x3 + 9 x3^2 + 6 x2 x4 - 18 x3 x4 + 9 x4^2 - 2 x2 x5 + 6 x3 x5 - 6 x4 x5 + x5^2 + y2^2 - 6 y2 y3 + 9 y3^2 + 6 y2 y4 - 18 y3 y4 + 9 y4^2 - 2 y2 y5 + 6 y3 y5 - 6 y4 y5 + y5^2
         * Then:
         * (11): q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 q5 t2^5 + q6 t2^6 = 0 --- (12)
         */
        var q0 = -r * r + x2_ * x2_ + y2_ * y2_,
            q1 = -6 * x2_ * x2_ + 6 * x2_ * x3_ - 6 * y2_ * y2_ + 6 * y2_ * y3_,
            q2 = 15 * x2_ * x2_ - 30 * x2_ * x3_ + 9 * x3_ * x3_ + 6 * x2_ * x4_ + 15 * y2_ * y2_ - 30 * y2_ * y3_ +
                9 * y3_ * y3_ + 6 * y2_ * y4_,
            q3 = -20 * x2_ * x2_ + 60 * x2_ * x3_ - 36 * x3_ * x3_ - 24 * x2_ * x4_ + 18 * x3_ * x4_ + 2 * x2_ * x5_
                - 20 * y2_ * y2_ + 60 * y2_ * y3_ - 36 * y3_ * y3_ - 24 * y2_ * y4_ + 18 * y3_ * y4_ + 2 * y2_ * y5_,
            q4 = 15 * x2_ * x2_ - 60 * x2_ * x3_ + 54 * x3_ * x3_ + 36 * x2_ * x4_ - 54 * x3_ * x4_ + 9 * x4_ * x4_
                - 6 * x2_ * x5_ + 6 * x3_ * x5_ + 15 * y2_ * y2_ - 60 * y2_ * y3_ + 54 * y3_ * y3_ + 36 * y2_ * y4_
                - 54 * y3_ * y4_ + 9 * y4_ * y4_ - 6 * y2_ * y5_ + 6 * y3_ * y5_,
            q5 = -6 * x2_ * x2_ + 30 * x2_ * x3_ - 36 * x3_ * x3_ - 24 * x2_ * x4_ + 54 * x3_ * x4_ - 18 * x4_ * x4_
                + 6 * x2_ * x5_ - 12 * x3_ * x5_ + 6 * x4_ * x5_ - 6 * y2_ * y2_ + 30 * y2_ * y3_ - 36 * y3_ * y3_
                - 24 * y2_ * y4_ + 54 * y3_ * y4_ - 18 * y4_ * y4_ + 6 * y2_ * y5_ - 12 * y3_ * y5_ + 6 * y4_ * y5_,
            q6 = x2_ * x2_ - 6 * x2_ * x3_ + 9 * x3_ * x3_ + 6 * x2_ * x4_ - 18 * x3_ * x4_ + 9 * x4_ * x4_
                - 2 * x2_ * x5_ + 6 * x3_ * x5_ - 6 * x4_ * x5_ + x5_ * x5_ + y2_ * y2_ - 6 * y2_ * y3_ + 9 * y3_ * y3_
                + 6 * y2_ * y4_ - 18 * y3_ * y4_ + 9 * y4_ * y4_ - 2 * y2_ * y5_ + 6 * y3_ * y5_ - 6 * y4_ * y5_
                + y5_ * y5_;

        /**
         * Step 3: Solve 6th degree polynomial eq(10)
         */
        var roots = [];
        var length = this.polySolver([q0, q1, q2, q3, q4, q5, q6], roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t2 = roots[n];
            if (0 <= t2 && t2 <= 1) {
                result[noOfIntx * 2] = (1 - t2) * (1 - t2) * (1 - t2) * x2 + 3 * (1 - t2) * (1 - t2) * t2 * x3 + 3 * (1 - t2) * t2 * t2 * x4 + t2 * t2 * t2 * x5; // x
                result[noOfIntx++ * 2 + 1] = (1 - t2) * (1 - t2) * (1 - t2) * y2 + 3 * (1 - t2) * (1 - t2) * t2 * y3 + 3 * (1 - t2) * t2 * t2 * y4 + t2 * t2 * t2 * y5; // y
            }
        }
        return noOfIntx;
    },

    /**
     * Intersect of a quadratic bezier curve and a cubic bezier curve
     * The number of intersection between a quadratic bezier curve and a cubic bezier curve is always <= 6
     *
     * Quadratic bezier curve: (parametric function) (0 <= t2 <= 1)
     * x = (1 - t1)^2 x1 + 2 (1 - t1) t1 x2 + t1^2 x3 --- (1)
     * y = (1 - t1)^2 y1 + 2 (1 - t1) t1 y2 + t1^2 y3 --- (2)
     *
     * Cubic bezier curve 1: (parametric function)  (0 <= t2 <= 1)
     * x = (1 - t2)^3 x4 + 3 (1 - t2)^2 t2 x5 + 3 (1 - t2) t2^2 x6 + t2^3 x7 --- (3)
     * y = (1 - t2)^3 y4 + 3 (1 - t2)^2 t2 y5 + 3 (1 - t2) t2^2 y6 + t2^3 y7 --- (4)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param x5 {number}
     * @param y5 {number}
     * @param x6 {number}
     * @param y6 {number}
     * @param x7 {number}
     * @param y7 {number}
     * @param result {Array}
     * @return {number} number of intersections
     */
    bezier2Bezier3: function (x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6, x7, y7, result) {
        /**
         * Step 1: Equate x and y
         * (1 - t1)^2 x1 + 2 (1 - t1) t1 x2 + t1^2 x3 = (1 - t2)^3 x4 + 3 (1 - t2)^2 t2 x5 + 3 (1 - t2) t2^2 x6 + t2^3 x7 --- Expand and Simplify
         * t1^2 (x1 - 2 x2 + x3) + t1 (-2 x1 + 2 x2) + t2^3 (x4 - 3 x5 + 3 x6 - x7) + t2^2 (-3 x4 + 6 x5 - 3 x6) + t2 (3 x4 - 3 x5) + x1 - x4 = 0 ---(5)
         *
         * (1 - t1)^2 y1 + 2 (1 - t1) t1 y2 + t1^2 y3 = (1 - t2)^3 y4 + 3 (1 - t2)^2 t2 y5 + 3 (1 - t2) t2^2 y6 + t2^3 y7 --- Eypand and Simplify
         * t1^2 (y1 - 2 y2 + y3) + t1 (-2 y1 + 2 y2) + t2^3 (y4 - 3 y5 + 3 y6 - y7) + t2^2 (-3 y4 + 6 y5 - 3 y6) + t2 (3 y4 - 3 y5) + y1 - y4 = 0 ---(6)
         *
         * let:
         * a = x1 - 2 x2 + x3
         * b = -2 x1 + 2 x2
         * c = x4 - 3 x5 + 3 x6 - x7
         * d = -3 x4 + 6 x5 - 3 x6
         * e = 3 x4 - 3 x5
         * f = x1 - x4
         * g = y1 - 2 y2 + y3
         * h = -2 y1 + 2 y2
         * i = y4 - 3 y5 + 3 y6 - y7
         * j = -3 y4 + 6 y5 - 3 y6
         * k = 3 y4 - 3 y5
         * l = y1 - y4
         * Then:
         * (5): a t1^2 + b t1 + c t2^3 + d t2^2 + e t2 + f = 0 --- (7)
         * (6): g t1^2 + h t1 + i t2^3 + j t2^2 + k t2 + l = 0 --- (8)
         *
         *
         * From (7) solve quadratic equation t1:
         * t1 = (9)
         * t1 = (10)
         *
         * Substitute
         * (9) -> (8) : (11) and
         * (10) -> (8) : (12)
         * Then:
         * (11) * (12) -> (13) --- 6th degree polynomial equation
         *
         * Let:
         * q0 = f^2 g^2 - b f g h + a f h^2 + b^2 g l - 2 a f g l - a b h l + a^2 l^2
         * q1 = 2 e f g^2 - b e g h + a e h^2 + b^2 g k - 2 a f g k - a b h k - 2 a e g l + 2 a^2 k l
         * q2 = e^2 g^2 + 2 d f g^2 - b d g h + a d h^2 + b^2 g j - 2 a f g j - a b h j - 2 a e g k + a^2 k^2 - 2 a d g l + 2 a^2 j l
         * q3 = 2 d e g^2 + 2 c f g^2 - b c g h + a c h^2 + b^2 g i - 2 a f g i - a b h i - 2 a e g j - 2 a d g k + 2 a^2 j k - 2 a c g l + 2 a^2 i l
         * q4 = d^2 g^2 + 2 c e g^2 - 2 a e g i - 2 a d g j + a^2 j^2 - 2 a c g k + 2 a^2 i k
         * q5 = 2 c d g^2 - 2 a d g i - 2 a c g j + 2 a^2 i j
         * q6 = c^2 g^2 - 2 a c g i + a^2 i^2
         * Then:
         * (13): q0 + q1 t2 + q2 t2^2 + q3 t2^3 + q4 t2^4 + q5 t2^5 + q6 t2^6 = 0 --- (14)
         */
        var a = x1 - 2 * x2 + x3,
            b = -2 * x1 + 2 * x2,
            c = x4 - 3 * x5 + 3 * x6 - x7,
            d = -3 * x4 + 6 * x5 - 3 * x6,
            e = 3 * x4 - 3 * x5,
            f = x1 - x4,
            g = y1 - 2 * y2 + y3,
            h = -2 * y1 + 2 * y2,
            i = y4 - 3 * y5 + 3 * y6 - y7,
            j = -3 * y4 + 6 * y5 - 3 * y6,
            k = 3 * y4 - 3 * y5,
            l = y1 - y4;
        var q0 = f * f * g * g - b * f * g * h + a * f * h * h + b * b * g * l - 2 * a * f * g * l - a * b * h * l
                + a * a * l * l,
            q1 = 2 * e * f * g * g - b * e * g * h + a * e * h * h + b * b * g * k - 2 * a * f * g * k - a * b * h * k
                - 2 * a * e * g * l + 2 * a * a * k * l,
            q2 = e * e * g * g + 2 * d * f * g * g - b * d * g * h + a * d * h * h + b * b * g * j - 2 * a * f * g * j
                - a * b * h * j - 2 * a * e * g * k + a * a * k * k - 2 * a * d * g * l + 2 * a * a * j * l,
            q3 = 2 * d * e * g * g + 2 * c * f * g * g - b * c * g * h + a * c * h * h + b * b * g * i
                - 2 * a * f * g * i - a * b * h * i - 2 * a * e * g * j - 2 * a * d * g * k + 2 * a * a * j * k
                - 2 * a * c * g * l + 2 * a * a * i * l,
            q4 = d * d * g * g + 2 * c * e * g * g - 2 * a * e * g * i - 2 * a * d * g * j + a * a * j * j
                - 2 * a * c * g * k + 2 * a * a * i * k,
            q5 = 2 * c * d * g * g - 2 * a * d * g * i - 2 * a * c * g * j + 2 * a * a * i * j,
            q6 = c * c * g * g - 2 * a * c * g * i + a * a * i * i;

        /**
         * Step 2: Solve 6th degree polynomial eq(10)
         */
        var roots = [];
        var length = this.polySolver([q0, q1, q2, q3, q4, q5, q6], roots);
        var noOfIntx = 0;
        for (var n = 0; n < length; ++n) {
            var t2 = roots[n];
            var t1 = (f * g - a * l + e * g * t2 - a * k * t2 + d * g * t2 * t2 - a * j * t2 * t2 + c * g * t2 * t2 * t2 - a * i * t2 * t2 * t2) / (-b * g + a * h);
            if (0 <= t2 && t2 <= 1 && 0 <= t1 && t1 <= 1) {
                result[noOfIntx * 2] = (1 - t1) * (1 - t1) * x1 + 2 * (1 - t1) * t1 * x2 + t1 * t1 * x3; // x
                result[noOfIntx++ * 2 + 1] = (1 - t1) * (1 - t1) * y1 + 2 * (1 - t1) * t1 * y2 + t1 * t1 * y3; // y
            }
        }
        return noOfIntx;
    },

    /**
     * Intersection of cubic bezier curve with itself
     * The number of selft intersection of a cubic bezier curve is always <= 1
     *
     * Cubic bezier curve:
     * x = (1 - t)^3 x1 + 3 (1 - t)^2 t x2 + 3 (1 - t) t^2 x3 + t^3 x4 --- (1)
     * y = (1 - t)^3 y1 + 3 (1 - t)^2 t y2 + 3 (1 - t) t^2 y3 + t^3 y4 --- (2)
     *
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
     * @param x3 {number}
     * @param y3 {number}
     * @param x4 {number}
     * @param y4 {number}
     * @param result {Array}
     * @return {number} Number of intersection
     */
    bezier3Self: function (x1, y1, x2, y2, x3, y3, x4, y4, result) {
        /**
         * Step 1: equate x and y but t1 != t2
         * So:
         * t1 = a + b
         * t2 = a - b
         *
         * Equate x:
         * (1 - (a + b))^3 x1 + 3 (1 - (a + b))^2 (a + b) x2 + 3 (1 - (a + b)) (a + b)^2 x3 + (a + b)^3 x4 =
         *   (1 - (a - b))^3 x1 + 3 (1 - (a - b))^2 (a - b) x2 + 3 (1 - (a - b)) (a - b)^2 x3 + (a - b)^3 x4
         * -6 x1 + 6 x2 + 12 a (x1 - 2 x2 + x3) - 6 a^2 (x1 - 3 x2 + 3 x3 - x4) - 2 b^2 (x1 - 3 x2 + 3 x3 - x4) = 0 --- get b^2
         * b^2 = (3 (-x1 + 2 a x1 - a^2 x1 + x2 - 4 a x2 + 3 a^2 x2 + 2 a x3 - 3 a^2 x3 + a^2 x4))/(x1 - 3 x2 + 3 x3 - x4) --- (3)
         *
         * Equate y:
         * (1 - (a + b))^3 y1 + 3 (1 - (a + b))^2 (a + b) y2 + 3 (1 - (a + b)) (a + b)^2 y3 + (a + b)^3 y4 =
         *   (1 - (a - b))^3 y1 + 3 (1 - (a - b))^2 (a - b) y2 + 3 (1 - (a - b)) (a - b)^2 y3 + (a - b)^3 y4
         * -6 y1 + 6 y2 + 12 a (y1 - 2 y2 + y3) - 6 a^2 (y1 - 3 y2 + 3 y3 - y4) - 2 b^2 (y1 - 3 y2 + 3 y3 - y4) = 0 --- (4)
         *
         * Substitute (3) -> (4) Then Simplify become:
         * a = (-x4 y1 + 3 x3 (y1 - y2) + 2 x1 y2 + x4 y2 - 3 x1 y3 + x1 y4 - x2 (2 y1 - 3 y3 + y4))/(2 (-x4 y1 + x1 y2 + 2 x4 y2 - 2 x1 y3 -
         *   x4 y3 + x1 y4 + x3 (2 y1 - 3 y2 + y4) - x2 (y1 - 3 y3 + 2 y4))) --- (5)
         *
         * Substitute (5) -> (3) and solve for b.
         */

        var a = (-x4 * y1 + 3 * x3 * (y1 - y2) + 2 * x1 * y2 + x4 * y2 - 3 * x1 * y3 + x1 * y4 - x2 * (2 * y1 - 3 * y3 + y4)) / (2 * (-x4 * y1 + x1 * y2 + 2 * x4 * y2 - 2 * x1 * y3 - x4 * y3 + x1 * y4 + x3 * (2 * y1 - 3 * y2 + y4) - x2 * (y1 - 3 * y3 + 2 * y4)));
        var b = Math.sqrt((3 * (-x1 + 2 * a * x1 - a * a * x1 + x2 - 4 * a * x2 + 3 * a * a * x2 + 2 * a * x3 - 3 * a * a * x3 + a * a * x4)) / (x1 - 3 * x2 + 3 * x3 - x4));

        var t1 = a + b;
        var t2 = a - b;

        if (0 <= t1 && t1 <= 1) {
            result[0] = (1 - t1) * (1 - t1) * (1 - t1) * x1 + 3 * (1 - t1) * (1 - t1) * t1 * x2 + 3 * (1 - t1) * t1 * t1 * x3 + t1 * t1 * t1 * x4;
            result[1] = (1 - t1) * (1 - t1) * (1 - t1) * y1 + 3 * (1 - t1) * (1 - t1) * t1 * y2 + 3 * (1 - t1) * t1 * t1 * y3 + t1 * t1 * t1 * y4;
            return 1
        }
        else if (0 <= t2 && t2 <= 1) {
            result[0] = (1 - t2) * (1 - t2) * (1 - t2) * x1 + 3 * (1 - t2) * (1 - t2) * t2 * x2 + 3 * (1 - t2) * t2 * t2 * x3 + t2 * t2 * t2 * x4;
            result[1] = (1 - t2) * (1 - t2) * (1 - t2) * y1 + 3 * (1 - t2) * (1 - t2) * t2 * y2 + 3 * (1 - t2) * t2 * t2 * y3 + t2 * t2 * t2 * y4;
            return 1
        }
        return 0;
    },

    /**
     * Cubic Solver
     * a0 + a1 x + a2 x^2 + a3 x^3 + a4 x^4 = 0
     *
     * More Information see: http://mathworld.wolfram.com/CubicFormula.html
     * @param a0 {number} constant
     * @param a1 {number} coefficient of x
     * @param a2 {number} coefficient of x^2
     * @param a3 {number} coefficient of x^3
     * @param result {Array} use to store the roots
     * return {number} number of roots
     */
    cubicSolver: function (a0, a1, a2, a3, result) {

        a2 /= a3;
        a1 /= a3;
        a0 /= a3;

        var Q = (3 * a1 - a2 * a2) / 9;
        var R = (9 * a2 * a1 - 27 * a0 - 2 * a2 * a2 * a2) / 54;

        var D = Q * Q * Q + R * R;


        if (D > 0) {
            /**
             * 1 real root and 2 are complex root
             * Ignore 2 complex root
             */
            var sqrtD = Math.sqrt(D);
            var S = this.cbrt(R + sqrtD);
            var T = this.cbrt(R - sqrtD);

            result[0] = (-a2 / 3) + S + T;
            return 1;
        } // else

        /**
         * 3 real root
         */
        var theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
        result[0] = 2 * Math.sqrt(-Q) * Math.cos(theta / 3) - a2 / 3;
        result[1] = 2 * Math.sqrt(-Q) * Math.cos((theta + 2 * Math.PI) / 3) - a2 / 3;
        result[2] = 2 * Math.sqrt(-Q) * Math.cos((theta + 4 * Math.PI) / 3) - a2 / 3;
        return 3;
    },

    /**
     * Cubic Solver (Only Solve for one root)
     * a0 + a1 x + a2 x^2 + a3 x^3 + a4 x^4 = 0
     *
     * More Information see: http://mathworld.wolfram.com/CubicFormula.html
     * @param a0 {number} constant
     * @param a1 {number} coefficient of x
     * @param a2 {number} coefficient of x^2
     * @param a3 {number} coefficient of x^3
     * return {number}
     */
    cubicSolver1Root: function (a0, a1, a2, a3) {
        a2 /= a3;
        a1 /= a3;
        a0 /= a3;

        var Q = (3 * a1 - a2 * a2) / 9;
        var R = (9 * a2 * a1 - 27 * a0 - 2 * a2 * a2 * a2) / 54;

        var D = Q * Q * Q + R * R;


        if (D >= 0) {
            /**
             * 1 real root and 2 are complex root
             * Ignore 2 complex root
             */
            var sqrtD = Math.sqrt(D);
            var S = this.cbrt(R + sqrtD);
            var T = this.cbrt(R - sqrtD);

            return (-a2 / 3) + S + T;
        } // else

        /**
         * 3 real root
         * We get 1 only
         */
        var theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
        return 2 * Math.sqrt(-Q) * Math.cos(theta / 3) - a2 / 3;
    },

    /**
     * Quartic Solver.
     * a0 + a1 x + a2 x^2 + a3 x^3 + a4 x^4 = 0
     *
     * More Information see: http://mathworld.wolfram.com/QuarticEquation.html
     * @param a0 {number} constant
     * @param a1 {number} coefficient of x
     * @param a2 {number} coefficient of x^2
     * @param a3 {number} coefficient of x^3
     * @param a4 {number} coefficient of x^4
     * @param result {Array} [root 1, root 2, root 3, root 4]
     * @returns {number} number of roots
     */
    quarticSolver: function (a0, a1, a2, a3, a4, result) {
        a3 /= a4;
        a2 /= a4;
        a1 /= a4;
        a0 /= a4;

        var length = 0;
        var y1 = this.cubicSolver1Root(4 * a2 * a0 - a1 * a1 - a3 * a3 * a0, a1 * a3 - 4 * a0, -a2, 1);

        var RSquare = a3 * a3 / 4 - a2 + y1;
        var DSquare;
        var ESquare;

        var R = Math.sqrt(RSquare);

        var frontPart;
        var backPart;
        if (RSquare == 0) {
            frontPart = a3 * a3 * 3 / 4 - 2 * a2;
            backPart = 2 * Math.sqrt(y1 * y1 - 4 * a0);

            DSquare = frontPart + backPart;
            ESquare = frontPart - backPart;
        } else {
            frontPart = a3 * a3 * 3 / 4 - RSquare - 2 * a2;
            backPart = (4 * a3 * a2 - 8 * a1 - a3 * a3 * a3) / 4 / R;

            DSquare = frontPart + backPart;
            ESquare = frontPart - backPart;
        }

        frontPart = -a3 / 4 + R / 2;
        if (DSquare >= 0) {
            var D = Math.sqrt(DSquare);
            backPart = D / 2;
            result[length++] = (frontPart + backPart);
            result[length++] = (frontPart - backPart);
        }

        frontPart = -a3 / 4 - R / 2;
        if (ESquare >= 0) {
            var E = Math.sqrt(ESquare);
            backPart = E / 2;
            result[length++] = (frontPart + backPart);
            result[length++] = (frontPart - backPart);
        }

        return length;
    },

    /**
     * Polynomial solver use to solve high degree polynomial equation by using numerical method.
     * Bairstow method is use by this function to improve the speed of execution.
     * Although Bairstow method can find real and imaginary roots, this function only find the real roots.
     * The number of real roots of the polynomial is always <= degree of the polynomial
     * More information see: https://en.wikipedia.org/wiki/Bairstow%27s_method
     *
     * a0 + a1 x + a2 x^2 + a3 x^3 + ... = 0
     *
     * @param poly {Array} the coefficient of the polynomial in ascending order. Exp: [a0, a1, a2, ...]
     * @param result {Array} the roots of polynomial. [root1, root2, root3, ...]
     * @param [alpha0] {number}
     * @param [alpha1] {number}
     * @param [epsilon] {number}
     * return {number} no of roots
     */
    polySolver: function (poly, result, alpha0, alpha1, epsilon) {
        var noOfRoots = 0;
        alpha0 = alpha0 || -1;
        alpha1 = alpha1 || 0.25;
        epsilon = epsilon || 1e-7;

        var c = poly.slice();
        var d = [];
        var delta = [];
        var incAlpha0 = 1;
        var incAlpha1 = 1;
        var D;
        var sqrtD;

        for (var n = poly.length - 1; n > 2; n -= 2) {
            while (Math.abs(incAlpha0) > epsilon && Math.abs(incAlpha1) > epsilon) {
                d[n] = c[n];
                d[n - 1] = c[n - 1] + alpha1 * d[n];
                d[n - 2] = c[n - 2] + alpha1 * d[n - 1] + alpha0 * d[n];

                delta[n - 1] = d[n];
                delta[n - 2] = d[n - 1] + alpha1 * delta[n - 1];

                for (var j = n - 3; j >= 0; --j) {
                    d[j] = c[j] + alpha1 * d[j + 1] + alpha0 * d[j + 2];
                    delta[j] = d[j + 1] + alpha1 * delta[j + 1] + alpha0 * delta[j + 2];
                }

                incAlpha0 = (delta[1] * -d[0] - delta[0] * -d[1]) / (delta[1] * delta[1] - delta[0] * delta[2]);
                incAlpha1 = (delta[1] * -d[1] - -d[0] * delta[2]) / (delta[1] * delta[1] - delta[0] * delta[2]);

                alpha0 += incAlpha0;
                alpha1 += incAlpha1;
            }
            incAlpha0 = 1;
            incAlpha1 = 1;

            D = alpha1 * alpha1 + 4 * alpha0;

            if (D > 0) {
                sqrtD = Math.sqrt(D);
                result[noOfRoots++] = (0.5 * (alpha1 - sqrtD));
                result[noOfRoots++] = (0.5 * (alpha1 + sqrtD));
            } else if (Math.abs(D) < epsilon) {
                result[noOfRoots++] = (0.5 * (alpha1));
            }

            c = d.slice(2, c.length);
        }

        if (n === 1) {
            result[noOfRoots++] = (-c[0] / c[1]);
        }
        else if (n === 2) {
            D = c[1] * c[1] - 4 * c[2] * c[0];
            if (D > 0) {
                sqrtD = Math.sqrt(D);
                result[noOfRoots++] = (-c[1] - sqrtD) / (2 * c[2]);
                result[noOfRoots++] = (-c[1] + sqrtD) / (2 * c[2]);
            } else if (Math.abs(D) < epsilon) {
                result[noOfRoots++] = -c[1] / (2 * c[2]);
            }
        }

        return noOfRoots;
    },

    /**
     * Solve cubic root
     * @param a {number}
     * @return {number}
     */
    cbrt: Math.cbrt || function (a) {
        var x1 = 0;
        var x2 = 1;
        while (Math.abs((x1 - x2) / x2) > 1e-17) {
            x1 = x2;
            x2 = x2 - (x2 * x2 * x2 - a) / (3 * x2 * x2);
        }
        return x2
    }
};