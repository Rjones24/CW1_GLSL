#ifndef SCENEBASIC_UNIFORM_H
#define SCENEBASIC_UNIFORM_H

#include "helper/scene.h"

#include <glad/glad.h>
#include "helper/glslprogram.h"
#include "helper/plane.h"
#include "helper/objmesh.h"
#include "helper/skybox.h"
#include "helper/cube.h"

#include <GLFW/glfw3.h>

#include <glm/glm.hpp>

#include <glm/gtc/matrix_transform.hpp>

class SceneBasic_Uniform : public Scene
{
private:

    GLSLProgram prog;
    GLSLProgram skyboxShader;

    SkyBox sky;

    Plane plane; //plane surface
    std::unique_ptr<ObjMesh> statue; //pig mesh

    void setMatrices();

    void processInputs(GLFWwindow *window);

    void mouse_callback(GLFWwindow* window, double xpos, double ypos);

    void compile();

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
};

#endif // SCENEBASIC_UNIFORM_H
