/* Keep the existing language key so navigation between RBS and Scrumble agrees. */
const RBS_LANGUAGE_KEY = "scrumble-site-lang";
const RBS_COPY = {
  pt: {
    title: "RBS — Apps, música e jogos", meta: "Criamos experiências digitais com simplicidade e personalidade. Conheça os projetos da RBS.",
    skip: "Pular para o conteúdo", navigation: "Principal", projects: "Projetos", about: "Sobre", eyebrow: "Independência para criar.",
    headline: "Apps, música\ne jogos.", intro: "Criamos experiências digitais com simplicidade e personalidade.", explore: "Explore nossos projetos",
    ourProjects: "Nossos projetos", category: "Jogo de palavras · iOS", description: "Palavras, batalhas e um universo para explorar. Conheça um jogo onde cada letra abre novas possibilidades.",
    discover: "Conhecer o jogo", aboutRbs: "Sobre a RBS", statement: "Ideias diferentes.\nO mesmo cuidado.",
    aboutText: "A RBS é uma empresa independente de apps, música e jogos. Um espaço para transformar ideias em experiências simples, criativas e cheias de personalidade.",
    copyright: "© 2026 RBS. Todos os direitos reservados.", language: "Idioma do site", character: "Léo Faísca, personagem do Scrumble"
  },
  en: {
    title: "RBS — Apps, music and games", meta: "We create digital experiences with simplicity and personality. Explore RBS projects.",
    skip: "Skip to content", navigation: "Main", projects: "Projects", about: "About", eyebrow: "Freedom to create.",
    headline: "Apps, music\nand games.", intro: "We create digital experiences with simplicity and personality.", explore: "Explore our projects",
    ourProjects: "Our projects", category: "Word game · iOS", description: "Words, battles and a universe to explore. Discover a game where every letter opens up new possibilities.",
    discover: "Discover the game", aboutRbs: "About RBS", statement: "Different ideas.\nThe same care.",
    aboutText: "RBS is an independent company creating apps, music and games. A space to turn ideas into simple, creative experiences full of personality.",
    copyright: "© 2026 RBS. All rights reserved.", language: "Site language", character: "Léo Faísca, a Scrumble character"
  },
  fr: {
    title: "RBS — Apps, musique et jeux", meta: "Nous créons des expériences numériques avec simplicité et personnalité. Découvrez les projets RBS.",
    skip: "Aller au contenu", navigation: "Navigation principale", projects: "Projets", about: "À propos", eyebrow: "La liberté de créer.",
    headline: "Apps, musique\net jeux.", intro: "Nous créons des expériences numériques avec simplicité et personnalité.", explore: "Explorez nos projets",
    ourProjects: "Nos projets", category: "Jeu de lettres · iOS", description: "Des mots, des batailles et un univers à explorer. Découvrez un jeu où chaque lettre ouvre de nouvelles possibilités.",
    discover: "Découvrir le jeu", aboutRbs: "À propos de RBS", statement: "Des idées différentes.\nLa même attention.",
    aboutText: "RBS est une entreprise indépendante qui crée des apps, de la musique et des jeux. Un espace pour transformer les idées en expériences simples, créatives et pleines de personnalité.",
    copyright: "© 2026 RBS. Tous droits réservés.", language: "Langue du site", character: "Léo Faísca, personnage de Scrumble"
  }
};
function setRbsLanguage(lang) {
  if (!Object.hasOwn(RBS_COPY, lang)) return;
  const copy = RBS_COPY[lang];
  try { localStorage.setItem(RBS_LANGUAGE_KEY, lang); } catch { /* Storage is optional. */ }
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.meta;
  document.querySelector('meta[property="og:title"]').content = copy.title;
  document.querySelector('meta[property="og:description"]').content = copy.meta;
  for (const [attribute, target] of [["data-copy", null], ["data-label", "aria-label"], ["data-alt", "alt"]]) {
    document.querySelectorAll(`[${attribute}]`).forEach(element => {
      const value = copy[element.getAttribute(attribute)];
      if (target) element.setAttribute(target, value); else element.textContent = value;
    });
  }
  document.querySelectorAll("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));
}
let initialRbsLanguage;
try { initialRbsLanguage = localStorage.getItem(RBS_LANGUAGE_KEY); } catch { /* Fall back to browser language. */ }
if (!Object.hasOwn(RBS_COPY, initialRbsLanguage)) initialRbsLanguage = (navigator.language || "pt").slice(0, 2).toLowerCase();
setRbsLanguage(Object.hasOwn(RBS_COPY, initialRbsLanguage) ? initialRbsLanguage : "pt");
document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => setRbsLanguage(button.dataset.lang)));
