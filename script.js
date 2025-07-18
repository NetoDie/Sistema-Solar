// Variáveis globais
let backgroundSphere = null;
let scene, camera, renderer, controls;
let planets = [];
let orbits = [];
let solarSystem;
let rotationEnabled = true;
let showOrbits = true;
let animationSpeed = 1;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

// Inicialização só após clicar no botão da main page
if (!document.getElementById('main-page')) {
    // Cria main page se não existir
    const mainDiv = document.createElement('div');
    mainDiv.id = 'main-page';
    mainDiv.style.position = 'fixed';
    mainDiv.style.top = '0';
    mainDiv.style.left = '0';
    mainDiv.style.width = '100vw';
    mainDiv.style.height = '100vh';
    mainDiv.style.background = 'linear-gradient(135deg, #0a1a2f 0%, #1a2a4f 60%, #0e223a 100%)';
    mainDiv.style.display = 'flex';
    mainDiv.style.flexDirection = 'column';
    mainDiv.style.alignItems = 'center';
    mainDiv.style.justifyContent = 'center';
    mainDiv.style.zIndex = '9999';
    mainDiv.style.overflow = 'hidden';
    mainDiv.innerHTML = `
        <div id="main-bg-anim" style="position:absolute;inset:0;z-index:0;pointer-events:none;"></div>
        <h1 id="main-title" style="color:#fff;font-family:'Orbitron',sans-serif;font-size:2.8em;letter-spacing:0.09em;text-shadow:0 0 32px #ff0033,0 0 8px #fff,0 0 2px #ff0033;filter:drop-shadow(0 0 18px #ff003388);margin-bottom:30px;transition:opacity 0.5s, filter 0.5s;">Sistema Solar 3D</h1>
        <p id="main-desc" class="parallax-rgb-desc">
            <span class="desc-parallax-bg"></span>
            <span class="desc-parallax-fg">Explore o sistema solar interativo em 3D.<br>Clique no botão abaixo para começar sua jornada pelo espaço!</span>
        </p>
        <button id="start-solar-btn" style="padding:18px 48px;font-size:1.3em;font-family:'Orbitron',sans-serif;font-weight:700;letter-spacing:0.08em;background:linear-gradient(90deg,#111 60%,#ff0033 100%)!important;color:#fff;border:none;border-radius:30px;box-shadow:0 4px 32px #ff003344,0 1.5px 0 #ff0033 inset,0 0 18px #ff003399;cursor:pointer;transition:background 0.2s,box-shadow 0.2s,transform 0.2s;outline:none;position:relative;z-index:1;overflow:hidden;text-shadow:0 0 18px #ff0033,0 0 2px #fff,0 0 2px #ff0033;">Explorar Sistema Solar 🚀</button>
    `;
    // Adiciona CSS para animação de fundo e partículas
    if (!document.getElementById('mainpage-css')) {
        const style = document.createElement('style');
        style.id = 'mainpage-css';
        style.innerHTML = `
        #main-bg-anim {
            background: linear-gradient(120deg, #070707 0%, #1a0033 100%);
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            overflow: hidden;
        }
        /* Cyberwave grid e linhas codex neon vermelhas animadas */
        #main-bg-anim::before, #main-bg-anim::after {
            content: '';
            position: absolute;
            left: 0; top: 0; width: 100%; height: 100%;
            pointer-events: none;
        }
        #main-bg-anim::before {
            background:
                repeating-linear-gradient(0deg, transparent 0 38px, #2b0a0a 38px 40px),
                repeating-linear-gradient(90deg, transparent 0 38px, #2b0a0a 38px 40px),
                linear-gradient(120deg, #ff003344 0%, #ff003333 100%);
            opacity: 0.22;
            z-index: 1;
            filter: blur(0.5px);
            animation: grid-move 12s linear infinite;
            background-size: 100% 100%, 100% 100%, 100% 100%;
        }
        #main-bg-anim::after {
            background:
                linear-gradient(90deg, #ff0033 0%, #ff0000 100%);
            opacity: 0.18;
            z-index: 2;
            mix-blend-mode: lighten;
            filter: blur(18px);
            animation: cyberwave-neon 6s linear infinite alternate;
        }
        @keyframes grid-move {
            0% { background-position: 0% 0%, 0% 0%, 0% 0%; }
            100% { background-position: 100px 100px, 100px 100px, 0% 0%; }
        }
        @keyframes cyberwave-neon {
            0% { background-position: 0% 50%; filter: blur(18px) brightness(1.1); }
            100% { background-position: 100% 50%; filter: blur(32px) brightness(1.3); }
        }
        #main-title, #main-desc {
            opacity: 1;
            filter: blur(0px);
        }
        .main-frag-particle {
            box-shadow: 0 0 18px #ff0033cc, 0 0 2px #fff;
            background: linear-gradient(90deg,#ff0033 60%,#fff 100%);
            animation: particle-glow 1.2s linear infinite alternate;
        }
        @keyframes particle-glow {
            0% { filter: brightness(1.1) blur(0.5px); }
            100% { filter: brightness(1.5) blur(2.5px); }
        }
        #start-solar-btn {
            background: linear-gradient(90deg,#111 60%,#ff0033 100%) !important;
            color: #fff !important;
            box-shadow: 0 4px 32px #ff003344,0 1.5px 0 #ff0033 inset,0 0 18px #ff003399;
            text-shadow: 0 0 18px #ff0033, 0 0 2px #fff, 0 0 2px #ff0033;
        }
        #start-solar-btn:hover {
            background: linear-gradient(90deg,#ff0033 60%,#111 100%) !important;
            color: #111 !important;
            box-shadow: 0 0 32px #ff0033cc, 0 0 8px #fff;
            transform: scale(1.04);
        }
        #start-solar-btn:active {
            transform: scale(0.98);
        }
        /* Parallax e RGB animado para descrição */
        .parallax-rgb-desc {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70px;
            max-width: 480px;
            margin-bottom: 38px;
            font-size: 1.25em;
            text-align: center;
            filter: drop-shadow(0 0 12px #ff003355);
            z-index: 2;
        }
        .desc-parallax-bg {
            position: absolute;
            left: 0; right: 0; top: 0; bottom: 0;
            width: 100%; height: 100%;
            z-index: 0;
            background: linear-gradient(90deg, #ff0033, #ff5555, #ff0033, #ff2222, #ff0033 100%);
            background-size: 300% 300%;
            filter: blur(18px) brightness(1.2) opacity(0.7);
            animation: rgbmove 4.5s linear infinite alternate;
            border-radius: 18px;
        }
        .desc-parallax-fg {
            position: relative;
            z-index: 1;
            background: none;
            font-weight: 600;
            color: #fff;
            text-shadow: 0 0 18px #ff0033, 0 0 2px #fff, 0 0 2px #ff0033;
            letter-spacing: 0.01em;
            transition: color 0.3s;
        }
        @keyframes rgbmove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
        }
        `;
    // Parallax JS para descrição
    setTimeout(() => {
        const desc = document.querySelector('.parallax-rgb-desc');
        if (!desc) return;
        desc.addEventListener('mousemove', e => {
            const rect = desc.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const bg = desc.querySelector('.desc-parallax-bg');
            if (bg) {
                bg.style.transform = `translate(${x*18}px,${y*18}px) scale(1.04)`;
            }
        });
        desc.addEventListener('mouseleave', () => {
            const bg = desc.querySelector('.desc-parallax-bg');
            if (bg) bg.style.transform = '';
        });
    }, 100);
        document.head.appendChild(style);
    }
    document.body.appendChild(mainDiv);
    // Esconde elementos se existirem
    const container = document.getElementById('container');
    if (container) container.style.display = 'none';
    const controlsContainer = document.getElementById('controls-container');
    if (controlsContainer) controlsContainer.style.display = 'none';
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) infoPanel.style.display = 'none';
    const infoOverlay = document.getElementById('info-overlay');
    if (infoOverlay) infoOverlay.style.display = 'none';
    document.getElementById('start-solar-btn').addEventListener('click', function() {
        // Animação de "fragmentação" futurista com fade/blur no texto
        const rect = mainDiv.getBoundingClientRect();
        const numParticles = 90;
        const particles = [];
        for (let i = 0; i < numParticles; i++) {
            const span = document.createElement('span');
            span.className = 'main-frag-particle';
            // Posição inicial aleatória dentro do mainDiv
            const px = Math.random() * rect.width;
            const py = Math.random() * rect.height;
            span.style.position = 'absolute';
            span.style.left = px + 'px';
            span.style.top = py + 'px';
            span.style.width = (8 + Math.random() * 18) + 'px';
            span.style.height = (3 + Math.random() * 10) + 'px';
            span.style.borderRadius = (2 + Math.random() * 8) + 'px';
            span.style.opacity = '0.92';
            span.style.pointerEvents = 'none';
            span.style.zIndex = '10000';
            // Animação: cada partícula vai para fora do centro e some
            const angle = Math.random() * Math.PI * 2;
            const dist = 140 + Math.random() * 220;
            const tx = Math.cos(angle) * dist;
            const ty = Math.sin(angle) * dist;
            span.animate([
                { transform: 'translate(0,0) scale(1)', opacity: 0.92 },
                { transform: `translate(${tx}px,${ty}px) scale(${0.3 + Math.random() * 0.7})`, opacity: 0 }
            ], {
                duration: 1100 + Math.random() * 300,
                easing: 'cubic-bezier(.7,.1,.2,1)',
                fill: 'forwards',
                delay: Math.random() * 120
            });
            mainDiv.appendChild(span);
            particles.push(span);
        }
        // Esconde conteúdo do mainDiv com fade e blur
        const mainTitle = document.getElementById('main-title');
        const mainDesc = document.getElementById('main-desc');
        if (mainTitle) {
            mainTitle.style.transition = 'opacity 0.5s, filter 0.7s';
            mainTitle.style.opacity = '0';
            mainTitle.style.filter = 'blur(18px)';
        }
        if (mainDesc) {
            mainDesc.style.transition = 'opacity 0.5s, filter 0.7s';
            mainDesc.style.opacity = '0';
            mainDesc.style.filter = 'blur(18px)';
        }
        const startBtn = document.getElementById('start-solar-btn');
        if (startBtn) {
            startBtn.style.transition = 'opacity 0.4s, filter 0.7s';
            startBtn.style.opacity = '0';
            startBtn.style.filter = 'blur(18px)';
        }
        // Após animação, remove mainDiv e mostra sistema
        setTimeout(() => {
            mainDiv.style.display = 'none';
            if (container) container.style.display = '';
            if (controlsContainer) controlsContainer.style.display = '';
            if (infoPanel) infoPanel.style.display = '';
            if (infoOverlay) infoOverlay.style.display = '';
            // Remove partículas
            particles.forEach(p => p.remove());
            init();
        }, 1300);
    });
} else {
    init();
}

