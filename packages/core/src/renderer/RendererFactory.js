import GLRenderer from './glRenderer/GLRenderer';
import GLProgram from './glRenderer/GLProgram';
import textVertexShader2D from './glRenderer/shaders2D/textVertexShader2D.glsl';
import textFragmentShader2D from './glRenderer/shaders2D/textFragmentShader2D.glsl';

import Canvas2dRenderer from './canvas2dRenderer/Canvas2dRenderer'

const GLRendererFactory = (canvas) => {
  let renderer = new GLRenderer(canvas);
  renderer.setProgram(GLProgram.createGLProgram(renderer.gl, textVertexShader2D, textFragmentShader2D));
  return renderer;
}

const Canvas2DRendererFactory = (canvas) => {
  return new Canvas2dRenderer(canvas);
}

export { GLRendererFactory, Canvas2DRendererFactory };
