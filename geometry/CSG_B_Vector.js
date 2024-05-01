/**
 * Model a 3D vector
 */

/**
 * Constructor
 */
CSGBuilder.Vector = function(x, y, z) {
    if (arguments.length == 3) {
      this.x = x;
      this.y = y;
      this.z = z;
    } else if ('x' in x) { // x as vector
      this.x = x.x;
      this.y = x.y;
      this.z = x.z;
    } else {
      this.x = x[0];
      this.y = x[1];
      this.z = x[2];
    }
};
  

/**
 * 3D vector functions
 */
CSGBuilder.Vector.prototype = {
    plus: function(a) {
        return new CSGBuilder.Vector(this.x + a.x, this.y + a.y, this.z + a.z);
    },
  
    minus: function(a) {
        return new CSGBuilder.Vector(this.x - a.x, this.y - a.y, this.z - a.z);
    },
      
    dot: function(a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    },

    cross: function(a) {
        return new CSGBuilder.Vector(
          this.y * a.z - this.z * a.y,
          this.z * a.x - this.x * a.z,
          this.x * a.y - this.y * a.x
        );
    },

    length: function() {
        return Math.sqrt(this.dot(this));
    },

    clone: function() {
      return new CSGBuilder.Vector(this.x, this.y, this.z);
    },
  
    negated: function() {
      return new CSGBuilder.Vector(-this.x, -this.y, -this.z);
    },
  
    times: function(a) {
      return new CSGBuilder.Vector(this.x * a, this.y * a, this.z * a);
    },
  
    dividedBy: function(a) {
      return new CSGBuilder.Vector(this.x / a, this.y / a, this.z / a);
    },
  
    // linear interpolation
    lerp: function(a, t) {
      return this.plus(a.minus(this).times(t));
    },

    // spherical linear interpolation
    slerp: function(a, t) {

    },   

    normalize: function() {
      return this.dividedBy(this.length());
    }
};