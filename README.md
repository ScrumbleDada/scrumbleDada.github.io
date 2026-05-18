# Scrumble — Site oficial

Landing page estática do jogo **Scrumble** (tema neon arcade), com carrosséis de heróis e vilões, textos em PT/EN/FR e página de privacidade para a App Store.

## Desenvolvimento local

```bash
cd /Users/rennanrbs/Desktop/Scrumble.io
python3 -m http.server 8000
```

Abra [http://localhost:8000](http://localhost:8000).

> Use um servidor local (não abra `index.html` direto no navegador) para que o carrossel carregue `data/characters.json` corretamente.

## Atualizar imagens dos personagens

Quando adicionar personagens no projeto iOS (`ScrumBly`):

```bash
./scripts/copy-assets.sh
```

O script lê as pastas do jogo e regenera `data/characters.json`:

- **Heróis:** `ScrumBly/Character/<Nome>/Personagem/animacao1/frame_001.png` — o nome vem da pasta (`Léo Faísca`, `Brocolino`, etc.).
- **Vilões:** `ScrumBly/Viloes/<número>/Personagem/animacao1/frame_001.png` — o nome vem do PNG na raiz da pasta (ex. `Zombie_Small`).

Variável opcional: `SCRUMBLY_ROOT=/caminho/para/ScrumBly`

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `scrumble` ou `scrumble.io`).
2. Envie o conteúdo desta pasta para a branch `main`.
3. No GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` / folder **`/ (root)`**
4. Aguarde alguns minutos. O site ficará em:
   - `https://<seu-usuario>.github.io/<nome-do-repo>/`

### Primeiro push (exemplo)

```bash
git init
git add .
git commit -m "Site inicial Scrumble"
git remote add origin https://github.com/<usuario>/<repo>.git
git branch -M main
git push -u origin main
```

## Estrutura

| Caminho | Descrição |
|---------|-----------|
| `index.html` | Página principal |
| `privacy.html` | Política de privacidade |
| `css/theme.css` | Tema neon (cores do jogo) |
| `js/i18n.js` | Traduções PT / EN / FR |
| `js/carousel.js` | Carrosséis |
| `data/characters.json` | Lista de heróis e vilões |
| `assets/images/` | Miniaturas dos personagens |

## Contato

**scrumbledada@gmail.com**
