precision mediump float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
  vec4 color = texture2D(u_texture, v_texcoord);

  if (v_texcoord.x < 0.0 ||
      v_texcoord.y < 0.0 ||
      v_texcoord.x > 1.0 ||
      v_texcoord.y > 1.0) {
    discard;
  }
  gl_FragColor = color;
}
