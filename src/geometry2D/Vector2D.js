export default Class Vector2D{
  x = 0;
  y = 0;

  constructor(x, y, x2 = 0, y2 = 0){
    this.x = x - x2;
    this.y = y - y2;
  }
  normal(){
    return new Vector2D(-this.y, this.x);
  }
  magnitude(){
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  projection(proyectionVector){
    let proyectionVectorMagnitude = proyectionVector.magnitude();
    return (this.x * (proyectionVector.x/proyectionVectorMagnitude)) + (this.y * (proyectionVector.y/proyectionVectorMagnitude));
  }
  rotate(angle, originPoint = new Vector2D(0,0)){
    let newX = ((this.x - originPoint.x)*Math.cos(angle)) - ((this.y - originPoint.y)*Math.sin(angle)) + originPoint.x;
    let newY = ((this.x - originPoint.x)*Math.sin(angle)) + ((this.y - originPoint.y)*Math.cos(angle)) + originPoint.y;
    return new Vector2D(newX, newY);
  }
  equals(vector){
    if(this.x == vector.x && this.y == vector.y) return true;
    return false;
  }
}
