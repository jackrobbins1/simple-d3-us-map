// command to use rollup.js::: ./node_modules/.bin/rollup
import usMap from './map.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';

const mapContainer = document.getElementById('us-map');

let width, height, scale;

function setMapSize() {
    width = mapContainer.offsetWidth;
    height = width * 0.625;
    // Pythagorean theorem below to calc scale ;-)
    scale = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))
}
setMapSize();

mapContainer.style.height = `${height}`;

usMap(mapContainer, width, height, scale, true);

let resizeMapDelay;

window.addEventListener('resize', () => {
    clearTimeout(resizeMapDelay);
    resizeMapDelay = setTimeout(() => {
        setMapSize();
        mapContainer.removeChild(mapContainer.childNodes[0]);
        usMap(mapContainer, width, height, scale, false);
    }, 1500);
});