#version 330 core
// This is a sample fragment shader.

// Inputs to the fragment shader are the outputs of the same name from the vertex shader.
// Note that you do not have access to the vertex shader's default output, gl_Position.
in float sampleExtraOutput;
uniform sampler2D tex; // this is the texture
uniform vec3 viewPos;
uniform int toon;

in vec2 fragTexCoord;
in vec3 fragNormal;
in vec3 fragPos;

// You can output many things. The first vec4 type output determines the color of the fragment
out vec4 color;

vec3 getIntensityScale(float intensity) {
  if (intensity > 0.75)
    return vec3(1.0,1,1);
  else if (intensity > 0.5)
    return vec3(0.7,0.7,0.7);
  else if (intensity > 0.25)
    return vec3(0.35,0.35,0.35);
  else
    return vec3(0.1,0.1,0.1);
}

void main()
{
  vec3 lightDir = normalize(vec3(1.0f, 1.0f, 0.0f));
  vec3 lightColor = vec3(1.0f);
  vec3 viewDir = normalize(viewPos - fragPos);
  float specularStrength = 3;
  int specularEx = 16;
  vec3 objectColor = vec3(0.95f, 0.9f, 0.55f);
  
  vec3 norm = normalize(fragNormal);
  
  // diffuse for directional light
  float lightAtten = 1.0f;
  float diff = max(dot(norm, lightDir), 0.0f);
  // vec3 diffuse = getIntensityScale(diff * lightAtten) * lightColor;
  vec3 diffuse = diff * lightAtten * lightColor;
  
  // specular for directional light
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), specularEx);
  // vec3 specular = getIntensityScale(specularStrength * spec * lightAtten) * lightColor;
  vec3 specular = specularStrength * spec * lightAtten * lightColor;
  
  vec3 ambient = lightColor;
  
  vec3 result = vec3(1.0f);
  if (toon == 0) {
    result = (specular * 0.05 + diffuse * 0.85 + 0.1 * ambient) * objectColor;
    color = vec4(result, 1.0f);
  } else {
    result = (getIntensityScale(specularStrength * spec * lightAtten) * lightColor * 0.05 + getIntensityScale(diff * lightAtten) * lightColor * 0.85 + 0.1 * lightColor) * objectColor;
    color = vec4(result, 1.0f);
    float edge = max(0, dot(viewDir, norm));
    if (edge < 0.12) {
      color = vec4(0.0f, 0.0f, 0.0f, 1.0f);
    }
  }
}
