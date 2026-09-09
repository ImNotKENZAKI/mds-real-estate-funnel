(() => {
  'use strict';
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileAuditCta = document.querySelector('[data-mobile-audit-cta]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const smoothstep = (from, to, value) => {
    const progress = clamp((value - from) / (to - from), 0, 1);
    return progress * progress * (3 - (2 * progress));
  };

  const onHeaderScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
    const pageTravel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pageProgress = clamp((window.scrollY / pageTravel) * 100, 0, 100);
    header?.style.setProperty('--page-progress', `${pageProgress.toFixed(3)}%`);
  };
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });


  const closeMenu = (restoreFocus = false) => {
    toggle?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus) toggle?.focus();
  };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) closeMenu();
    else {
      toggle.setAttribute('aria-expanded', 'true');
      menu?.classList.add('is-open');
      document.body.classList.add('menu-open');
    }
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!header?.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', (event) => {
    if (!header?.contains(event.target)) closeMenu();
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => closeMenu());
  const navigationLinks = [...(menu?.querySelectorAll('a[href^="#"]') || [])];
  const navigationSections = navigationLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveNavigation = (sectionId) => {
    navigationLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${sectionId}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if ('IntersectionObserver' in window && navigationSections.length) {
    const navigationObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (visibleSection) setActiveNavigation(visibleSection.target.id);
    }, { threshold: 0, rootMargin: '-28% 0px -64% 0px' });
    navigationSections.forEach((section) => navigationObserver.observe(section));
  }

  const clearNavigationAtTop = () => {
    if (window.scrollY < window.innerHeight * 0.45) setActiveNavigation('');
  };
  clearNavigationAtTop();
  window.addEventListener('scroll', clearNavigationAtTop, { passive: true });


  const hero = document.querySelector('[data-portal-hero]');
  const heroStage = document.querySelector('[data-hero-stage]');
  const heroImage = document.querySelector('[data-hero-image]');
  const heroCopy = document.querySelector('[data-hero-copy]');
  const heroNextSection = hero?.nextElementSibling;
  const heroEnter = document.querySelector('[data-hero-enter]');
  const heroThreshold = document.querySelector('[data-hero-threshold]');
  let heroFrame = 0;
  let heroRun = 0;
  let heroRunning = false;
  let heroCooldown = 0;

  // Door leaf measured in the original 1672 x 941 photograph.
  // Scene, reveal aperture and moving leaf all use this same rectangle.
  const door = { x: 1118, y: 407, width: 85, height: 155 };
  const renderHero = () => {
    heroFrame = 0;
    if (!hero || !heroStage || !heroImage) return;
    const w = heroStage.clientWidth;
    const h = heroStage.clientHeight;
    const travel = Math.max(1, hero.offsetHeight - h);
    const p = reduceMotion.matches ? 0 : clamp(-hero.getBoundingClientRect().top / travel, 0, 1);
    const naturalW = heroImage.naturalWidth || 1672;
    const naturalH = heroImage.naturalHeight || 941;
    const cover = Math.max(w / naturalW, h / naturalH);
    const horizontalCrop = w <= 620 ? .69 : w <= 900 ? .58 : .5;
    const sourceX = (w - naturalW * cover) * horizontalCrop;
    const sourceY = (h - naturalH * cover) / 2;
    const centerX = sourceX + (door.x + door.width / 2) * cover;
    const centerY = sourceY + (door.y + door.height / 2) * cover;
    const approach = smoothstep(.02, .39, p);
    const targetScale = Math.min(h * .68 / (door.height * cover), w * .64 / (door.width * cover));
    const scale = 1 + (Math.max(1, targetScale) - 1) * approach;
    const shiftX = (w / 2 - centerX) * approach;
    const shiftY = (h / 2 - centerY) * approach;
    const doorW = door.width * cover * scale;
    const doorH = door.height * cover * scale;
    const doorX = centerX + shiftX - doorW / 2;
    const doorY = centerY + shiftY - doorH / 2;
    const expand = smoothstep(.64, .86, p);
    const copyOpacity = 1 - smoothstep(.02, .21, p);
    const values = {
      '--hero-scale': scale,
      '--hero-shift-x': shiftX + 'px', '--hero-shift-y': shiftY + 'px',
      '--hero-origin-x': centerX + 'px', '--hero-origin-y': centerY + 'px',
      '--hero-photo-opacity': 1 - smoothstep(.75, .87, p),
      '--hero-copy-opacity': copyOpacity,
      '--hero-copy-shift': (-24 * (1 - copyOpacity)) + 'px',
      '--hero-signal-opacity': 1 - smoothstep(.03, .18, p),
      '--hero-cue-opacity': 1 - smoothstep(.12, .3, p),
      '--hero-cue-x': (centerX + shiftX) + 'px',
      '--hero-cue-y': (centerY + shiftY) + 'px',
      '--hero-scroll-opacity': 1 - smoothstep(0, .1, p),
      '--hero-door-opacity': smoothstep(.32, .38, p) * (1 - smoothstep(.65, .76, p)),
      '--hero-door-angle': (102 * smoothstep(.4, .67, p)) + 'deg',
      '--hero-portal-world-opacity': smoothstep(.38, .41, p),
      '--portal-left': (Math.max(0, doorX) * (1 - expand)) + 'px',
      '--portal-right': (Math.max(0, w - doorX - doorW) * (1 - expand)) + 'px',
      '--portal-top': (Math.max(0, doorY) * (1 - expand)) + 'px',
      '--portal-bottom': (Math.max(0, h - doorY - doorH) * (1 - expand)) + 'px',
      '--door-x': doorX + 'px', '--door-y': doorY + 'px',
      '--door-width': doorW + 'px', '--door-height': doorH + 'px',
      '--door-bg-width': (naturalW * cover * scale) + 'px',
      '--door-bg-height': (naturalH * cover * scale) + 'px',
      '--door-bg-x': (-door.x * cover * scale) + 'px',
      '--door-bg-y': (-door.y * cover * scale) + 'px',
      '--hero-exit-opacity': smoothstep(.85, .96, p),
      '--hero-threshold-opacity': smoothstep(.92, 1, p)
    };
    Object.entries(values).forEach(([name, value]) => hero.style.setProperty(name, String(value)));
    if (heroCopy) heroCopy.inert = copyOpacity < .1;
    heroThreshold?.setAttribute('aria-hidden', String(p < .92));
  };
  const requestHeroRender = () => {
    if (!heroFrame) heroFrame = requestAnimationFrame(renderHero);
  };
  const cancelHeroRun = () => {
    cancelAnimationFrame(heroRun);
    heroRunning = false;
    document.documentElement.classList.remove('hero-playing');
  };
  const canEnterHero = () => hero && !reduceMotion.matches &&
    !document.body.classList.contains('menu-open') &&
    window.scrollY < hero.offsetTop + 64;

  const playHero = () => {
    if (!hero || !heroNextSection || heroRunning) return;
    const startY = window.scrollY;
    const destination = hero.offsetTop + hero.offsetHeight - 72;
    if (reduceMotion.matches) {
      heroNextSection.scrollIntoView({ behavior: 'instant' });
      return;
    }
    const stageTravel = Math.max(1, hero.offsetHeight - heroStage.clientHeight);
    const startTime = performance.now();
    heroRunning = true;
    document.documentElement.classList.add('hero-playing');
    const tick = (now) => {
      const time = clamp((now - startTime) / 3100, 0, 1);
      if (time > .6) heroNextSection.querySelectorAll('.is-pending').forEach(element => {
        element.classList.remove('is-pending');
        element.classList.add('is-visible');
      });
      // Reserve the first 72% for the camera, door and interior. Then enter the copy.
      const y = time < .72
        ? startY + (stageTravel - startY) * smoothstep(0, .72, time)
        : stageTravel + (destination - stageTravel) * smoothstep(.72, 1, time);
      window.scrollTo({ top: y, behavior: 'instant' });
      renderHero();
      if (time < 1) heroRun = requestAnimationFrame(tick);
      else {
        cancelHeroRun();
        heroCooldown = performance.now() + 300;
        heroNextSection.tabIndex = -1;
        heroNextSection.focus({ preventScroll: true });
      }
    };
    heroRun = requestAnimationFrame(tick);
  };
  heroEnter?.addEventListener('click', playHero);
  // Scope the one-gesture sequence to the opening hero only. Up/Escape always exits.
  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.metaKey || event.deltaY === 0) return;
    if (heroRunning) {
      if (event.deltaY < 0) cancelHeroRun();
      else event.preventDefault();
      return;
    }
    if (performance.now() < heroCooldown && event.deltaY > 0) { event.preventDefault(); return; }
    if (canEnterHero() && event.deltaY > 6) { event.preventDefault(); playHero(); }
  }, { passive: false });
  document.addEventListener('keydown', (event) => {
    if (['Escape', 'ArrowUp', 'Home'].includes(event.key)) cancelHeroRun();
    const basicTarget = event.target === document.body || event.target === document.documentElement;
    if (basicTarget && ['ArrowDown', 'PageDown', ' '].includes(event.key) && canEnterHero()) {
      event.preventDefault(); playHero();
    }
  });
  let heroTouchY = null;
  heroStage?.addEventListener('touchstart', (event) => {
    heroTouchY = event.target.closest('a,button') ? null : event.touches[0]?.clientY;
  }, { passive: true });
  heroStage?.addEventListener('touchmove', (event) => {
    if (heroTouchY === null || event.touches.length !== 1) return;
    const distance = heroTouchY - event.touches[0].clientY;
    if (heroRunning && distance < -20) { cancelHeroRun(); heroTouchY = null; return; }
    if (heroRunning) { event.preventDefault(); return; }
    if (canEnterHero() && distance > 28) { event.preventDefault(); playHero(); }
  }, { passive: false });
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', cancelHeroRun));
  if (hero && heroImage) {
    hero.classList.add('is-ready');
    heroImage.addEventListener('load', requestHeroRender);
    window.addEventListener('scroll', requestHeroRender, { passive: true });
    let heroViewportWidth = window.innerWidth;
    window.addEventListener('resize', () => {
      // Mobile browser chrome can resize the height during a swipe.
      if (window.innerWidth !== heroViewportWidth) cancelHeroRun();
      heroViewportWidth = window.innerWidth;
      requestHeroRender();
    }, { passive: true });
    reduceMotion.addEventListener('change', () => { cancelHeroRun(); requestHeroRender(); });
    requestHeroRender();
  }

  const auditSection = document.querySelector('#audit');
  const updateMobileAuditCta = () => {
    if (!mobileAuditCta || !hero || !auditSection) return;
    const compactViewport = window.innerWidth <= 900;
    const heroExit = hero.offsetTop + hero.offsetHeight - (window.innerHeight * 0.28);
    const auditApproaching = auditSection.getBoundingClientRect().top < window.innerHeight * 0.82;
    const shouldShow = compactViewport && window.scrollY > heroExit && !auditApproaching;
    mobileAuditCta.classList.toggle('is-visible', shouldShow);
    mobileAuditCta.setAttribute('aria-hidden', String(!shouldShow));
    mobileAuditCta.tabIndex = shouldShow ? 0 : -1;
  };

  updateMobileAuditCta();
  window.addEventListener('scroll', updateMobileAuditCta, { passive: true });
  window.addEventListener('resize', updateMobileAuditCta);


  const systemJourney = document.querySelector('[data-system-journey]');
  const systemStages = [...document.querySelectorAll('[data-system-stage]')];
  const recordStages = [...document.querySelectorAll('[data-record-stage]')];
  const compactSystem = window.matchMedia('(max-width: 620px)');
  let systemObserver;
  const activateSystemStage = (activeIndex) => {
    systemStages.forEach((stage, index) => {
      stage.classList.toggle('is-active', index === activeIndex);
      if (index === activeIndex) stage.setAttribute('aria-current', 'step');
      else stage.removeAttribute('aria-current');
    });
    recordStages.forEach((row, index) => row.classList.toggle('is-current', index === activeIndex));
  };
  const setupSystem = () => {
    systemObserver?.disconnect();
    if (!systemJourney) return;
    activateSystemStage(-1);
    if (reduceMotion.matches || compactSystem.matches || !('IntersectionObserver' in window)) return;
    const line = window.innerHeight * .42;
    let active = 0;
    systemStages.forEach((stage, index) => {
      if (stage.getBoundingClientRect().top < line) active = index;
    });
    activateSystemStage(active);
    systemObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activateSystemStage(Number(entry.target.dataset.systemStage));
      });
    }, { rootMargin: '-35% 0px -48% 0px', threshold: 0 });
    systemStages.forEach(stage => systemObserver.observe(stage));
  };
  setupSystem();
  compactSystem.addEventListener('change', setupSystem);
  reduceMotion.addEventListener('change', setupSystem);

  const campaignPanels = [...document.querySelectorAll('[data-campaign-panel]')];
  const campaignDetails = [...document.querySelectorAll('[data-campaign-details]')];
  const setCampaignDetails = () => campaignDetails.forEach(details => { details.open = !compactSystem.matches; });
  setCampaignDetails();
  compactSystem.addEventListener('change', setCampaignDetails);
  let campaignFrame = 0;
  const renderCampaignState = () => {
    campaignFrame = 0;
    if (!campaignPanels.length) return;
    const focusLine = window.innerHeight * 0.48;
    let activePanel = null;
    let activeDistance = Number.POSITIVE_INFINITY;
    campaignPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const visible = rect.bottom > 80 && rect.top < window.innerHeight;
      const distance = Math.abs((rect.top + Math.min(rect.height * 0.34, 220)) - focusLine);
      if (visible && distance < activeDistance) {
        activeDistance = distance;
        activePanel = panel;
      }
    });
    campaignPanels.forEach((panel) => panel.classList.toggle('is-current', panel === activePanel));
  };
  const requestCampaignState = () => {
    if (!campaignFrame) campaignFrame = window.requestAnimationFrame(renderCampaignState);
  };
  if (campaignPanels.length) {
    renderCampaignState();
    window.addEventListener('scroll', requestCampaignState, { passive: true });
    window.addEventListener('resize', requestCampaignState);
  }

  const items = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    items.forEach((element) => {
      // Only hide elements below the current viewport, after the observer exists.
      if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-pending');
      observer.observe(element);
    });
    reduceMotion.addEventListener('change', () => {
      if (reduceMotion.matches) items.forEach(element => element.classList.remove('is-pending'));
    });
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
