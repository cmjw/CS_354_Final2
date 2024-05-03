/**
 * Node
 */

/**
 * Constructor
 */
CSGBuilder.Node = function(polygons) {
    this.plane = null;
    this.front = null;
    this.back = null;
    this.polygons = [];

    // build tree
    if (polygons) this.build(polygons);
};

/**
 * Polygon functions
 */
CSGBuilder.Node.prototype = {
    // clone
    clone: function() {
      var node = new CSGBuilder.Node();
      node.plane = this.plane && this.plane.clone();
      node.front = this.front && this.front.clone();
      node.back = this.back && this.back.clone();
      node.polygons = this.polygons.map(function(p) { return p.clone(); });
      
      return node;
    },

    // get polygons from this BSP tree
    allPolygons: function() {
        var polygons = this.polygons.slice();
        if (this.front) polygons = polygons.concat(this.front.allPolygons());
        if (this.back) polygons = polygons.concat(this.back.allPolygons());
        return polygons;
    },
  
    // invert space 
    invert: function() {
      for (var i = 0; i < this.polygons.length; i++) {
        this.polygons[i].flip();
      }
      this.plane.flip();

      if (this.front) {
        this.front.invert();
      }
      if (this.back) {
        this.back.invert();
      }

      // swap
      var temp = this.front;
      this.front = this.back;
      this.back = temp;
    },
  
    // Remove all polygons in p that are inside this tree
    clipPolygons: function(p) {
      if (!this.plane) { return p.slice(); }

      // create splitting lists
      var front = [], back = [];

      for (var i = 0; i < p.length; i++) {
        this.plane.splitPolygon(p[i], front, back, front, back);
      }

      if (this.front) {
        front = this.front.clipPolygons(front);
      }
      if (this.back) {
        back = this.back.clipPolygons(back);
      }
      else {
        back = [];
      }

      return front.concat(back);
    },
  
    // Remove all polygons in this tree that are inside bsp
    clipTo: function(bsp) {
      this.polygons = bsp.clipPolygons(this.polygons);

      if (this.front) {
        this.front.clipTo(bsp);
      }
      if (this.back) {
        this.back.clipTo(bsp);
      }
    },
  
    // Build a BSP tree. Newest polygons are added to the bottom.
    // split across the given plane as described in the node class.
    build: function(polygons) {
      if (!polygons.length) return;
      if (!this.plane) {
        this.plane = polygons[0].plane.clone();
      }

      // lists to split into
      var front = [], back = [];

      for (var i = 0; i < polygons.length; i++) {
        this.plane.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
      }

      if (front.length) {
        if (!this.front) this.front = new CSGBuilder.Node();
        this.front.build(front);
      }
      if (back.length) {
        if (!this.back) this.back = new CSGBuilder.Node();
        this.back.build(back);
      }
    }
};