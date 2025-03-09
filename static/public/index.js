"use strict";

const form = document.getElementById("uv-form");
const address = document.getElementById("uv-address");
const searchEngine = document.getElementById("uv-search-engine");
const error = document.getElementById("uv-error");
const errorCode = document.getElementById("uv-error-code");
const connection = new BareMux.BareMuxConnection("/baremux/worker.js");
const uvFrame = document.getElementById("uv-frame");
const proxyContainer = document.getElementById("proxy-container");
const loadingPage = document.getElementById("loading-page");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    loadingPage.style.display = 'flex';

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    const url = search(address.value, searchEngine.value);

    uvFrame.style.display = "block";
    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    if (await connection.getTransport() !== "/epoxy/index.mjs") {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    uvFrame.onload = function() {
        loadingPage.style.display = 'none';
    };

    uvFrame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    proxyContainer.style.display = 'none';
    document.body.style.overflow = 'hidden';

    uvFrame.addEventListener('load', function() {
        loadingPage.style.display = 'none';
    });

    uvFrame.addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            loadingPage.style.display = 'flex';
        }
    });

});

window.onload = function() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#88c0d0' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
            opacity: { value: 0.5, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 2, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: '#88c0d0', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true }, modes: { repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 } } },
        retina_detect: true
    });
};

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(event) {
        if (uvFrame.style.display === 'block' && !uvFrame.contains(event.target)) {
            uvFrame.style.display = 'none';
            proxyContainer.style.display = 'block';
            document.body.style.overflow = 'visible';
        }
    });
});
