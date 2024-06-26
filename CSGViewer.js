// Viewer for CSG geometry

// global variables
var viewers = [];
var nextID = 0;
var angleX = 20;
var angleY = 20;

function CSGViewer(csgObject, width, height, depth) {
    viewers.push(this);
  
    // Get a new WebGL canvas
    var gl = GL.create();
    this.gl = gl;
    this.mesh = csgObject.toMesh();
  
    // Set up the viewport
    gl.canvas.width = width;
    gl.canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.matrixMode(gl.PROJECTION);
    gl.loadIdentity();
    gl.perspective(45, width / height, 0.1, 100);
    gl.matrixMode(gl.MODELVIEW);
  
    // Set up WebGL state
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0.01, 0.01, 0.01, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.polygonOffset(1, 1);
  
    // Shader with diffuse and specular lighting
    this.lightingShader = new GL.Shader('\
      varying vec3 color;\
      varying vec3 normal;\
      varying vec3 light;\
      void main() {\
        const vec3 lightDir = vec3(1.0, 2.0, 3.0) / 3.741657386773941;\
        light = (gl_ModelViewMatrix * vec4(lightDir, 0.0)).xyz;\
        color = gl_Color.rgb;\
        normal = gl_NormalMatrix * gl_Normal;\
        gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;\
      }\
    ', '\
      varying vec3 color;\
      varying vec3 normal;\
      varying vec3 light;\
      void main() {\
        vec3 n = normalize(normal);\
        float diffuse = max(0.0, dot(light, n));\
        float specular = pow(max(0.0, -reflect(light, n).z), 32.0) * sqrt(diffuse);\
        gl_FragColor = vec4(mix(color * (0.3 + 0.7 * diffuse), vec3(1.0), specular), 1.0);\
      }\
    ');
  
    gl.onmousemove = function(e) {
      if (e.dragging) {
        angleY += e.deltaX * 2;
        angleX += e.deltaY * 2;
        angleX = Math.max(-90, Math.min(90, angleX));
  
        viewers.map(function(viewer) {
          viewer.gl.ondraw();
        });
      }
    };
  
    var that = this;
    gl.ondraw = function() {
      gl.makeCurrent();
  
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.loadIdentity();
      gl.translate(0, 0, -depth);
      gl.rotate(angleX, 1, 0, 0);
      gl.rotate(angleY, 0, 1, 0);
  
      gl.enable(gl.POLYGON_OFFSET_FILL);
      //gl.enable(gl.BLEND);

      that.lightingShader.draw(that.mesh, gl.TRIANGLES);
    };
  
    gl.ondraw();
}

/**
 * Add a viewer to the list of viewers
 */
function addViewer(viewer) {
    document.getElementById(nextID++).appendChild(viewer.gl.canvas);
}

/**
 * Clear viewers
 */
function clearViewers() {
  document.getElementById(0).innerHTML = "";
  document.getElementById(1).innerHTML = "";
  document.getElementById(2).innerHTML = "";
  viewers = [];
  nextID = 0;
}

/**
 * Convert a CSG object to a GL mesh
 */
CSGBuilder.prototype.toMesh = function() {
    var mesh = new GL.Mesh({
        normals: true, colors: true
    });
    var indexer = new GL.Indexer();

    // iterate over polygons
    this.toPolygons().map(function(polygon) {
        // iterate over vertices
        var indices = polygon.vertices.map(function(vertex) {
        vertex.color = polygon.shared || [1, 1, 1];
        return indexer.add(vertex);
      });

      for (var i = 2; i < indices.length; i++) {
        mesh.triangles.push([indices[0], indices[i - 1], indices[i]]);
      }
    });

    mesh.vertices = indexer.unique.map(function(v) { return [v.pos.x, v.pos.y, v.pos.z]; });
    mesh.normals = indexer.unique.map(function(v) { return [v.normal.x, v.normal.y, v.normal.z]; });
    mesh.colors = indexer.unique.map(function(v) { return v.color; });
    
    mesh.computeWireframe();
    return mesh;
};

/**
 * Set color of a CSG object
 */
CSGBuilder.prototype.setColor = function(r,g,b) {
    // iterate over polygons and set color
    this.toPolygons().map(function(polygon) {
        polygon.shared = [r,g,b];
    });
};

CSGBuilder.prototype.getColor = function() {
  return this.shared;
};