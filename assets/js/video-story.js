(() => {
  "use strict";

  const section = document.querySelector("[data-cinematic-story]");
  if (!section) return;

  const stage = section.querySelector("[data-cinematic-stage]");
  const iframe = section.querySelector("[data-cinematic-player]");
  const beats = [...section.querySelectorAll("[data-story-beat]")];
  const progressLine = section.querySelector("[data-story-progress]");
  const watchButton = section.querySelector("[data-video-watch]");
  const closeButton = section.querySelector("[data-video-close]");
  const playToggle = section.querySelector("[data-video-toggle]");
  const playIcon = section.querySelector("[data-video-toggle-icon]");
  const muteButton = section.querySelector("[data-video-mute]");
  const soundIcon = section.querySelector("[data-video-sound-icon]");
  const scrub = section.querySelector("[data-video-scrub]");
  const currentLabel = section.querySelector("[data-video-current]");
  const durationLabel = section.querySelector("[data-video-duration]");
  const status = section.querySelector("[data-video-status]");
  const modeLabel = section.querySelector("[data-video-mode-label]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videoId = iframe?.dataset.videoId || "64HUMVre1QM";

  let player = null;
  let playerReady = false;
  let playerRequested = false;
  let apiRequested = false;
  let activeBeat = 0;
  let raf = 0;
  let timer = 0;
  let inViewport = false;
  let watchMode = false;
  let savedScroll = null;
  let pendingWatch = false;
  let loadTimer = 0;
  let inertElements = [];
  const viewer = section.querySelector('[data-video-viewer]');
  const feedback = section.querySelector('[data-video-feedback]');
  const playerControls = [playToggle, muteButton, scrub].filter(Boolean);
  playerControls.forEach(control => { control.disabled = true; });

  function message(text) {
    if (status) status.textContent = text;
    if (feedback) feedback.textContent = text;
  }

  function lockScroll() {
    const body = document.body;
    const root = document.documentElement;
    savedScroll = { x: scrollX, y: scrollY, body: body.getAttribute('style'), root: root.getAttribute('style') };
    const gutter = innerWidth - root.clientWidth;
    root.style.overflow = 'hidden';
    root.style.scrollBehavior = 'auto';
    body.style.position = 'fixed';
    body.style.top = `-${savedScroll.y}px`;
    body.style.left = `-${savedScroll.x}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (gutter) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    // Make only the viewing controls reachable, without reparenting/reloading YouTube.
    let branch = section;
    while (branch.parentElement) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !sibling.inert && !['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)) {
          sibling.inert = true;
          inertElements.push(sibling);
        }
      }
      if (branch.parentElement === body) break;
      branch = branch.parentElement;
    }
    section.querySelector('[data-cinematic-copy]').inert = true;
    watchButton.inert = true;
  }

  function unlockScroll() {
    if (!savedScroll) return;
    const saved = savedScroll;
    savedScroll = null;
    for (const element of inertElements) element.inert = false;
    inertElements = [];
    section.querySelector('[data-cinematic-copy]').inert = false;
    watchButton.inert = false;
    if (saved.body === null) document.body.removeAttribute('style');
    else document.body.setAttribute('style', saved.body);
    // Restore the position before restoring a possible smooth-scroll preference.
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
    if (saved.root === null) document.documentElement.removeAttribute('style');
    else document.documentElement.setAttribute('style', saved.root);
  }

  function formatTime(seconds) {
    const value = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(value / 60);
    const secs = Math.floor(value % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  function setActiveBeat(index) {
    const next = Math.max(0, Math.min(beats.length - 1, index));
    if (next === activeBeat && section.dataset.activeBeat === String(next)) return;
    activeBeat = next;
    section.dataset.activeBeat = String(next);
    beats.forEach((beat, beatIndex) => beat.classList.toggle("is-active", beatIndex === next));
  }

  function renderScrollStory() {
    raf = 0;
    const rect = section.getBoundingClientRect();
    // The mobile audit CTA is useful between sections, but must not sit over
    // the story's own Watch control or the full-screen film controls.
    document.body.classList.toggle(
      "cinematic-story-in-view",
      rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.18
    );
    if (watchMode || reduceMotion.matches) return;

    const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    const traveled = Math.min(scrollable, Math.max(0, -rect.top));
    const progress = Math.min(1, Math.max(0, traveled / scrollable));

    section.style.setProperty("--story-progress", progress.toFixed(4));
    setActiveBeat(Math.min(beats.length - 1, Math.floor(progress * beats.length)));
  }

  function requestStoryRender() {
    if (!raf) raf = window.requestAnimationFrame(renderScrollStory);
  }

  function loadYouTubeAPI() {
    if (apiRequested || window.YT?.Player) {
      if (window.YT?.Player) createPlayer();
      return;
    }
    apiRequested = true;

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") previousReady();
      createPlayer();
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => message('The film could not load. Open it on YouTube or return to the story.');
    document.head.appendChild(script);
  }

  function requestPlayer(explicitPlay = false) {
    if (playerRequested || (reduceMotion.matches && !explicitPlay) || !iframe) return;
    playerRequested = true;

    const params = new URLSearchParams({
      enablejsapi: "1",
      autoplay: reduceMotion.matches ? "0" : "1",
      mute: "1",
      controls: "0",
      rel: "0",
      playsinline: "1",
      loop: "1",
      playlist: videoId,
      disablekb: "1",
      fs: "0",
      iv_load_policy: "3"
    });
    if (location.protocol !== 'file:') params.set('origin', location.origin);
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    loadYouTubeAPI();
  }

  function createPlayer() {
    if (player || !iframe || !window.YT?.Player) return;
    player = new window.YT.Player(iframe, {
      events: {
        onReady: () => {
          playerReady = true;
          playerControls.forEach(control => { control.disabled = false; });
          try {
            player.mute();
            if (pendingWatch && watchMode) beginWatchPlayback();
            else if (inViewport && !reduceMotion.matches) player.playVideo();
            else player.pauseVideo();
          } catch (_) {}
          updatePlayerUI();
        },
        onStateChange: event => {
          if (!window.YT) return;
          const playing = event.data === window.YT.PlayerState.PLAYING;
          if (playing) {
            section.classList.add('is-video-ready');
            if (watchMode) { clearTimeout(loadTimer); message(''); }
          }
          if (playIcon) playIcon.textContent = playing ? "Ⅱ" : "▶";
          if (playToggle) playToggle.setAttribute("aria-label", playing ? "Pause video" : "Play video");
          if (event.data === window.YT.PlayerState.ENDED && !watchMode) {
            try { player.seekTo(0, true); player.playVideo(); } catch (_) {}
          }
        },
        onError: () => { clearTimeout(loadTimer); message('The film is unavailable here. Open it on YouTube or return to the story.'); },
        onAutoplayBlocked: () => { if (watchMode) message('Press Play to start the film. Your browser paused playback.'); }
      }
    });
  }

  function updatePlayerUI() {
    if (!playerReady || !player) return;
    try {
      const current = player.getCurrentTime?.() || 0;
      const duration = player.getDuration?.() || 0;
      const loaded = player.getVideoLoadedFraction?.() || 0;
      const played = duration ? (current / duration) * 100 : 0;
      if (currentLabel) currentLabel.textContent = formatTime(current);
      if (durationLabel && duration) durationLabel.textContent = formatTime(duration);
      if (scrub) {
        scrub.style.setProperty("--video-played", `${played}%`);
        scrub.style.setProperty("--video-buffer", `${loaded * 100}%`);
      }
      if (soundIcon) soundIcon.textContent = player.isMuted?.() ? "Sound off" : "Sound on";
      if (muteButton) muteButton.setAttribute("aria-label", player.isMuted?.() ? "Unmute video" : "Mute video");
    } catch (_) {}
  }

  function startUITimer() {
    window.clearInterval(timer);
    timer = window.setInterval(updatePlayerUI, 220);
  }

  function stopUITimer() {
    window.clearInterval(timer);
    timer = 0;
  }

  function beginWatchPlayback() {
    if (!watchMode || !playerReady || !player || !pendingWatch) return;
    pendingWatch = false;
    try {
      player.seekTo(0, true);
      player.unMute();
      player.playVideo();
    } catch (_) { message('Press Play to start the film.'); }
    updatePlayerUI();
    startUITimer();
  }

  function enterWatchMode() {
    if (watchMode) return;
    watchMode = true;
    pendingWatch = true;
    lockScroll();
    section.classList.add("is-watch-mode");
    document.body.classList.add("cinematic-watch-open");
    viewer.setAttribute('aria-hidden', 'false');
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-modal', 'true');
    viewer.setAttribute('aria-label', 'MDS Real Estate system film');
    if (modeLabel) modeLabel.textContent = "WATCHING WITH SOUND";

    message(playerReady ? '' : 'Loading the system film…');
    window.requestAnimationFrame(() => {
      if (watchMode) closeButton?.focus({ preventScroll: true });
    });
    loadTimer = window.setTimeout(() => {
      if (watchMode) message('Playback is taking longer than expected. Open on YouTube or return to the story.');
    }, 15000);
    requestPlayer(true);
    beginWatchPlayback();
  }

  // Visibility is animated for a softer handoff, so also focus once the
  // viewer has actually faded in. The guard avoids stealing focus from a
  // viewer control the user may already be using.
  viewer?.addEventListener("transitionend", event => {
    if (event.propertyName !== "opacity" || !watchMode || viewer.contains(document.activeElement)) return;
    closeButton?.focus({ preventScroll: true });
  });

  function exitWatchMode() {
    if (!watchMode) return;
    watchMode = false;
    pendingWatch = false;
    clearTimeout(loadTimer);
    section.classList.remove("is-watch-mode");
    document.body.classList.remove("cinematic-watch-open");
    viewer.setAttribute('aria-hidden', 'true');
    viewer.removeAttribute('aria-modal');
    if (modeLabel) modeLabel.textContent = "LIVE SYSTEM FILM";
    stopUITimer();
    if (playerReady && player) {
      try {
        player.mute();
        if (inViewport && !reduceMotion.matches) player.playVideo();
        else player.pauseVideo();
      } catch (_) {}
    }
    status && (status.textContent = "Returned to the scroll story. Video muted.");
    unlockScroll();
    watchButton?.focus({ preventScroll: true });
    requestStoryRender();
  }

  watchButton?.addEventListener("click", enterWatchMode);
  closeButton?.addEventListener("click", exitWatchMode);

  playToggle?.addEventListener("click", () => {
    if (!watchMode || !playerReady || !player || !window.YT) return;
    try {
      const state = player.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) player.pauseVideo();
      else player.playVideo();
    } catch (_) {}
  });

  muteButton?.addEventListener("click", () => {
    if (!watchMode || !playerReady || !player) return;
    try {
      if (player.isMuted()) player.unMute();
      else player.mute();
      updatePlayerUI();
    } catch (_) {}
  });

  scrub?.addEventListener("click", event => {
    if (!playerReady || !player) return;
    const rect = scrub.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    try {
      const duration = player.getDuration?.() || 0;
      if (duration) player.seekTo(duration * ratio, true);
    } catch (_) {}
    updatePlayerUI();
  });

  document.addEventListener('keydown', event => {
    if (!watchMode) return;
    if (event.key === 'Escape') { event.preventDefault(); exitWatchMode(); return; }
    if (event.key === 'Tab') {
      const controls = [...viewer.querySelectorAll('button:not(:disabled), a[href]')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
      event.stopImmediatePropagation();
      if (event.key !== ' ' || document.activeElement?.tagName !== 'BUTTON') event.preventDefault();
    }
  }, true);
  // Keep the separate hero wheel handler dormant while the body is position-locked.
  window.addEventListener('wheel', event => {
    if (watchMode && !event.ctrlKey) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { capture: true, passive: false });
  window.addEventListener('touchmove', event => {
    if (watchMode && event.touches.length === 1) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, { capture: true, passive: false });
  window.addEventListener('pagehide', () => { if (watchMode) exitWatchMode(); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target !== section) return;
        inViewport = entry.isIntersecting;
        if (inViewport) {
          requestPlayer();
          if (playerReady && !watchMode && !reduceMotion.matches) {
            try { player.mute(); player.playVideo(); } catch (_) {}
          }
        } else if (playerReady && !watchMode) {
          try { player.pauseVideo(); } catch (_) {}
        }
      });
    }, { rootMargin: "80% 0px 80% 0px", threshold: 0.01 });
    observer.observe(section);
  } else {
    inViewport = true;
    requestPlayer();
  }

  window.addEventListener("scroll", requestStoryRender, { passive: true });
  window.addEventListener("resize", requestStoryRender);
  reduceMotion.addEventListener?.("change", () => {
    if (!reduceMotion.matches) requestPlayer();
    else if (playerReady && !watchMode) { player.mute(); player.pauseVideo(); }
    requestStoryRender();
  });

  renderScrollStory();
})();
