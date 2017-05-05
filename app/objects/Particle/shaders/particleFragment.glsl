uniform sampler2D u_map;


void main() {

  vec4 texture = texture2D( u_map, gl_PointCoord );

  vec3 color = vec3(1.) * texture.rgb;

  float alpha = 1. * texture.a;

  gl_FragColor = vec4( color, alpha );
}
