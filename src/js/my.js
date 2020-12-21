function setRightVhProperty() {
    let one_vh = (window.innerHeight / 100);
    document.documentElement.style.setProperty('--vh', one_vh + 'px');
}

export default function init() {
    setRightVhProperty();
    initLazyLoading();
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

function initLazyLoading() {
    if ("loading" in HTMLImageElement.prototype) {
        var lazyEls = document.querySelectorAll("[loading=lazy]");
        lazyEls.forEach(function(lazyEl) {
            lazyEl.setAttribute(
                "src",
                lazyEl.getAttribute("data-src")
            );
        });
    } else {
        // Dynamically include a lazy loading library of your choice
        // Here including vanilla-lazyload
        var script             = document.createElement("script");
        script.async           = true;
        script.src             =
            "https://cdn.jsdelivr.net/npm/vanilla-lazyload@17.3.0/dist/lazyload.min.js";
        window.lazyLoadOptions = {
            elements_selector: "[loading=lazy]"
            //eventually more options here
        };
        document.body.appendChild(script);
    }
}