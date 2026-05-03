/* ═══════════════════════════════════════
   DISAH – app.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll ──────────────────────────────
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Active nav link on scroll ─────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const activateLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', activateLink, { passive: true });

  // ── Smooth scroll for anchor links ────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      // cerrar navbar mobile
      const collapse = document.getElementById('navMenu');
      if (collapse && collapse.classList.contains('show')) {
        bootstrap.Collapse.getInstance(collapse)?.hide();
      }
    });
  });

  // ── Intersection Observer – fade-up ──────────
  const fadeEls = document.querySelectorAll(
    '.service-card, .prod-card, .clientes-col, .ci, .section-label, .section-title, .qs-tag'
  );
  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => observer.observe(el));

  // ── Filtros de productos ───────────────────────
  const filterBtns = document.querySelectorAll('.pf-btn');
  const prodItems = document.querySelectorAll('.prod-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      prodItems.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.cat === filter;
        if (match) {
          item.classList.remove('hidden');
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          const delay = i * 40;
          setTimeout(() => {
            item.style.transition = 'opacity .3s ease, transform .3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, delay);
        } else {
          item.classList.add('hidden');
          item.style.opacity = '';
          item.style.transform = '';
          item.style.transition = '';
        }
      });
    });
  });

  // ── Formulario de contacto ────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const checkbox = document.getElementById('aceptaPrivacidad');
      if (!checkbox.checked) {
        checkbox.classList.add('is-invalid');
        checkbox.focus();
        return;
      }
      checkbox.classList.remove('is-invalid');

      const btn = form.querySelector('button[type=submit]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';

      emailjs.sendForm('service_zrpmrb8', 'template_0garyxt', form)
        .then(() => {
          btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Mensaje enviado!';
          btn.style.background = '#16486e';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
          }, 3500);
        })
        .catch(() => {
          btn.innerHTML = '<i class="fas fa-times me-2"></i>Error al enviar, completa correctamente los datos.';
          btn.style.background = '#c0392b';
          setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    });
  }

  // ── Stagger animación cards (entrada inicial) ─
  document.querySelectorAll('.prod-item').forEach((el, i) => {
    el.style.animationDelay = `${i * 60}ms`;
  });

  // ── Cuenta regresiva stats (números animados) ─
  const animateCount = (el, target, suffix = '') => {
    let start = 0;
    const duration = 1600;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statNums = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const txt = e.target.textContent;
        if (txt.includes('+')) {
          const n = parseInt(txt.replace(/\D/g, ''));
          animateCount(e.target, n, '+');
        }
        statsObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));

});
