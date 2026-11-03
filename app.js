(() => {
  'use strict';

  // 'scroll' = figure rotates with scroll position; 'loop' = figure spins continuously while travelling
  const HERO_MODE = 'scroll';
  const VIDEO_SRC = './assets/figure-turntable.mp4';

  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Data ---------- */
  const capList = ['Digital sculpt', '8K resin print', 'Hand-painted', '1:6 — 1:10 scale', 'Ships worldwide'];
  const steps = [
    { no: '01', title: 'Brief', body: 'Send photos and tell us about pose, outfit and any props or scene details.' },
    { no: '02', title: 'Digital sculpt', body: 'We sculpt in 3D and share turntable renders for two revision rounds.' },
    { no: '03', title: 'Print & finish', body: 'Printed in 8K resin, cleaned, cured, primed and sanded by hand.' },
    { no: '04', title: 'Paint & ship', body: 'Hand-painted, sealed, mounted on its base and packed for delivery.' },
  ];
  const quotes = [
    { img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&h=160&q=80', name: 'Mina Seo', role: 'Engineering Lead, Halo Labs', text: 'My team gave me this for my birthday and I genuinely couldn’t speak. They got the glasses, the watch, even the drawer unit under my desk.' },
    { img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80', name: 'Daniel Okafor', role: 'Founder, Northfold', text: 'We ordered figures of our first ten employees for the anniversary. They now sit in reception and every visitor asks about them.' },
    { img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&h=160&q=80', name: 'Yuna & Jae Park', role: 'Wedding commission', text: 'Instead of a cake topper we got something we’ll keep forever. The paintwork on the dress is unreal up close.' },
    { img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=160&h=160&q=80', name: 'Leo Martins', role: 'Creative Director, Atelier Ono', text: 'The review process was clear and fast. Two rounds of sculpt tweaks and the final piece looked exactly like the render.' },
    { img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80', name: 'Hana Kim', role: 'Gift for her father', text: 'They captured how my dad stands with his hands behind his back. My mother cried. Worth every week of waiting.' },
  ];
  const faqData = [
    ['What do you need from me to start?', 'Six to twelve clear photos — front, sides, back — plus any outfit, props or setting you want included. We guide you through a short brief after you get in touch.'],
    ['Which scales and sizes do you offer?', 'Most figures are 1:8 (around 22–28 cm). We also make 1:10 desk pieces and 1:6 display pieces for larger scenes.'],
    ['Can you make couples, families or whole teams?', 'Yes. Group pieces share one base and are sculpted together so the poses interact naturally. Team sets of up to 40 people are scheduled in batches.'],
    ['Do I get to review the sculpt before printing?', 'You receive turntable renders of the digital sculpt and two rounds of revisions before anything is printed or painted.'],
    ['How long does a commission take?', 'Four to six weeks from approved brief to dispatch for a single figure. Group and team pieces are quoted individually.'],
    ['Do you ship internationally?', 'We ship worldwide in a custom foam-lined box with tracking and insurance included.'],
  ];

  /* ---------- Render lists ---------- */
  const marquee = $('marquee');
  for (let k = 0; k < 4; k++) capList.forEach((c) => marquee.appendChild(el('div', 'cap', esc(c))));

  const aboutWords = $('aboutWords');
  'We turn people into objects worth keeping'.split(' ').forEach((t) => {
    const s = el('span', t === 'objects' ? 'hot' : '', esc(t));
    s.dataset.word = '';
    aboutWords.appendChild(s);
  });

  const stepsBox = $('steps');
  steps.forEach((s) => stepsBox.appendChild(el('div', 'step',
    `<span class="step-no">${s.no}</span><div><div class="step-title">${esc(s.title)}</div><p>${esc(s.body)}</p></div>`)));

  const track = $('track');
  quotes.forEach((q) => track.appendChild(el('div', 'quote',
    `<div><div class="avatar"><img src="${q.img}" alt="${esc(q.name)}" loading="lazy"></div><p>“${esc(q.text)}”</p></div>
     <div><div class="quote-name">${esc(q.name)}</div><div class="quote-role">${esc(q.role)}</div></div>`)));

  const faqList = $('faqList');
  let openFaq = 0;
  const faqItems = faqData.map(([q, a], i) => {
    const item = el('div', 'faq-item' + (i === openFaq ? ' open' : ''),
      `<button class="faq-q" aria-expanded="${i === openFaq}"><span>${esc(q)}</span><span class="faq-icon" aria-hidden="true">+</span></button>
       <div class="faq-body"><div><p>${esc(a)}</p></div></div>`);
    item.querySelector('button').addEventListener('click', () => {
      openFaq = openFaq === i ? -1 : i;
      faqItems.forEach((it, j) => {
        it.classList.toggle('open', j === openFaq);
        it.querySelector('button').setAttribute('aria-expanded', j === openFaq);
      });
    });
    faqList.appendChild(item);
    return item;
  });

  const wordInner = $('wordInner');
  '8B—STUDIO'.split('').forEach((l) => wordInner.appendChild(el('span', '', esc(l))));

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('menuBtn'), mobileMenu = $('mobileMenu');
  const setMenu = (open) => {
    mobileMenu.hidden = !open;
    menuBtn.textContent = open ? '×' : '≡';
    menuBtn.setAttribute('aria-expanded', open);
  };
  menuBtn.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Testimonials carousel ---------- */
  let qi = 0, vw = window.innerWidth, sx = 0;
  const layoutCarousel = () => {
    const small = vw < 560;
    const cardW = small ? Math.min(300, vw - 40) : 300;
    const visible = Math.max(1, Math.floor((Math.min(vw, 1240) - 40 + 16) / (cardW + 16)));
    const maxQi = Math.max(0, quotes.length - visible);
    qi = Math.max(0, Math.min(qi, maxQi));
    track.querySelectorAll('.quote').forEach((c) => { c.style.flexBasis = cardW + 'px'; });
    track.style.transform = `translateX(-${qi * (cardW + 16)}px)`;
    return maxQi;
  };
  let maxQi = layoutCarousel();
  const moveQuote = (d) => { qi = Math.max(0, Math.min(maxQi, qi + d)); maxQi = layoutCarousel(); };
  $('prevQ').addEventListener('click', () => moveQuote(-1));
  $('nextQ').addEventListener('click', () => moveQuote(1));
  const carousel = $('carousel');
  carousel.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) moveQuote(dx < 0 ? 1 : -1);
  });

  /* ---------- Footer wordmark fit ---------- */
  const wordBox = $('wordBox');
  const fitWordmark = () => {
    wordBox.style.fontSize = '100px';
    const w = wordInner.scrollWidth;
    if (w) wordBox.style.fontSize = (100 * wordBox.clientWidth / w * 0.995) + 'px';
  };

  window.addEventListener('resize', () => {
    fitWordmark();
    if (window.innerWidth !== vw) {
      vw = window.innerWidth;
      if (vw >= 820) setMenu(false);
      maxQi = layoutCarousel();
    }
  });
  fitWordmark();
  if (document.fonts) document.fonts.ready.then(fitWordmark);
  if ('ResizeObserver' in window) new ResizeObserver(fitWordmark).observe(wordBox);

  /* ---------- Scroll reveal ---------- */
  const root = $('root');
  const ease = 'cubic-bezier(.2,.7,.2,1)';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countUp = (n) => {
    const to = +n.dataset.count, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 1400);
      n.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!reduced && 'IntersectionObserver' in window) {
    const prep = (n, delay) => {
      n.style.opacity = 0; n.style.transform = 'translateY(40px)';
      n.style.transition = `opacity .9s ${ease} ${delay}ms, transform .9s ${ease} ${delay}ms`;
    };
    const targets = [];
    root.querySelectorAll('[data-reveal]').forEach((n) => { prep(n, 0); targets.push(n); });
    root.querySelectorAll('[data-reveal-stagger]').forEach((p) => {
      const step = +(p.dataset.staggerStep || 90);
      [...p.children].forEach((c, i) => prep(c, i * step));
      targets.push(p);
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      const t = e.target;
      const els = t.hasAttribute('data-reveal-stagger') ? [...t.children] : [t];
      els.forEach((c) => { c.style.opacity = 1; c.style.transform = 'none'; });
      t.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(t);
    }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((t) => io.observe(t));
  } else {
    root.querySelectorAll('[data-count]').forEach((n) => { n.textContent = n.dataset.count; });
  }

  /* ---------- Flying turntable figure ---------- */
  const video = $('video'), flyer = $('flyer'), canvas = $('canvas');
  const heroSlot = $('heroSlot'), specSlot = $('specSlot');
  const angleEl = $('angle'), angleBar = $('angleBar'), playBtn = $('playBtn');
  const about = root.querySelector('[data-about]');
  const words = about.querySelectorAll('[data-word]');

  let user = false, playing = false, tick = 0, lastY = -1, lastScrollAt = 0, lastT = -1, painted = false, ctx = null, drag = null;

  video.muted = true; video.defaultMuted = true; video.playsInline = true;
  // Load as a blob so seeking is instant and doesn't depend on server range support.
  fetch(VIDEO_SRC)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then((b) => { video.src = URL.createObjectURL(b); video.load(); })
    .catch(() => { video.src = VIDEO_SRC; });
  video.addEventListener('loadeddata', () => { lastY = -1; flyer.style.opacity = 1; });

  const setPlaying = (v) => { playing = v; playBtn.textContent = v ? 'Stop rotation' : 'Rotate figure'; };

  const setAngle = () => {
    if (!video.duration) return;
    const a = Math.round((video.currentTime / video.duration) * 360) % 360;
    angleEl.textContent = String(a).padStart(3, '0') + '°';
    angleBar.style.width = (a / 360 * 100) + '%';
  };

  // Draw the current video frame and key out the light neutral studio background.
  const paint = () => {
    if (!video.duration || video.readyState < 2) return;
    if (video.currentTime === lastT && painted) return;
    lastT = video.currentTime; painted = true;
    ctx = ctx || canvas.getContext('2d', { willReadFrequently: true });
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(video, 0, 0, W, H);
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
      if (mx - mn > 18) continue;
      const a = (238 - mn) / 23;
      if (a < 1) d[i + 3] = a <= 0 ? 0 : Math.round(a * 255);
    }
    ctx.putImageData(img, 0, 0);
  };

  const frame = () => {
    const y = window.scrollY, vh = window.innerHeight;
    const a = heroSlot.getBoundingClientRect(), b = specSlot.getBoundingClientRect();
    const end = Math.max(1, b.top + y + b.height / 2 - vh / 2);
    const p = Math.min(1, Math.max(0, y / end));
    const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    const lerp = (m, n) => m + (n - m) * e;
    const w = lerp(a.width, b.width * 0.92), h = lerp(a.height, b.height * 0.92);
    const cx = lerp(a.left + a.width / 2, b.left + b.width / 2), cy = lerp(a.top + a.height / 2, b.top + b.height / 2);
    const tilt = Math.sin(p * Math.PI) * -16;
    flyer.style.width = w + 'px'; flyer.style.height = h + 'px';
    flyer.style.transform = `translate(${cx - w / 2}px,${cy - h / 2}px) rotate(${tilt}deg) scale(${1 + Math.sin(p * Math.PI) * 0.08})`;

    if (p < 0.98) {
      if (user) { user = false; if (!video.paused) video.pause(); clearInterval(tick); if (playing) setPlaying(false); }
      if (HERO_MODE === 'scroll') {
        const now = performance.now();
        if (y !== lastY && lastY >= 0 && video.duration) {
          if (!video.paused) video.pause();
          lastScrollAt = now;
          const d = video.duration;
          video.currentTime = (((video.currentTime + (y - lastY) / 1600 * d) % d) + d) % d;
          setAngle();
        } else if (video.paused && video.src && now - lastScrollAt > 180) {
          video.play().catch(() => {});
        }
      } else if (video.paused && video.src) video.play().catch(() => {});
    } else if (!user && !video.paused) {
      video.pause();
    }
    lastY = y;
    paint();

    const r = about.getBoundingClientRect();
    const q = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.6)));
    words.forEach((wd, i) => { wd.style.opacity = q * words.length > i + 0.5 ? 1 : 0.15; });

    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  playBtn.addEventListener('click', () => {
    user = true;
    clearInterval(tick);
    if (video.paused) {
      video.play().catch(() => {});
      tick = setInterval(setAngle, 80);
      setPlaying(true);
    } else {
      video.pause(); setAngle(); setPlaying(false);
    }
  });

  specSlot.addEventListener('pointerdown', (e) => {
    user = true; video.pause(); clearInterval(tick);
    drag = { x: e.clientX, t: video.currentTime };
    specSlot.classList.add('dragging');
    if (playing) setPlaying(false);
  });
  specSlot.addEventListener('pointermove', (e) => {
    if (!drag || !video.duration) return;
    const w = specSlot.clientWidth || 400;
    const t = drag.t + ((e.clientX - drag.x) / w) * video.duration;
    video.currentTime = ((t % video.duration) + video.duration) % video.duration;
    setAngle();
  });
  const endDrag = () => { drag = null; specSlot.classList.remove('dragging'); };
  specSlot.addEventListener('pointerup', endDrag);
  specSlot.addEventListener('pointerleave', endDrag);
  specSlot.addEventListener('pointercancel', endDrag);
})();
