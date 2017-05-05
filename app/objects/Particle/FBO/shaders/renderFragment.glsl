uniform sampler2D u_map;
uniform float u_alpha;
uniform float u_time;

varying vec2 vUV;
varying vec3 vPos;
varying float vRandom;

void main() {

    vec4 texture = texture2D( u_map, gl_PointCoord );

    // vec3 color = mix( texture.rgb, vec3(1., 0., 0.), 0.5 );
    vec3 color = texture.rgb;
    // vec3 color = vec3(1., 1., 1.);

    // float alpha = 1.;
    float alpha = ( texture.a * 0.7 * sin( u_time * vRandom * 5. ) * step(0., vPos.y) ) * u_alpha;
    // float alpha = .2 * sin( u_time * vRandom * 5. );

    gl_FragColor = vec4( color, alpha );
}
