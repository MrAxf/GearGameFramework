export default class AnimationGroup{
  constructor(animations = new Map(), currentAnimation = 'default'){
    this.animations = animations;
    this.currentAnimation = undefined;
  }

  addAnimation(id, animation){
    this.animations.set(id, animation);
  }

  deleteAnimation(id){
    return this.animations.delete(id);
  }

  hasAnimation(id){
    return this.animations.has(id);
  }

  setCurrentAnimation(id){
    if(this.hasAnimation(id)){
      this.currentAnimation = this.animations.get(id);
      return true;
    }
    return false;
  }

  resetAnimation(id){
    if(!id){
      if(!this.currentAnimation) return false;
      this.currentAnimation.reset();
      return true;
    }
    if(!this.hasAnimation(id)) return false;
    this.animations.get(id).reset();
  }

  resetAllAnimations(){
    for (let animation of this.animations.values()) {
      animation.reset();
    }
  }

  update(){
    if(this.currentAnimation) this.currentAnimation.update();
  }

  render(x = 0, y = 0, width = undefined, height = undefined, srcRotation = 0, offsetX = 0, offsetY = 0){
    if(this.currentAnimation) this.currentAnimation.render(x, y, width, height, srcRotation, offsetX, offsetY);
  }
}
