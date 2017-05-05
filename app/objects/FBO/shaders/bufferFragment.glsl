uniform sampler2D u_diffuse;
uniform sampler2D u_picture;

varying vec2 vUv;

void main( void ) {

    // float factor = u_factor;
    float factor = 0.99999999999;

    vec2 uv = vUv;

    vec4 texture = texture2D(u_diffuse, uv);
    vec4 pictureTexture = texture2D(u_picture, uv);


    // vec3 color = texture.r * pictureTexture.rgb;
    vec3 color = texture.r * pictureTexture.rgb;
    // color = mix( lighter, darker, smoothstep( 0., 0.05, texture.r ) );
    color.rgb *= factor;
    // color.rgb *= smoothstep( 0., factor * 0.005, color.rgb );


    // float alpha = texture.a;
    float alpha = pictureTexture.a;
    // float alpha = 1.;


    gl_FragColor = vec4( color, alpha );
}
