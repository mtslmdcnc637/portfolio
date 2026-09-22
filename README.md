# Portfólio

Site estático (HTML + CSS + JS puro, sem build). Design dark editorial com acento verde-limão, interações suaves e layout responsivo.

## Editar o conteúdo

O conteúdo está no `index.html`: apresentação, serviços, projetos, links e formulário. O visual fica em `css/style.css` e as interações em `js/main.js`.

- **Retrato e screenshots**: ficam em `assets/`.
- **Vídeos do showreel**: ficam em `assets/videos/`.
- **Contato**: `api/contact.js` recebe o formulário e envia a mensagem ao Telegram pelas variáveis de ambiente da Vercel.
- **SEO/social**: título, descrição e Open Graph ficam no `<head>` de `index.html`.

## Rodar local

Sirva a pasta com qualquer servidor estático. Exemplo:

```bash
npx serve .
```

## Deploy (Vercel)

Push em `main` → a Vercel publica sozinha. Primeira vez:

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe o repositório do GitHub
3. Framework preset: **Other** (sem build command, output = raiz)
4. Deploy

## Estrutura

```
index.html      → todo o conteúdo (edite aqui)
css/style.css   → todo o visual (cores nas variáveis do :root)
js/main.js      → menu, acordeão, glitch do logo, rolagem com inércia,
                  parallax, letreiro reativo, cursor, relógio
assets/         → favicon e suas imagens
```
