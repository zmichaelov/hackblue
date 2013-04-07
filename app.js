var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1800;

    scene = new THREE.Scene();


    function placeRandomly(element) {
        var object = new THREE.CSS3DObject(element);
        object.position.x = Math.random() * 4000 - 2000;
        object.position.y = Math.random() * 4000 - 2000;
        object.position.z = Math.random() * 4000 - 2000;
        scene.add(object);

        objects.push(object);

    }

    // table


    function placeInTable(i) {
        var object = new THREE.Object3D();
        object.position.x = ( i * 160 ) - 1540;
        object.position.y = -(i * 200 ) + 1100;
        targets.table.push(object);
    }

    // sphere

    var sphereVector = new THREE.Vector3();


    function placeInSphere(i, l) {
        var phi = Math.acos(-1 + ( 2 * i ) / l);
        var theta = Math.sqrt(l * Math.PI) * phi;

        var object = new THREE.Object3D();

        object.position.x = 1000 * Math.cos(theta) * Math.sin(phi);
        object.position.y = 1000 * Math.sin(theta) * Math.sin(phi);
        object.position.z = 1000 * Math.cos(phi);

        sphereVector.copy(object.position).multiplyScalar(2);

        object.lookAt(sphereVector);

        targets.sphere.push(object);
    }

    // helix

    var helixVector = new THREE.Vector3();

    function placeInHelix(i, l) {
        var phi = i * 0.175 + Math.PI;
        var object = new THREE.Object3D();

        object.position.x = 1100 * Math.sin(phi);
        object.position.y = -( i * 8 ) + 450;
        object.position.z = 1100 * Math.cos(phi);

        helixVector.copy(object.position);
        helixVector.x *= 2;
        helixVector.z *= 2;

        object.lookAt(helixVector);

        targets.helix.push(object);

    }

    // grid

    function placeInGrid(i) {
        var object = new THREE.Object3D();
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( -( Math.floor(i / 5) % 5 ) * 400 ) + 800;
        object.position.z = ( Math.floor(i / 25) ) * 1000 - 2000;
        targets.grid.push(object);
    }


    function makeElement(response, template) {

        var element = document.createElement('div');
        element.className = 'element';
        element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';
        element.innerHTML += X.render(template, response)
        return element;
    }


    var X = new SexyApp();

    // retrieve friends using an FB API call
    FB.api('/me/friends?limit=100', function (response) {
        var friends_list = response.data;
        var n = friends_list.length;
        for (var i = 0; i < n; i++) {
            var friend = friends_list[i];
            var element = makeElement(friend, 'fb_template');
            placeRandomly(element);

            placeInTable(i);
            placeInSphere(i, n);
            placeInHelix(i, n);
            placeInGrid(i);
        }
        console.log("# of friends: " + friends_list.length);
                transform(targets.table, 2000);

    });


    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.addEventListener('change', render);

    var button = document.getElementById('table');
    button.addEventListener('click', function (event) {

        transform(targets.table, 2000);

    }, false);

    var button = document.getElementById('sphere');
    button.addEventListener('click', function (event) {

        transform(targets.sphere, 2000);

    }, false);

    var button = document.getElementById('helix');
    button.addEventListener('click', function (event) {

        transform(targets.helix, 2000);

    }, false);

    var button = document.getElementById('grid');
    button.addEventListener('click', function (event) {

        transform(targets.grid, 2000);

    }, false);

    transform(targets.table, 5000);

    window.addEventListener('resize', onWindowResize, false);

}

function transform(targets, duration) {

    TWEEN.removeAll();

    for (var i = 0; i < objects.length; i++) {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween(object.position)
            .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

        new TWEEN.Tween(object.rotation)
            .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();

    }

    new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
}

function render() {
    renderer.render(scene, camera);
}
