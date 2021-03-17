#version 460

//input varaibales
layout (location = 0) in vec3 VertexPosition;
layout (location = 1) in vec3 VertexNormal;
layout (location = 2) in vec2 VertexTexCoord;

//output variables
out vec3 Position;
out vec3 Normal;
out vec2 TexCoord;

// all of the uniforms that the vertex shader will need
uniform mat4 ModelViewMatrix;
uniform mat3 NormalMatrix;
uniform mat4 ProjectionMatrix;
uniform mat4 MVP;

void main() {

//conversts the vertex normal to eye coordinates,
  Normal = normalize( NormalMatrix * VertexNormal);
  //converts the vertex position to eye coordinates,
  Position = (ModelViewMatrix * vec4(VertexPosition,1.0)).xyz;

  TexCoord = VertexTexCoord;

  gl_Position = MVP * vec4(VertexPosition,1.0);
}
