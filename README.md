# CW1_GLSL
 
Visual Studio 2019 and Operating System windows 10

----------------------------------------------------------
How to use
----------------------------------------------------------

the executable is a prototype to show off my knowledge of GLSL 

when the executable is run you are placed in a scene with a statue in the middle of it.

you can use WASD to  move around the scene and the mouse to rotate.

----------------------------------------------------------
 how does it work / how does the code fit together?
----------------------------------------------------------

The code starts off by initiating the models that are being used by the scene in this case a statue and a plane(square)

in the initScene() function all of the textures are loaded in and all of the light intensities that the shaders needed to create the light is set.

in the scene there are a total of 4-point lights scattered around the statue and a main directs light(spot light) pointing onto it.

in the program there are 2 shaders each made of a vertex shader and a fragment shader.

the first shader and the most important is the basic_uniform.vert and basic_uniform.frag as these are used to create the lights using a blinn_phong approach as well as map the textures to the models used in the scene

the second shader is used to create a skybox within the scene to give it a more realistic feel.

![](Comp3015-CW1/media/shader.gif)
