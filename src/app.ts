type Stream = {
  title: string;
  dateLabel: string;
  startsAt: string;
  youtubeUrl?: string;
  anchorId?: string;
};

type GalleryPhoto = {
  src: string;
  alt?: string;
  caption?: string;
  /** Format largeur/hauteur, ex. "4/3" (paysage) ou "3/4" (portrait).
   *  Facultatif : à défaut, il est déduit de l'image une fois chargée. */
  ratio?: string;
};

type MoissonConfig = {
  helloAssoUrl?: string;
  youtubeChannelUrl?: string;
  shareUrl?: string;
  streams?: Stream[];
  gallery?: GalleryPhoto[];
};

declare global {
  interface Window {
    MOISSON_CONFIG?: MoissonConfig;
  }
}

const config: MoissonConfig = window.MOISSON_CONFIG ?? {};
const MAIN_EVENT = new Date("2026-10-11T10:00:00+02:00");
const EVENT_DAY_END = new Date("2026-10-11T23:59:59+02:00");

const $ = <T extends Element>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);
const $$ = <T extends Element>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

function pad(value: number): string {
  return String(Math.max(0, value)).padStart(2, "0");
}

/** Le contenu de config.js est saisi à la main : une apostrophe ou un & ne doit pas
 *  casser le HTML généré (en particulier dans les attributs). */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function updateCountdown(): void {
  const now = new Date();
  const status = $("#countdown-status");
  const countdown = $("#countdown");
  if (!status || !countdown) return;

  if (now >= MAIN_EVENT && now <= EVENT_DAY_END) {
    status.textContent = "C'est aujourd'hui — bienvenue à la Moisson !";
    countdown.innerHTML = '<div class="countdown-message"><strong>Bienvenue</strong><span>Le Grand Culte d\'Action de Grâce a commencé.</span></div>';
    return;
  }

  if (now > EVENT_DAY_END) {
    status.textContent = "Merci d'avoir célébré la Moisson 2026 avec nous.";
    countdown.innerHTML = '<div class="countdown-message"><strong>Merci</strong><span>Retrouvez les replays dans la section Direct.</span></div>';
    return;
  }

  const diff = MAIN_EVENT.getTime() - now.getTime();
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  const minutes = Math.floor((diff / 60_000) % 60);
  const seconds = Math.floor((diff / 1_000) % 60);

  const values: Record<string, string> = {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds)
  };

  Object.entries(values).forEach(([key, value]) => {
    const node = $<HTMLElement>(`[data-countdown="${key}"]`);
    if (node) node.textContent = value;
  });
}

function setupMenu(): void {
  const toggle = $(".menu-toggle") as HTMLButtonElement | null;
  const nav = $("#main-nav");
  if (!toggle || !nav) return;

  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });

  $$("a", nav).forEach(link => link.addEventListener("click", close));
}

function setupWhatsAppShare(): void {
  const url = config.shareUrl || window.location.href;
  const text = `🌾 Fête de la Moisson 2026 — Paroisse La Grâce Divine\n« Porter du bon fruit et rayonner »\n📅 Du 2 au 11 octobre 2026 · Argenteuil\n${url}`;
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  $$<HTMLButtonElement>("[data-whatsapp-share]").forEach(button => {
    button.addEventListener("click", () => {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    });
  });
}

