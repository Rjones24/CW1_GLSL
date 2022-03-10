# CW1_GLSL
 
Visual Studio 2019 and Operating System windows 10

----------------------------------------------------------
How to use
----------------------------------------------------------

The executable is a prototype to show off my knowledge of GLSL. 

When the executable is run, you are placed in a scene with a statue in the centre.

You use WASD to move around the scene and use the mouse to rotate around the object.

----------------------------------------------------------
How does it work / Fow does the code fit together
----------------------------------------------------------

The code starts off by initiating the models that are being used by the scene. In this case a staue and a plane(square) are the models.

In the initScene() function all of the textures are loaded in and all of the light intensities that the shaders needed to create the light is set.

In the scene there are a total of 4 point lights scattered around the statue and a main directs light(spot light) pointing directly onto it.

In the program there are 2 shaders, each made of a vertex shader and a fragment shader.

The first shader and the most important is the basic_uniform.vert and basic_uniform.frag.  These are used to create the lights using a blinn_phong approach as well as map the textures to the models used in the scene.

![](media/shader.gif)