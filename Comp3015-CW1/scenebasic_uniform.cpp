#include "scenebasic_uniform.h"
#include "helper/texture.h"

#include <iostream>
using std::cerr;
using std::endl;

#include <glm/gtc/matrix_transform.hpp>
using glm::vec3;
using glm::mat4;

#include <sstream>

glm::vec3 cameraPos = glm::vec3(0.0f, 5.0f, 3.0f);
glm::vec3 cameraFront = glm::vec3(0.0f, 0.0f, -1.0f);
glm::vec3 cameraUp = glm::vec3(0.0f, 1.0f, 0.0f);

float deltaTime = 0.0f;	// Time between current frame and last frame
float lastFrame = 0.0f; // Time of last frame

bool firstMouse = true;
double mouseX,  mouseY;
float lastX = 400, lastY = 300, yaw = -90.0f, pitch = 0.0f;

GLFWwindow* window1;

SceneBasic_Uniform::SceneBasic_Uniform() : plane(10.0f, 10.0f, 100, 100),
sky(100.0f)
{
    statue = ObjMesh::load("../Comp3015-CW1/media/statue.obj", true);

}

void SceneBasic_Uniform::initScene()
{
    compile();
    glEnable(GL_DEPTH_TEST);
    window1 = glfwGetCurrentContext();

    //extract the cube texture
    GLuint cubeTex = Texture::loadCubeMap("../Comp3015-CW1/media/texture/cube/skybox/skybox", ".jpg");

    //activate and bindtexture
    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_CUBE_MAP, cubeTex);

    prog.setUniform("lights[0].Position", glm::vec4(0.7f, 0.2f, 2.0f ,1.0f));
    prog.setUniform("lights[1].Position", glm::vec4(2.3f, -3.3f, 4.0f, 1.0f));
    prog.setUniform("lights[2].Position", glm::vec4(-4.0f, 2.0f, 12.0f, 1.0f));
    prog.setUniform("lights[3].Position", glm::vec4(0.0f, 0.0f, 3.0f, 1.0f));

    prog.setUniform("lights[0].L", vec3(1.0f, 0.6f, 0.0f));
    prog.setUniform("lights[1].L", vec3(1.0f, 0.0f, 0.0f));
    prog.setUniform("lights[2].L", vec3(1.0f, 1.0, 0.0));
    prog.setUniform("lights[3].L", vec3(0.2f, 0.2f, 1.0f));

    prog.setUniform("lights[0].La", vec3(1.0f, 0.6f, 0.0f));
    prog.setUniform("lights[1].La", vec3(1.0f, 0.0f, 0.0f));
    prog.setUniform("lights[2].La", vec3(1.0f, 1.0, 0.0));
    prog.setUniform("lights[3].La", vec3(0.2f, 0.2f, 1.0f));

    prog.setUniform("Spot.L", vec3(0.9f));
    prog.setUniform("Spot.La", vec3(0.5f));
    prog.setUniform("Spot.Exponent", 50.0f);
    prog.setUniform("Spot.Cutoff", glm::radians(15.0f));
    prog.setUniform("Spot.position", glm::vec4(0.0f, 10.0f, 0.0f, 1.0f));

    GLuint Exterior = Texture::loadTexture("../Comp3015-CW1/media/texture/Statue_diff.jpg");
    GLuint moss = Texture::loadTexture("../Comp3015-CW1/media/texture/moss.png");
    GLuint moss2 = Texture::loadTexture("../Comp3015-CW1/media/texture/hardwood2_roughness.jpg");
    GLuint moss3 = Texture::loadTexture("../Comp3015-CW1/media/texture/bluewater.png");

    projection = mat4(1.0f);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, Exterior);
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, moss);
    glActiveTexture(GL_TEXTURE2);
    glBindTexture(GL_TEXTURE_2D, moss2);
    glActiveTexture(GL_TEXTURE3);
    glBindTexture(GL_TEXTURE_2D, moss3);
}

void SceneBasic_Uniform::compile()
{
	try {
		prog.compileShader("shader/basic_uniform.vert");
		prog.compileShader("shader/basic_uniform.frag");
		prog.link();
		prog.use();

        skyboxShader.compileShader("shader/Skybox.vert");
        skyboxShader.compileShader("shader/Skybox.frag");
        skyboxShader.link();
        prog.use();

	} catch (GLSLProgramException &e) {
		cerr << e.what() << endl;
		exit(EXIT_FAILURE);
	}
}

