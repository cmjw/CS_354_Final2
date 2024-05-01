/**
 * Plane
 */


/**
 * Constructor
 */
CSGBuilder.Plane = function(normal, w) {
    // using homogenous coordinates
    this.normal = normal;
    this.w = w;
};

/**
 * Construct a plane using 3 points on the plane.
 * 
 */
CSGBuilder.Plane.fromThreePoints = function(a, b, c) {
    // calculate normal from points
    var n = b.minus(a).cross(c.minus(a)).normalize();

    return new CSGBuilder.Plane(n, n.dot(a));
};


/**
 * Class variables
*/

// split tolerance
CSGBuilder.Plane.EPSILON = 1e-10;


/**
 * Plane functions
 */
CSGBuilder.Plane.prototype = {
    // clone the plane
    clone: function() {
      return new CSGBuilder.Plane(this.normal.clone(), this.w);
    },
  
    // flip the plane by the normal
    flip: function() {
      this.normal = this.normal.negated();
      this.w = -this.w;
    },
  
    /**
     * "Split" a polygon by this plane, i.e. place into the correct list, either front or back of
     * the plane based on position/orientation.
     * 
     * Polygons are split into either the front or back list depending on their
     * position.
     * 
     * Handles coplanar polygons based on orientation, put in coplanarFront or -Back.
     * 
     * Handles spanning polygons that do not lie in the front or back.
     */
    splitPolygon: function(polygon, coplanarFront, coplanarBack, front, back) {
      const COPLANAR = 0;
      const FRONT = 1;
      const BACK = 2;
      const SPANNING = 3;
  
      var thisType = 0;
      var types = [];

      for (var i = 0; i < polygon.vertices.length; i++) {
        var t = this.normal.dot(polygon.vertices[i].pos) - this.w;

        if (t < -CSGBuilder.Plane.EPSILON) {
            type = BACK;
        } else if (t > CSGBuilder.Plane.EPSILON) {
            type = FRONT;
        } else {
            // special case
            type = COPLANAR;
        }

        thisType |= type;
        types.push(type);
      }
  
      // Put the polygon in the corresponding list
      switch (thisType) {

        case COPLANAR:
          if (this.normal.dot(polygon.plane.normal) > 0) {
            coplanarFront.push(polygon);
          } else {
            coplanarBack.push(polygon);
          }
          break;

        case FRONT:
          front.push(polygon);
          break;

        case BACK:
          back.push(polygon);
          break;
        
        // below code attributed to CSG simple
        case SPANNING:
          var f = [], b = [];
          for (var i = 0; i < polygon.vertices.length; i++) {
            var j = (i + 1) % polygon.vertices.length;
            var ti = types[i], tj = types[j];
            var vi = polygon.vertices[i], vj = polygon.vertices[j];
            if (ti != BACK) f.push(vi);
            if (ti != FRONT) b.push(ti != BACK ? vi.clone() : vi);
            if ((ti | tj) == SPANNING) {
              var t = (this.w - this.normal.dot(vi.pos)) / this.normal.dot(vj.pos.minus(vi.pos));
              var v = vi.interpolate(vj, t);
              f.push(v);
              b.push(v.clone());
            }
          }
          if (f.length >= 3) front.push(new CSGBuilder.Polygon(f, polygon.shared));
          if (b.length >= 3) back.push(new CSGBuilder.Polygon(b, polygon.shared));
          break;
      }
    }
};