/**
 * Configuration éditable sans recompilation.
 * 1) Collez l'URL HelloAsso dans helloAssoUrl.
 * 2) Collez l'URL de la chaîne YouTube dans youtubeChannelUrl.
 * 3) Pour chaque direct, collez l'URL YouTube dans youtubeUrl.
 * 4) Pour la galerie, déposez les photos dans assets/galerie/ et listez-les
 *    dans `gallery` (elles défilent dans un carrousel, dans cet ordre).
 *
 * L'ordre du tableau `streams` définit l'ordre d'affichage des cartes.
 * `anchorId` doit rester synchronisé avec les liens « Direct prévu » du
 * programme dans index.html.
 */
window.MOISSON_CONFIG = {
  helloAssoUrl: "",
  youtubeChannelUrl: "",
  shareUrl: "https://grace-divine.fr/moisson/",
  streams: [
    {
      title: "Veillée des Visionnaires de France",
      dateLabel: "Vendredi 2 octobre · 21h",
      startsAt: "2026-10-02T21:00:00+02:00",
      youtubeUrl: "",
      anchorId: "stream-visionnaires"
    },
    {
      title: "Conférences bibliques — Les femmes de prière et de foi",
      dateLabel: "Samedi 3 octobre · 18h–21h",
      startsAt: "2026-10-03T18:00:00+02:00",
      youtubeUrl: "",
      anchorId: "stream-conferences-samedi"
    },
    {
      title: "Culte d'engrangement & veillée d'adoration",
      dateLabel: "Vendredi 9 octobre · 19h",
      startsAt: "2026-10-09T19:00:00+02:00",
      youtubeUrl: "",
      anchorId: "stream-engrangement"
    },
    {
      title: "Porter des fruits et rayonner",
      dateLabel: "Samedi 10 octobre · 10h",
      startsAt: "2026-10-10T10:00:00+02:00",
      youtubeUrl: "",
      anchorId: "stream-porter-des-fruits"
    },
    {
      title: "Grand Culte d'Action de Grâce",
      dateLabel: "Dimanche 11 octobre · 10h",
      startsAt: "2026-10-11T10:00:00+02:00",
      youtubeUrl: "",
      anchorId: "stream-grand-culte"
    }
  ],

  /**
   * Galerie « La vie de la communauté ».
   * Chaque entrée : { src, alt?, caption?, ratio? }
   *  - src     : chemin de la photo, ex. "./assets/galerie/culte-mars.jpg"
   *  - alt     : description pour les lecteurs d'écran (à défaut, la légende est utilisée)
   *  - caption : légende affichée sur la photo (facultative, aucune par défaut)
   *  - ratio   : format largeur/hauteur, ex. "4/3" (paysage) ou "3/4" (portrait).
   *              Facultatif : sans lui, il est déduit de l'image au chargement.
   * Tant que la liste est vide, la section affiche un message d'attente.
   *
   * gallery: [
   *   { src: "./assets/galerie/culte-action-de-grace.jpg", caption: "Culte d'action de grâce", alt: "L'assemblée réunie pour le culte" },
   *   { src: "./assets/galerie/chorale.jpg", caption: "La chorale en répétition" }
   * ],
   */
  gallery: [
    { src: "./assets/galerie/galerie-2026-02-08-01.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-02-08-03.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-02-08-04.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-02-08-05.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-02-08-06.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-02-08-07.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-02-08-08.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-01-09.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-01-10.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-11.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-12.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-13.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-14.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-15.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-16.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-03-29-17.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-18.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-19.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-20.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-03-29-21.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-03-29-25.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-04-12-26.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-04-19-27.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-04-19-28.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-04-19-29.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-04-19-30.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-04-26-31.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-06-07-32.jpg", ratio: "4/3" },
    { src: "./assets/galerie/galerie-2026-06-07-33.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-06-21-34.jpg", ratio: "3/4" },
    { src: "./assets/galerie/galerie-2026-09-21-35.jpg", ratio: "301/400" },
    { src: "./assets/galerie/galerie-2026-09-21-36.jpg", ratio: "240/157" },
    { src: "./assets/galerie/galerie-2026-09-21-37.jpg", ratio: "16/9" },
    { src: "./assets/galerie/galerie-2026-09-21-38.jpg", ratio: "400/301" }
  ]
};
