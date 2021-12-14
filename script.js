start()
function start() { 

    slider1.value = 0
    slider2.value = 0

    var vertexSource = document.getElementById("vs").text
    var fragmentSource = document.getElementById("fs").text

    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader,vertexSource)
    gl.compileShader(vertexShader)

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragmentShader,fragmentSource)
    gl.compileShader(fragmentShader)

    var shaderProgram = gl.createProgram()
    gl.attachShader(shaderProgram, vertexShader)
    gl.attachShader(shaderProgram, fragmentShader)
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition")
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute)

    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor")
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute)

    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal")
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute)

    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP")
    shaderProgram.Normalmatrix = gl.getUniformLocation(shaderProgram,"normalMatrix")
    
    var vectorNorms = new Float32Array(810)

    for (var i = 0; i < 610; i=i+9) {
        var p1 = [vertexPos[i], vertexPos[i+1], vertexPos[i+2]]
        var p2 = [vertexPos[i+3], vertexPos[i+4], vertexPos[i+5]]
        var p3 = [vertexPos[i+6], vertexPos[i+7], vertexPos[i+8]]

        var u = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]]
        var v = [p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]]
        var crossProductVec1 = v3.cross(u, v)
        vectorNorms[i] = crossProductVec1[0]
        vectorNorms[i+1] = crossProductVec1[1]
        vectorNorms[i+2] = crossProductVec1[2]

        var u2 = [p1[0]-p2[0],p1[1]-p2[1],p1[2]-p2[2]]
        var v2 = [p3[0]-p2[0],p3[1]-p2[1],p3[2]-p2[2]]
        var crossProductVec2 = v3.cross(u2, v2)
        vectorNorms[i+3] = crossProductVec2[0]
        vectorNorms[i+4] = crossProductVec2[1]
        vectorNorms[i+5] = crossProductVec2[2]

        var u4 = [p1[0]-p3[0],p1[1]-p3[1],p1[2]-p3[2]]
        var v4 = [p2[0]-p3[0],p2[1]-p3[1],p2[2]-p3[2]]
        var crossProductVec4 = v3.cross(u4, v4)
        vectorNorms[i+6] = crossProductVec4[0]
        vectorNorms[i+7] = crossProductVec4[1]
        vectorNorms[i+8] = crossProductVec4[2]
    }

    var trianglePosBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW)
    trianglePosBuffer.itemSize = 3
    trianglePosBuffer.numItems = 192

    var colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW)
    colorBuffer.itemSize = 3
    colorBuffer.numItems = 192

    var normalBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vectorNorms, gl.STATIC_DRAW)
    normalBuffer.itemSize = 3
    normalBuffer.numItems = 192

    function draw() {

        var angle1 = slider1.value*0.01*Math.PI
        var angle2 = slider2.value*0.01*Math.PI

        var eye = [300*Math.sin(angle1)+parseInt(slider7.value),150.0+parseInt(slider8.value),300.0*Math.cos(angle1)+parseInt(slider9.value)]
        var target = [100+parseInt(slider4.value),40+parseInt(slider5.value),0+parseInt(slider6.value)]
        var up = [0,1,0]

        var tModel = m4.multiply(m4.scaling([500,500,500]),m4.axisRotation([1,1,1],angle2))
        var tCamera = m4.inverse(m4.lookAt(eye,target,up))

        var tModelView = m4.multiply(tModel,tCamera)
        var fov = parseInt(slider3.value)/180*Math.PI
        var tProjection = m4.perspective((-Math.PI / 6) + fov,1,10,4000)

        var tMVP=m4.multiply(m4.multiply(tModel,tCamera),tProjection)

        gl.clearColor(0.22, 0.7, 0.5, 0.3)
        gl.enable(gl.DEPTH_TEST)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP)
        gl.uniformMatrix4fv(shaderProgram.Normalmatrix,false,m4.inverse(m4.transpose(tModelView)))

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize, gl.FLOAT,false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer)
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0)
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer)
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, normalBuffer.itemSize, gl.FLOAT, false, 0, 0)

        gl.drawArrays(gl.TRIANGLES, 0, trianglePosBuffer.numItems)
    }

    slider1.addEventListener("input",draw)
    slider2.addEventListener("input",draw)
    slider3.addEventListener("input",draw)
    slider4.addEventListener("input",draw)
    slider5.addEventListener("input",draw)
    slider6.addEventListener("input",draw)
    slider7.addEventListener("input",draw)
    slider8.addEventListener("input",draw)
    slider9.addEventListener("input",draw)
    draw()
}