uniform sampler2D u_map;
uniform sampler2D u_mask;
uniform float u_alpha;
uniform float u_time;

varying vec2 vUv;

void main() {

  vec4 texture = texture2D(u_map, vUv);
  vec4 mask = texture2D(u_mask, vUv );

  vec3 color = texture.rgb;
  float alpha = mask.a * u_alpha;

  gl_FragColor = vec4(color, alpha);
}