void SceneBasic_Uniform::update( float t )
{
    
    const float radius = 10.0f;
    float camX = sin(glfwGetTime()) * radius;
    float camZ = cos(glfwGetTime()) * radius;

    view = lookAt(cameraPos, cameraPos + cameraFront, cameraUp);

    glfwGetCursorPos(window1 ,&mouseX, &mouseY);
    mouse_callback(window1, mouseX, mouseY);
    processInputs(window1);
    glfwSetInputMode(window1, GLFW_CURSOR, GLFW_CURSOR_DISABLED);

    float currentFrame = glfwGetTime();
    deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;
}

void SceneBasic_Uniform::mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
    if (firstMouse)
    {
        lastX = xpos;
        lastY = ypos;
        firstMouse = false;
    }

    float xoffset = xpos - lastX;
    float yoffset = lastY - ypos;
    lastX = xpos;
    lastY = ypos;

    float sensitivity = 0.1f;
    xoffset *= sensitivity;
    yoffset *= sensitivity;

    yaw += xoffset;
    pitch += yoffset;

    if (pitch > 89.0f)
        pitch = 89.0f;
    if (pitch < -89.0f)
        pitch = -89.0f;

    glm::vec3 direction;
    direction.x = cos(glm::radians(yaw)) * cos(glm::radians(pitch));
    direction.y = sin(glm::radians(pitch));
    direction.z = sin(glm::radians(yaw)) * cos(glm::radians(pitch));
    cameraFront = glm::normalize(direction);
}

void  SceneBasic_Uniform::processInputs(GLFWwindow* window)
{
    float cameraSpeed = 2.5f * deltaTime; 
    if (glfwGetKey(window,GLFW_KEY_W) == GLFW_PRESS)
        cameraPos += cameraSpeed * cameraFront;
    if (glfwGetKey(window, GLFW_KEY_S) == GLFW_PRESS)
        cameraPos -= cameraSpeed * cameraFront;
    if (glfwGetKey(window, GLFW_KEY_A) == GLFW_PRESS)
        cameraPos -= glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
    if (glfwGetKey(window, GLFW_KEY_D) == GLFW_PRESS)
        cameraPos += glm::normalize(glm::cross(cameraFront, cameraUp)) * cameraSpeed;
}

void SceneBasic_Uniform::render()
{
    glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

 
    skyboxShader.use();
    model = mat4(1.0f);
    mat4 mv = view * model;
    skyboxShader.setUniform("ModelViewMatrix", mv);
    skyboxShader.setUniform("MVP", projection * mv);
    sky.render();

    prog.use();
    prog.setUniform("Material.Kd", 0.4f, 0.4f, 0.4f);
    prog.setUniform("Material.Ks", 0.1f, 0.1f, 0.1f);
    prog.setUniform("Material.Ka", 0.1f, 0.1f, 0.1f);
    prog.setUniform("Material.Shininess", 180.0f);
    prog.setUniform("Material.pick", 0.0f);

    model = mat4(1.0f);
    model = glm::rotate(model, glm::radians(-90.0f), vec3(1.0f, 0.0f, 0.0f));
    model = glm::scale(model , vec3(0.1f, 0.1f, 0.1f));
    model = glm::translate(model, vec3(0.0f, 0.0f, 40.0f));

    setMatrices();

    statue->render();

    prog.setUniform("Material.Kd", 0.1f, 0.1f, 0.1f);
    prog.setUniform("Material.Ks", 0.9f, 0.9f, 0.9f);
    prog.setUniform("Material.Ka", 0.1f, 0.1f, 0.1f);
    prog.setUniform("Material.Shininess", 180.0f);
    prog.setUniform("Material.pick", 1.0f);

    model = mat4(1.0f);
    model = glm::translate(model, vec3(0.0f, 0.5f, 0.0f));
    model = glm::scale(model, vec3(2.0f, 2.0f, 2.0f));

    setMatrices();

    plane.render();
}


void SceneBasic_Uniform::resize(int w, int h)
{
    glViewport(0, 0, w, h);
    width = w;
    height = h;
    projection = glm::perspective(glm::radians(70.0f), (float)w / h, 0.3f, 100.0f);
}

void  SceneBasic_Uniform::setMatrices() {

    mat4 mv = view * model;

    prog.setUniform("ModelViewMatrix", mv);

    prog.setUniform("NormalMatrix", glm::mat3(vec3(mv[0]), vec3(mv[1]), vec3(mv[2])));

    prog.setUniform("MVP", projection * mv);
}