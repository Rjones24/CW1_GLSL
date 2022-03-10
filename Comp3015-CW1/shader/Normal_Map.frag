#version 460

in vec3 LightDir;
in vec2 TexCoord;
in vec3 ViewDir;

layout (location = 0) out vec4 FragColor;
layout(binding=4) uniform sampler2D ColorTex;
layout(binding=5) uniform sampler2D NormalMapTex;

uniform struct LightInfo {
vec4 Position; // Light position in eye coords.
vec3 La; // Ambient light intensity
vec3 L; // Diffuse and specular light intensity
} Light;


uniform struct MaterialInfo {
vec3 Ka; // Ambient reflectivity
vec3 Kd; // Diffuse reflectivity
vec3 Ks; // Specular reflectivity
float Shininess; // Specular shininess factor
} Material;

vec3 phongModel( vec3 position, vec3 n )
{
    vec4 brickTexColor = texture(ColorTex , TexCoord);
    vec3 col =  brickTexColor.rgb;

    //calculate ambient here, to access each light La value use this: lights[light].La
    vec3 ambient = Light.La * col;

    //calculate diffuse here
     vec3 s = normalize(vec3(Light.Position) - position);
     float sDotN = max( dot(s,n), 0.0 );

    vec3 diffuse = Material.Kd * col * sDotN;
    //calculate specular here

    vec3 spec = vec3(0.0);
    if( sDotN > 0.0 )
    {
        vec3 v = normalize(-position.xyz);
        vec3 h = normalize(v + s);

        spec = Material.Ks * pow( max( dot(h,n), 0.0 ), Material.Shininess );
    }
    return ambient + Light.L * (diffuse + spec);
}

void main() {
    vec3 norm = texture(NormalMapTex, TexCoord).xyz;
    norm.xy = 2.0 * norm.xy - 1.0;
    FragColor = vec4(phongModel ((LightDir * ViewDir), normalize (norm)),1.0);
}
