// Scroll reveal (IntersectionObserver)
const revealItems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger: small delay based on index
                entry.target.style.transitionDelay = `${Math.min(index * 60, 300)}ms`;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.15 }
);

revealItems.forEach((el) => observer.observe(el));


document.querySelectorAll('.load-in').forEach(...)
