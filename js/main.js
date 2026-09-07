(() => {
  const doc = document;
  const $ = (s, c = doc) => c.querySelector(s);
  const $$ = (s, c = doc) => [...c.querySelectorAll(s)];

  /* header ganha fundo ao rolar */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* menu mobile */
  const toggle = $('.menu-toggle');
  const nav = $('#menu');
  const closeMenu = () => {
    doc.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const open = doc.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('#menu a').forEach(a => a.addEventListener('click', closeMenu));
  nav.addEventListener('click', e => { if (e.target === nav) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* serviços: acordeão (um aberto por vez, primeiro começa aberto) */
  const services = $$('.service');
  const openService = item => {
    item.classList.add('is-open');
    $('.service-head', item).setAttribute('aria-expanded', 'true');
    const body = $('.service-body', item);
    body.style.maxHeight = body.scrollHeight + 'px';
  };
  const closeService = item => {
    item.classList.remove('is-open');
    $('.service-head', item).setAttribute('aria-expanded', 'false');
    $('.service-body', item).style.maxHeight = '';
  };
  services.forEach(item => {
    $('.service-head', item).addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      services.forEach(closeService);
      if (!wasOpen) openService(item);
    });
  });
  if (services[0]) openService(services[0]);
  addEventListener('resize', () => {
    const open = $('.service.is-open .service-body');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

  /* reveal no scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* relógio do rodapé */
  const clock = $('#clock');
  if (clock) {
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };
    tick();
    setInterval(tick, 1000);
  }

  /* logo: glitch + troca pra "O Automatizador" no hover */
  const logo = $('.logo');
  if (logo) {
    const out = $('.logo-text', logo);
    const NAME = 'mateus.';
    const ALT = 'O Automatizador.'; // EDITE: o texto do glitch
    const GLYPHS = '!-_\\/[]{}=+*^?#@%$~';
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const render = text => {
      out.textContent = text.slice(0, -1);
      const dot = doc.createElement('span');
      dot.className = 'logo-dot';
      dot.textContent = text.slice(-1);
      out.append(dot);
    };

    let raf = null;
    const glitchTo = target => {
      cancelAnimationFrame(raf);
      const from = out.textContent;
      const dur = 560;
      const t0 = performance.now();
      logo.classList.add('is-glitching');
      const step = now => {
        const t = Math.min(1, (now - t0) / dur);
        let s = '';
        for (let i = 0; i < target.length; i++) {
          if (i / target.length < t * 1.2 - 0.2) s += target[i];
          else if (from[i] && Math.random() < 0.25) s += from[i];
          else s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        render(s);
        if (t < 1) raf = requestAnimationFrame(step);
        else { render(target); logo.classList.remove('is-glitching'); }
      };
      raf = requestAnimationFrame(step);
    };

    if (reducedMotion) {
      logo.addEventListener('mouseenter', () => render(ALT));
      logo.addEventListener('mouseleave', () => render(NAME));
      logo.addEventListener('focus', () => render(ALT));
      logo.addEventListener('blur', () => render(NAME));
    } else {
      logo.addEventListener('mouseenter', () => glitchTo(ALT));
      logo.addEventListener('mouseleave', () => glitchTo(NAME));
      logo.addEventListener('focus', () => glitchTo(ALT));
      logo.addEventListener('blur', () => glitchTo(NAME));
    }
  }

  /* ano automático */
  const year = $('#ano');
  if (year) year.textContent = new Date().getFullYear();

  /* cursor customizado (só desktop, respeita reduced motion) */
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (fine.matches && !reduced.matches) {
    doc.documentElement.classList.add('has-cursor');
    const dot = Object.assign(doc.createElement('div'), { className: 'cursor-dot' });
    const ring = Object.assign(doc.createElement('div'), { className: 'cursor-ring' });
    doc.body.append(dot, ring);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px,${y}px)`;
    });
    (function loop() {
      rx += (x - rx) * .16;
      ry += (y - ry) * .16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    doc.addEventListener('mouseover', e => {
      const hit = e.target.closest('a, button, .project-media');
      doc.body.classList.toggle('cursor-hover', !!hit);
    });
  }
})();