function init() {
    // Cena
    scene = new THREE.Scene();
    // Não define cor de fundo, será coberto pela esfera com textura

    // Câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 50, 100);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Luzes
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    // Sistema solar (grupo para rotação)
    solarSystem = new THREE.Group();
    scene.add(solarSystem);

    // Cria o fundo com a textura do ESO antes dos planetas
    createESOBackground();
    // Carrega os dados dos planetas
    loadPlanetData();

    // Exibe mensagem padrão no painel de informações ao iniciar
    showDefaultInfoPanel();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('click', onDocumentClick);
    document.getElementById('toggle-orbits').addEventListener('click', toggleOrbits);
    document.getElementById('toggle-rotation').addEventListener('click', toggleRotation);
    document.getElementById('speed').addEventListener('input', updateSpeed);

    // Inicia a animação
    animate();
}

async function loadPlanetData() {
    try {
        const response = await fetch('data.json');
        const planetData = await response.json();
        createSolarSystem(planetData);
    } catch (error) {
        console.error('Erro ao carregar dados dos planetas:', error);
    }
}

function createSolarSystem(planetData) {
    const textureLoader = new THREE.TextureLoader();

    // Sol
    const sunData = planetData.find(p => p.name === "Sol");
    const sunTexture = textureLoader.load(`textures/${sunData.texture}`);
    const sunGeometry = new THREE.SphereGeometry(sunData.radius, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
        map: sunTexture,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.name = sunData.name;
    sun.userData.info = sunData;
    solarSystem.add(sun);

    // Adiciona emissão de luz ao sol
    const sunLight = new THREE.PointLight(0xffffff, 1.5, 200);
    sun.add(sunLight);

    // Planetas
    planetData.filter(p => p.name !== "Sol").forEach(planet => {
        // Cria a órbita
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
        const orbitPoints = [];
        const orbitRadius = planet.distance;

        for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            orbitPoints.push(new THREE.Vector3(
                orbitRadius * Math.cos(theta),
                0,
                orbitRadius * Math.sin(theta)
            ));
        }

        orbitGeometry.setFromPoints(orbitPoints);
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.name = `${planet.name}_orbit`;
        solarSystem.add(orbit);
        orbits.push(orbit);

        // Cria o planeta
        const planetTexture = textureLoader.load(`textures/${planet.texture}`);
        const planetGeometry = new THREE.SphereGeometry(planet.radius, 32, 32);
        
        let planetMaterial;
        if (planet.name === "Earth") {
            const normalMap = textureLoader.load('textures/earth_normal.jpg');
            const specularMap = textureLoader.load('textures/earth_specular.jpg');
            planetMaterial = new THREE.MeshPhongMaterial({
                map: planetTexture,
                normalMap: normalMap,
                specularMap: specularMap,
                specular: new THREE.Color('grey'),
                shininess: 5
            });
        } else {
            planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture });
        }

        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        planetMesh.position.x = planet.distance;
        planetMesh.name = planet.name;
        planetMesh.userData.info = planet;
        planetMesh.userData.angle = Math.random() * Math.PI * 2;
        planetMesh.userData.speed = planet.speed;
        planetMesh.castShadow = true;
        planetMesh.receiveShadow = true;
        
        solarSystem.add(planetMesh);
        planets.push(planetMesh);

        // Anéis de Saturno
        if (planet.name === "Saturn") {
            // Anel plano com textura correta
            const ringTexture = textureLoader.load('textures/saturn_ring.jpg');
            const ringGeometry = new THREE.RingGeometry(
                planet.radius * 1.5, 
                planet.radius * 2.5, 
                128
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            planetMesh.add(ring);

            // Microesferas simulando asteroides do anel
            const asteroidGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const asteroidMaterial = new THREE.MeshPhongMaterial({ color: 0xd2c29d });
            const numAsteroids = 800;
            const innerRadius = planet.radius * 1.55;
            const outerRadius = planet.radius * 2.45;
            for (let i = 0; i < numAsteroids; i++) {
                // Distribuição aleatória entre os limites do anel
                const angle = Math.random() * Math.PI * 2;
                // Para dar "faixas" mais realistas, use um ruído radial
                const band = Math.random();
                let radius = innerRadius + (outerRadius - innerRadius) * Math.pow(band, 1.2);
                // Pequena variação vertical para dar volume
                const y = (Math.random() - 0.5) * 0.15;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);
                const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial.clone());
                asteroid.position.set(x, y, z);
                // Pequena rotação aleatória
                asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                // Escala aleatória para variar tamanho
                const scale = 0.7 + Math.random() * 1.2;
                asteroid.scale.set(scale, scale, scale);
                planetMesh.add(asteroid);
            }
        }

        // Luas (exemplo para a Terra)
        if (planet.name === "Terra") {
   
    
            // Criação da Lua
            const moonTexture = new THREE.TextureLoader().load('textures/moon.jpg');
            const moonGeometry = new THREE.SphereGeometry(planet.radius * 0.27, 32, 32);
            const moonMaterial = new THREE.MeshPhongMaterial({ 
                map: moonTexture,
                emissive: 0x222222, // Melhora visibilidade
                emissiveIntensity: 0.5
            });
            const moon = new THREE.Mesh(moonGeometry, moonMaterial);
            moon.name = "Lua";
            moon.userData = {
                info: {
                    name: "Lua",
                    radius: planet.radius * 0.27,
                    distance: planet.radius * 1.7, // Distância da Terra (ajustada para não invadir Vênus)
                    speed: planet.speed * 2.5,     // Velocidade orbital
                    description: "A Lua é o único satélite natural da Terra e o quinto maior do Sistema Solar. É o maior satélite natural de um planeta no sistema solar em relação ao tamanho do seu corpo primário, tendo 27% do diâmetro e 60% da densidade da Terra, o que representa 1⁄81 da sua massa"
                },
                angle: Math.random() * Math.PI * 2 // Posição inicial aleatória
            };

            // Cria um grupo para a órbita da Lua
            const moonOrbitGroup = new THREE.Group();
            moonOrbitGroup.name = "Lua_OrbitGroup";
            // Posiciona o grupo no centro da Terra
            moonOrbitGroup.position.set(0, 0, 0);
            // Posiciona a Lua em relação ao grupo
            moon.position.set(moon.userData.info.distance, 0, 0);
            // Adiciona a Lua ao grupo
            moonOrbitGroup.add(moon);
            // Adiciona o grupo à Terra
            planetMesh.add(moonOrbitGroup);
            // Adiciona a Lua ao array de planetas para interação
            planets.push(moon);
            // Salva referência ao grupo para animação
            planetMesh.userData.moonOrbitGroup = moonOrbitGroup;

        }
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    if (rotationEnabled) {
        // Rotação dos planetas em torno do sol
        planets.forEach(planet => {
            if (!planet.userData) return;
            // Não atualizar a posição da Lua aqui, pois ela orbita via grupo
            if (planet.name === "Lua") return;
            planet.userData.angle += 0.005 * planet.userData.speed * animationSpeed;
            // Planetas orbitam o sol
            if (planet.parent === solarSystem) {
                planet.position.x = planet.userData.info.distance * Math.cos(planet.userData.angle);
                planet.position.z = planet.userData.info.distance * Math.sin(planet.userData.angle);
            }
            // Rotação do planeta em torno do próprio eixo
            if (planet.name === "Terra") {
                planet.rotation.y += 0.002 * animationSpeed; // Terra gira mais devagar
            } else {
                planet.rotation.y += 0.01 * animationSpeed;
            }
        });

        // Faz a Lua orbitar a Terra usando o grupo
        planets.forEach(planet => {
            if (planet.name === "Terra" && planet.userData && planet.userData.moonOrbitGroup) {
                const moonOrbitGroup = planet.userData.moonOrbitGroup;
                // Atualiza o ângulo da órbita da Lua
                const moon = moonOrbitGroup.children[0];
                moon.userData.angle += 0.005 * moon.userData.info.speed * animationSpeed;
                // Rotaciona o grupo para simular a órbita
                moonOrbitGroup.rotation.y = moon.userData.angle;
            }
        });
    }

    // Atualiza a posição e o tamanho da esfera de fundo a cada frame
    if (backgroundSphere) {
        backgroundSphere.position.copy(camera.position);
        const dist = camera.far * 0.95;
        const currentRadius = backgroundSphere.geometry.parameters.radius;
        if (Math.abs(currentRadius - dist) > 1) {
            const newGeometry = new THREE.SphereGeometry(dist, 60, 40);
            newGeometry.scale(-1, 1, 1); // Garante inversão para dentro
            backgroundSphere.geometry.dispose();
            backgroundSphere.geometry = newGeometry;
        }
    }
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentClick(event) {
    // Calcula a posição do mouse normalizada
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Atualiza o raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Calcula objetos intersectados (inclui filhos, como a Lua)
    const intersects = raycaster.intersectObjects(planets, true);
    if (intersects.length > 0) {
        const obj = intersects[0].object;
        // Garante que sempre há info e, se for a Lua, adiciona a textura manualmente
        let info = obj.userData.info;
        if (obj.name === "Lua" && info && !info.texture) {
            info = { ...info, texture: "moon.jpg" };
        }
        showPlanetInfo(info);
    }
}

