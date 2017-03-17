export default class Texture {
  width = 1;
  height = 1;
  constructor(gl, url){
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    let image = new Image();

    image.onload = (() => {
      this.width = image.width;
      this.height = image.height;

      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    }).bind(this);
    let imageUlr = `${window.location.origin}/${url}`;
    this.sameOriginUrl(image, imageUlr);
    image.src = imageUlr;
  }
  sameOriginUrl(img, url) {
    if ((new URL(url)).origin !== window.location.origin) {
      img.crossOrigin = "";
    }
  }
}
