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
                setupNavigationButtons(); // Adaugă apelul aici
            }
        }
    });

    $(window).on('resize', function() {
        const newDisplay = getDisplayMode();
        const currentPage = $viewer.turn('page');
        const fixedPage = fixPageForDisplayMode(currentPage, newDisplay);

        $viewer.turn('display', newDisplay);
        $viewer.turn('page', fixedPage);
        setTimeout(() => {
            scaleManual(newDisplay);
            setupNavigationButtons(); // Reafișează butoanele după redimensionare
        }, 300);
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

    // Funcția de configurare a butoanelor de navigare
    function setupNavigationButtons() {
        console.log("Setup navigation buttons called"); // Pentru debugging

        // Verifică dacă butoanele există deja
        if ($('.nav-arrow').length === 0) {
            console.log("Adding navigation buttons"); // Pentru debugging

            // Adaugă butoanele
            $wrapper.append('<div class="nav-arrow prev-arrow">&#10094;</div>');
            $wrapper.append('<div class="nav-arrow next-arrow">&#10095;</div>');
        }

        // Adaugă funcționalitatea (se poate aplica indiferent dacă butoanele au fost adăugate manual sau prin JavaScript)
        $('.prev-arrow').off('click').on('click', function() {
            console.log("Previous button clicked"); // Pentru debugging
            const page = $viewer.turn('page');
            const display = $viewer.turn('display');
            const step = display === 'double' ? 2 : 1;

            if (page > 1) {
                $viewer.turn('page', Math.max(1, page - step));
            }
        });

        $('.next-arrow').off('click').on('click', function() {
            console.log("Next button clicked"); // Pentru debugging
            const page = $viewer.turn('page');
            const max = $viewer.turn('pages');
            const display = $viewer.turn('display');
            const step = display === 'double' ? 2 : 1;

            if (page < max) {
                $viewer.turn('page', Math.min(max, page + step));
            }
        });

        updateArrows();
    }

    // Actualizează vizibilitatea săgeților în funcție de pagina curentă
    function updateArrows() {
        const page = $viewer.turn('page');
        const max = $viewer.turn('pages');

        $('.prev-arrow').css('opacity', page <= 1 ? '0.2' : '0.7');
        $('.next-arrow').css('opacity', page >= max ? '0.2' : '0.7');
    }

    // Apelăm funcția inițial și la schimbarea paginii
    updateArrows();
    $viewer.on('turned', function() {
        updateArrows();
    });

    // Apel inițial pentru butoanele de navigare
    setupNavigationButtons();
    scaleManual(getDisplayMode());

    // Asigură-te că funcția este apelată după ce DOM-ul este complet încărcat
    $(document).ready(function() {
        setTimeout(function() {
            setupNavigationButtons();
        }, 500); // Oferă timp pentru ca turn.js să fie inițializat complet
    });
});
