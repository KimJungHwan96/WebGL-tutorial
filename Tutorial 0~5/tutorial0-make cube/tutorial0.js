
/*
WebGL 1.0 Tutorial0 - Make Cube using triangles.

(CC-NC-BY) WON WOO LEE 2019

(201420916 이원우 소프트웨어학과)

@author Won Woo Lee

참고사이트: 
@https://www.w3schools.com/html/default.asp
*/

var gl;
var EPSILON = 0.000001;
var arrCount=0; //count of triangles
var flag=0;
var mov_matrix=new Array();

function testGLError(functionLastCalled) {
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}


function identity$3(out) { //idmatrix
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

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl")
		       || canvas.getContext("experimental-webgl");
        gl.viewport(0,0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }

    return true;
}

var shaderProgram;

function initialiseBuffer() {
    // Generate a buffer object

    var vertexData = [

        -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face
        0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face
        -0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face
        -0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face
        0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face

        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face
        0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face
        -0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face
        -0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face
        0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face

        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face
        0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face
        0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,   // Bottom Face
        -0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face
        -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0, // Bottom Face
        0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face

        -0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face
        0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face
        0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,    // Roof Face
        -0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face
        -0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,  // Roof Face
        0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face

        -0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0,   // Left Face
        -0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face
        -0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face
        -0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face
        -0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0, // Left Face
        -0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face

        0.5, -0.5, 0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face
        0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face
        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face

        0.5, -0.5, 0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face
        0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face
        0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face
    ];

    gl.vertexBuffer = gl.createBuffer();

    // Bind buffer as a vertex buffer so we can fill it with data
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    return testGLError("initialiseBuffers");
}

