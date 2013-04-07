var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] , subGrid: [],explode: []};
var MAX_DEPTH = 4;
function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1800;
//    camera.position.x = 500;
//    camera.position.y = 500;

    scene = new THREE.Scene();
    // file system

    function placeFolderinFS(element, i){
        var object = new THREE.CSS3DObject(element);
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( -( Math.floor(i / 5)) * 400 ) + 800;
        object.position.z = 0;
        scene.add(object);

        objects[i] = object;
        return object;
    }

    function placeSubFolderinFS(element, i, depth){
        var object = new THREE.CSS3DObject(element);
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( -( Math.floor(i / 5)) * 400 ) + 800;
        object.position.z = - (depth+1)*200;
        scene.add(object);

        return object;
    }

    function placeInExplode(){
        var object = new THREE.Object3D();
        object.position.x = -50000;
        object.position.y = -50000;
        object.position.z = -50000;

        targets.explode[0] = object;
    }

    // grid

    function placeInGrid(i) {
        var object = new THREE.Object3D();
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( -( Math.floor(i / 5)) * 400 ) + 800;
        object.position.z = 0;
        targets.grid.push(object);
    }

    function placeInSubGrid(i, depth){
        var object = new THREE.Object3D();
        object.position.x = ( ( i % 5 ) * 400 ) - 800;
        object.position.y = ( -( Math.floor(i / 5)) * 400 ) + 800;
        object.position.z = - (depth+1)*200;
        targets.subGrid.push(object);
    }

//    function makeElement(response, template) {
//        var element = document.createElement('div');
//        element.className = 'element';
//        element.style.backgroundColor = 'rgba(6,154,213,.5)';// + ')';
//        element.innerHTML += X.render(template, response);
//        return element;
//    }
    function makeElement(response, template){
        var element = document.createElement("div");
        element.id = response.id;
        if(response.isFolder){
            element.className += " folder"
        }
        settings = {
            fontSize: 30,
            margin: 50

        };
        var html = X.render(template, response);
        var cubeSet = new HexaFlip(element,
            {
                dropbox: [response.name, response.path, html]
            }, settings
        );
        if(response.isFolder === false){
            element.addEventListener('click', function(){
                cubeSet.flip();
            }, false);
        }
        return element;
    }

    function makeFolder(response, template, element) {
        if(!element)
            var element = makeElement(response, template);
        element.addEventListener('dblclick', function (event){
            console.log("Double Click");
            event.preventDefault();
            for(var i = 0; i < objects.length; i++){
                if(!objects[i] || i === this.ind){
                    continue;
                }
                if(objects[i].subObjects)
                    transform(objects[i].subObjects, targets.explode, 1000);
            }
            transform(objects, targets.explode, 1000);
            objects = objects[this.ind].subObjects;
            transform(objects, targets.grid, 1000);

            for(var i = 0; i < objects.length; i++){
                var object = objects[i];
                if(object.el.isFolder){
                    object.element = makeFolder(object.el, 'debug_template', object.element);
                    object.element.ind = i;
                    readPath(i, object.element, object.el);
                }
            }

        }, false);

        return element;
    }


    var X = new SexyApp();


    // initiate grids
    for (var i = 0; i < 300; i++){
        placeInGrid(i);
    }

   function readPath (i, element, el){
        readDir(el.path, function (subcontent){
            object = placeFolderinFS(element, i);
            object.subObjects = [];
            object.element = element;
            object.el = el;

            var m = subcontent.length;
            for(var j = 0; j < m && j < MAX_DEPTH; j++){
                var subel = subcontent[j];
                var subelement = makeElement(subel, 'debug_template');
                var subObject = placeSubFolderinFS(subelement, i, j);
                placeInSubGrid(i,j);
                subObject.el = subel;
                subObject.element = subelement;
                // subObject.parentObjects = objects;
                object.subObjects.push(subObject);
                object.subObjects.parentObjects = objects;
            }
        });
    }

    readDir('/', function (content){
        var n = content.length;
        placeInExplode();
        for(var i = 0; i < n; i++){
            var el = content[i];
            var element;
            var object;

            if(el.isFolder){
                element = makeFolder(el, 'debug_template');
                element.ind = i;
                readPath(i, element, el);
            }
            else{
                element = makeElement(el, 'debug_template');
                object = placeFolderinFS(element, i);
                object.element = element;
                object.el = el;
            }
        }
    }
);

    function placeSubDir(directory, index) {
        var n = directory.length;
        for (var i = 0; i < n; i++){
            var el = directory[i];
            var element = makeElement(el, 'debug_template');
            placeSubFolderinFS(element, index, i);
        }
    }

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    document.getElementById('container').appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.addEventListener('change', render);

    var button = document.getElementById('back');
    button.addEventListener('click', function (event) {
        if(!objects.parentObjects)
            return;
        for(var i = 0; i < objects.length; i++){
            if(!objects[i] || !objects[i].subObjects)
                continue;
            targets.subGrid = [];
            for(var j = 0; j < objects[i].subObjects.length; j++){
                placeInSubGrid(i, j);
            }
            transform(objects[i].subObjects, targets.explode, 1000);
        }
        // transform(objects, targets.subGrid, 1000);

        objects = objects.parentObjects;
        transform(objects, targets.grid, 1000);
        for(var i = 0; i < objects.length; i++){
            targets.subGrid = [];
            if(!objects[i] || !objects[i].subObjects)
                continue;
            for(var j = 0; j < objects[i].subObjects.length && j < MAX_DEPTH; j++){
                placeInSubGrid(i, j);
            }
            if(objects[i].subObjects.length !== 0){
                transform(objects[i].subObjects, targets.subGrid, 1000);
            }
        }

    }, false);

    transform(objects, 1000);

    window.addEventListener('resize', onWindowResize, false);

}

function transform(dobjects, targets, duration) {

    // TWEEN.removeAll();

    for (var i = 0; i < dobjects.length; i++) {

        var object = dobjects[ i ];
        var target;

        if(targets.length === 1)
            target = targets[0];
        else
            target = targets[i];

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

init();
animate();
