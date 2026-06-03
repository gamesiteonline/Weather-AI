/* ============================================
   Three.js Background Scene
   Ambient 3D animation for Africa Weather AI
   ============================================ */

class BackgroundScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.objects = [];
        this.animationId = null;
        this.init();
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    init() {
        const container = document.getElementById('canvas-container');
        if (!container) return;

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null;
        this.scene.fog = new THREE.Fog(0x0f1419, 100, 1000);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x0f1419, 0);
        container.appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xff6b35, 0.8);
        directionalLight.position.set(10, 10, 10);
        this.scene.add(directionalLight);

        // Create background objects
        this.createParticles();
        this.createFloatingShapes();
        this.createClouds && this.createClouds();
        this.createRain && this.createRain();
        this.createSand && this.createSand();
        
        // Start animation
        this.animate();
    }

    createParticles() {
        const particleCount = 100;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 200;
            positions[i + 1] = (Math.random() - 0.5) * 200;
            positions[i + 2] = (Math.random() - 0.5) * 200;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x1AB5A3,
            size: 0.5,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);

        // Store particle object for animation
        this.particleSystem = {
            object: particles,
            velocity: new Float32Array(particleCount * 3)
        };

        // Initialize velocities
        for (let i = 0; i < this.particleSystem.velocity.length; i++) {
            this.particleSystem.velocity[i] = (Math.random() - 0.5) * 0.5;
        }
    }

    createClouds() {
        const cloudCount = 40;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(cloudCount * 3);
        const sizes = new Float32Array(cloudCount);

        for (let i = 0; i < cloudCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 1] = 60 + Math.random() * 80;
            positions[i * 3 + 2] = -50 + Math.random() * -200;
            sizes[i] = 40 + Math.random() * 80;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 20,
            transparent: true,
            opacity: 0.12,
            depthWrite: false
        });

        const clouds = new THREE.Points(geometry, material);
        this.scene.add(clouds);
        this.cloudSystem = { object: clouds, baseOpacity: 0.12 };
    }

    createRain() {
        const rainCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(rainCount * 3);
        const velocities = new Float32Array(rainCount);

        for (let i = 0; i < rainCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 400;
            positions[i * 3 + 1] = Math.random() * 200;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 400;
            velocities[i] = 0.6 + Math.random() * 1.4;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x9fd3ff,
            size: 0.8,
            transparent: true,
            opacity: 0.0,
            depthWrite: false
        });

        const rain = new THREE.Points(geometry, material);
        this.scene.add(rain);
        this.rainSystem = { object: rain, velocities };
    }

    createSand() {
        const sandCount = 600;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(sandCount * 3);
        const velocities = new Float32Array(sandCount);

        for (let i = 0; i < sandCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 600;
            positions[i * 3 + 1] = Math.random() * 60 - 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
            velocities[i] = 0.2 + Math.random() * 0.8;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0xD2B48C,
            size: 0.6,
            transparent: true,
            opacity: 0.0,
            depthWrite: false
        });

        const sand = new THREE.Points(geometry, material);
        this.scene.add(sand);
        this.sandSystem = { object: sand, velocities };
    }

    createFloatingShapes() {
        // Create rotating geometric shapes
        const shapes = [
            { geometry: new THREE.IcosahedronGeometry(2, 4), position: [-30, 30, 0] },
            { geometry: new THREE.OctahedronGeometry(2.5, 2), position: [30, -20, -20] },
            { geometry: new THREE.TetrahedronGeometry(3, 2), position: [0, 0, -40] },
            { geometry: new THREE.DodecahedronGeometry(2, 0), position: [-20, -30, 0] },
            { geometry: new THREE.BoxGeometry(2, 2, 2), position: [25, 20, -30] }
        ];

        shapes.forEach((shape, index) => {
            const material = new THREE.MeshPhongMaterial({
                color: [0xff6b35, 0x004e89, 0x1ab5a3, 0x2dd4bf, 0xffa502][index % 5],
                emissive: [0xff6b35, 0x004e89, 0x1ab5a3, 0x2dd4bf, 0xffa502][index % 5],
                emissiveIntensity: 0.2,
                wireframe: Math.random() > 0.5,
                transparent: true,
                opacity: 0.3
            });

            const mesh = new THREE.Mesh(shape.geometry, material);
            mesh.position.set(...shape.position);
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;

            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.01,
                    y: (Math.random() - 0.5) * 0.01,
                    z: (Math.random() - 0.5) * 0.01
                },
                initialScale: mesh.scale.x,
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.01 + Math.random() * 0.01
            };

            this.scene.add(mesh);
            this.objects.push(mesh);
        });
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);

        // Animate particles
        if (this.particleSystem) {
            const positions = this.particleSystem.object.geometry.attributes.position.array;
            const velocity = this.particleSystem.velocity;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocity[i];
                positions[i + 1] += velocity[i + 1];
                positions[i + 2] += velocity[i + 2];

                // Wrap around
                if (Math.abs(positions[i]) > 100) velocity[i] *= -1;
                if (Math.abs(positions[i + 1]) > 100) velocity[i + 1] *= -1;
                if (Math.abs(positions[i + 2]) > 100) velocity[i + 2] *= -1;
            }
            this.particleSystem.object.geometry.attributes.position.needsUpdate = true;
        }

        // Animate floating shapes
        this.objects.forEach((obj) => {
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;

            // Float animation
            obj.position.y += Math.sin(Date.now() * obj.userData.floatSpeed * 0.001 + obj.userData.floatOffset) * 0.01;
        });

        // Animate rain
        if (this.rainSystem) {
            const positions = this.rainSystem.object.geometry.attributes.position.array;
            const vel = this.rainSystem.velocities;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= vel[i / 3];
                if (positions[i + 1] < -50) positions[i + 1] = 200 + Math.random() * 100;
            }
            this.rainSystem.object.geometry.attributes.position.needsUpdate = true;
        }

        // Animate sand
        if (this.sandSystem) {
            const positions = this.sandSystem.object.geometry.attributes.position.array;
            const vel = this.sandSystem.velocities;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += vel[i / 3] * 0.6;
                if (positions[i] > 400) positions[i] = -400 + Math.random() * 20;
            }
            this.sandSystem.object.geometry.attributes.position.needsUpdate = true;
        }

        // Slight cloud movement
        if (this.cloudSystem) {
            const positions = this.cloudSystem.object.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += Math.sin((Date.now() + i) * 0.0001) * 0.05;
            }
            this.cloudSystem.object.geometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    };

    handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    updateWeatherEffects(weather) {
        try {
            const precip = weather?.current?.precipitation || 0;
            const condition = (weather?.current?.condition || '').toLowerCase();
            const humidity = weather?.current?.humidity || 0;
            const wind = weather?.current?.windSpeed || 0;

            // Rain intensity based on precipitation
            if (this.rainSystem) {
                const rainOpacity = Math.min(1, Math.max(0.05, precip / 40));
                this.rainSystem.object.material.opacity = Math.min(0.9, 0.2 + rainOpacity);
                this.rainSystem.object.visible = precip > 1 || condition.includes('rain') || condition.includes('storm');
            }

            // Clouds opacity based on humidity and condition
            if (this.cloudSystem) {
                const cloudOpacity = Math.min(0.6, 0.05 + (humidity / 200));
                this.cloudSystem.object.material.opacity = Math.max(0.02, cloudOpacity);
                this.cloudSystem.object.visible = humidity > 20 || condition.includes('cloud');
            }

            // Sand storms for hot dry windy conditions
            if (this.sandSystem) {
                const sandActive = (weather?.current?.temperature || 0) > 30 && humidity < 35 && wind > 20;
                this.sandSystem.object.visible = sandActive;
                this.sandSystem.object.material.opacity = sandActive ? 0.45 : 0.0;
            }
        } catch (e) {
            console.warn('updateWeatherEffects failed', e);
        }
    }

    dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.renderer && this.renderer.domElement) {
            this.renderer.domElement.remove();
        }
        this.renderer.dispose();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.backgroundScene = new BackgroundScene();
    });
} else {
    window.backgroundScene = new BackgroundScene();
}
