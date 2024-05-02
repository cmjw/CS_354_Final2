/**
 * Cylinder
 */
CSGBuilder.cylinder = function(options) {
  options = options || {};
  
  var height = options.height || 2;
  var s = new CSGBuilder.Vector(options.start || [0, -height/2, 0]);
  var e = new CSGBuilder.Vector(options.end || [0, height/2, 0]); // Adjust end point based on height
  var ray = e.minus(s);
  var r = options.radius || 1;
  var slices = options.slices || 16;
  var axisZ = ray.normalize(), isY = (Math.abs(axisZ.y) > 0.5);
  var axisX = new CSGBuilder.Vector(isY, !isY, 0).cross(axisZ).normalize();
  var axisY = axisX.cross(axisZ).normalize();
  var start = new CSGBuilder.Vertex(s, axisZ.negated());
  var end = new CSGBuilder.Vertex(e, axisZ.normalize());
  var polygons = [];

  function point(stack, slice, normalBlend) {
      var angle = slice * Math.PI * 2;
      var out = axisX.times(Math.cos(angle)).plus(axisY.times(Math.sin(angle)));
      var pos = s.plus(ray.times(stack)).plus(out.times(r));
      var normal = out.times(1 - Math.abs(normalBlend)).plus(axisZ.times(normalBlend));
      return new CSGBuilder.Vertex(pos, normal);
  }

  for (var i = 0; i < slices; i++) {
      var t0 = i / slices, t1 = (i + 1) / slices;
      polygons.push(new CSGBuilder.Polygon([start, point(0, t0, -1), point(0, t1, -1)]));
      polygons.push(new CSGBuilder.Polygon([point(0, t1, 0), point(0, t0, 0), point(1, t0, 0), point(1, t1, 0)]));
      polygons.push(new CSGBuilder.Polygon([end, point(1, t1, 1), point(1, t0, 1)]));
  }

  return CSGBuilder.fromPolygons(polygons);
};