function setupDonation(): void {
  const donationUrl = config.helloAssoUrl?.trim();
  const links = $$<HTMLAnchorElement>("[data-donation-link]");

  // Les boutons pointent déjà sur /don dans le HTML : cette redirection, tenue
  // par netlify.toml, mène à HelloAsso sans passer par la page. Renseigner
  // helloAssoUrl ici ne fait qu'éviter le saut de redirection ; laissé vide,
  // le lien reste parfaitement fonctionnel, y compris sans JavaScript.
  links.forEach(link => {
    if (!donationUrl) return;
    link.href = donationUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let id = "";
    if (parsed.hostname.includes("youtu.be")) {
      id = parsed.pathname.replace("/", "");
    } else if (parsed.pathname.includes("/live/")) {
      id = parsed.pathname.split("/live/")[1]?.split("/")[0] || "";
    } else if (parsed.pathname.includes("/embed/")) {
      id = parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
    } else {
      id = parsed.searchParams.get("v") || "";
    }
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function streamState(startsAt: string): "upcoming" | "today" | "past" {
  const start = new Date(startsAt);
  const now = new Date();
  const sameDate = now.toDateString() === start.toDateString();
  if (sameDate) return "today";
  return now < start ? "upcoming" : "past";
}

function renderLiveStreams(): void {
  const grid = $("#live-grid");
  if (!grid) return;

  const streams = config.streams ?? [];
  if (!streams.length) {
    grid.innerHTML = '<div class="live-empty"><span>▶</span><h3>Les prochains directs seront annoncés ici</h3><p>Revenez à l\'approche de la Moisson pour retrouver les diffusions YouTube.</p></div>';
    return;
  }

  grid.innerHTML = streams.map((stream, index) => {
    const url = stream.youtubeUrl?.trim() || "";
    const embed = url ? youtubeEmbedUrl(url) : null;
    const state = streamState(stream.startsAt);
    // Tant qu'aucune URL n'est renseignée, ne rien promettre de cliquable :
    // pas de faux bouton lecture, et pas de « Replay » qui n'existe pas encore.
    const pending = !url;
    const stateLabel =
      state === "today" ? (pending ? "Bientôt en ligne" : "Aujourd'hui")
      : state === "past" ? (pending ? "Replay à venir" : "Replay")
      : "À venir";
    const media = embed
      ? `<div class="video-frame"><iframe src="${embed}" title="${escapeHtml(stream.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
      : `<div class="video-placeholder${pending ? " video-placeholder-pending" : ""}" aria-hidden="true"><span>▶</span><small>${pending ? "Direct à venir" : "YouTube"}</small></div>`;
    const action = url
      ? `<a class="btn btn-gold btn-small" href="${url}" target="_blank" rel="noopener">${state === "past" ? "Voir le replay" : "Ouvrir sur YouTube"}</a>`
      : `<span class="stream-pending">Le lien YouTube sera publié ici</span>`;
    const anchorId = stream.anchorId || `stream-${index + 1}`;

    return `<article class="live-card reveal ${index === 0 ? "live-card-primary" : ""}" id="${anchorId}">
      ${media}
      <div class="live-card-body">
        <div class="live-card-meta"><span class="live-state live-state-${state}">${stateLabel}</span><time datetime="${stream.startsAt}">${stream.dateLabel}</time></div>
        <h3>${stream.title}</h3>
        ${action}
      </div>
    </article>`;
  }).join("");

  const channelLink = $("#youtube-channel-link") as HTMLAnchorElement | null;
  if (channelLink && config.youtubeChannelUrl?.trim()) {
    channelLink.href = config.youtubeChannelUrl.trim();
    channelLink.hidden = false;
  }
}

function renderGallery(): void {
  const track = $("#gallery-track");
  if (!track) return;

  const photos = (config.gallery ?? []).filter(photo => photo?.src?.trim());
  if (!photos.length) {
    track.innerHTML = '<div class="gallery-empty"><span aria-hidden="true">✦</span><h3>Les photos arrivent bientôt</h3><p>Les temps forts de la vie de la paroisse seront publiés ici tout au long de l\'année.</p></div>';
    return;
  }

  track.innerHTML = photos.map((photo, index) => {
    const src = escapeHtml(photo.src.trim());
    const caption = photo.caption?.trim() || "";
    // À défaut d'alt explicite, la légende fait un texte alternatif acceptable.
    const alt = escapeHtml(photo.alt?.trim() || caption || "Vie de la paroisse La Grâce Divine");
    // Les premières diapos sont visibles d'emblée : pas de chargement différé.
    const loading = index < 4 ? "eager" : "lazy";
    // Hauteur uniforme, largeur dictée par le format : une photo paysage reste
    // paysage au lieu d'être rognée dans une vignette portrait.
    const ratio = /^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(photo.ratio?.trim() || "")
      ? ` style="aspect-ratio:${photo.ratio!.trim()}"`
      : "";

    // Vignettes purement illustratives : aucun lien, rien à ouvrir au clic.
    return `<figure class="gallery-item"${ratio}>
      <img src="${src}" alt="${alt}" loading="${loading}" decoding="async">
      ${caption ? `<figcaption class="gallery-caption">${escapeHtml(caption)}</figcaption>` : ""}
    </figure>`;
  }).join("");

  // Photos ajoutées sans `ratio` dans config.js : on le déduit une fois
  // l'image chargée, pour qu'elles ne restent pas au format par défaut.
  $$<HTMLImageElement>(".gallery-item img", track).forEach(img => {
    const figure = img.parentElement as HTMLElement | null;
    if (!figure || figure.style.aspectRatio) return;
    const apply = (): void => {
      if (img.naturalWidth && img.naturalHeight) {
        figure.style.aspectRatio = `${img.naturalWidth}/${img.naturalHeight}`;
      }
    };
    if (img.complete) apply();
    else img.addEventListener("load", apply, { once: true });
  });
}

const AUTOPLAY_DELAY = 4000;

function setupGalleryCarousel(): void {
  const track = $<HTMLElement>("#gallery-track");
  const controls = $<HTMLElement>("[data-gallery-controls]");
  const prev = $<HTMLButtonElement>("[data-gallery-prev]");
  const next = $<HTMLButtonElement>("[data-gallery-next]");
  const toggle = $<HTMLButtonElement>("[data-gallery-toggle]");
  if (!track || !controls || !prev || !next || !toggle) return;

  const maxScroll = (): number => track.scrollWidth - track.clientWidth;

  /** Déplace d'une photo, en visant sa position réelle.
   *  Les diapos n'ont pas toutes la même largeur (portrait, paysage, 16/9) :
   *  avancer d'un nombre fixe de pixels décalerait progressivement le cadrage. */
  const goToAdjacentSlide = (direction: 1 | -1): void => {
    const slides = $$<HTMLElement>(".gallery-item", track);
    if (!slides.length) return;

    // Centre visible actuel, pour trouver la diapo voisine.
    const center = track.scrollLeft + track.clientWidth / 2;
    const tolerance = 4; // arrondis de rendu et de défilement fluide
    const middle = (slide: HTMLElement): number => slide.offsetLeft + slide.offsetWidth / 2;
    const target = direction === 1
      ? slides.find(slide => middle(slide) > center + tolerance)
      : slides.filter(slide => middle(slide) < center - tolerance).pop();

    // Position qui centre la diapo, en accord avec `scroll-snap-align: center`.
    const centered = (slide: HTMLElement): number =>
      slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

    const left = target
      ? Math.max(0, Math.min(centered(target), maxScroll()))
      : (direction === 1 ? maxScroll() : 0);
    track.scrollTo({ left, behavior: "smooth" });
  };
  const scrollable = (): boolean => maxScroll() > 4;

  const update = (): void => {
    // Rien à faire défiler (peu de photos, grand écran) : on masque les commandes.
    const hasOverflow = scrollable();
    controls.hidden = !hasOverflow;
    toggle.hidden = !hasOverflow;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll() - 2;
  };

  // --- Défilement automatique ---------------------------------------------
  // Respecte prefers-reduced-motion, se met en pause au survol, au focus,
  // pendant une manipulation tactile et quand la section n'est pas visible.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer = 0;
  let stopped = reduceMotion;
  let held = false;
  let onScreen = true;

  const sync = (): void => {
    window.clearInterval(timer);
    if (!stopped && !held && onScreen && scrollable()) {
      timer = window.setInterval(() => {
        // Arrivé au bout : on repart du début pour boucler.
        if (track.scrollLeft >= maxScroll() - 2) track.scrollTo({ left: 0, behavior: "smooth" });
        else goToAdjacentSlide(1);
      }, AUTOPLAY_DELAY);
    }
  };

  const setStopped = (value: boolean): void => {
    stopped = value;
    toggle.setAttribute("aria-label", value ? "Reprendre le défilement automatique" : "Mettre en pause le défilement automatique");
    const label = toggle.querySelector("[data-gallery-toggle-label]");
    if (label) label.textContent = value ? "Lecture" : "Pause";
    toggle.dataset.state = value ? "paused" : "playing";
    sync();
  };

  const hold = (value: boolean): void => {
    held = value;
    sync();
  };

  toggle.addEventListener("click", () => setStopped(!stopped));

  track.addEventListener("pointerenter", () => hold(true));
  track.addEventListener("pointerleave", () => hold(false));
  track.addEventListener("pointerdown", () => hold(true));
  track.addEventListener("pointerup", () => hold(false));
  track.addEventListener("pointercancel", () => hold(false));
  track.addEventListener("focusin", () => hold(true));
  track.addEventListener("focusout", () => hold(false));

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => {
      onScreen = entries.some(entry => entry.isIntersecting);
      sync();
    }, { threshold: 0.2 }).observe(track);
  }

  prev.addEventListener("click", () => goToAdjacentSlide(-1));
  next.addEventListener("click", () => goToAdjacentSlide(1));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", () => { update(); sync(); });

  update();
  setStopped(stopped);
}

function highlightNextSchedule(): void {
  const cards = $$<HTMLElement>("[data-schedule] [data-start]");
  const now = Date.now();
  const next = cards
    .map(card => ({ card, time: new Date(card.dataset.start || "").getTime() }))
    .filter(item => Number.isFinite(item.time) && item.time >= now)
    .sort((a, b) => a.time - b.time)[0];

  next?.card.classList.add("is-next");
}

function setupReveal(): void {
  const items = $$<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  items.forEach(item => observer.observe(item));
}

function isLocalDev(): boolean {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".local");
}

function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || !window.location.protocol.startsWith("http")) return;

  // En dev (vite), le service worker servirait des fichiers en cache et casserait le
  // rechargement à chaud : on le désenregistre au lieu de l'installer.
  if (isLocalDev()) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => void registration.unregister());
    }).catch(() => {
      // Sans importance : la page reste utilisable.
    });
    return;
  }

  // Un service worker enregistré à la racine du domaine par une version
  // antérieure du site y intercepte les navigations et sert la page mise en
  // cache : la redirection « / vers /moisson/ » n'est alors jamais vue. Le
  // nôtre porte sur /moisson/ ; on retire donc celui de la racine.
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      if (new URL(registration.scope).pathname === "/") void registration.unregister();
    });
  }).catch(() => {
    // Sans importance : la page reste utilisable.
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // PWA support is progressive; the page remains fully usable without it.
    });
  });
}

function setupCopyright(): void {
  const year = $("#copyright-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

setupMenu();
setupWhatsAppShare();
setupDonation();
renderLiveStreams();
renderGallery();
setupGalleryCarousel();
highlightNextSchedule();
setupReveal();
registerServiceWorker();
setupCopyright();
updateCountdown();
window.setInterval(updateCountdown, 1000);

export {};
