import Renderer from '../core/Renderer';
import textVertexShader2D from '../shaders2D/textVertexShader2D.glsl';
import textFragmentShader2D from '../shaders2D/textFragmentShader2D.glsl';

const create2DRenderer = (gl) => {
  let renderer = new Renderer(gl);
  renderer.createProgram(textVertexShader2D, textFragmentShader2D);
  renderer.init();
  return renderer;
};

export {create2DRenderer};
