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

        this.renderer.render(this.scene, this.camera);
    };

    handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

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
