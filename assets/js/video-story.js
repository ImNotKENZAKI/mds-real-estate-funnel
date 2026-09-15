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
    if (watchMode || reduceMotion.matches) return;

    const rect = section.getBoundingClientRect();
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
    document.head.appendChild(script);
  }

  function requestPlayer() {
    if (playerRequested || reduceMotion.matches || !iframe) return;
    playerRequested = true;

    const params = new URLSearchParams({
      enablejsapi: "1",
      autoplay: "1",
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
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
    loadYouTubeAPI();
  }

  function createPlayer() {
    if (player || !iframe || !window.YT?.Player) return;
    player = new window.YT.Player(iframe, {
      events: {
        onReady: () => {
          playerReady = true;
          section.classList.add("is-video-ready");
          try {
            player.mute();
            if (inViewport) player.playVideo();
          } catch (_) {}
          updatePlayerUI();
        },
        onStateChange: event => {
          if (!window.YT) return;
          const playing = event.data === window.YT.PlayerState.PLAYING;
          if (playIcon) playIcon.textContent = playing ? "Ⅱ" : "▶";
          if (playToggle) playToggle.setAttribute("aria-label", playing ? "Pause video" : "Play video");
          if (event.data === window.YT.PlayerState.ENDED && !watchMode) {
            try { player.seekTo(0, true); player.playVideo(); } catch (_) {}
          }
        }
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

  function enterWatchMode() {
    watchMode = true;
    section.classList.add("is-watch-mode");
    document.body.classList.add("cinematic-watch-open");
    section.querySelector("[data-video-viewer]")?.setAttribute("aria-hidden", "false");
    if (modeLabel) modeLabel.textContent = "WATCHING WITH SOUND";

    requestPlayer();
    const begin = () => {
      if (!playerReady || !player) {
        window.setTimeout(begin, 120);
        return;
      }
      try {
        player.seekTo(0, true);
        player.unMute();
        player.playVideo();
      } catch (_) {}
      updatePlayerUI();
      startUITimer();
      status && (status.textContent = "System film opened with sound.");
      closeButton?.focus();
    };
    begin();
  }

  function exitWatchMode() {
    watchMode = false;
    section.classList.remove("is-watch-mode");
    document.body.classList.remove("cinematic-watch-open");
    section.querySelector("[data-video-viewer]")?.setAttribute("aria-hidden", "true");
    if (modeLabel) modeLabel.textContent = "LIVE SYSTEM FILM";
    stopUITimer();
    if (playerReady && player) {
      try {
        player.mute();
        if (inViewport) player.playVideo();
      } catch (_) {}
    }
    status && (status.textContent = "Returned to the scroll story. Video muted.");
    watchButton?.focus();
    requestStoryRender();
  }

  watchButton?.addEventListener("click", enterWatchMode);
  closeButton?.addEventListener("click", exitWatchMode);

  playToggle?.addEventListener("click", () => {
    if (!playerReady || !player || !window.YT) return;
    try {
      const state = player.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) player.pauseVideo();
      else player.playVideo();
    } catch (_) {}
  });

  muteButton?.addEventListener("click", () => {
    if (!playerReady || !player) return;
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

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && watchMode) exitWatchMode();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.target !== section) return;
        inViewport = entry.isIntersecting;
        if (inViewport) {
          requestPlayer();
          if (playerReady && !watchMode) {
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
    requestStoryRender();
  });

  renderScrollStory();
})();
