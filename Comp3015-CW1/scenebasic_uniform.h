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
#include "helper/particleutils.h"

using namespace glm;

class SceneBasic_Uniform : public Scene
{
private:

    GLSLProgram prog;
    GLSLProgram norm;
    GLSLProgram skyboxShader;
    GLSLProgram particle;

    float tPrev;

    SkyBox sky;

    Plane plane; //plane surface

    std::unique_ptr<ObjMesh> statue;
    std::unique_ptr<ObjMesh> Chalic;


    vec3 emitterPos, emitterDir;

    GLuint posBuf[2], velBuf[2], age[2];

    GLuint particleArray[2];
    GLuint feedback[2], initVel;
    GLuint drawBuf;

    int nParticles;

    float angle, time, particleLifetime, deltaT;

    void initBuffers();

    void setMatrices(GLSLProgram &);

    void processInputs(GLFWwindow *window);

    void compile();

public:
    SceneBasic_Uniform();

    void initScene();
    void update( float t );
    void render();
    void resize(int, int);
};

#endif // SCENEBASIC_UNIFORM_H
