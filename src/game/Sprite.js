export default class Sprite{
  constructor(game, texture, rows = 1, cols = 1){
    this.game = game;
    this.texture = texture;
    this.rows = rows;
    this.cols = cols;
  }

  render(row = 0, col = 0, x = 0, y = 0, width, height, srcRotation = 0, offsetX = 0, offsetY = 0){
    let cellWidth = this.texture.width/this.cols;
    let cellHeight = this.texture.height/this.rows;

    if(row < 0 || row >= this.rows){
      row = 0;
    }
    if(col < 0 || col >= this.cols){
      col = 0;
    }
    if (width === undefined) {
      width = cellWidth;
    }
    if (height === undefined) {
      height = cellHeight;
    }
    this.game.renderer.drawTexture(this.texture, cellWidth * col, cellHeight * row, cellWidth, cellHeight, x, y, width, height, srcRotation, offsetX, offsetY);
  }
}
