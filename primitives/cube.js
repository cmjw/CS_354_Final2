/**
 * Cube
 */
CSGBuilder.cube = function(options) {
    options = options || {};

    var c = new CSGBuilder.Vector(options.center || [0, 0, 0]);
    var r = !options.radius ? [1, 1, 1] : options.radius.length ?
             options.radius : [options.radius, options.radius, options.radius];
             
    return CSGBuilder.fromPolygons([
      [[0, 4, 6, 2], [-1, 0, 0]],
      [[1, 3, 7, 5], [+1, 0, 0]],
      [[0, 1, 5, 4], [0, -1, 0]],
      [[2, 6, 7, 3], [0, +1, 0]],
      [[0, 2, 3, 1], [0, 0, -1]],
      [[4, 5, 7, 6], [0, 0, +1]]
    ].map(function(info) {
      return new CSGBuilder.Polygon(info[0].map(function(i) {
        var pos = new CSGBuilder.Vector(
          c.x + r[0] * (2 * !!(i & 1) - 1),
          c.y + r[1] * (2 * !!(i & 2) - 1),
          c.z + r[2] * (2 * !!(i & 4) - 1)
        );
        return new CSGBuilder.Vertex(pos, new CSGBuilder.Vector(info[1]));
      }));
    }));
};