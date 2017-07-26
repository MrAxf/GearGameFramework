Number.prototype.mod = (n) => ((this%n)+n)%n;

import { Game, Texture, GLRendererFactory, Canvas2DRendererFactory, Color } from '../packages/core';
import Sprite from './game/Sprite';
import Animation from './game/Animation';
import AnimationGroup from './game/AnimationGroup';

class MyGame extends Game{

  init(){
    this.renderer = Canvas2DRendererFactory(this.canvas);

    this.resizeCanvas(this.renderer, this.options.width, this.options.height, true);
    this.fitCanvasToConatiner();

    let self = this;

    this.blueColor = new Color('#45aef1');
    Texture.loadFromUrl('assets/scott.png')
      .then(texture => {
        self.texture = texture;
        /*this.sprite = new Sprite(this, this.texture, 2, 8);
        this.scott = new AnimationGroup();
        this.scott.addAnimation('walk_right', new Animation(this.sprite, [[0,0], [0,1], [0,2], [0,3], [0,4], [0,5], [0,6],[0,7]], 7));
        this.scott.addAnimation('walk_left', new Animation(this.sprite, [[1,0], [1,1], [1,2], [1,3], [1,4], [1,5], [1,6],[1,7]], 7));
        this.scott.setCurrentAnimation('walk_right');

        this.direction = 1;
        this.speed = 4;
        this.position = 0;
        this.height = -50;*/
      });
  }

  update(){
    /*this.position += this.speed * this.direction;
    if(this.position > this.options.width + 60){
      this.direction = -1;
      this.scott.setCurrentAnimation('walk_left');
    }
    else if (this.position < -120){
      this.direction = 1;
      this.scott.setCurrentAnimation('walk_right');
    }
    this.height+=5;
    if(this.height > 240) this.height = 240;
    this.scott.update();*/
  }

  render(){
    this.renderer.clearColor(this.blueColor);
    //this.scott.render(this.position, this.height);
    if(this.texture) this.texture.render(this.renderer, 50, 50);
  }
}
document.addEventListener("DOMContentLoaded", (event) => {
  const game = new MyGame();
  game.start();
  game.canvas.addEventListener("click", (e) => {game.toggleFullScreen();});
});