function showPlanetInfo(info) {
    const infoPanel = document.getElementById('planet-info');
    // Usa moon.jpg se for a Lua
    const texture = info.texture ? info.texture : (info.name === 'Lua' ? 'moon.jpg' : '');

    // Dados reais para planetas e Lua
    const tipos = {
        'Mercurio': 'Planeta Rochoso',
        'Venus': 'Planeta Rochoso',
        'Terra': 'Planeta Rochoso',
        'Earth': 'Planeta Rochoso',
        'Mars': 'Planeta Rochoso',
        'Jupiter': 'Gigante Gasoso',
        'Saturn': 'Gigante Gasoso',
        'Uranus': 'Gigante Gasoso',
        'Neptune': 'Gigante Gasoso',
        'Pluto': 'Planeta Anão',
        'Lua': 'Satélite Natural',
        'Moon': 'Satélite Natural',
        'Sol': 'Estrela',
        // Adiciona nomes em português para compatibilidade
        'Marte': 'Planeta Rochoso',
        'Saturno': 'Gigante Gasoso',
        'Netuno': 'Gigante Gasoso',
        'Plutão': 'Planeta Anão'
    };
    const diametros = {
        'Mercurio': 4879,
        'Venus': 12104,
        'Terra': 12742,
        'Earth': 12742,
        'Mars': 6779,
        'Marte': 6779,
        'Jupiter': 139820,
        'Saturn': 116460,
        'Saturno': 116460,
        'Uranus': 50724,
        'Neptune': 49244,
        'Netuno': 49244,
        'Pluto': 2376,
        'Plutão': 2376,
        'Lua': 3474,
        'Moon': 3474,
        'Sol': 1391400
    };
    const distSol = {
        'Mercurio': 57900000,
        'Venus': 108200000,
        'Terra': 149600000,
        'Earth': 149600000,
        'Mars': 227900000,
        'Marte': 227900000,
        'Jupiter': 778500000,
        'Saturn': 1433500000,
        'Saturno': 1433500000,
        'Uranus': 2872500000,
        'Neptune': 4495100000,
        'Netuno': 4495100000,
        'Pluto': 5906380000,
        'Plutão': 5906380000,
        'Lua': 384400,
        'Moon': 384400,
        'Sol': 0
    };
    const periodos = {
        'Mercurio': '87,97 dias',
        'Venus': '224,7 dias',
        'Terra': '365,25 dias',
        'Earth': '365,25 dias',
        'Mars': '687 dias',
        'Marte': '687 dias',
        'Jupiter': '11,86 anos',
        'Saturn': '29,46 anos',
        'Saturno': '29,46 anos',
        'Uranus': '84,01 anos',
        'Neptune': '164,8 anos',
        'Netuno': '164,8 anos',
        'Pluto': '248 anos',
        'Plutão': '248 anos',
        'Lua': '27,3 dias',
        'Moon': '27,3 dias',
        'Sol': '—'
    };

    // Nome para exibir distância do Sol
    const distLabel = (info.name === 'Lua' || info.name === 'Moon') ? 'Distância da Terra' : 'Distância do Sol';
    // Valor para exibir distância
    const distValue = distSol[info.name] !== undefined ? distSol[info.name].toLocaleString('pt-BR') + ' km' : 'N/A';
    // Valor para exibir diâmetro
    const diamValue = diametros[info.name] !== undefined ? diametros[info.name].toLocaleString('pt-BR') + ' km' : 'N/A';
    // Tipo
    const tipoValue = tipos[info.name] || (info.type || 'Planeta');
    // Período orbital
    const periodoValue = periodos[info.name] || info.orbitalPeriod || 'N/A';

    let descricaoExtra = '';
    if (info.name === 'Jupiter' || info.name === 'Júpiter') {
        descricaoExtra = 'Júpiter é o maior planeta do Sistema Solar, tanto em diâmetro quanto em massa, e é o quinto mais próximo do Sol. Possui menos de um milésimo da massa solar, contudo tem 2,5 vezes a massa de todos os outros planetas em conjunto. É um planeta gasoso, junto com Saturno, Urano e Netuno. Saturno tem 79 luas conhecidas.';
    }
    infoPanel.style.overflowY = 'auto';
    infoPanel.style.maxHeight = '70vh';
    infoPanel.style.scrollbarWidth = 'thin'; // Firefox
    infoPanel.style.scrollbarColor = '#4ddcff #222'; // Firefox
    // Chrome/Edge/Safari via CSS-in-JS
    infoPanel.style.setProperty('scrollbar-width', 'thin');
    infoPanel.style.setProperty('scrollbar-color', '#4ddcff #222');
    // Adiciona CSS para webkit scrollbars
    if (!document.getElementById('custom-scrollbar-style')) {
        const style = document.createElement('style');
        style.id = 'custom-scrollbar-style';
        style.innerHTML = `
            #planet-info::-webkit-scrollbar {
                width: 8px;
                background: #222;
                border-radius: 8px;
            }
            #planet-info::-webkit-scrollbar-thumb {
                background: linear-gradient(120deg, #4ddcff 60%, #222 100%);
                border-radius: 8px;
                min-height: 30px;
            }
            #planet-info::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(120deg, #4ddcff 80%, #222 100%);
            }
        `;
        document.head.appendChild(style);
    }
    infoPanel.innerHTML = `
        <button id="back-info-btn" style="
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(90deg, #222 60%, #4ddcff 100%);
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 8px 18px;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 18px;
            box-shadow: 0 2px 12px rgba(77, 221, 255, 0.25);
            cursor: pointer;
            transition: background 0.2s, box-shadow 0.2s;
        " title="Voltar">
            <span style="font-size:1.3em;">⟵</span> Voltar
        </button>
        <h3>${info.name}</h3>
        ${texture ? `<img src="textures/${texture}" alt="${info.name}" style="max-width:100%; height:auto;">` : ''}
        <p><strong>Tipo:</strong> ${tipoValue}</p>
        <p><strong>Diâmetro:</strong> ${diamValue}</p>
        <p><strong>${distLabel}:</strong> ${distValue}</p>
        <p><strong>Período orbital:</strong> ${periodoValue}</p>
        <div class="details">${descricaoExtra || info.description || 'Sem descrição disponível.'}</div>
    `;
    // Adiciona evento ao botão de voltar
    document.getElementById('back-info-btn').addEventListener('click', showDefaultInfoPanel);
}

