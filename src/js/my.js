function setRightVhProperty() {
    let one_vh = (window.innerHeight / 100);
    document.documentElement.style.setProperty('--vh', one_vh + 'px');
}

export default function init() {
    setRightVhProperty();
    window.addEventListener('resize', function (event) {
        setRightVhProperty();
    });
}

window.initResponsiveMap = function (element) {
    let map_container = element.closest('.responsive-map');
    if (map_container) {
        map_container.classList.remove('d-none');
    }
};