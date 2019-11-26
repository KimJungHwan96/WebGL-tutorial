/*
WebGL 1.0 Tutorial2 - Blending Cube

(CC-NC-BY) Choi Ji Won 2019 


@author Choi Ji Won

참고사이트: 
*/

var gl;

function testGLError(functionLastCalled) {
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }

    return true;
}

function initialiseGL(canvas) {
    try {
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

var shaderProgram;

function initialiseBuffer() {
    var vertexData = [
        -0.5, 0.5, 0.5,     1.0, 1.0, 1.0, 0.5,     0.0, 1.0,//3
        0.5, 0.5, 0.5,      1.0, 1.0, 1.0, 0.5,     1.0, 1.0,//1
        0.5, 0.5, -0.5,     1.0, 1.0, 1.0, 0.5,     1.0, 1.0,//2
                
        -0.5, 0.5, 0.5,     1.0, 1.0, 1.0, 0.5,     0.0, 1.0,//3
        0.5, 0.5, -0.5,     1.0, 1.0, 1.0, 0.5,     1.0, 1.0,//2
        -0.5, 0.5, -0.5,    1.0, 1.0, 1.0, 0.5,     0.0, 1.0,//4
         
        0.5, 0.5, -0.5,     0.0, 0.0, 0.0, 0.5,     1.0, 1.0,//2
        0.5, -0.5, -0.5,    0.0, 0.0, 0.0, 0.5,     1.0, 0.0,//6
        -0.5,-0.5,-0.5,     0.0, 0.0, 0.0, 0.5,     0.0, 0.0,//8
           
        -0.5, 0.5, -0.5,    0.0, 0.0, 0.0, 0.5,     0.0, 1.0,//4
        0.5, 0.5, -0.5,     0.0, 0.0, 0.0, 0.5,     1.0, 1.0,//2
        -0.5,-0.5,-0.5,     0.0, 0.0, 0.0, 0.5,     0.0, 0.0,//8
            
        0.5, -0.5, 0.5,     1.0, 0.5, 0.0, 0.5,     0.0, 1.0,//5
        0.5, -0.5, -0.5,    1.0, 0.5, 0.0, 0.5,     0.0, 1.0,//6
        0.5, 0.5, -0.5,     1.0, 0.5, 0.0, 0.5,     1.0, 1.0,//2

        0.5, -0.5, 0.5,     1.0, 0.5, 0.0, 0.5,     0.0, 1.0,//5
        0.5, 0.5, -0.5,     1.0, 0.5, 0.0, 0.5,     1.0, 1.0,//2
        0.5, 0.5, 0.5,      1.0, 0.5, 0.0, 0.5,     1.0, 1.0,//1
                 
        -0.5, 0.5, -0.5,    1.0, 0.0, 0.0, 0.5,     0.0, 1.0,//4
        -0.5,-0.5, -0.5,    1.0, 0.0, 0.0, 0.5,     0.0, 0.0,//8
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0, 0.5,     0.0, 0.0,//7
        
        -0.5, 0.5, 0.5,     1.0, 0.0, 0.0, 0.5,     0.0, 1.0,//3
        -0.5, 0.5, -0.5,    1.0, 0.0, 0.0, 0.5,     0.0, 1.0,//4
        -0.5, -0.5, 0.5,    1.0, 0.0, 0.0, 0.5,     0.0, 0.0,//7
        
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0, 0.5,     0.0, 0.0,//7
        0.5, -0.5, 0.5,     0.0, 0.0, 1.0, 0.5,     1.0, 0.0,//5
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0, 0.5,     1.0, 1.0,//1
                 
        -0.5, -0.5, 0.5,    0.0, 0.0, 1.0, 0.5,     0.0, 0.0,//7
        0.5, 0.5, 0.5,      0.0, 0.0, 1.0, 0.5,     1.0, 1.0,//1
        -0.5, 0.5, 0.5,     0.0, 0.0, 1.0, 0.5,     0.0, 1.0,//3
        
         0.5, -0.5, -0.5,   0.0, 1.0, 0.0, 0.5,     1.0, 0.0,//6
         0.5, -0.5, 0.5,    0.0, 1.0, 0.0, 0.5,     1.0, 0.0,//5
        -0.5, -0.5, 0.5,    0.0, 1.0, 0.0, 0.5,     0.0, 0.0,//7
        
        -0.5,-0.5, -0.5,    0.0, 1.0, 0.0, 0.5,     0.0, 0.0,//8
         0.5, -0.5, -0.5,   0.0, 1.0, 0.0, 0.5,     1.0, 0.0,//6
        -0.5, -0.5, 0.5,    0.0, 1.0, 0.0, 0.5,     0.0, 0.0,//7
    ];

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    return testGLError("initialiseBuffers");
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

    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    var vertexShaderSource = '\
			attribute highp vec3 myVertex; \
            attribute highp vec4 myColor; \
            attribute highp vec2 myUV; \
            uniform mediump mat4 Pmatrix; \
            uniform mediump mat4 Vmatrix; \
            uniform mediump mat4 Mmatrix; \
            varying mediump vec4 color; \
            varying mediump vec2 texCoord;\
            void main(void)  \
            { \
                gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(myVertex, 1.0);\
                color = 1.0 * myColor;\
                texCoord = myUV; \
            }';

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);

    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    gl.programObject = gl.createProgram();

    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);

    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");

    gl.linkProgram(gl.programObject);

    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

/**
 * identity matrix function by gl-matrix.js
 *
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

var EPSILON = 0.000001;

/**
 * rotate matrix function by gl-matrix.js
 *
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation$3(out, rad, axis) {
    var x = axis[0],
        y = axis[1],
        z = axis[2];
    var len = Math.hypot(x, y, z);
    var s, c, t;

    if (len < EPSILON) {
      return null;
    }

    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c; // Perform rotation-specific matrix multiplication

    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
}

var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
var mov_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

rotValue = 0.0; 
animRotValue = 0.0;

/*
 * button onclick callback function
 */
function animRotate() {
    animRotValue = 0.03;
}

function animPause() {
    animRotValue = 0.0;
}

function renderScene() {

    gl.clearColor(0.6, 0.8, 1.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var locPmatrix = gl.getUniformLocation(gl.programObject, "Pmatrix");
    var locVmatrix = gl.getUniformLocation(gl.programObject, "Vmatrix");
    var locMmatrix = gl.getUniformLocation(gl.programObject, "Mmatrix");

    rotAxis = [1,1,0];
    identity$3(mov_matrix);
    fromRotation$3(mov_matrix, rotValue, rotAxis);
    rotValue += animRotValue;

    gl.uniformMatrix4fv(locPmatrix, false, view_matrix);
    gl.uniformMatrix4fv(locVmatrix, false, view_matrix);
    gl.uniformMatrix4fv(locMmatrix, false, mov_matrix);

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

    //select 에서 값 불러오는 부분
    var se = document.getElementById("sel_equ");
    var sel_equ = se.options[se.selectedIndex].value;

    var ss = document.getElementById("sel_src");
    var sel_src = ss.options[ss.selectedIndex].value;

    var sd = document.getElementById("sel_dst");
    var sel_dst = sd.options[sd.selectedIndex].value;

    //파라미터 값 저장해놓는 변수
    var mode, sfactor, dfactor;

    //gl.blendEquation 선택하는 부분 - 각 파라미터 별 설명 변경 및 파라미터 값 저장
    switch(sel_equ) {
        case "FUNC_ADD":
            document.getElementById("txt_equ").innerHTML = "source + destination";
            mode = gl.FUNC_ADD;
            break;
        case "FUNC_SUBTRACT":
            document.getElementById("txt_equ").innerHTML = "source - destination";
            mode = gl.FUNC_SUBTRACT;
            break;
        case "FUNC_REVERSE_SUBTRACT":
            document.getElementById("txt_equ").innerHTML = "destination - source";
            mode = gl.FUNC_REVERSE_SUBTRACT;
            break;
    }

    //gl.blendFunc(sfactor, dfactor) 중에서 sfactor 선택하는 부분 - 각 파라미터 별 설명 변경 및 파라미터 값 저장
    //CONSTANT_COLOR와 CONSTANT_ALPHA를 sfactor와 dfactor 동시에 쓰이면 gl.INVALID_ENUM error exception때문에
    //해당 파라미터 선택 시 disabled 처리
    switch(sel_src) {
        case "ZERO":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 0.";
            sfactor = gl.ZERO;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "ONE":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1.";
            sfactor = gl.ONE;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "SRC_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by the source colors.";
            sfactor = gl.SRC_COLOR;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "ONE_MINUS_SRC_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus each source color.";
            sfactor = gl.ONE_MINUS_SRC_COLOR;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "DST_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by the destination color.";
            sfactor = gl.DST_COLOR;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "ONE_MINUS_DST_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus each destination color.";
            sfactor = gl.ONE_MINUS_DST_COLOR;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "SRC_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by the source alpha value.";
            sfactor = gl.SRC_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "ONE_MINUS_SRC_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus the source alpha value.";
            sfactor = gl.ONE_MINUS_SRC_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "DST_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by the destination alpha value.";
            sfactor = gl.DST_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "ONE_MINUS_DST_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus the destination alpha value.n";
            sfactor = gl.ONE_MINUS_DST_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "CONSTANT_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by a constant color."
            +"<br><br>Warning : If a constant color and a constant alpha value are used together as source and destination factors, "
            +"a gl.INVALID_ENUM error is thrown.";
            sfactor = gl.CONSTANT_COLOR;
            sd.options[12].disabled = true;
            sd.options[10].disabled = false;
            break;
        case "ONE_MINUS_CONSTANT_COLOR":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus a constant color.";
            sfactor = gl.ONE_MINUS_CONSTANT_COLOR;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "CONSTANT_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by a constant alpha value.e"
            +"<br><br>Warning : If a constant color and a constant alpha value are used together as source and destination factors, "
            +"a gl.INVALID_ENUM error is thrown.";
            sfactor = gl.CONSTANT_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = true;
            break;
        case "ONE_MINUS_CONSTANT_ALPHA":
            document.getElementById("txt_src").innerHTML = "Multiplies all colors by 1 minus a constant alpha value.";
            sfactor = gl.ONE_MINUS_CONSTANT_ALPHA;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
        case "SRC_ALPHA_SATURATE":
            document.getElementById("txt_src").innerHTML = "Multiplies the RGB colors by the smaller of either the source alpha value or the value of 1 minus the destination alpha value. The alpha value is multiplied by 1.";
            sfactor = gl.SRC_ALPHA_SATURATE;
            sd.options[12].disabled = false;
            sd.options[10].disabled = false;
            break;
    }

    //gl.blendFunc(sfactor, dfactor) 중에서 dfactor 선택하는 부분 - 각 파라미터 별 설명 변경 및 파라미터 값 저장
    switch(sel_dst) {
        case "ZERO":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 0.";
            dfactor = gl.ZERO;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "ONE":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1.";
            dfactor = gl.ONE;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "SRC_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by the source colors.";
            dfactor = gl.SRC_COLOR;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "ONE_MINUS_SRC_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus each source color.";
            dfactor = gl.ONE_MINUS_SRC_COLOR;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "DST_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by the destination color.";
            dfactor = gl.DST_COLOR;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "ONE_MINUS_DST_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus each destination color.";
            dfactor = gl.ONE_MINUS_DST_COLOR;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "SRC_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by the source alpha value.";
            dfactor = gl.SRC_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "ONE_MINUS_SRC_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus the source alpha value.";
            dfactor = gl.ONE_MINUS_SRC_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "DST_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by the destination alpha value.";
            dfactor = gl.DST_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "ONE_MINUS_DST_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus the destination alpha value.n";
            dfactor = gl.ONE_MINUS_DST_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "CONSTANT_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by a constant color."
            +"<br><br>Warning : If a constant color and a constant alpha value are used together as source and destination factors, "
            +"a gl.INVALID_ENUM error is thrown.";
            dfactor = gl.CONSTANT_COLOR;
            ss.options[12].disabled = true;
            ss.options[10].disabled = false;
            break;
        case "ONE_MINUS_CONSTANT_COLOR":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus a constant color.";
            dfactor = gl.ONE_MINUS_CONSTANT_COLOR;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
        case "CONSTANT_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by a constant alpha value.e"
            +"<br><br>Warning : If a constant color and a constant alpha value are used together as source and destination factors, "
            +"a gl.INVALID_ENUM error is thrown.";
            dfactor = gl.CONSTANT_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = true;
            break;
        case "ONE_MINUS_CONSTANT_ALPHA":
            document.getElementById("txt_dst").innerHTML = "Multiplies all colors by 1 minus a constant alpha value.";
            dfactor = gl.ONE_MINUS_CONSTANT_ALPHA;
            ss.options[12].disabled = false;
            ss.options[10].disabled = false;
            break;
    }

    //blend enable 체크박스 값 받아오는 부분
    if(document.getElementById("chk_ble").checked) {    //체크한 경우(default)
        gl.enable(gl.BLEND);
        document.getElementById("code_ena").innerHTML = "gl.enable(gl.BLEND);"
    }
    else {  //체크를 해제한 경우
        gl.disable(gl.BLEND);
        document.getElementById("code_ena").innerHTML = "//gl.enable(gl.BLEND);"
    }
    
    //blend함수 적용
    gl.blendEquation(mode);
    gl.blendFunc(sfactor, dfactor);

    //코드 박스 부분 변경
    document.getElementById("code_mode").innerHTML = sel_equ;
    document.getElementById("code_sfactor").innerHTML = sel_src;
    document.getElementById("code_dfactor").innerHTML = sel_dst;
    
    gl.drawArrays(gl.TRIANGLES, 0, 36);

    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("webglCanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            requestAnimFrame(renderLoop);
        }
    })();
}