// Função para restaurar o painel de informações ao estado padrão
function showDefaultInfoPanel() {
    const infoPanel = document.getElementById('planet-info');
    infoPanel.style.overflowY = 'auto';
    infoPanel.style.maxHeight = '70vh';
    infoPanel.style.scrollbarWidth = 'thin'; // Firefox
    infoPanel.style.scrollbarColor = '#4ddcff #222'; // Firefox
    infoPanel.style.setProperty('scrollbar-width', 'thin');
    infoPanel.style.setProperty('scrollbar-color', '#4ddcff #222');
    if (!document.getElementById('custom-scrollbar-style')) {
        const style = document.createElement('style');
        style.id = 'custom-scrollbar-style';
        style.innerHTML = `
            #planet-info::-webkit-scrollbar {
                width: 8px;
                background: #222;
                border-radius: 8px;
            }
            #planet-info::-webkit-scrollbar-thumb {
                background: linear-gradient(120deg, #4ddcff 60%, #222 100%);
                border-radius: 8px;
                min-height: 30px;
            }
            #planet-info::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(120deg, #4ddcff 80%, #222 100%);
            }
        `;
        document.head.appendChild(style);
    }
    infoPanel.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:30px 0;">
            <span style="font-size:3em; color:#4ddcff; margin-bottom:10px;">🪐</span>
            <h3 style="color:#fff; margin-bottom:10px;">Clique em um planeta para exibir informações</h3>
            <p style="color:#b0eaff; font-size:1.1em; text-align:center; max-width:300px;">Explore o sistema solar interativo clicando nos planetas para saber mais sobre cada um deles!</p>
        </div>
    `;
}

//  nova função:
function hidePlanetInfo() {
    document.getElementById('info-panel').classList.add('hidden');
    document.getElementById('info-overlay').style.display = 'none';
    
    // Remove destaque do planeta selecionado
    if (selectedObject) {
        selectedObject.material.emissive.setHex(selectedObject.userData.originalEmissive || 0x000000);
        selectedObject = null;
    }
}

// Atualize o event listener para fechar a barra ao clicar fora dela ou no overlay
document.addEventListener('mousedown', function(event) {
    const infoPanel = document.getElementById('info-panel');
    const infoOverlay = document.getElementById('info-overlay');
    const controlsContainer = document.getElementById('controls-container');
    const isClickInsidePanel = infoPanel && infoPanel.contains(event.target);
    const isClickOnOverlay = infoOverlay && event.target === infoOverlay;
    const isClickInControls = controlsContainer && controlsContainer.contains(event.target);

    // Verifica se clicou em um planeta (canvas do three.js)
    const isCanvas = event.target === renderer.domElement;
    // Só fecha se não for clique no painel, overlay, canvas (planeta) ou controles
    if ((isClickOnOverlay || (!isClickInsidePanel && !isCanvas && !isClickInControls)) && infoPanel && !infoPanel.classList.contains('hidden')) {
        hidePlanetInfo();
    }
});

function selectPlanet(planet) {
    if (selectedObject) {
        selectedObject.material.emissive.setHex(selectedObject.userData.originalEmissive || 0x000000);
    }
    
    selectedObject = planet;
    selectedObject.userData.originalEmissive = selectedObject.material.emissive.getHex();
    selectedObject.material.emissive.setHex(0xffff00);
    
    showPlanetInfo(planet.userData.info);

}


function toggleOrbits() {
    showOrbits = !showOrbits;
    orbits.forEach(orbit => {
        orbit.visible = showOrbits;
    });
}

function toggleRotation() {
    rotationEnabled = !rotationEnabled;
}

function updateSpeed(e) {
    animationSpeed = parseFloat(e.target.value);
}

let selectedObject = null;

function onDocumentClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(planets, true);
    
    if (intersects.length > 0) {
        // Remove destaque do objeto anterior
        if (selectedObject) {
            selectedObject.material.emissive.setHex(selectedObject.userData.originalEmissive || 0x000000);
        }
        
        selectedObject = intersects[0].object;
        selectedObject.userData.originalEmissive = selectedObject.material.emissive.getHex();
        selectedObject.material.emissive.setHex(0xffff00);
        
        showPlanetInfo(selectedObject.userData.info);
    }
}

function initLights() {
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Luz direcional principal (Sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 0, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Luz de preenchimento
    const fillLight = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    fillLight.position.set(1, 1, 1);
    scene.add(fillLight);
}

function createAsteroidBelt() {
    const textureLoader = new THREE.TextureLoader();
    const asteroidTexture = textureLoader.load('textures/asteroid.jpg');
    const geometry = new THREE.SphereGeometry(0.2, 8, 8);
    const material = new THREE.MeshPhongMaterial({ map: asteroidTexture });
    
    for (let i = 0; i < 500; i++) {
        const asteroid = new THREE.Mesh(geometry, material.clone());
        const distance = THREE.MathUtils.randFloat(130, 150);
        const angle = THREE.MathUtils.randFloat(0, Math.PI * 2);
        
        asteroid.position.x = distance * Math.cos(angle);
        asteroid.position.z = distance * Math.sin(angle);
        asteroid.position.y = THREE.MathUtils.randFloat(-5, 5);
        
        asteroid.userData = {
            speed: THREE.MathUtils.randFloat(0.1, 0.3),
            angle: angle,
            distance: distance
        };
        
        solarSystem.add(asteroid);
        planets.push(asteroid);
    }
}
document.querySelectorAll('#controls button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.boxShadow = '0 0 20px rgba(77, 221, 255, 0.8)';
        setTimeout(() => {
            this.style.boxShadow = '0 0 10px rgba(77, 221, 255, 0.3), inset 0 0 5px rgba(77, 221, 255, 0.2)';
        }, 300);
    });
});
const controlsContainer = document.getElementById('controls-container');
const controlsHandle = document.getElementById('controls-handle');

// Estado inicial (recolhido por padrão)
let controlsCollapsed = true;
controlsContainer.classList.add('collapsed');

// Alternar estado ao clicar no ícone
controlsHandle.addEventListener('click', function() {
    controlsCollapsed = !controlsCollapsed;
    
    if (controlsCollapsed) {
        controlsContainer.classList.add('collapsed');
    } else {
        controlsContainer.classList.remove('collapsed');
    }
});

// Fechar ao clicar fora (opcional)
document.addEventListener('click', function(event) {
    if (!controlsContainer.contains(event.target) && !controlsCollapsed) {
        controlsContainer.classList.add('collapsed');
        controlsCollapsed = true;
    }
});
// (Removido: não define scene.background diretamente)
function createESOBackground() {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('textures/eso0932a.jpg', (texture) => {
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.encoding = THREE.sRGBEncoding;
        // Esfera bem maior para cobrir todo o fundo, mesmo em zoom out
        const geometry = new THREE.SphereGeometry(2000, 60, 40);
        geometry.scale(-1, 1, 1); // Garante inversão para dentro
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.BackSide,
            transparent: false,
            opacity: 1
        });
        backgroundSphere = new THREE.Mesh(geometry, material);
        backgroundSphere.renderOrder = -1;
        scene.add(backgroundSphere);
    }, undefined, (error) => {
        console.error('Erro ao carregar background:', error);
        // Fallback procedural se a imagem não carregar
        createProceduralStars();
    });
}

// Chame esta função no seu init(), antes de criar os planetas
createESOBackground();



