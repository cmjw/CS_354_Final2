/**
 * Polygon
 */

/**
 * Constructor
 * 
 * "shared" propoerties are shared among all derivative polygons.
 * This mostly only affects colour.
 */
CSGBuilder.Polygon = function(vertices, shared) {
    this.vertices = vertices;
    this.shared = shared;
    this.plane = CSGBuilder.Plane.fromThreePoints(vertices[0].pos, vertices[1].pos, vertices[2].pos);
};
  
/**
 * Polygon functions
 */
CSGBuilder.Polygon.prototype = {
    // clone
    clone: function() {
        var vertices = this.vertices.map(function(v) { return v.clone(); });
        return new CSGBuilder.Polygon(vertices, this.shared);
    },
  
    // reverse the polygon
    flip: function() {
        // reverse each vertex
        this.vertices.reverse().map(function(v) { v.flip(); });
        this.plane.flip();
    }
};