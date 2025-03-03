const timeDisplay = document.getElementById('time');
const dateDisplay = document.getElementById('date');
const appsBar = document.getElementById('apps-bar');
const appIcons = document.querySelectorAll('.app-icon');
const appListItems = document.querySelectorAll('.start-item');
const windows = document.querySelectorAll('.window');
const startButton = document.getElementById('start-button');
const appList = document.getElementById('app-list');
const creditsWindow = document.getElementById('credits-window');
const settingsWindow = document.getElementById('settings-window');
const settingsNavItems = document.querySelectorAll('.settings-nav-item');
const settingsSections = document.querySelectorAll('.settings-section');
const wallpaperButtons = document.querySelectorAll('#wallpaper-selector button');
const themeButtons = document.querySelectorAll('#theme-selector button');
const body = document.body;
const wallpaperDiv = document.getElementById('wallpaper');
const timeButton = document.getElementById('time-button');
const timePopup = document.getElementById('time-popup');
const wifiStatus = document.getElementById('wifi-status');
const defaultbtn = document.getElementById('defualtbtn');

function updateDateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString();
    timeDisplay.textContent = timeString;
    dateDisplay.textContent = dateString;
}

updateDateTime();
setInterval(updateDateTime, 1000);

timeButton.addEventListener('click', () => {
    timePopup.classList.toggle('hidden');
});

wifiStatus.textContent = "Connected";

// COMBINED event listener for app icons and start menu items:
[...appIcons, ...appListItems].forEach(item => {
    item.addEventListener('click', () => {
        const app = item.getAttribute('data-app');
        const window = document.getElementById(`${app}-window`);

        if (app === 'google') {
            const uvFrame = document.getElementById('uv-frame');
            const iframeSrc = new filePathHelper(item.dataset.iframeSrc).relativeToAbsolute();
            console.log(iframeSrc);
            uvFrame.src = iframeSrc;
        }

        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        window.classList.add('show');
        bringWindowToFront(window);

        if (appList.classList.contains('show')) { // Only close if app list is open
            appList.classList.remove('show');
        }

        setTimeout(() => {
            window.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        }, 10);

        if (app === 'credits') {
            setTimeout(initParticles, 10);
        } else if (app === 'settings') {
            setTimeout(initSettingsParticles, 10);
        }
    });
});


windows.forEach(window => {
    const minimizeButton = window.querySelector('.minimize');
    const maximizeButton = window.querySelector('.maximize');
    const closeButton = window.querySelector('.close');
    let isDragging = false;
    let initialMouseX, initialMouseY;
    let initialWindowX, initialWindowY;
    let lastMoveTime = 0;
    let overlay;
    let clickOffsetX, clickOffsetY;
    let initialWidth, initialHeight;

    minimizeButton.addEventListener('click', () => {
        window.classList.remove('show');
    });

    maximizeButton.addEventListener('click', () => {
        if (window.style.width === '100%') {
            window.style.width = initialWidth;
            window.style.height = initialHeight;
            window.style.top = '50px';
            window.style.left = '100px';
        } else {
            initialWidth = window.style.width;
            initialHeight = window.style.height;
            window.style.width = '100%';
            window.style.height = 'calc(96% - 50px)';
            window.style.top = '0';
            window.style.left = '0';
        }
    });

    closeButton.addEventListener('click', () => {
        window.classList.remove('show');
    });

    window.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('window-header')) {
            isDragging = true;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            initialWindowX = window.offsetLeft;
            initialWindowY = window.offsetTop;
            clickOffsetX = e.clientX - initialWindowX;
            clickOffsetY = e.clientY - initialWindowY;
            e.preventDefault();

            overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '38px';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = 'calc(100% - 38px)';
            overlay.style.zIndex = '2147483647';
            overlay.style.pointerEvents = 'none';
            window.appendChild(overlay);

            window.addEventListener('mousemove', dragMove);
        }
        bringWindowToFront(window);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            window.removeEventListener('mousemove', dragMove);
            if (overlay) {
                window.removeChild(overlay);
                overlay = null;
            }
        }
    });

    function dragMove(e) {
        if (!isDragging) return;
        const now = Date.now();
        if (now - lastMoveTime < 8) return;
        lastMoveTime = now;

        requestAnimationFrame(() => {
            window.style.left = e.clientX - clickOffsetX + 'px';
            window.style.top = e.clientY - clickOffsetY + 'px';
        });
        e.preventDefault();
    }

    window.addEventListener('mousemove', (e) => {
        if (window.style.resize === 'both' && e.buttons === 1) {
            window.style.width = e.clientX - window.offsetLeft + 'px';
            window.style.height = e.clientY - window.offsetTop + 'px';
        }
    });
});

