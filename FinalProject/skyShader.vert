#version 330 core
layout (location = 0) in vec3 aPos;

out vec3 TexCoords;

uniform mat4 projection;
uniform mat4 modelview;

void main()
{
    TexCoords = aPos;
    gl_Position = projection * modelview * vec4(aPos, 1.0);
}  
