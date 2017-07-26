const requestAnimationFrame = window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const defaultOptions = {
  container_id: 'game-container',
  width: 960,
  height: 540,
  ticks_per_second: 60
}

export default class Game{

  constructor(options = {}){
    //Setup options
    this.options = {...defaultOptions, options};

    this.setContainer();
    this.canvas = document.getElementById(`${this.options.container_id}-canvas`);

    this.loopData = {
      interval: 1000/this.options.ticks_per_second,
      lag: 0,
      then: 0,
    }
    this.loop = this.loop.bind(this);
    this.running = false;
  }

  init(){

  }

  setContainer(){
    this.container = document.getElementById(this.options.container_id);

    this.container.requestFullScreen = this.container.requestFullscreen ||
      this.container.msRequestFullscreen ||
      this.container.mozRequestFullScreen ||
      this.container.webkitRequestFullscreen;

    document.exitFullScreen = document.exitFullscreen ||
      document.msExitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitCancelFullScreen;

    this.fullScreenActive = false;

    this.container.style.background = "#000000";
    this.container.style.position = "relative";
    this.container.style.display = "flex";
    this.container.style.alignItems = "center";
    this.container.style.justifyContent = "center";
    this.container.style.overflow = "hidden";
    this.container.style.width = "100%";
    this.container.style.height = "100%";

    this.container.innerHTML = `<canvas id="${this.options.container_id}-canvas"></canvas>`;
  }

  fitCanvasToConatiner(){
    let canvasProportions = this.canvas.clientWidth/this.canvas.clientHeight;
    let containerProportions = this.container.clientWidth/this.container.clientHeight;

    if(containerProportions > canvasProportions){
      this.canvas.style.width = "auto";
      this.canvas.style.height = "100%";
    } else {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "auto";
    }
  }

  resizeCanvas(renderer, width = 960, height = 540, force = false){
    if(!force && this.options.width == width && this.options.height == height) return;
    this.options.width = width;
    this.options.height = height;

    this[`_${renderer.type}ResizeCanvas`](renderer, width, height);
  }

  _webglResizeCanvas(renderer, width, height){
    renderer.setCanvasSize(width, height);
    renderer.setViewport();
  }

  _canvas2dResizeCanvas(renderer, width, height){
    renderer.setCanvasSize(width, height);
  }

  toggleFullScreen(activate = !this.fullScreenActive){
    this.fullScreenActive = activate;

    if(activate) this.container.requestFullScreen();
    else document.exitFullScreen();

    setTimeout(this.fitCanvasToConatiner.bind(this), 300);
  }

  loop(){
    if(this.running){
      let now = Date.now();
    	this.loopData.lag += now - this.loopData.then;
    	this.loopData.then = now;
      let i = 60;
    	while(this.loopData.interval < this.loopData.lag){
    		this.update();
    		//updateInputs();
    		this.loopData.lag -= this.loopData.interval;
    	}
    }
  	this.render();
    requestAnimationFrame(this.loop);
  }

  start(){
    this.init();
    this.running = true;
    this.loopData.then = Date.now();
    requestAnimationFrame(this.loop);
  }

  pause(){
    this.running = false;
  }

  continue(){
    this.loopData.then = Date.now();
    this.loopData.lag = 0;
    this.running = true;
  }

  update(){

  }

  render(){

  }

}
