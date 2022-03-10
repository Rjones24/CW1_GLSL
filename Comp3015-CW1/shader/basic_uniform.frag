#version 460

//input variables
in vec3 Position;
in vec3 Normal;
in vec2 TexCoord;

layout (location = 0) out vec4 FragColor;

//all of the input textures used
layout(binding=0) uniform sampler2D statueTex;
layout(binding=1) uniform sampler2D MossTex;
layout(binding=2) uniform sampler2D floorTex;
layout(binding=3) uniform sampler2D waterTex;

//all of the uniforms needed for a spotlight
uniform struct spotLightInfo {
vec4 Position; // Light position in eye co-ordinates.
vec3 intensity;// Diffuse and specular light intensity
vec3 Direction;// Direction of the spotlight in cam co-ordinates
float Exponent;// Angular attenuation exponent
float Cutoff;// Cutoff angle (between 0 and pi/2)
} Spot[4];

uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
vec3 Kd; // Diffuse reflectivity
vec3 Ks; // Specular reflectivity
float Shininess;// Specular shininess factor
float pick;// used to pick which texture is used
} Material;

//varaibles used for toon shading
const int levels = 4;
const float scaleFactor = 1.0/levels;

vec3 Colour;
vec3 texColor;

//blinnphong approach to spotlights
 vec3 Spot_blinn_phongModel(  vec3 position, vec3 n , int light )
{
     //calculate ambient
    vec3 ambient = Material.Ka * Spot[light].intensity * texColor;

    vec3 s = normalize(vec3(Spot[light].Position) - position);

    float cosAng =  max( dot(-s, normalize(Spot[light].Direction)), 0.0 );
    float angle = acos(cosAng);


    float cutoff = radians( clamp( Spot[light].Cutoff, 0.0, 90.0 ) );
    float SpotScale = 0.0;
    vec3 spec = vec3(0.0);
    vec3 diffuse = vec3(0.0);

    if(angle < Spot[light].Cutoff)
    {
        SpotScale = pow(cosAng, Spot[light].Exponent);

          //calculate dot product between s and n
          float sDotN = max( dot(s,n), 0.0 );

       //calculate diffuse 
       diffuse = Material.Kd * floor(sDotN * levels) * scaleFactor * texColor  ;
  
       //check to see if sDotN is greater then 0 and if it is calculates a speculer light 
 
        if( sDotN > 0.0 )
        {
            vec3 v = normalize(-position.xyz);
            vec3 h = normalize(v + s);
            spec = Material.Ks * pow( max( dot(h,n), 0.0 ), Material.Shininess );
        }
           return ambient + SpotScale * Spot[light].intensity * (diffuse + spec);
    }else{
        return ambient;
    }
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

     for (int i = 0; i <= 3; i++)
    {
        Colour += Spot_blinn_phongModel (Position, normalize (Normal), i);
    }
     FragColor = vec4(Colour, 1.0);
}
