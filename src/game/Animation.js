export default class Animation{
  constructor(sprite, cells, ticks, loop = true){
    this.sprite = sprite;
    this.cells = cells;
    this.ticks = ticks;
    this.loop = loop;

    this.reset();
  }

  arrayNext(){
    this.currentCell++;
    this.currentTick++;
    if(this.currentCell >= this.cells.length){
      if(!this.loop){
        this.currentCell--;
        this.currentTick--;
        return;
      }
      this.currentCell = 0;
    }
    if(this.currentTick >= this.ticks.length) this.currentTick = 0;
    this.tickCounter = this.ticks[this.currentTick];
  }

  numberNext(){
    this.currentCell++;
    if(this.currentCell >= this.cells.length){
      if(!this.loop){
        this.currentCell--;
        return;
      }
      this.currentCell = 0;
    }
    this.tickCounter = this.ticks;
  }

  reset(){
    this.currentCell = 0;
    if(Object.prototype.toString.call(this.ticks) === '[object Array]' ){
      this.currentTick = 0;
      this.next = this.arrayNext;
      this.tickCounter = this.ticks[0];
    }else{
      this.next = this.numberNext;
      this.tickCounter = this.ticks;
    }
  }

  update(){
    this.tickCounter--;
    if(this.tickCounter === 0) this.next();
  }

  render(x = 0, y = 0, width = undefined, height = undefined, srcRotation = 0, offsetX = 0, offsetY = 0){
    this.sprite.render(...this.cells[this.currentCell], x, y, width, height, srcRotation, offsetX, offsetY);
  }
}
