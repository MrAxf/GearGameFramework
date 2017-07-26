import Color from '../../Color';

export default class GLRenderer {

  constructor(canvas){
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl');
    this.type = 'webgl';
  }

  setProgram(program){
    this.program = program;
    this.afterProgramIsSet();
  }

  afterProgramIsSet(){
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
    this.gl.viewport(0, 0, width, height);
  }

  clearColor(color = new Color(0, 0, 0, 1)){
    this.gl.clearColor(...color.getRGBA());
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
