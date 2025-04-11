$(function() {
    const $viewer = $('#manual-viewer');
    const $wrapper = $('.manual-wrapper');
    $viewer.empty();

    // Pagini (copertă, conținut, copertă spate)
    const pages = [
        'assets/pages/cop1.jpg',
        'assets/pages/cop2.jpg',
        ...Array.from({ length: 112 }, (_, i) => `assets/pages/p${String(i + 1).padStart(3, '0')}.jpg`),
        'assets/pages/cop3.jpg',
        'assets/pages/cop4.jpg'
    ];

    pages.forEach(src => {
        $viewer.append(`<div class="page" style="background-image:url('${src}')"></div>`);
    });

    function getDisplayMode() {
        return $(window).width() >= 768 ? 'double' : 'single';
    }

    function scaleManual(displayMode) {
        const isDouble = displayMode === 'double';
        const pageW = 576;
        const pageH = 752;
        const viewerW = isDouble ? pageW * 2 : pageW;
        const viewerH = pageH;

        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const scale = Math.min(winW / viewerW, winH / viewerH);

        // Verifică dacă este dispozitiv mobil
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            $wrapper.css({
                width: '100%',
                height: '100%',
                left: '0',
                top: '0',
                position: 'fixed',
                transform: 'none'
            });

            $viewer.css({
                width: `${viewerW}px`,
                height: `${viewerH}px`,
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${scale * 0.95})`,
                transformOrigin: 'center center'
            });
        } else {
            $wrapper.css({
                width: `${viewerW}px`,
                height: `${viewerH}px`,
                left: '50%',
                top: '50%',
                position: 'absolute',
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: 'center center'
            });

            $viewer.css({
                width: `${viewerW}px`,
                height: `${viewerH}px`
            });
        }

        $viewer.turn('size', viewerW, viewerH);
        $viewer.turn('resize');
    }

    function fixPageForDisplayMode(page, display) {
        if (display === 'double') {
            return page % 2 === 0 ? page - 1 : page;
        }
        return page;
    }

    $viewer.turn({
        width: 1152,
        height: 752,
        display: getDisplayMode(),
        autoCenter: true,
        acceleration: false,
        gradients: true,
        duration: 500,
        elevation: 100,
        pages: pages.length,
        page: 1,
        when: {
            turned: function(e, page) {
                scaleManual(getDisplayMode());
            },
            ready: function() {
                scaleManual(getDisplayMode());
            }
        }
    });

    $(window).on('resize', function() {
        const newDisplay = getDisplayMode();
        const currentPage = $viewer.turn('page');
        const fixedPage = fixPageForDisplayMode(currentPage, newDisplay);

        $viewer.turn('display', newDisplay);
        $viewer.turn('page', fixedPage);
        setTimeout(() => scaleManual(newDisplay), 10);
    });

    // Navigare cu tastele ← și →
    $(window).on('keydown', function(e) {
        const key = e.keyCode;
        const page = $viewer.turn('page');
        const max = $viewer.turn('pages');
        const display = $viewer.turn('display');
        const step = display === 'double' ? 2 : 1;

        if (key === 37 && page > 1) {
            $viewer.turn('page', Math.max(1, page - step));
        }
        if (key === 39 && page < max) {
            $viewer.turn('page', Math.min(max, page + step));
        }
    });

    scaleManual(getDisplayMode());
});