import M4 from '../math/Mat4';

export default class Texture {
  constructor(img){
    this.img = img;
    this.width = img.width;
    this.height = img.height;
    this._glInitializaed = false;
  }

  glInit(renderer){
    this.texture = renderer.gl.createTexture();
    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.texture);
    renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, 1, 1, 0, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl.CLAMP_TO_EDGE);
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl.CLAMP_TO_EDGE);
    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl.LINEAR);

    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.texture);
    renderer.gl.texImage2D(renderer.gl.TEXTURE_2D, 0, renderer.gl.RGBA, renderer.gl.RGBA, renderer.gl.UNSIGNED_BYTE, this.img);
  }

  _webglRender(renderer, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation, offsetX, offsetY){
    if(!this.__glInitializaed){
      this.glInit(renderer);
      this._glInitializaed = true;
    }
    if (dstX === undefined) {
      dstX = srcX;
      srcX = 0;
    }
    if (dstY === undefined) {
      dstY = srcY;
      srcY = 0;
    }
    if (srcWidth === undefined) {
      srcWidth = this.width;
    }
    if (srcHeight === undefined) {
      srcHeight = this.height;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      srcWidth = this.width;
    }
    if (dstHeight === undefined) {
      dstHeight = srcHeight;
      srcHeight = this.height;
    }

    renderer.gl.bindTexture(renderer.gl.TEXTURE_2D, this.texture);

    // Tell WebGL to use our shader program pair
    renderer.gl.useProgram(renderer.program);

    // Setup the attributes to pull data from our buffers
    renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, renderer.positionBuffer);
    renderer.gl.enableVertexAttribArray(renderer.positionLocation);
    renderer.gl.vertexAttribPointer(renderer.positionLocation, 2, renderer.gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    let matrix = M4.orthographic(0, renderer.gl.canvas.width, renderer.gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dstX, dstY
    matrix = M4.translate(matrix, dstX, dstY, 0);

    matrix = M4.translate(matrix, dstWidth * offsetX, dstHeight * offsetY, 0);
    matrix = M4.zRotate(matrix, srcRotation);
    matrix = M4.translate(matrix, dstWidth * -offsetX, dstHeight * -offsetY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = M4.scale(matrix, dstWidth, dstHeight, 1);

    // Set the matrix.
    renderer.gl.uniformMatrix4fv(renderer.matrixLocation, false, matrix);

    // just like a 2d projection matrix except in texture space (0 to 1)
    // instead of clip space. This matrix puts us in pixel space.
    let texMatrix = M4.scaling(1 / this.width, 1 / this.height, 1);

    // because were in pixel space
    // the scale and translation are now in pixels
    texMatrix = M4.translate(texMatrix, srcX, srcY, 0);
    texMatrix = M4.scale(texMatrix, srcWidth, srcHeight, 1);

    // Set the texture matrix.
    renderer.gl.uniformMatrix4fv(renderer.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    renderer.gl.uniform1i(renderer.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    renderer.gl.drawArrays(renderer.gl.TRIANGLES, 0, 6);
  }

  _canvas2dRender(renderer, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation, offsetX, offsetY){
    if (dstX === undefined) {
      dstX = srcX;
      srcX = 0;
    }
    if (dstY === undefined) {
      dstY = srcY;
      srcY = 0;
    }
    if (srcWidth === undefined) {
      srcWidth = this.width;
    }
    if (srcHeight === undefined) {
      srcHeight = this.height;
    }
    if (dstWidth === undefined) {
      dstWidth = srcWidth;
      srcWidth = this.width;
    }
    if (dstHeight === undefined) {
      dstHeight = srcHeight;
      srcHeight = this.height;
    }

    renderer.ctx.drawImage(this.img, dstX, dstY);
  }

  render(renderer, srcX = 0, srcY = 0, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation = 0, offsetX = 0, offsetY = 0){
    this[`_${renderer.type}Render`](renderer, srcX, srcY, srcWidth, srcHeight, dstX, dstY, dstWidth, dstHeight, srcRotation, offsetX, offsetY)
  }

  static loadFromUrl(url){
    return new Promise((resolve, reject) =>{
      let img = new Image();
      img.onload = () => {
        resolve(new Texture(img));
      };
      let formatUlr = `${window.location.origin}/${url}`;
      if ((new URL(formatUlr)).origin !== window.location.origin) {
        img.crossOrigin = "";
      }
      img.src = formatUlr;
    });
  }
}
