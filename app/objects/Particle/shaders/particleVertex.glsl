attribute float size;
attribute float speed;

uniform float u_time;
uniform float u_radius;
uniform vec3 u_position;

void main() {

  float xModulo = 100.;
  float radius = 10.;
  float modulo = 100.;

  vec3 newPosition = vec3(
    // u_position.x + ( mod( u_time * 10. * speed, xModulo ) - xModulo / 2. ),
    u_position.x,
    u_position.y - mod( u_time * speed * 100., modulo ),
    u_position.z
  );

  // newPosition.y -= smoothstep( modulo * 0.6, modulo, mod( u_time * modSpeed * speed, modulo ) ) * modulo * 1.5;

  // vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

  // gl_PointSize = size * ( 50.0 / length( mvPosition.xyz ) );
  gl_PointSize = 50.;

  gl_Position = projectionMatrix * mvPosition;
}
