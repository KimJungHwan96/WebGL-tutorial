/*
WebGL 1.0 Tutorial4 - Phong Shading
CC-NC-BY SeongHeon Kim (201421109)

@author SeongHeon Kim
@date 2019-06-22

@WebGL applet by Prof. Thorsten Thormahlen. Modified by SeongHeon Kim for educational purpose
@http://www.mathematik.uni-marburg.de/~thormae/lectures/graphics1/code/WebGLShaderLightMat/ShaderLightMat.html
*/

// GLM library

/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.0.0

Copyright (c) 2015-2019, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
   * Generates a perspective projection matrix with the given bounds.
   * Passing null/undefined/no value for far will generate infinite projection matrix.
   *
   * @param {mat4} out mat4 frustum matrix will be written into
   * @param {number} fovy Vertical field of view in radians
   * @param {number} aspect Aspect ratio. typically viewport width/height
   * @param {number} near Near bound of the frustum
   * @param {number} far Far bound of the frustum, can be null or Infinity
   * @returns {mat4} out
   */

function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf;
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;

    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }

    return out;
}

/**
   * Set a mat4 to the identity matrix
   *
   * @param {mat4} out the receiving matrix
   * @returns {mat4} out
   */

function identity$3(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

/**
   * Multiplies two mat4s
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the first operand
   * @param {mat4} b the second operand
   * @returns {mat4} out
   */

function multiply$3(out, a, b) {
    var a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
    var a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
    var a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
    var a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15]; // Cache only the current line of the second matrix

    var b0 = b[0],
        b1 = b[1],
        b2 = b[2],
        b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
}

/**
   * Translate a mat4 by the given vector
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to translate
   * @param {vec3} v vector to translate by
   * @returns {mat4} out
   */

