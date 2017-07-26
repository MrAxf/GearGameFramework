const GLProgram = {
  createGLProgram(gl, vertexShader, fragmentShader){

    let programVertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShader);
    let programFragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    let program = gl.createProgram();
    gl.attachShader(program, programVertexShader);
    gl.attachShader(program, programFragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  },
  createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
}

export default GLProgram;
