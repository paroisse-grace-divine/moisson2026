const config = window.MOISSON_CONFIG ?? {};
const MAIN_EVENT = new Date("2026-10-11T10:00:00+02:00");
const EVENT_DAY_END = new Date("2026-10-11T23:59:59+02:00");
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
function pad(value) {
    return String(Math.max(0, value)).padStart(2, "0");
}
/** Le contenu de config.js est saisi à la main : une apostrophe ou un & ne doit pas
 *  casser le HTML généré (en particulier dans les attributs). */
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
function updateCountdown() {
    const now = new Date();
    const status = $("#countdown-status");
    const countdown = $("#countdown");
    if (!status || !countdown)
        return;
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
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const values = {
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds)
    };
    Object.entries(values).forEach(([key, value]) => {
        const node = $(`[data-countdown="${key}"]`);
        if (node)
            node.textContent = value;
    });
}
function setupMenu() {
    const toggle = $(".menu-toggle");
    const nav = $("#main-nav");
    if (!toggle || !nav)
        return;
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
function setupWhatsAppShare() {
    const url = config.shareUrl || window.location.href;
    const text = `🌾 Fête de la Moisson 2026 — Paroisse La Grâce Divine\n« Porter du bon fruit et rayonner »\n📅 Du 2 au 11 octobre 2026 · Argenteuil\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    $$("[data-whatsapp-share]").forEach(button => {
        button.addEventListener("click", () => {
            window.open(shareUrl, "_blank", "noopener,noreferrer");
        });
    });
}
function setupDonation() {
    const donationUrl = config.helloAssoUrl?.trim();
    const links = $$("[data-donation-link]");
    const status = $("#donation-status");
    links.forEach(link => {
        if (donationUrl) {
            link.href = donationUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.classList.remove("is-disabled");
            link.removeAttribute("aria-disabled");
        }
        else {
            link.href = "#don";
            link.classList.add("is-disabled");
            link.setAttribute("aria-disabled", "true");
        }
    });
    if (status && donationUrl)
        status.textContent = "Paiement et collecte via HelloAsso.";
}
function youtubeEmbedUrl(url) {
    try {
        const parsed = new URL(url);
        let id = "";
        if (parsed.hostname.includes("youtu.be")) {
            id = parsed.pathname.replace("/", "");
        }
        else if (parsed.pathname.includes("/live/")) {
            id = parsed.pathname.split("/live/")[1]?.split("/")[0] || "";
        }
        else if (parsed.pathname.includes("/embed/")) {
            id = parsed.pathname.split("/embed/")[1]?.split("/")[0] || "";
        }
        else {
            id = parsed.searchParams.get("v") || "";
        }
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    catch {
        return null;
    }
}
function streamState(startsAt) {
    const start = new Date(startsAt);
    const now = new Date();
    const sameDate = now.toDateString() === start.toDateString();
    if (sameDate)
        return "today";
    return now < start ? "upcoming" : "past";
}
function renderLiveStreams() {
    const grid = $("#live-grid");
    if (!grid)
        return;
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
        const stateLabel = state === "today" ? (pending ? "Bientôt en ligne" : "Aujourd'hui")
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
    const channelLink = $("#youtube-channel-link");
    if (channelLink && config.youtubeChannelUrl?.trim()) {
        channelLink.href = config.youtubeChannelUrl.trim();
        channelLink.hidden = false;
    }
}
function renderGallery() {
    const track = $("#gallery-track");
    if (!track)
        return;
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
        // Vignettes purement illustratives : aucun lien, rien à ouvrir au clic.
        return `<figure class="gallery-item">
      <img src="${src}" alt="${alt}" loading="${loading}" decoding="async">
      ${caption ? `<figcaption class="gallery-caption">${escapeHtml(caption)}</figcaption>` : ""}
    </figure>`;
    }).join("");
}
const AUTOPLAY_DELAY = 4000;
function setupGalleryCarousel() {
    const track = $("#gallery-track");
    const controls = $("[data-gallery-controls]");
    const prev = $("[data-gallery-prev]");
    const next = $("[data-gallery-next]");
    const toggle = $("[data-gallery-toggle]");
    if (!track || !controls || !prev || !next || !toggle)
        return;
    /** Largeur d'une diapo + gouttière : un pas fait défiler d'une photo. */
    const step = () => {
        const first = track.querySelector(".gallery-item");
        if (!first)
            return track.clientWidth;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first.getBoundingClientRect().width + gap;
    };
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const scrollable = () => maxScroll() > 4;
    const update = () => {
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
    const sync = () => {
        window.clearInterval(timer);
        if (!stopped && !held && onScreen && scrollable()) {
            timer = window.setInterval(() => {
                // Arrivé au bout : on repart du début pour boucler.
                if (track.scrollLeft >= maxScroll() - 2)
                    track.scrollTo({ left: 0, behavior: "smooth" });
                else
                    track.scrollBy({ left: step(), behavior: "smooth" });
            }, AUTOPLAY_DELAY);
        }
    };
    const setStopped = (value) => {
        stopped = value;
        toggle.setAttribute("aria-label", value ? "Reprendre le défilement automatique" : "Mettre en pause le défilement automatique");
        const label = toggle.querySelector("[data-gallery-toggle-label]");
        if (label)
            label.textContent = value ? "Lecture" : "Pause";
        toggle.dataset.state = value ? "paused" : "playing";
        sync();
    };
    const hold = (value) => {
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
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", () => { update(); sync(); });
    update();
    setStopped(stopped);
}
function highlightNextSchedule() {
    const cards = $$("[data-schedule] [data-start]");
    const now = Date.now();
    const next = cards
        .map(card => ({ card, time: new Date(card.dataset.start || "").getTime() }))
        .filter(item => Number.isFinite(item.time) && item.time >= now)
        .sort((a, b) => a.time - b.time)[0];
    next?.card.classList.add("is-next");
}
function setupReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("is-visible"));
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    items.forEach(item => observer.observe(item));
}
let deferredInstallPrompt = null;
function setupInstallPrompt() {
    const button = $("#install-app");
    if (!button)
        return;
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault();
        deferredInstallPrompt = event;
        button.hidden = false;
    });
    button.addEventListener("click", async () => {
        if (!deferredInstallPrompt)
            return;
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        button.hidden = true;
    });
    window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        button.hidden = true;
    });
}
function isLocalDev() {
    const host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".local");
}
function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || !window.location.protocol.startsWith("http"))
        return;
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
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {
            // PWA support is progressive; the page remains fully usable without it.
        });
    });
}
function setupCopyright() {
    const year = $("#copyright-year");
    if (year)
        year.textContent = String(new Date().getFullYear());
}
setupMenu();
setupWhatsAppShare();
setupDonation();
renderLiveStreams();
renderGallery();
setupGalleryCarousel();
highlightNextSchedule();
setupReveal();
setupInstallPrompt();
registerServiceWorker();
setupCopyright();
updateCountdown();
window.setInterval(updateCountdown, 1000);
export {};
