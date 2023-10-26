'use strict';

// Imports
const Vector = require('../physics/Vector');

// Ball class constructor
const Ball = function (position, radius, colour, number) {

    // Properties
    this.position = position;
    this.velocity = new Vector();
    this.acceleration = new Vector();
    this.radius = radius;
    this.colour = colour;
    this.number = number;
};

// Export Ball class
module.exports = Ball;