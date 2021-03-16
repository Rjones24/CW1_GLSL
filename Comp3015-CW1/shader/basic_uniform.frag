#version 460

in vec3 Position;
in vec3 Normal;
in vec2 TexCoord;

layout (location = 0) out vec4 FragColor;

layout(binding=0) uniform sampler2D ExteriorTex;
layout(binding=1) uniform sampler2D MossTex;
layout(binding=2) uniform sampler2D Moss2Tex;
layout(binding=3) uniform sampler2D Moss3Tex;




uniform struct LightInfo {
vec4 Position; // Light position in eye coords.
vec3 La; // Ambient light intensity
vec3 L; // Diffuse and specular light intensity
} lights;


uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
vec3 Kd; // Diffuse reflectivity
vec3 Ks; // Specular reflectivity
float Shininess;
float pick;// Specular shininess factor
} Material;

vec3 blinn_phongModel( vec3 position, vec3 n )
{
 vec3 texColor;
 if (Material.pick==0){
  vec4 ExteriorTexColor = texture( ExteriorTex , TexCoord);
  vec4 mossTexColor = texture( MossTex , TexCoord);
  texColor  = mix( ExteriorTexColor.rgb , mossTexColor.rgb , mossTexColor.a);
 } else if(Material.pick==1){
  vec4 moss2TexColor = texture( Moss2Tex , TexCoord);
  vec4 moss3TexColor = texture( Moss3Tex , TexCoord);
   texColor  = mix( moss2TexColor.rgb , moss3TexColor.rgb , moss3TexColor.a);
 }
//calculate ambient here, to access each light La value use this: lights[light].La
vec3 ambient = Material.Ka * lights.La * texColor;

//calculate diffuse here
 vec3 s = normalize(vec3(lights.Position - vec4(position,1.0)));
 float sDotN = max( dot(s,n), 0.0 );

vec3 diffuse = Material.Kd * sDotN * texColor;
//calculate specular here

vec3 spec = vec3(0.0);
if( sDotN > 0.0 )
{
vec3 v = normalize(-position.xyz);
vec3 h = normalize(v + s);

spec = Material.Ks * pow( max( dot(h,n), 0.0 ), Material.Shininess );
}
return ambient + lights.L * (diffuse + spec);
}

void main() {
    FragColor = vec4(blinn_phongModel (Position, normalize (Normal)),1.0);
}