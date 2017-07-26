export default class Color{
  red = 0;
  green = 0;
  blue = 0;
  alpha = 1;

  constructor(param1, param2, param3, param4){
    if(typeof param1 == "string"){
      let hexRGB = param1.replace("#", "");
      for (let i = 0; i < param1.length; i+=2) {
        let intColor = parseInt(hexRGB.substring(i, i + 2), 16);
        if(i < 2) this.red = intColor;
        else if(i < 4) this.green = intColor;
        else if(i < 6) this.blue = intColor;
      }
      if(typeof param2 == "number" && param2 >= 0 && param2 <= 1){
        this.alpha = param2;
      }
    }
    else if(typeof param1 == "number" && typeof param2 == "number" && typeof param3 == "number"){
      this.red = param1.mod(256);
      this.green = param2.mod(256);
      this.blue = param3.mod(256);
      if(typeof param4 == "number" && param4 >= 0 && param4 <= 1){
        this.alpha = param4;
      }
    }
  }
  getRGBA(){
    return [this.red/255, this.green/255, this.blue/255, this.alpha];
  }
  toString(){
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
  }
}
