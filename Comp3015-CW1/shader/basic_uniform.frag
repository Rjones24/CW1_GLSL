#version 460

//input varaibales
in vec3 Position;
in vec3 Normal;
in vec2 TexCoord;

layout (location = 0) out vec4 FragColor;

//all of the input textures that will be used
layout(binding=0) uniform sampler2D statueTex;
layout(binding=1) uniform sampler2D MossTex;
layout(binding=2) uniform sampler2D floorTex;
layout(binding=3) uniform sampler2D waterTex;

//all of the uniforms needed for a spotlight
uniform struct spotLightInfo {
vec4 Position; // Light position in eye coords.
vec3 La; // Ambient light intensity
vec3 L; // Diffuse and specular light intensity
vec3 Direction;// Direction of the spotlight in cam coords
float Exponent;// Angular attenuation exponent
float cutoff;// Cutoff angle (between 0 and pi/2)
} spot;

uniform struct LightInfo {
vec4 Position; // Light position in eye coords.
vec3 La; // Ambient light intensity
vec3 L; // Diffuse and specular light intensity
} lights[4];


uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
vec3 Kd; // Diffuse reflectivity
vec3 Ks; // Specular reflectivity
float Shininess;
float pick;// Specular shininess factor
} Material;

//varaibles used for toon shading
const int levels = 4;
const float scaleFactor = 1.0/levels;

vec3 Colour;
vec3 s;
vec3 texColor;

//blinnphong approach to pointlights
vec3 point_blinn_phongModel( int light, vec3 position, vec3 n )
{
 
 //calculate ambient
 vec3 ambient = Material.Ka * lights[light].La * texColor;

 //calcualtes s : the direction from the surface point to the light source
 s = normalize(vec3(lights[light].Position - vec4(position,1.0)));
 //calculate dot product between s & n
 float sDotN = max( dot(s,n), 0.0 );

//calculate diffuse 
 vec3 diffuse = Material.Kd * floor(sDotN *levels)* scaleFactor * texColor ;

 vec3 spec = vec3(0.0);

 //check to see it=f sDotN is grater then 0 and if it is calculates a speculer
 if( sDotN > 0.0 ){
  vec3 v = normalize(-position.xyz);
  vec3 h = normalize(v + s);
  spec = Material.Ks * pow( max( dot(h,n), 0.0 ), Material.Shininess );
 }

 //returns all of the calulates fro the light
 return ambient + lights[light].L * (diffuse + spec);
}

//blinnphong approach to spotlights
 vec3 Spot_blinn_phongModel(  vec3 position, vec3 n )
{
 //calculate ambient
vec3 ambient = Material.Ka * spot.La * texColor;

//calcualtes s : the direction from the surface point to the light source
  s = spot.Position.xyz;

   //cosine of the angle
 float cosangle = max( dot(-s, normalize(spot.Direction)), 0.0 );

 //gives you the actual angle
 float angle = acos(cosangle);
 float spotScale = 0.0;

 vec3 diffuse;
 vec3 spec = vec3(0.0);
 //checks that the cuttoff is grater then the angle
 if(angle< spot.cutoff){

  spotScale = pow(cosangle,spot.Exponent);

  //calculate dot product between s and n
  float sDotN = max( dot(s,n), 0.0 );

  //calculate diffuse 
  diffuse = Material.Kd * floor(sDotN *levels)* scaleFactor*texColor ;
  
 //check to see it=f sDotN is grater then 0 and if it is calculates a speculer
  if( sDotN > 0.0 ){
    vec3 v = normalize(-position.xyz);
    vec3 h = normalize(v + s);
    spec = Material.Ks * pow( max( dot(h,n), 0.0 ), Material.Shininess );
   }
 }
  //returns all of the calulates fro the light
 return ambient + spot.L * (diffuse + spec);
}

void tex(){
if (Material.pick==0){
  vec4 statueTexColor = texture( statueTex , TexCoord);
  vec4 mossTexColor = texture( MossTex , TexCoord);
  texColor  = mix( statueTexColor.rgb , mossTexColor.rgb , mossTexColor.a);
 } else if(Material.pick==1){
  vec4 floorTexColor = texture( floorTex , TexCoord);
  vec4 waterTexColor = texture( waterTex , TexCoord);
  texColor  = mix(floorTexColor.rgb , waterTexColor.rgb , waterTexColor.a);
 }
}

void main() {
 tex();

 Colour += Spot_blinn_phongModel (Position, normalize (Normal));

 for( int i = 0; i < 3; i++ )
    Colour += point_blinn_phongModel (i,Position, normalize (Normal));
    
  FragColor = vec4(Colour, 1.0);
}
