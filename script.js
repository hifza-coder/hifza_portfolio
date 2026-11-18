
import * as THREE from 'three';

// 3D ANIMATION

const stage = document.querySelector('#three-stage');

if (stage) {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        38,
        stage.clientWidth / stage.clientHeight,
        0.1,
        100
    );

    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        stage.clientWidth,
        stage.clientHeight
    );

    stage.appendChild(renderer.domElement);

    const group = new THREE.Group();

    scene.add(group);


    // Main 3D shape

    const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.55, 2),

        new THREE.MeshPhysicalMaterial({
            color: 0xb7c5cb,
            metalness: 0.8,
            roughness: 0.2,
            wireframe: true,
            transparent: true,
            opacity: 0.65
        })
    );

    group.add(shell);


    // Inner shape

    const inner = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.86, 1),

        new THREE.MeshBasicMaterial({
            color: 0xd7ff67,
            wireframe: true,
            transparent: true,
            opacity: 0.24
        })
    );

    group.add(inner);


    // First orbit ring

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.05, 0.009, 8, 180),

        new THREE.MeshBasicMaterial({
            color: 0xd7ff67,
            transparent: true,
            opacity: 0.8
        })
    );

    ring.rotation.set(1.1, 0.25, 0.2);

    group.add(ring);


    // Second orbit ring

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.006, 8, 180),

        new THREE.MeshBasicMaterial({
            color: 0x9db5c1,
            transparent: true,
            opacity: 0.45
        })
    );

    ring2.rotation.set(0.3, 1.15, 0.8);

    group.add(ring2);


    // Floating particles

    const count = 700;

    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {

        const r = 2.7 + Math.random() * 2;

        const theta = Math.random() * Math.PI * 2;

        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] =
            r * Math.sin(phi) * Math.cos(theta);

        positions[i * 3 + 1] =
            r * Math.sin(phi) * Math.sin(theta);

        positions[i * 3 + 2] =
            r * Math.cos(phi);
    }

    const points = new THREE.BufferGeometry();

    points.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    const stars = new THREE.Points(
        points,

        new THREE.PointsMaterial({
            color: 0xe3e9e5,
            size: 0.012,
            transparent: true,
            opacity: 0.7
        })
    );

    group.add(stars);


    // Lighting

    scene.add(
        new THREE.AmbientLight(0xffffff, 1.2)
    );

    const glow = new THREE.PointLight(
        0xd7ff67,
        16,
        12
    );

    glow.position.set(2, 2, 3);

    scene.add(glow);


    // Mouse movement

    let mx = 0;
    let my = 0;

    let tx = 0;
    let ty = 0;

    window.addEventListener('pointermove', (e) => {

        mx = (e.clientX / window.innerWidth - 0.5) * 2;

        my = (e.clientY / window.innerHeight - 0.5) * 2;

    }, { passive: true });


    // Screen resize

    function resize() {

        const w = stage.clientWidth;

        const h = stage.clientHeight;

        camera.aspect = w / h;

        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
    }

    window.addEventListener('resize', resize);


    // Animation loop

    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const t = clock.getElapsedTime();

        tx += (mx - tx) * 0.025;

        ty += (my - ty) * 0.025;

        group.rotation.y = t * 0.12 + tx * 0.2;

        group.rotation.x =
            Math.sin(t * 0.2) * 0.12 + ty * 0.12;

        ring.rotation.z += 0.0018;

        ring2.rotation.x += 0.001;

        stars.rotation.y -= 0.0003;

        renderer.render(scene, camera);
    }

    animate();
}


// SCROLL ANIMATION

const reveal = document.querySelectorAll(
    '.section-label, .about-grid, .edu, .skills-head, .skill-grid article, .experience-content, footer h2, .email'
);

reveal.forEach((el) => {
    el.classList.add('reveal');
});

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);
            }
        });

    },
    {
        threshold: 0.12
    }
);

reveal.forEach((el) => {
    observer.observe(el);
});


// LOADER

const loader = document.querySelector('#loader');

window.addEventListener('load', () => {

    setTimeout(() => {

        loader?.classList.add('done');

    }, 450);
});


// MOBILE MENU

const menu = document.querySelector('.menu');

const nav = document.querySelector('.nav');

menu?.addEventListener('click', () => {

    nav.classList.toggle('open');
});

document.querySelectorAll('#navLinks a').forEach((a) => {

    a.addEventListener('click', () => {

        nav.classList.remove('open');
    });
});
