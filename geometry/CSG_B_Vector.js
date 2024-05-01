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
  
    divideBy: function(a) {
      return new CSGBuilder.Vector(this.x / a, this.y / a, this.z / a);
    },
  
    // linear interpolation
    lerp: function(a, t) {
      return this.plus(a.minus(this).times(t));
    },

    // spherical linear interpolation
    slerp: function(a, t) {
        this.normalize();
        a.normalize();

        const theta = Math.acos(Math.max(Math.min(this.dot(a), 1), -1));

        const sinVal = Math.sin((1-t) * theta) / Math.sin(theta);
        const cosVal = Math.sin(t*theta) / Math.sin(theta);

        const x = this.x*sinVal + a.x*cosVal;
        const y = this.y*sinVal + a.y*cosVal;
        const z = this.z*sinVal + a.z*cosVal;

        return new CSGBuilder.Vector(x,y,z);
    },   

    normalize: function() {
      return this.divideBy(this.length());
    }
};