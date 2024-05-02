/**
 * CSG Builder
 */

/**
 * Construct empty
 */
CSGBuilder = function() {
    this.polygons = [];  
};

/** 
 * Construct from polygons
 */
CSGBuilder.fromPolygons = function(polygons) {
    var csg = new CSGBuilder();
    csg.polygons = polygons;
    return csg;
};
  
/** 
 * CSG Builder functions
 */
CSGBuilder.prototype = {
    // clone
    clone: function() {
      var csg = new CSGBuilder();
      csg.polygons = this.polygons.map(function(p) { return p.clone(); });
      return csg;
    },
   
    // return list of polygons
    toPolygons: function() {
      return this.polygons;
    },

    // return the csg object "clipped" by csg
    // i.e. remove polygons in csg from this object
    clippedBy: function(csg) {
        var a = new CSGBuilder.Node(this.clone().polygons);
        var b = new CSGBuilder.Node(csg.clone().polygons);
        a.clipTo(b);
        return CSGBuilder.fromPolygons(a.allPolygons());
    },

    // reverse solid and empty
    inverse: function() {
        var csg = this.clone();
        csg.polygons.map(function(p) { p.flip(); });
        return csg;
    },
  
    // return the union of this object and csg
    union: function(csg) {
      var a = new CSGBuilder.Node(this.clone().polygons);
      var b = new CSGBuilder.Node(csg.clone().polygons);

      a.clipTo(b);
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();
      a.build(b.allPolygons());
      
      return CSGBuilder.fromPolygons(a.allPolygons());
    },
  
    // return csg subtracted from this object
    subtract: function(csg) {
      var a = new CSGBuilder.Node(this.clone().polygons);
      var b = new CSGBuilder.Node(csg.clone().polygons);

      a.invert();
      a.clipTo(b);
      b.clipTo(a);
      b.invert();
      b.clipTo(a);
      b.invert();
      a.build(b.allPolygons());
      a.invert();

      return CSGBuilder.fromPolygons(a.allPolygons());
    },
  
    // return the intersection of this object and csg
    intersect: function(csg) {
      var a = new CSGBuilder.Node(this.clone().polygons);
      var b = new CSGBuilder.Node(csg.clone().polygons);

      a.invert();
      b.clipTo(a);
      b.invert();
      a.clipTo(b);
      b.clipTo(a);
      a.build(b.allPolygons());
      a.invert();

      return CSGBuilder.fromPolygons(a.allPolygons());
    },
};
