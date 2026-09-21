# Scrumble — site do jogo

Home do **Scrumble** (jogo de palavras arcade) em GitHub Pages. A empresa B2B **RBS Tech** vive em [rbs-site-production.up.railway.app](https://rbs-site-production.up.railway.app).

## Desenvolvimento local

```bash
python3 -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000).

> Use um servidor local (não abra `index.html` direto no navegador) para que o carrossel carregue `data/characters.json` corretamente.

A preferência de idioma (PT/EN/FR) é compartilhada. A política permanece em `privacy.html` para preservar links existentes.

## Atualizar imagens dos personagens

Quando adicionar personagens no projeto iOS (`ScrumBly`):

```bash
./scripts/copy-assets.sh
```

## Publicar no GitHub Pages

Branch `main` → Settings → Pages → Deploy from a branch → `main` / `/ (root)`.

Site: `https://scrumbledada.github.io/`

## Estrutura

| Caminho | Descrição |
|---------|-----------|
| `index.html` | Home Scrumble (produto) |
| `apps/scrumble/index.html` | Mesma página do jogo (URL legada) |
| `privacy.html` | Privacidade / App Store |
| `css/theme.css` | Tema neon |
| `js/i18n.js` / `js/carousel.js` / `js/main.js` | i18n e carrosséis |
| `data/characters.json` | Heróis e vilões |
| `assets/images/` | Arte dos personagens |

## Contato

**scrumbledada@gmail.com**
