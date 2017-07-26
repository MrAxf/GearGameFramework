import Color from '../../Color';

export default class Canvas2dRenderer {

  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.type = 'canvas2d';
  }

  setCanvasSize(width = 0, height = 0){
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
  }

  clearColor(color = new Color(0, 0, 0, 1)){
    this.ctx.fillStyle=color.toString();
    this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  }

}
