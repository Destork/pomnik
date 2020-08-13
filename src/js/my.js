function setRightVhProperty() {
    var one_vh = (window.innerHeight / 100);
    document.documentElement.style.setProperty('--vh', one_vh + 'px');
}

function init(event) {
    setRightVhProperty();
    window.addEventListener('resize', function (event) {
        setRightVhProperty();
    });
    Navbars.init();
    Dropdown.init();
}

window.addEventListener('load', init);

window.Navbars = {
    init: function () {
        var togglers = document.querySelectorAll('.navbar-toggler');
        if (togglers.length) {
            togglers.forEach(function (toggler) {
                toggler.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var toggler = getToggler('navbar-toggler', event.target);
                    if (toggler) {
                        var is_show_action = Collapse.isShowAction(toggler);
                        Navbars.hideAll();
                        if (is_show_action) {
                            Collapse.show(toggler);
                        }
                    }
                });
            });
        }
    },
    hideAll: function () {
        var togglers = document.querySelectorAll('.navbar-toggler');
        if (togglers.length) {
            togglers.forEach(Collapse.hide);
        }
    }
};

window.Collapse = {
    hide: function (toggler) {
        if (toggler) {
            var target = Collapse.getTargetElement(toggler);
            if (target) {
                toggler.setAttribute('aria-expanded', 'false');
                toggler.classList.add('collapsed');
                target.classList.remove('show');
            }
        }
    },
    show: function (toggler) {
        if (toggler) {
            var target = Collapse.getTargetElement(toggler);
            if (target) {
                toggler.setAttribute('aria-expanded', 'true');
                toggler.classList.remove('collapsed');
                target.classList.add('show');
            }
        }
    },
    isShowAction: function (toggler) {
        return toggler
            && toggler.hasAttribute('aria-expanded')
            && toggler.getAttribute('aria-expanded') === 'false';
    },
    getTargetElement: function (toggler) {
        var target_elem = null;
        var target = toggler.hasAttribute('data-target')
            ? toggler.getAttribute('data-target')
            : (
                toggler.hasAttribute('href')
                    ? toggler.getAttribute('href')
                    : null
            );
        if (target) {
            target_elem = document.querySelector(target);
        }
        return target_elem;
    }
};

function findSvgContainer(element) {

}

window.Dropdown = {
    init: function () {
        var togglers = document.querySelectorAll('.dropdown-toggle');
        if (togglers) {
            togglers.forEach(function (toggler) {
                toggler.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var toggler = getToggler('dropdown-toggle', event.target);
                    if (toggler) {
                        var is_show_action = Dropdown.isShowAction(toggler);
                        Dropdown.hideAll();
                        if (is_show_action) {
                            Dropdown.show(toggler);
                        }
                    }
                });
            });
        }
    },
    show: function (toggler) {
        if (toggler) {
            var container = toggler.closest('.dropdown');
            if (container) {
                container.classList.add('show');
                var menu = container.querySelector('.dropdown-menu');
                if (menu) {
                    toggler.setAttribute('aria-expanded', 'true');
                    menu.classList.add('show');
                }
            }
        }
    },
    hideAll: function () {
        var togglers = document.querySelectorAll('.dropdown-toggle');
        if (togglers.length) {
            togglers.forEach(Dropdown.hide);
        }
    },
    hide: function (toggler) {
        if (toggler) {
            var container = toggler.closest('.dropdown');
            if (container) {
                container.classList.remove('show');
                var menu = container.querySelector('.dropdown-menu');
                if (menu) {
                    toggler.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('show');
                }
            }
        }
    },
    isShowAction: Collapse.isShowAction
}

function getToggler(toggler_class, element) {
    return element.classList.contains(toggler_class) ? element : element.closest('.' + toggler_class);
}