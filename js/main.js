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

  /* ---------- rolagem com inércia + efeitos de scroll ---------- */
  const REDUCED_M = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inertiaOn = matchMedia('(hover: hover) and (pointer: fine)').matches && !REDUCED_M;
  const html = doc.documentElement;
  const marqueeGroups = $$('.marquee-group');
  const mediaImgs = $$('.media-frame img');
  let targetY = scrollY, currentY = scrollY, lastIntent = 0, vel = 0;

  if (inertiaOn) {
    html.classList.add('smooth');

    addEventListener('wheel', e => {
      if (e.ctrlKey || doc.body.classList.contains('menu-open')) return;
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      targetY += dy;
      lastIntent = performance.now();
    }, { passive: false });

    /* links internos deslizam com a mesma inércia */
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const el = a.getAttribute('href').length > 1 && $(a.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, '', a.getAttribute('href'));
      targetY = el.getBoundingClientRect().top + scrollY - 76;
      lastIntent = performance.now();
    }));
  }

  if (!REDUCED_M) {
    const frame = () => {
      if (inertiaOn) {
        /* interferência externa (barra de rolagem, teclado): ressincroniza */
        if (Math.abs(currentY - scrollY) > 2) { currentY = targetY = scrollY; }
        const max = html.scrollHeight - innerHeight;
        targetY = Math.max(0, Math.min(targetY, max));
        const prev = currentY;
        currentY += (targetY - currentY) * 0.095;
        if (Math.abs(targetY - currentY) < 0.5) currentY = targetY;
        if (Math.abs(currentY - scrollY) >= 0.5) scrollTo(0, currentY);
        vel = currentY - prev;
      } else {
        const y = scrollY;
        vel = y - (frame.lastY ?? y);
        frame.lastY = y;
      }

      /* parallax das mídias */
      const vh = innerHeight;
      for (const img of mediaImgs) {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -60 || r.top > vh + 60) continue;
        const prog = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        img.style.setProperty('--py', (prog * -7).toFixed(2) + '%');
      }

      /* letreiro inclina com a velocidade */
      if (marqueeGroups.length) {
        const sk = Math.max(-6, Math.min(6, vel * 0.35));
        for (const g of marqueeGroups) g.style.transform = `skewX(${sk.toFixed(2)}deg)`;
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* item do menu acende na seção ativa */
  const navMap = new Map($$('.nav a[href^="#"]').map(a => [a.getAttribute('href').slice(1), a]));
  const secIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      $$('.nav a').forEach(a => a.classList.remove('active'));
      navMap.get(en.target.id)?.classList.add('active');
    });
  }, { rootMargin: '-35% 0px -60% 0px' });
  ['sobre', 'servicos', 'projetos', 'contato'].forEach(id => {
    const s = doc.getElementById(id);
    if (s) secIO.observe(s);
  });

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

    /* sem hover (celular/tablet): alterna o glitch a cada 5s */
    if (matchMedia('(hover: none)').matches) {
      let alt = false;
      const flip = () => {
        alt = !alt;
        const target = alt ? ALT : NAME;
        if (reducedMotion) render(target);
        else glitchTo(target);
      };
      let timer = setInterval(flip, 5000);
      doc.addEventListener('visibilitychange', () => {
        clearInterval(timer);
        if (!doc.hidden) timer = setInterval(flip, 5000);
      });
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
