var scene = new THREE.Scene();

const setupGLTFLoader = () => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
};

const addLights = () => {
    var pointLight = new THREE.PointLight(0xffff00, 1, 1000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    var angle = 0;
    var radius = 10000;
    var speed = 0.0005;

    var animate = function () {
        requestAnimationFrame(animate);
        angle += speed;
        pointLight.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    };

    animate();
};

const addCube = () => {
    var whiteCube = new THREE.Mesh(
        new THREE.BoxGeometry(1500, 1500, 1500),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10 })
    );
    whiteCube.position.set(0, 0, 0);
    whiteCube.castShadow = true;
    whiteCube.receiveShadow = true;
    scene.add(whiteCube);

    var outerWhiteCube = new THREE.Mesh(
        new THREE.BoxGeometry(100000, 100000, 100000),
        new THREE.MeshBasicMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 10 })
    );
    outerWhiteCube.position.set(0, 0, 0);
    scene.add(outerWhiteCube);
};

const addText = async (text="Hi", surface=1, y=500, x=500) => {
    const loader = new THREE.FontLoader();
    const font = await new Promise((resolve) => {
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', resolve);
    });

    const textGeometry = new THREE.TextGeometry(text, {
        font: font,
        size: 72, // Adjust the size of the text
        height: 5, // Adjust the extrusion depth of the text
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelOffset: 1,
        bevelSegments: 2,
    });

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.castShadow = true;
    textMesh.receiveShadow = true;
    textMesh.rotation.set(0, Math.PI/2, 0);
    // add textmesh helper
    const helper = new THREE.BoxHelper(textMesh, 0xffff00);
    helper.geometry.computeBoundingBox();
    const box = helper.geometry.boundingBox;
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log(size);
    textMesh.position.set(750, x, y+(size.z/2));
    scene.add(textMesh);
};

const random = (x, y) => {
    return Math.random() * (y - x) + x;
};

const addHill = (x, z, r, top) => {
    var stack = new THREE.Group();
    var radiusTop = r - 5;
    var radiusBottom = r;
    var levelHeight = 100;
    var radialSegments = 64;
    var direction = Math.pow(-1, Math.round(random(1, 2)));
    var decrement = levelHeight;
    var shift = random(0.5, 1) * decrement * direction;
    var i = 0;

    while (radiusTop > (top + levelHeight)) {
        var cylinderGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, levelHeight, radialSegments);
        var cylinderMaterial = new THREE.MeshLambertMaterial({
            color: 0x4caf50,
            clipIntersection: true
        });
        var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.position.set(shift * i, (levelHeight / 2) + (i * levelHeight), 0);
        stack.add(cylinder);
        radiusTop -= decrement;
        radiusBottom -= decrement;
        i++;
    }

    stack.position.set(x, -5000, z);
    scene.add(stack);
};

const addHills = () => {
    let sum = 0;
    for (let i = 0; i < 50; i++) {
        let x = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
        let z = Math.floor(Math.random() * (5000 - -5000 + 1)) - 5000;
        let dist = Math.sqrt(x * x + z * z);
        let r = Math.floor(random(dist, dist + 10));
        let top = Math.floor(random(250, 500)) + 10;
        sum += r;

        if (!((x > -700 && x < 700) && (z > -700 && z < 700))) {
            addHill(x, z, r, top);
        }
    }
    console.log("Average height of all hills:", sum / 500);
};

const addSpace = () => {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 100 });
    const starCount = 1200;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
        starPositions[i] = Math.random() * 100000 - 50000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
};

const addTerrain = () => {
    const loader = new THREE.TextureLoader();
    const file = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/terrain/heightmap4.png";
    loader.load(file, (heightMapTexture) => {
        console.log(heightMapTexture.image.data.length);
        const terrainWidth = 100000;
        const terrainHeight = 100000;
        const terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, 255, 255);
        terrainGeometry.rotateX(-Math.PI / 2);

        for (let i = 0; i < terrainGeometry.attributes.position.count; i++) {
            const vertex = new THREE.Vector3();
            vertex.fromBufferAttribute(terrainGeometry.attributes.position, i);
            const y = heightMapTexture.image.data[i] * 50; // Adjust the multiplier to change the terrain height
            terrainGeometry.attributes.position.setY(i, y);
        }

        terrainGeometry.computeVertexNormals();

        const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
        const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.receiveShadow = true;
        scene.add(terrainMesh);
    });
};

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});
document.getElementById("container").appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 1500000);
camera.position.set(2350, 0, 0);
camera.lookAt(0, 0, 0);
var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
camera.updateProjectionMatrix();

addSpace();
// addTerrain();
var pointLight = new THREE.PointLight(0xffff00, 1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

addCube();
setupGLTFLoader();
addHills();
addText("Hello There! ", 1,0,200);
addText("Thanks for coming :)", 0, 0, 0);
addText("This is Madhav Shroff's Portfolio", 1, 0, -200);
addText("(Work in Progress)", 1, 0, -400);

var angle = -Math.PI / 2;
var radius = 1000000;
var speed = 0.003;

(function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera); angle += speed;
    pointLight.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    controls.update();
})();