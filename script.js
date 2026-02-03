// ============================================================
// 1.  PAGE LOAD  –  trigger hero staggered reveal
// ============================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');   // CSS animations key off this
});

// ============================================================
// 2.  SCROLL PROGRESS BAR
// ============================================================
const progressBar = document.createElement('div');
progressBar.className = 'progress-bar';
document.body.prepend(progressBar);

function updateProgress() {
    const scrollTop  = window.pageYOffset;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ============================================================
// 3.  MOBILE MENU TOGGLE
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const navbar     = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('bx-menu');
    icon.classList.toggle('bx-x');
});

navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('open');
        menuToggle.querySelector('i').classList.add('bx-menu');
        menuToggle.querySelector('i').classList.remove('bx-x');
    });
});

// ============================================================
// 4.  SMOOTH SCROLL  (header-offset aware)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 78;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ============================================================
// 5.  ACTIVE NAV LINK  +  HEADER SHRINK
// ============================================================
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.navbar a')];
const header   = document.querySelector('.header');

window.addEventListener('scroll', () => {
    // nav active
    let current = '';
    sections.forEach(sec => {
        if (window.pageYOffset >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // header shrink
    header.classList.toggle('scrolled', window.pageYOffset > 80);
}, { passive: true });

// ============================================================
// 6.  SCROLL-REVEAL  –  cards / groups  (staggered per group)
// ============================================================
function revealOnScroll(selector, baseDelay = 0) {
    const els = [...document.querySelectorAll(selector)];

    // group elements by their parent so each group staggers independently
    const groups = new Map();
    els.forEach(el => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });

    // set initial hidden state
    els.forEach(el => {
        el.style.opacity   = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = 'opacity .55s ease, transform .55s ease';
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = groups.get(entry.target.parentElement) || [];
            const idx      = siblings.indexOf(entry.target);
            const delay    = baseDelay + idx * 120;   // 120 ms stagger

            setTimeout(() => {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);

            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    els.forEach(el => obs.observe(el));
}

revealOnScroll('.proj-card');
revealOnScroll('.skill-group');
revealOnScroll('.cert-card');
revealOnScroll('.contact-card');

// ============================================================
// 7.  SKILL BARS  –  wipe + glow pulse when visible
// ============================================================
const skillSection  = document.querySelector('.skills');
let   skillsAnimated = false;

new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || skillsAnimated) return;
    skillsAnimated = true;

    document.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const target = bar.style.width;   // e.g. "85%"
        bar.style.width = '0';

        setTimeout(() => {
            bar.style.width = target;
            // short glow flash after fill finishes
            setTimeout(() => {
                bar.style.boxShadow = '0 0 8px var(--accent-glow)';
                setTimeout(() => { bar.style.boxShadow = 'none'; }, 400);
            }, 1200);
        }, 100 + i * 60);   // stagger each bar by 60 ms
    });
}, { threshold: 0.25 }).observe(skillSection);

// ============================================================
// 8.  BUTTON RIPPLE  (click effect)
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple   = document.createElement('span');
        ripple.className = 'ripple';

        const rect     = this.getBoundingClientRect();
        const size     = Math.max(rect.width, rect.height);
        ripple.style.width  = ripple.style.height = size + 'px';
        ripple.style.left   = (e.clientX - rect.left  - size / 2) + 'px';
        ripple.style.top    = (e.clientY - rect.top   - size / 2) + 'px';

        this.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// ============================================================
// 9.  CONTACT FORM  –  toast notification
// ============================================================
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    showToast('Thank you! I will get back to you soon.');
    this.reset();
});

function showToast(msg) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="bx bx-check-circle" style="font-size:1.4rem"></i><span>${msg}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 350);
    }, 3800);
}

// ============================================================
// 10. SCROLL-TO-TOP BUTTON
// ============================================================
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className  = 'scroll-top';
scrollTopBtn.innerHTML  = '<i class="bx bx-chevron-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.pageYOffset > 600);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================================
// 11. EASTER EGG
// ============================================================
console.log(
    '%c👋  Hey developer!  %c\n' +
    'Thanks for peeking at the code.\n' +
    'Contact: abhikumarnaths@gmail.com',
    'font-size:18px; color:#2563eb; font-weight:bold;',
    'font-size:13px; color:#8fa3b8;'
);