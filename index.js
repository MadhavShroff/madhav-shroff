var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -65;
camera.position.y = 87;
camera.position.z = 80;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// var stable = new THREE.Mesh(
//   new THREE.BoxGeometry(2, 2, 2),
//   new THREE.MeshLambertMaterial({ color: 0x964b00 })
// );
// scene.add(stable);

// var horse = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshLambertMaterial({ color: 0xffffff })
// );
// horse.position.x = -2;
// scene.add(horse);

// var farmer = new THREE.Mesh(
//   new THREE.BoxGeometry(0.5, 0.5, 0.5),
//   new THREE.MeshLambertMaterial({ color: 0x8B4513 })
// );
// farmer.position.x = 2;
// scene.add(farmer);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 0);
scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x404040, 0.6);
scene.add(ambientLight);

var whiteCube = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 })
);
whiteCube.position.set(-20, 40, -55);
scene.add(whiteCube);

const addHill = (x, z) => {
    var stack = new THREE.Group();
    var numCylinders = 15;
    var radiusTop = 49;
    var radiusBottom = 50;
    var height = 5;
    var radialSegments = 32;

    for (var i = 0; i < numCylinders; i++) {
        if(radiusTop-(i*3) < 20) break;
        var cylinderGeometry = new THREE.CylinderGeometry(radiusTop-(i*4), radiusBottom-(i*4), height, radialSegments);
        var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0x4caf50 });
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

        cylinder.position.y = (height / 2) + (i * height);
        cylinder.position.x = i;
        stack.add(cylinder);

        // Decrement the radius of the top and bottom for each iteration
        radiusTop -= 0.25;
        radiusBottom -= 0.25;
    }
    stack.position.x = x;
    stack.position.z = z;
    scene.add(stack);
}


const addPlane = () => {
    var planeGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    var canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;

    // Get a reference to the 2D rendering context
    var ctx = canvas.getContext("2d");

    // Define the color palette
    var colors = [  "#f44336",  "#e91e63",  "#9c27b0",  "#673ab7",  "#3f51b5",  "#2196f3",  "#03a9f4",  "#00bcd4",  "#009688",  "#4caf50"];

    // Draw the pattern on the canvas
    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            ctx.fillStyle = colors[(x + y) % colors.length];
            ctx.fillRect(x, y, 1, 1);
        }
    }
    // Create a texture from the canvas
    var texture = new THREE.CanvasTexture(canvas);

    // Apply the texture to the plane as a material
    var material = new THREE.MeshBasicMaterial({ map: texture });
    var plane = new THREE.Mesh(planeGeometry, material);

    // Rotate the plane to be flat on the XZ plane
    plane.rotation.x = -0.5 * Math.PI;

    scene.add(plane);
}

addPlane();
addHill(0, 0);
addHill(-20, 0);
addHill(+24, -12);
addHill(+30, -30);

var controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
  animate();