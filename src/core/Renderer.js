import Color from "./Color";
import M4 from "./Mat4";

export default class Renderer{
  constructor(gl){
    this.gl = gl;
    this.program = null;
  }

  createShader(type, source) {
    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.error(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }

  createProgram(vertexShader, fragmentShader){

    let programVertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShader);
    let programFragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShader);
    let program = this.gl.createProgram();
    this.gl.attachShader(program, programVertexShader);
    this.gl.attachShader(program, programFragmentShader);
    this.gl.linkProgram(program);
    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) {
      this.program = program;
      return program;
    }

    console.error(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }

  init(){
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);

    this.positionLocation = this.gl.getAttribLocation(this.program, "a_position");

    // lookup uniforms
    this.matrixLocation = this.gl.getUniformLocation(this.program, "u_matrix");
    this.textureMatrixLocation = this.gl.getUniformLocation(this.program, "u_textureMatrix");
    this.textureLocation = this.gl.getUniformLocation(this.program, "u_texture");

    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1]), this.gl.STATIC_DRAW);
  }

  setCanvasSize(width = 0, height = 0){
    this.gl.canvas.width = width;
    this.gl.canvas.height = height;
  }

  setViewport(width = this.gl.canvas.width, height = this.gl.canvas.height){
    this.gl.viewport(0, 0, width*1.5, height*1.5);
  }

  clear(color = new Color(0, 0, 0, 0)){
    this.gl.clearColor(...color.getRGBA());
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  setColor(color = new Color(1, 1, 1, 1)){
    this.gl.uniform4f(this.getShaderAttribute("u_color"), ...color.getRGBA());
  }

  drawTriangles(position = [], transformMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1]){

    this.gl.useProgram(this.program);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.getShaderAttribute("a_position"));
    this.gl.vertexAttribPointer(this.getShaderAttribute("a_position"), 2, this.gl.FLOAT, false, 0, 0);
    this.gl.uniform2f(this.getShaderAttribute("u_resolution"), this.gl.canvas.width, this.gl.canvas.height);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.uniformMatrix3fv(this.getShaderAttribute("u_matrix"), false, transformMatrix);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(position), this.gl.STATIC_DRAW);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, position.length/2);
  }

  drawTexture(tex, srcX = 0, srcY = 0, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation = 0, offsetX = 0, offsetY = 0) {
    if (dstX === undefined) {
      dstX = srcX;
      srcX = 0;
    }
    if (dstY === undefined) {
      dstY = srcY;
      srcY = 0;
    }
    if (srcWidth === undefined) {
      srcWidth = tex.width;
    }
    if (srcHeight === undefined) {
      srcHeight = tex.height;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      srcWidth = tex.width;
    }
    if (dstHeight === undefined) {
      dstHeight = srcHeight;
      srcHeight = tex.height;
    }

    this.gl.bindTexture(this.gl.TEXTURE_2D, tex.texture);

    // Tell WebGL to use our shader program pair
    this.gl.useProgram(this.program);

    // Setup the attributes to pull data from our buffers
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    var matrix = M4.orthographic(0, this.gl.canvas.width, this.gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = M4.translate(matrix, dstX, dstY, 0);

    matrix = M4.translate(matrix, dstWidth * offsetX, dstHeight * offsetY, 0);
    matrix = M4.zRotate(matrix, srcRotation);
    matrix = M4.translate(matrix, dstWidth * -offsetX, dstHeight * -offsetY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = M4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    this.gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

    // just like a 2d projection matrix except in texture space (0 to 1)
    // instead of clip space. This matrix puts us in pixel space.
    var texMatrix = M4.scaling(1 / tex.width, 1 / tex.height, 1);

    // because were in pixel space
    // the scale and translation are now in pixels
    var texMatrix = M4.translate(texMatrix, srcX, srcY, 0);
    var texMatrix = M4.scale(texMatrix, srcWidth, srcHeight, 1);

    // Set the texture matrix.
    this.gl.uniformMatrix4fv(this.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    this.gl.uniform1i(this.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }

  getShaderAttribute(attribute){
    return this.gl.getUniformLocation(this.program, attribute);
  }
}
