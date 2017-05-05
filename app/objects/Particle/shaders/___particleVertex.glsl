attribute float size;
attribute float speed;

uniform float u_time;
uniform float u_radius;
uniform vec3 u_position;

void main() {

  float radius = 10.;
  float modulo = 100.;

  vec3 newPosition = vec3(
    u_position.x + sin( u_time * speed * 10. ) * speed * mod( u_time * 10. * speed, modulo ),
    // u_position.y /* + sin( u_time * speed ) * radius */,
    mod( u_time * 10. * speed, modulo ) * 1. + u_position.y,

    // mod( u_position.z + u_time * 10. * speed, modulo ) * -1.
    u_position.z
  );

  newPosition.y -= smoothstep( modulo * 0.6, modulo, mod( u_time * 10. * speed, modulo ) ) * 10.;

  vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );

  gl_PointSize = size * ( 50.0 / length( mvPosition.xyz ) );

  gl_Position = projectionMatrix * mvPosition;
}
