/**
 * Cylinder from lightgl
 */
CSGBuilder.cylinder = function(options) {
    options = options || {};
    var s = new CSG.Vector(options.start || [0, -1, 0]);
    var e = new CSG.Vector(options.end || [0, 1, 0]);
    var ray = e.minus(s);
    var r = options.radius || 1;
    var slices = options.slices || 16;
    var axisZ = ray.unit(), isY = (Math.abs(axisZ.y) > 0.5);
    var axisX = new CSG.Vector(isY, !isY, 0).cross(axisZ).unit();
    var axisY = axisX.cross(axisZ).unit();
    var start = new CSG.Vertex(s, axisZ.negated());
    var end = new CSG.Vertex(e, axisZ.unit());
    var polygons = [];
    function point(stack, slice, normalBlend) {
      var angle = slice * Math.PI * 2;
      var out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
      var pos = s.plus(ray.times(stack)).plus(out.times(r));
      var normal = out.times(1 - Math.abs(normalBlend)).plus(axisZ.times(normalBlend));
      return new CSG.Vertex(pos, normal);
    }
    for (var i = 0; i < slices; i++) {
      var t0 = i / slices, t1 = (i + 1) / slices;
      polygons.push(new CSG.Polygon([start, point(0, t0, -1), point(0, t1, -1)]));
      polygons.push(new CSG.Polygon([point(0, t1, 0), point(0, t0, 0), point(1, t0, 0), point(1, t1, 0)]));
      polygons.push(new CSG.Polygon([end, point(1, t1, 1), point(1, t0, 1)]));
    }
    return CSG.fromPolygons(polygons);
  };