function rotate$3(out, a, rad, axis) { //rotate cube
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.hypot(x, y, z);
    var s, c, t;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;

    if (len < EPSILON) {
        return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;
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
    a23 = a[11]; // Construct the elements of the rotation matrix

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) {
        // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    return out;
}



function initialiseShaders() {


    var fragmentShaderSource = '\
			varying highp vec4 color; \
			void main(void) \
			{ \
				gl_FragColor = color; \
            }';
     gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
     var vertexShaderSource = '\
			attribute highp vec4 myVertex; \
			attribute highp vec4 myColor; \
			uniform mediump mat4 Mmatrix; \
			varying highp vec4 color; \
			void main(void)  \
			{ \
				gl_Position = Mmatrix * myVertex; \
				color = myColor; \
			}';

    // Create the vertex shader object
    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);

    // Load the source code into it
    gl.shaderSource(gl.vertexShader, vertexShaderSource);

    // Compile the source code
    gl.compileShader(gl.vertexShader);

    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        // It didn't. Display the info log as to why
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();

    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");

    // Link the program
    gl.linkProgram(gl.programObject);

    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

function addTri() {   //add triangle code in html

    //순서대로 삼각형이 생성되게 됩니다.
    if(arrCount/3==0){
        var cubeFront1=document.getElementById("cubeFront1");
        cubeFront1.innerHTML="<p>&nbsp;	-0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face</p> <p>&nbsp;	0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face</p> <p>&nbsp;0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0, // Front Face </p><p style='color:red;'>//With a triangle of three dots, webGl makes all shape. </p>";
    }else if(arrCount/3==1){
        var cubeFront2=document.getElementById("cubeFront2");
        cubeFront2.innerHTML="<p>&nbsp;	-0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face</p><p>&nbsp;	-0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face</p><p>&nbsp;	0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 1.0,   // Front Face</p>";
    }else if(arrCount/3==2){
        var cubeBack1=document.getElementById("cubeBack1");
        cubeBack1.innerHTML="<p>&nbsp;-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p><p>&nbsp;0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p><p>&nbsp;0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p>";
    }else if(arrCount/3==3){
        var cubeBack2=document.getElementById("cubeBack2");
        cubeBack2.innerHTML="<p>&nbsp;-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p><p>&nbsp;-0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p><p>&nbsp;0.5, -0.5, -0.5, 0.0, 1.0, 0.0, 1.0,  // Back Face</p>";
    }else if(arrCount/3==4){
        var cubeBottom1=document.getElementById("cubeBottom1");
        cubeBottom1.innerHTML="<p>&nbsp;-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face</p><p>&nbsp;0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face</p><p>&nbsp;0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,   // Bottom Face</p>";
    }else if(arrCount/3==5){
        var cubeBottom2=document.getElementById("cubeBottom2");
        cubeBottom2.innerHTML="<p>&nbsp;-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face</p><p>&nbsp;-0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0, // Bottom Face</p><p>&nbsp;0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,  // Bottom Face</p>";
    }else if(arrCount/3==6){
        var cubeTop1=document.getElementById("cubeTop1");
        cubeTop1.innerHTML="<p>&nbsp;-0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face</p><p>&nbsp;0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face</p><p>&nbsp;0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,    // Roof Face</p>";
    }else if(arrCount/3==7){
        var cubeTop2=document.getElementById("cubeTop2");
        cubeTop2.innerHTML="<p>&nbsp;-0.5, 0.5, 0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face</p><p>&nbsp;-0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,  // Roof Face</p><p>&nbsp;0.5, 0.5, -0.5, 0.0, 1.0, 1.0, 1.0,   // Roof Face</p>";
    }else if(arrCount/3==8){
        var cubeLeft1=document.getElementById("cubeLeft1");
        cubeLeft1.innerHTML="<p>&nbsp;-0.5, 0.5, 0.5, 1.0, 0.0, 1.0, 1.0,   // Left Face</p><p>&nbsp;-0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face</p><p>&nbsp;-0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face</p>";
    }else if(arrCount/3==9){
        var cubeLeft2=document.getElementById("cubeLeft2");
        cubeLeft2.innerHTML="<p>&nbsp;-0.5, -0.5, 0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face</p><p>&nbsp;-0.5, -0.5, -0.5, 1.0, 0.0, 1.0, 1.0, // Left Face</p><p>&nbsp;-0.5, 0.5, -0.5, 1.0, 0.0, 1.0, 1.0,  // Left Face</p>";
    }else if(arrCount/3==10){
        var cubeRight1=document.getElementById("cubeRight1");
        cubeRight1.innerHTML="<p>&nbsp;0.5, -0.5, 0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face</p><p>&nbsp;0.5, -0.5, -0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face</p><p>&nbsp;0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face</p>";
    }else if(arrCount/3==11){
        var cubeRight2=document.getElementById("cubeRight2");
        cubeRight2.innerHTML="<p>&nbsp;0.5, -0.5, 0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face</p><p>&nbsp;0.5, 0.5, -0.5, 1.0, 1.0, 0.0, 1.0,  // Right Face</p><p>&nbsp;0.5, 0.5, 0.5, 1.0, 1.0, 0.0, 1.0,   // Right Face</p>";
    }

    if(arrCount<36){ //삼각형이 총 12개 생성됨으로, 36이상이 되지 않도록 만들어 준다.
        arrCount+=3; //다음 삼각형 html을 추가하기 위하여, +3
    }
    var arrC1=document.getElementById("arrCount1"); //gl.drawArrays값이 변경됨에 따라 기존에 있던 코드는 지워버린다.
    arrC1.innerHTML="";
    var arrC2=document.getElementById("arrCount2");//gl.drawArrays값을 변경해주는 코드.
    arrC2.innerHTML="&nbsp;gl.drawArrays(gl.TRIANGLES, 0,"+ arrCount+");"
}

function delTri() { // 삼각형을 지우는 코드

    if(arrCount/3==1){
        var cubeFront1=document.getElementById("cubeFront1");
        cubeFront1.innerHTML="";
    }else if(arrCount/3==2){
        var cubeFront2=document.getElementById("cubeFront2");
        cubeFront2.innerHTML="";
    }else if(arrCount/3==3){
        var cubeBack1=document.getElementById("cubeBack1");
        cubeBack1.innerHTML="";
    }else if(arrCount/3==4){
        var cubeBack2=document.getElementById("cubeBack2");
        cubeBack2.innerHTML="";
    }else if(arrCount/3==5){
        var cubeBottom1=document.getElementById("cubeBottom1");
        cubeBottom1.innerHTML="";
    }else if(arrCount/3==6){
        var cubeBottom2=document.getElementById("cubeBottom2");
        cubeBottom2.innerHTML="";
    }else if(arrCount/3==7){
        var cubeTop1=document.getElementById("cubeTop1");
        cubeTop1.innerHTML="";
    }else if(arrCount/3==8){
        var cubeTop2=document.getElementById("cubeTop2");
        cubeTop2.innerHTML="";
    }else if(arrCount/3==9){
        var cubeLeft1=document.getElementById("cubeLeft1");
        cubeLeft1.innerHTML="";

    }else if(arrCount/3==10){
        var cubeLeft2=document.getElementById("cubeLeft2");
        cubeLeft2.innerHTML="";
    }else if(arrCount/3==11){
        var cubeRight1=document.getElementById("cubeRight1");
        cubeRight1.innerHTML="";
    }else if(arrCount/3==12){
        var cubeRight2=document.getElementById("cubeRight2");
        cubeRight2.innerHTML="";
    }

    if(arrCount>0){ //마이너스 값이 되지 않도록 해준다.
        arrCount-=3;
    }
    var arrC1=document.getElementById("arrCount1");
    arrC1.innerHTML="";
    var arrC2=document.getElementById("arrCount2");
    arrC2.innerHTML="&nbsp;gl.drawArrays(gl.TRIANGLES, 0,"+ arrCount+");"
}

function doRotate(){ // 로테이트를 해주는 함수, html코드에 로테이트에 관련된 코드를 표시해준다. 실질적으로 js 코드내에서는 rot_value가 변경되어 회전하게 된다.
    rot_value=0.01; //회전을 위한 Angle값 입력
    var rotateCode=document.getElementById("rotate3");
    rotate3.innerHTML="&nbsp;\trotate$3(mov_matrix,mov_matrix,rot_value,rotAxis);<br>";
    var rotateCode=document.getElementById("rotatecode");
    rotateCode.innerHTML="&nbsp;function rotate$3(out, a, rad, axis) {<br>\n" +
        "&nbsp;var x = axis[0],<br>\n" +
        "&nbsp;y = axis[1],<br>\n" +
        "&nbsp;z = axis[2];<br>\n" +
        "&nbsp;var len = Math.hypot(x, y, z);<br>\n" +
        "&nbsp;var s, c, t;<br>\n" +
        "&nbsp;var a00, a01, a02, a03;<br>\n" +
        "&nbsp;var a10, a11, a12, a13;<br>\n" +
        "&nbsp;var a20, a21, a22, a23;<br>\n" +
        "&nbsp;var b00, b01, b02;<br>\n" +
        "&nbsp;var b10, b11, b12;<br>\n" +
        "&nbsp;var b20, b21, b22;<br>\n" +
        "\n" +
        "&nbsp;if (len < EPSILON) {<br>\n" +
        "&nbsp;return null;<br>\n" +
        "&nbsp;}<br>\n" +
        "\n" +
        "&nbsp;len = 1 / len;<br>\n" +
        "&nbsp;x *= len;<br>\n" +
        "&nbsp;y *= len;<br>\n" +
        "&nbsp;z *= len;<br>\n" +
        "&nbsp;s = Math.sin(rad);<br>\n" +
        "&nbsp;c = Math.cos(rad);<br>\n" +
        "&nbsp;t = 1 - c;<br>\n" +
        "&nbsp;a00 = a[0];<br>\n" +
        "&nbsp;a01 = a[1];<br>\n" +
        "&nbsp;a02 = a[2];<br>\n" +
        "&nbsp;a03 = a[3];<br>\n" +
        "&nbsp;a10 = a[4];<br>\n" +
        "&nbsp;a11 = a[5];<br>\n" +
        "&nbsp;a12 = a[6];<br>\n" +
        "&nbsp;a13 = a[7];<br>\n" +
        "&nbsp;a20 = a[8];<br>\n" +
        "&nbsp;a21 = a[9];<br>\n" +
        "&nbsp;a22 = a[10];<br>\n" +
        "&nbsp;a23 = a[11]; // Construct the elements of the rotation matrix<br>\n" +
        "&nbsp;<br>\n" +
        "&nbsp;b00 = x * x * t + c;<br>\n" +
        "&nbsp;b01 = y * x * t + z * s;<br>\n" +
        "&nbsp;b02 = z * x * t - y * s;<br>\n" +
        "&nbsp;b10 = x * y * t - z * s;<br>\n" +
        "&nbsp;b11 = y * y * t + c;<br>\n" +
        "&nbsp;b12 = z * y * t + x * s;<br>\n" +
        "&nbsp;b20 = x * z * t + y * s;<br>\n" +
        "&nbsp;b21 = y * z * t - x * s;<br>\n" +
        "&nbsp;b22 = z * z * t + c; // Perform rotation-specific matrix multiplication<br>\n" +
        "&nbsp;<br>\n" +
        "&nbsp;out[0] = a00 * b00 + a10 * b01 + a20 * b02;<br>\n" +
        "&nbsp;out[1] = a01 * b00 + a11 * b01 + a21 * b02;<br>\n" +
        "&nbsp;out[2] = a02 * b00 + a12 * b01 + a22 * b02;<br>\n" +
        "&nbsp;out[3] = a03 * b00 + a13 * b01 + a23 * b02;<br>\n" +
        "&nbsp;out[4] = a00 * b10 + a10 * b11 + a20 * b12;<br>\n" +
        "&nbsp;out[5] = a01 * b10 + a11 * b11 + a21 * b12;<br>\n" +
        "&nbsp;out[6] = a02 * b10 + a12 * b11 + a22 * b12;<br>\n" +
        "&nbsp;out[7] = a03 * b10 + a13 * b11 + a23 * b12;<br>\n" +
        "&nbsp;out[8] = a00 * b20 + a10 * b21 + a20 * b22;<br>\n" +
        "&nbsp;out[9] = a01 * b20 + a11 * b21 + a21 * b22;<br>\n" +
        "&nbsp;out[10] = a02 * b20 + a12 * b21 + a22 * b22;<br>\n" +
        "&nbsp;out[11] = a03 * b20 + a13 * b21 + a23 * b22;<br>\n" +
        "&nbsp;<br>\n" +
        "&nbsp;if (a !== out) {<br>\n" +
        "&nbsp;// If the source and destination differ, copy the unchanged last row<br>\n" +
        "&nbsp;out[12] = a[12];<br>\n" +
        "&nbsp;out[13] = a[13];<br>\n" +
        "&nbsp;out[14] = a[14];<br>\n" +
        "&nbsp;out[15] = a[15];<br>\n" +
        "&nbsp;}<br>\n" +
        "&nbsp;<br>\n" +
        "&nbsp;return out;<br>\n" +
        "&nbsp;}<br>";
}

function stopRotate() { //회전을 정지한다. rotate 코드도 지워버린다.
    rot_value=0;
    var rotateCode=document.getElementById("rotatecode");
    rotateCode.innerHTML="";
    var rotateCode=document.getElementById("rotate3");
    rotate3.innerHTML="";
}
var rot_value = 0;
identity$3(mov_matrix);
function renderScene() {

    rotAxis = [1,1,0];

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    var Mmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");



    rotate$3(mov_matrix,mov_matrix,rot_value,rotAxis);



    // Pass the identity transformation matrix to the shader using its location
    gl.uniformMatrix4fv(Mmatrix, gl.FALSE, mov_matrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 28, 0);
	gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 28, 12);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }



    gl.drawArrays(gl.TRIANGLES, 0, arrCount);

    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}



function main() {
    var canvas = document.getElementById("helloapicanvas");


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
    requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
		       window.webkitRequestAnimationFrame ||
			   window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}
