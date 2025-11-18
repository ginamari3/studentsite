/* js/script.js
   - mobile menu toggle
   - collapsing search on small screens
   - membership hover/focus expand
   - destinations carousel controls + snap
*/

document.addEventListener('DOMContentLoaded', () => {

    /* ------- NAV MENU TOGGLE ------- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            const isActive = navbar.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isActive));
        });
    }

    /* ------- COLLAPSIBLE SEARCH BOX (small screens) ------- */
    const searchBox = document.querySelector('.search-box');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBox && searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            // On very small screens, expand input on first tap
            if (window.innerWidth <= 500) {
                if (!searchBox.classList.contains('active')) {
                    e.preventDefault();
                    searchBox.classList.add('active');
                    const input = searchBox.querySelector('input');
                    if (input) input.focus();
                    return;
                }
            }
            // else allow normal submit/behavior (if you wire a search endpoint)
        });

        // If window resizes larger, ensure search is visible
        window.addEventListener('resize', () => {
            if (window.innerWidth > 500) {
                searchBox.classList.remove('active');
            }
        });
    }


    /* ------- MEMBERSHIP HOVER / FOCUS (no dip) ------- */
    const mCards = Array.from(document.querySelectorAll('.m-card'));

    function activateMembership(el) {
        if (!el || el.classList.contains('active')) return;

        // add active first to avoid a frame with "no active"
        el.classList.add('active');

        // then remove from others on the next frame
        requestAnimationFrame(() => {
            mCards.forEach(c => { if (c !== el) c.classList.remove('active'); });
        });
    }

    // keep the first card active by default (already in your HTML)
    mCards.forEach(card => {
        card.addEventListener('mouseenter', () => activateMembership(card));
        card.addEventListener('focusin', () => activateMembership(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateMembership(card);
            }
        });
    });



    /* ------- DESTINATIONS CAROUSEL ------- */
    const carousel = document.querySelector('.carousel');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (!carousel) return;

    function computeCardWidth() {
        const card = carousel.querySelector('.d-card');
        if (!card) return 260;
        const style = getComputedStyle(card);
        // margin/gap is handled by CSS gap; we approximate with offsetWidth + gap
        const gap = parseInt(getComputedStyle(carousel).gap || 16, 10);
        return Math.round(card.offsetWidth + gap);
    }

    leftBtn && leftBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -computeCardWidth(), behavior: 'smooth' });
    });

    rightBtn && rightBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: computeCardWidth(), behavior: 'smooth' });
    });

    // keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') carousel.scrollBy({ left: -computeCardWidth(), behavior: 'smooth' });
        if (e.key === 'ArrowRight') carousel.scrollBy({ left: computeCardWidth(), behavior: 'smooth' });
    });

    // Snap to nearest card after user stops scrolling
    let isScrolling;
    carousel.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            const cardWidth = computeCardWidth();
            const index = Math.round(carousel.scrollLeft / cardWidth);
            carousel.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
        }, 120);
    });

    /* Optional: enable focus outline support (accessibility)
       Make carousel focusable with tabindex="0" in HTML (already set)
    */

});


// --- Reveal on scroll: Booking, Flight Detail, Cloud Sections ---
document.addEventListener('DOMContentLoaded', () => {
    const revealSections = document.querySelectorAll(
        '.booking-made, .flight-detail, #memberships, #destinations'
    );
    if (!revealSections.length) return;

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
            (entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view'); // triggers CSS animations
                        o.unobserve(entry.target);             // play once
                    }
                });
            },
            { root: null, threshold: 0.2 } // reveal when ~20% visible
        );
        revealSections.forEach(sec => obs.observe(sec));
    } else {
        // Fallback: show everything
        revealSections.forEach(sec => sec.classList.add('in-view'));
    }
});


// --- Reveal sections on scroll: Booking + Flight Detail ---
document.addEventListener('DOMContentLoaded', () => {
    const revealSections = document.querySelectorAll('.flight-detail');
    if (!revealSections.length) return;

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
            (entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view'); // triggers the CSS animations
                        o.unobserve(entry.target);             // play once
                    }
                });
            },
            { root: null, threshold: 0.2 } // ~20% visible
        );

        revealSections.forEach(sec => obs.observe(sec));
    } else {
        // Fallback for very old browsers
        revealSections.forEach(sec => sec.classList.add('in-view'));
    }
});


// --- Booking Made Easy: reveal on scroll ---
document.addEventListener('DOMContentLoaded', () => {
    const bookingSection = document.querySelector('.booking-made');

    if (!bookingSection) return;

    // If IntersectionObserver is available, reveal when ~20% is visible
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(
            (entries, o) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bookingSection.classList.add('in-view');
                        o.unobserve(entry.target); // play once
                    }
                });
            },
            { root: null, threshold: 0.2 }
        );
        obs.observe(bookingSection);
    } else {
        // Fallback for very old browsers: just show
        bookingSection.classList.add('in-view');
    }
});


// Journeys: idle-until-scroll
(function () {
    const section = document.getElementById('journeys');
    if (!section || 'IntersectionObserver' in window === false) {
        // Fallback: show immediately
        section && section.classList.add('in-view');
        return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('in-view');
                obs.unobserve(entry.target); // play once
            }
        });
    }, { root: null, threshold: 0.25 });
    io.observe(section);
})();
