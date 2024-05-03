/**
 * A sphere primitive
 */

CSGBuilder.sphere = function(options) {
    options = options || {};
    var c = new CSGBuilder.Vector([0, 0, 0]);
    var r = options.radius || 1;
    
    var polygons = []
    var vertices;

    // from lightgl
    function vertex(theta, phi) {
      theta *= Math.PI * 2;
      phi *= Math.PI;
      var dir = new CSGBuilder.Vector(
        Math.cos(theta) * Math.sin(phi),
        Math.cos(phi),
        Math.sin(theta) * Math.sin(phi)
      );
      vertices.push(new CSGBuilder.Vertex(c.plus(dir.times(r)), dir));
    }

    var slices = 24;
    var stacks = 24;

    for (var i = 0; i < slices; i++) {
      for (var j = 0; j < stacks; j++) {
        vertices = [];
        vertex(i / slices, j / stacks);
        if (j > 0) vertex((i + 1) / slices, j / stacks);
        if (j < stacks - 1) vertex((i + 1) / slices, (j + 1) / stacks);
        vertex(i / slices, (j + 1) / stacks);
        polygons.push(new CSGBuilder.Polygon(vertices));
      }
    }
    
    return CSGBuilder.fromPolygons(polygons);
  };