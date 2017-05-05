attribute float random;

uniform sampler2D positions;//RenderTarget containing the transformed positions
uniform float pointSize;//size

// varying vec2 vUV;
varying float vRandom;
varying vec3 vPos;

void main() {

    // vec3 pos = vec3( 40. - 80. * random, 40. - 80. * random, 80. - 80. * random );

    //the mesh is a nomrliazed square so the uvs = the xy positions of the vertices
    vec3 pos = texture2D( positions, position.xy ).xyz;
    //pos now contains a 3D position in space, we can use it as a regular vertex

    // vUV = position.xy;
    // vUV = uv;
    vRandom = random;
    vPos = pos;

    //regular projection of our position
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

    //sets the point size
    gl_PointSize = pointSize;
}
