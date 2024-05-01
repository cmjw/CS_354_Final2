/**
 * Vertex
 */

/**
 * Constructor
 */
CSGBuilder.Vertex = function(pos, normal) {
    this.pos = new CSGBuilder.Vector(pos);
    this.normal = new CSGBuilder.Vector(normal);
};
  
/** 
 * Vertex functions
 */
CSGBuilder.Vertex.prototype = {
    // clone
    clone: function() {
      return new CSGBuilder.Vertex(this.pos.clone(), this.normal.clone());
    },
  
    // flip the vertex
    flip: function() {
      this.normal = this.normal.negated();
    },
  
    // interpolate - new vertec b/t this and v
    interpolate: function(v, t) {
      return new CSGBuilder.Vertex(
        this.pos.lerp(v.pos, t),
        this.normal.lerp(v.normal, t)
      );
    }
};