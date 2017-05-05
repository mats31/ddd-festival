uniform sampler2D u_originalPos;
uniform sampler2D u_targetPos;
uniform float u_time;
varying vec2 vUv;

void main() {

    //basic simulation: displays the particles in place.
    vec4 originalPos = texture2D( u_originalPos, vUv );
    vec4 targetPos = texture2D( u_targetPos, vUv );

    vec3 pos = mix( originalPos.rgb, targetPos.rgb, min( step( 1., targetPos.a ) + abs( sin( u_time * min( targetPos.a, 1. ) ) ) + originalPos.a, 1. ) );
    // vec3 pos = originalPos;
    /*
        we can move the particle here
    */
    gl_FragColor = vec4( pos,1.0 );
}