startButton.addEventListener('click', () => {
    appList.classList.toggle('show');
});


function bringWindowToFront(window) {
    const allWindows = document.querySelectorAll('.window');
    let maxZIndex = 10;

    allWindows.forEach(win => {
        const zIndex = parseInt(win.style.zIndex) || 10;
        if (zIndex > maxZIndex) {
            maxZIndex = zIndex;
        }
    });

    window.style.zIndex = maxZIndex + 1;
}

function initParticles() {
    particlesJS('particles-canvas', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: '#d0d0d0' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: '#d0d0d0', opacity: 0.4, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } }
        },
        retina_detect: true
    });
}

function initSettingsParticles() {
    particlesJS('settings-particles-canvas', {
        particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: '#a0a0a0' },
            shape: { type: 'circle', stroke: { width: 0, color: '#000000' } },
            opacity: { value: 0.4, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
            size: { value: 2, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 120, color: '#a0a0a0', opacity: 0.3, width: 1 },
            move: { enable: true, speed: 1, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
            modes: { repulse: { distance: 150, duration: 0.4 }, push: { particles_nb: 3 } }
        },
        retina_detect: true
    });
}

settingsNavItems.forEach(item => {
    item.addEventListener('click', () => {
        settingsNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        const sectionId = item.getAttribute('data-section');
        settingsSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    });
});

// wallpaperButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         const wallpaper = button.getAttribute('data-wallpaper');
//         // wallpaperDiv.style.backgroundImage = `url('${wallpaper}')`;
//     });
// });

themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        body.setAttribute('data-theme', theme);
    });
});


const rainCanvas = document.getElementById('rainCanvas');
const ctx = rainCanvas.getContext('2d');
rainCanvas.width = window.innerWidth;
rainCanvas.height = window.innerHeight;
let raindrops = [];

for (let i = 0; i < 100; i++) {
    raindrops.push({
        x: Math.random() * rainCanvas.width,
        y: Math.random() * rainCanvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1
    });
}

function drawRain() {
    ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    for (let drop of raindrops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.stroke();
        drop.y += drop.speed;
        if (drop.y > rainCanvas.height) {
            drop.y = -drop.length;
            drop.x = Math.random() * rainCanvas.width;
        }
    }
}

setInterval(drawRain, 33);



window.addEventListener('resize', () => {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
});

let timeout;


function V2() {
    let shouldRun = true;
    function loop() {
        if (!shouldRun) return;

        const numRaindrops = 100;

        for (let i = 0; i < numRaindrops; i++) {
            const raindrop = document.createElement('div');
            raindrop.classList.add('raindrop');
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 5;
    
            raindrop.style.opacity = 1;
            raindrop.style.left = `${randomX}vw`;
            raindrop.style.animationDuration = `${Math.random() * 6 + 1}s`;
            raindrop.style.animationDelay = `-${randomDelay}s`;
    
            document.body.appendChild(raindrop);
        }
    }
    loop();

    console.log("Wallpaper changed to V2");
}

function stopV2() {
    clearTimeout(timeout);
}

function switchToV2() {
    V2();
    rainCanvas.style.opacity = 0;
}

function switchToV1() {
    rainCanvas.style.opacity = 1;
    const raindrops = document.querySelectorAll('.raindrop');
    raindrops.forEach(raindrop => raindrop.remove());
}

function switchToV3(){
    canvas3.style.opacity = 0;
}
