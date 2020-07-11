const initThree = () => {
  start();
};

//開始
const start = () => {
  initScene();
  initCamera();
  initLight();
  initObject();
};

//Three.js初期化
let canvas;
let renderer; // レンダラ
let scene; // シーン
const initScene = () => {
  //シーン生成
  scene = new THREE.Scene();

  // 座標軸を表示
  let axes = new THREE.AxesHelper(100);
  // scene.add(axes);

  //レンダラー生成
  canvas = document.querySelector('#canvas');
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  if (!renderer) {
    alert('初期化失敗');
  }
  const ratio = window.devicePixelRatio;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth / ratio, canvas.clientHeight / ratio);
  renderer.setClearColor(0xff00ff, 0.2);
};

//カメラ初期化
let camera; // カメラ
const initCamera = () => {
  //カメラ生成
  camera = new THREE.OrthographicCamera(
    -canvas.clientWidth / 2,
    canvas.clientWidth / 2,
    canvas.clientHeight / 2,
    -canvas.clientHeight / 2,
    -100,
    200
  );
  // camera.up.set(0, 0, 1);
  camera.position.set(0, 0, 100);
  camera.lookAt(scene.position);
};

//光源初期化
let directionalLight, ambientLight;
const initLight = () => {
  //平行光源の生成
  directionalLight = new THREE.DirectionalLight(0xdddddd, 1.0, 0);
  directionalLight.position.set(30, 30, 100);
  //環境光の生成
  ambientLight = new THREE.AmbientLight(0x222222);

  //光源をシーンへ追加
  // scene.add(ambientLight);
  scene.add(directionalLight);
};

//オブジェクト初期化
let geometry; // ジオメトリ
let material; // マテリアル
let torus;
function initObject() {
  //トーラスを作成
  geometry = new THREE.TorusGeometry(30, 10, 16, 100);
  //マテリアルを作成
  material = new THREE.MeshNormalMaterial();
  //メッシュを作成
  torus = new THREE.Mesh(geometry, material);
  torus.position.set(0, 0, 0);
  scene.add(torus);
}

//描画
// let step = 0; //ステップ数
const draw = (points) => {
  //トーラスの位置を右目の1点にセット
  if (points && points.eyes.right) {
    const x = points.eyes.right[0].x - canvas.clientWidth / 2;
    const y = -points.eyes.right[0].y + canvas.clientHeight / 2;
    torus.position.set(x, y, 0);
  }
  //回転
  torus.rotation.x += 0.1;
  torus.rotation.y += 0.1;
  // レンダリング
  renderer.render(scene, camera);
};
