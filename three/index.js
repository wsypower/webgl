//页面加载完成
window.onload = function () {
  createWorld();
};

//模拟现实场景
function createWorld() {
  initRender(); //创建渲染器
  initCamera(); //创建相机
  initLight(); //创建光源
  initObject(); //创建物体
  initScene(); //创建场景
  render(); //渲染
}

var renderer; //渲染器
var width;
var height;
function initRender() {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿开启
  });
  renderer.setSize(width, height); //设置渲染器宽度和高度
  renderer.setClearColor("#000000", 1.0); //设置背景颜色
  renderer.setPixelRatio(window.devicePixelRatio); //设置设备像素比
  document.getElementById("retina").appendChild(renderer.domElement); //把渲染器放置到页面中
}

var camera;
var origPoint = new THREE.Vector3(0, 0, 0); //原点
function initCamera() {
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(200, 400, 600); //设置相机位置
  camera.up.set(0, 1, 0); //设置相机正方向
  camera.lookAt(origPoint); //设置相机视点
}

var pointLight;
var ambientLight;
function initLight() {
  //点光源
  pointLight = new THREE.PointLight(0xffffff, 1, 2000);
  pointLight.position.set(70, 112, 98);
  //环境光
  ambientLight = new THREE.AmbientLight(0x333333);
}

var cube;
function initObject() {
  var geometry = new THREE.BoxGeometry(100, 100, 100);
  var material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
}

var scene;
function initScene() {
  scene = new THREE.Scene();
  scene.add(pointLight);
  scene.add(ambientLight);
  scene.add(cube);
}

function render() {
  renderer.clear();
  renderer.render(scene, camera);
  cube.rotation.x += 0.005;
  cube.rotation.y += 0.005;
  cube.rotation.z += 0.005;
  requestAnimationFrame(render);
}

function initObject(gl,shaderProgram){

  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

  //顶点
  var vertices = new Float32Array([
      2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
      2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
      2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
      -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
      -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
      2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
  ]);

  //颜色
  var colors = new Float32Array([
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
      1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0    // v4-v7-v6-v5 back
  ]);

  //法向量
  var normals = new Float32Array([
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
      0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
      0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);

  //索引
  var indices = new Uint8Array([
      0, 1, 2,   0, 2, 3,    // front
      4, 5, 6,   4, 6, 7,    // right
      8, 9,10,   8,10,11,    // up
      12,13,14,  12,14,15,   // left
      16,17,18,  16,18,19,   // down
      20,21,22,  20,22,23    // back
  ]);

  var num = indices.length;
  
  if(!_initElementBuffer(gl,indices)) return -1;//创建索引缓冲区
  if(!_initArrayBuffer(gl,shaderProgram,'a_Normal',normals,3,gl.FLOAT)) return -1;//创建法向量缓冲区
  if(!_initArrayBuffer(gl,shaderProgram,'a_Position',vertices,3,gl.FLOAT)) return -1;//创建顶点缓冲区
  if(!_initArrayBuffer(gl,shaderProgram,'a_Color',colors,3,gl.FLOAT)) return -1;////创建颜色缓冲区

  return num;
}