function translate$2(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;

    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
      a00 = a[0];
      a01 = a[1];
      a02 = a[2];
      a03 = a[3];
      a10 = a[4];
      a11 = a[5];
      a12 = a[6];
      a13 = a[7];
      a20 = a[8];
      a21 = a[9];
      a22 = a[10];
      a23 = a[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a[12];
      out[13] = a01 * x + a11 * y + a21 * z + a[13];
      out[14] = a02 * x + a12 * y + a22 * z + a[14];
      out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
}

/**
   * Rotates a matrix by the given angle around the X axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

function rotateX(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[0] = a[0];
      out[1] = a[1];
      out[2] = a[2];
      out[3] = a[3];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
}

/**
   * Rotates a matrix by the given angle around the Y axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

function rotateY(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a20 = a[8];
    var a21 = a[9];
    var a22 = a[10];
    var a23 = a[11];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged rows
      out[4] = a[4];
      out[5] = a[5];
      out[6] = a[6];
      out[7] = a[7];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
}

/**
   * Rotates a matrix by the given angle around the Z axis
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to rotate
   * @param {Number} rad the angle to rotate the matrix by
   * @returns {mat4} out
   */

function rotateZ(out, a, rad) {
    var s = Math.sin(rad);
    var c = Math.cos(rad);
    var a00 = a[0];
    var a01 = a[1];
    var a02 = a[2];
    var a03 = a[3];
    var a10 = a[4];
    var a11 = a[5];
    var a12 = a[6];
    var a13 = a[7];

    if (a !== out) {
      // If the source and destination differ, copy the unchanged last row
      out[8] = a[8];
      out[9] = a[9];
      out[10] = a[10];
      out[11] = a[11];
      out[12] = a[12];
      out[13] = a[13];
      out[14] = a[14];
      out[15] = a[15];
    } // Perform axis-specific matrix multiplication


    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
}

/**
   * Scales the mat4 by the dimensions in the given vec3 not using vectorization
   *
   * @param {mat4} out the receiving matrix
   * @param {mat4} a the matrix to scale
   * @param {vec3} v the vec3 to scale the matrix by
   * @returns {mat4} out
   **/

function scale$3(out, a, v) {
    var x = v[0],
        y = v[1],
        z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
}

/**
   * Normalize a vec3
   *
   * @param {vec3} out the receiving vector
   * @param {vec3} a vector to normalize
   * @returns {vec3} out
   */

function normalize(out, a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var len = x * x + y * y + z * z;

    if (len > 0) {
      //TODO: evaluate use of glm_invsqrt here?
      len = 1 / Math.sqrt(len);
    }

    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
    return out;
}

// Start of project code

// global variable
var gl;

// mode, Ka, Kd, Ks using HTML code and fragment shader code to change mode and coefficient of reflection
// This 4 variables range from 0 to 1 and initial number was 1
// modeVal is int and others are float
var modeVal = 1;
var KaVal = 1.0;
var KdVal = 1.0;
var KsVal = 1.0;

// rotValue and incRotValue are used for rotating cube
// Small is used for rotating small cube
// 2 small cubes are start to rotate when program initialize
// big cube is rotate when user click button in HTML code
var rotValue = 0.0; 
var rotValueSmall = 0.0; 
var incRotValue = 0.0;
var incRotValueSmall = 0.02;
var tempRotValue = 0.0; 

// Projection Matrix
// Fov angle was 30 and it must be changed as radian
// aspect ratio, near, far was set 1.0, 1 and 15.0
var proj_matrix = [];
var FOVangle = 30;
proj_matrix = perspective(proj_matrix, FOVangle*Math.PI/180, 1.0, 1, 15.0);

// Model Matrix
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

// View Matrix
// view_matrix[14]- 5 for zoom camera
var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
view_matrix[14] = view_matrix[14]-5;

// Normal Matrix
var normal_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

/**
   * check err of last functioncall 
   *
   * @param functionLastCalled
   **/

function testGLError(functionLastCalled) {

    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

/**
   * initialize canas for gl program using canva.width, canvas.height
   *
   * @param canvas
   **/

function initialiseGL(canvas) {
    try {
 // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}

/**
   * initialize and bind vertex Data 
   *
   **/

function initialiseBuffer() {
    
    // vertexData for cube 

    var vertexData = [
    // x,y,z    color(r,g,b,a)    texture(u,v)    normal(x,y,z)
    // using counter-clock-wise front face check
    // front
    -0.5, -0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    0.0, 0.0,    0.0,  0.0,  1.0, //7
     0.5, -0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    1.0, 0.0,    0.0,  0.0,  1.0, //5
     0.5,  0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    1.0, 1.0,    0.0,  0.0,  1.0, //1
         
    -0.5, -0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    0.0, 0.0,    0.0,  0.0,  1.0, //7
     0.5,  0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    1.0, 1.0,    0.0,  0.0,  1.0, //1
    -0.5,  0.5,  0.5,    1.0, 0.0, 1.0, 0.5,    0.0, 1.0,    0.0,  0.0,  1.0, //3

    // back
     0.5,  0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    1.0, 1.0,    0.0,  0.0, -1.0, //2
     0.5, -0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    1.0, 0.0,    0.0,  0.0, -1.0, //6
    -0.5, -0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    0.0, 0.0,    0.0,  0.0, -1.0, //8
    
    -0.5,  0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    0.0, 1.0,    0.0,  0.0, -1.0, //4
     0.5,  0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    1.0, 1.0,    0.0,  0.0, -1.0, //2
    -0.5, -0.5, -0.5,    0.0, 0.0, 0.0, 0.5,    0.0, 0.0,    0.0,  0.0, -1.0, //8

    // up
    -0.5,  0.5,  0.5,    1.0, 1.0, 1.0, 0.5,    0.0, 1.0,    0.0,  1.0,  0.0, //3 
     0.5,  0.5,  0.5,    1.0, 1.0, 1.0, 0.5,    1.0, 1.0,    0.0,  1.0,  0.0, //1
     0.5,  0.5, -0.5,    1.0, 1.0, 1.0, 0.5,    1.0, 1.0,    0.0,  1.0,  0.0, //2
        
    -0.5,  0.5,  0.5,    1.0, 1.0, 1.0, 0.5,    0.0, 1.0,    0.0,  1.0,  0.0, //3
     0.5,  0.5, -0.5,    1.0, 1.0, 1.0, 0.5,    1.0, 1.0,    0.0,  1.0,  0.0, //2
    -0.5,  0.5, -0.5,    1.0, 1.0, 1.0, 0.5,    0.0, 1.0,    0.0,  1.0,  0.0, //4

    // down
     0.5, -0.5, -0.5,    0.0, 1.0, 0.0, 0.5,    1.0, 0.0,    0.0, -1.0,  0.0, //6
     0.5, -0.5,  0.5,    0.0, 1.0, 0.0, 0.5,    1.0, 0.0,    0.0, -1.0,  0.0, //5
    -0.5, -0.5,  0.5,    0.0, 1.0, 0.0, 0.5,    0.0, 0.0,    0.0, -1.0,  0.0, //7
    
    -0.5, -0.5, -0.5,    0.0, 1.0, 0.0, 0.5,    0.0, 0.0,    0.0, -1.0,  0.0, //8
     0.5, -0.5, -0.5,    0.0, 1.0, 0.0, 0.5,    1.0, 0.0,    0.0, -1.0,  0.0, //6
    -0.5, -0.5,  0.5,    0.0, 1.0, 0.0, 0.5,    0.0, 0.0,    0.0, -1.0,  0.0, //7

    // right
     0.5, -0.5,  0.5,    1.0, 0.5, 0.0, 0.5,    0.0, 1.0,    1.0,  0.0,  0.0, //5
     0.5, -0.5, -0.5,    1.0, 0.5, 0.0, 0.5,    0.0, 1.0,    1.0,  0.0,  0.0, //6
     0.5,  0.5, -0.5,    1.0, 0.5, 0.0, 0.5,    1.0, 1.0,    1.0,  0.0,  0.0, //2

     0.5, -0.5,  0.5,    1.0, 0.5, 0.0, 0.5,    0.0, 1.0,    1.0,  0.0,  0.0, //5
     0.5,  0.5, -0.5,    1.0, 0.5, 0.0, 0.5,    1.0, 1.0,    1.0,  0.0,  0.0, //2
     0.5,  0.5,  0.5,    1.0, 0.5, 0.0, 0.5,    1.0, 1.0,    1.0,  0.0,  0.0, //1

    //left
    -0.5,  0.5, -0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 1.0,   -1.0,  0.0,  0.0, //4
    -0.5, -0.5, -0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 0.0,   -1.0,  0.0,  0.0, //8
    -0.5, -0.5,  0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 0.0,   -1.0,  0.0,  0.0, //7
    
    -0.5,  0.5,  0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 1.0,   -1.0,  0.0,  0.0, //3
    -0.5,  0.5, -0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 1.0,   -1.0,  0.0,  0.0, //4
    -0.5, -0.5,  0.5,    1.0, 0.0, 0.0, 0.5,    0.0, 0.0,   -1.0,  0.0,  0.0, //7
    ];
  
    // Generate a buffer object
    gl.vertexBuffer = gl.createBuffer();

    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return testGLError("initialiseBuffers");
}


function initialiseShaders() {

    /**
       * fragment shader source code
       *
       * varying comes form vertex shader
       * normalInterp was Surfce normal vector
       * vertPos was a Vertex Position
       *
       * uniform was set as global variable and it will be changed by HTML 
       *
       * const vec3 for light position, ambientColor, diffuseColor, specularColor
       *
       * normal vector was normalize to use
       * lightDir was Light direction from obj
       * reflectDir was reflected light vector
       * viewDir was vector to viewer
       *
       * Phong shading use labercian suface which is perfectly diffuse reflector
       * So we use Labert's cosine Law to calculate specular
       *
       * Phong Shading = Ambient + Diffuse + Specular 
       * Ka, Kd, Ks was coefficient for tutorial study
       * 
       **/
    var fragmentShaderSource = '\
    precision mediump float;\
    \
    varying vec4 color;\
    void main() {\
      gl_FragColor = color;\
    }';

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    /**
       * vertes shader source code
       *
       * phong shading calculate light and color in fragment shader
       * So vertex shader only have goal that calculate position of vertex 
       * and assign value for varying using attribute
       * 
       **/
    var vertexShaderSource = '\
    attribute highp vec3 myVertex;\
    attribute highp vec3 myNormal;\
    uniform mediump mat4 Pmatrix; \
    uniform mediump mat4 Vmatrix; \
    uniform mediump mat4 Mmatrix;\
    uniform mediump mat4 Nmatrix; \
    \
    varying mediump vec3 normalInterp;\
    varying vec3 vertPos;\
    uniform int mode;\
    \
    uniform float Ka;\
    uniform float Kd;\
    uniform float Ks;\
    \
    uniform float shininessVal;\
    \
    const vec3 lightPos = vec3(5.0,1.0,1.0);\
    const vec3 ambientColor = vec3(0.3, 0.0, 0.0);\
    const vec3 diffuseColor = vec3(0.7, 0.0, 0.0);\
    const vec3 specColor = vec3(1.0, 1.0, 1.0);\
    varying mediump vec4 color; \
    \
    void main() {\
        vec4 vertPos4 = Vmatrix*vec4(myVertex, 1.0);\
        vertPos = vec3(vertPos4) / vertPos4.w;\
        normalInterp = vec3(Mmatrix * vec4(myNormal, 0.0));\
        gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
        \
        vec3 normal = normalize(normalInterp);\
        vec3 lightDir = normalize(lightPos - vertPos);\
        float lambertian = max(dot(normal, lightDir), 0.0);\
        float specular = 0.0;\
        vec3 reflectDir = reflect(-lightDir, normal);\
        vec3 viewDir = normalize(-vertPos);\
        \
        if(lambertian > 0.0) {\
            float specAngle = max(dot(reflectDir, viewDir), 0.0);\
            specular = pow(specAngle, 4.0);\
        }\
        color = vec4(Ka * ambientColor + Kd * lambertian * diffuseColor + Ks * specular * specColor, 1.0);\
        \
        if(mode == 2) color = vec4(Ka*ambientColor, 1.0);\
        \
        if(mode == 3) color = vec4(Kd*lambertian*diffuseColor, 1.0);\
        \
        if(mode == 4) color = vec4(Ks*specular*specColor, 1.0);\
        \
        if(mode == 5) color = vec4(Ka * normal * 0.1 + Kd * lambertian * normal + Ks * specular * specColor, 1.0);\
      }';


    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    // Bind the custom vertex attribute
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    gl.bindAttribLocation(gl.programObject, 3, "myNormal"); //추가됨

    // Link the program
    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

/**
   * stop Rotating
   *
   **/

function stopRotate()
{
  if (incRotValue == 0.0)
  {
    incRotValue = tempRotValue; 
  }
  else
  {
    tempRotValue = incRotValue; 
    incRotValue = 0.0; 
  }
}

/**
   * start Rotating
   *
   **/

function animRotate()
{
  incRotValue += 0.01;
}

/**
   * rendering Scene
   *
   **/

function renderScene() {

  rotValue += incRotValue; 
  rotValueSmall += incRotValueSmall;

  // initilize location of uniform
  var Pmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
  var Vmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
  var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");
  var Nmatrix = gl.getUniformLocation(gl.programObject, "Nmatrix"); 
  var modeLoc = gl.getUniformLocation(gl.programObject, "mode");
  var KaLoc = gl.getUniformLocation(gl.programObject, "Ka");
  var KdLoc = gl.getUniformLocation(gl.programObject, "Kd");
  var KsLoc = gl.getUniformLocation(gl.programObject, "Ks");
  
  // set uniform
  if(modeLoc != -1) gl.uniform1i(modeLoc, modeVal);
  if(KaLoc != -1) gl.uniform1f(KaLoc, KaVal);
  if(KdLoc != -1) gl.uniform1f(KdLoc, KdVal);
  if(KsLoc != -1) gl.uniform1f(KsLoc, KsVal);
  
  // set vertex Object which bind in initialiseBuffer()
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 48, 0); // x, y, z
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 48, 12); // a, g, b, a
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 48, 28); // u, v
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 3, gl.FLOAT, gl.FALSE, 48, 36); // x, y, z (normal vector)

  if (!testGLError("gl.vertexAttribPointer")) {
      return false;
  }

  // per-fragment operation : depth test, culling, blending 
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); 
  // gl.enable(gl.CULL_FACE);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.blendEquation(gl.FUNC_ADD);

  // set background color
  gl.clearColor(0.6, 0.8, 1.0, 1.0);
  gl.clearDepth(1.0); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // first cube
  // set Model Matrix for trnalsation
  identity$3(mov_matrix);
  
  // copy original Model Matrix (identity)
  var mov_matrix_ori = mov_matrix.slice();
  
  rotateY(mov_matrix, mov_matrix, rotValue); 
  rotateX(mov_matrix, mov_matrix, rotValue); 

  // set M, V, P Matrix
  gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
  gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
  gl.uniformMatrix4fv(Mmatrix, false, mov_matrix);
  gl.uniformMatrix4fv(Nmatrix, false, normal_matrix);

  if (!testGLError("gl.uniformMatrix4fv")) {
      return false;
  }
  
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  
  // second cube
  var mov_matrix2 = mov_matrix.slice(); 
  translate$2(mov_matrix2, mov_matrix2, [0.75, 0.75, 0.75]);
  rotateY(mov_matrix2, mov_matrix2, rotValueSmall); 
  scale$3(mov_matrix2, mov_matrix2,[0.25, 0.25, 0.25]);
  gl.uniformMatrix4fv(Mmatrix, false, mov_matrix2);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  // third cube
  var mov_matrix3 = mov_matrix2.slice(); 
  translate$2(mov_matrix3, mov_matrix3, [0.75, -0.75, 0.75]);
  rotateY(mov_matrix3, mov_matrix3, rotValueSmall); 
  scale$3(mov_matrix3, mov_matrix3,[0.25, 0.25, 0.25]);
  gl.uniformMatrix4fv(Mmatrix, false, mov_matrix3);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  
  if (!testGLError("gl.drawArrays")) {
      return false;
  }

  return true;
}

/**
   * main function
   * using render loop draw scean
   **/

function main() {
    var canvas = document.getElementById("helloapicanvas");
    console.log("Start");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    // Render loop
    requestAnimFrame = (
    function () {
        //  return window.requestAnimationFrame || window.webkitRequestAnimationFrame 
       // || window.mozRequestAnimationFrame || 
      return function (callback) {
          // console.log("Callback is"+callback); 
          window.setTimeout(callback, 10, 10); };
    })();

    (function renderLoop(param) {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
